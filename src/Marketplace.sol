// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Escrow.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    // Order structure
    struct Order {
        uint256 id;
        address farmer;
        address buyer;
        uint256 amount;
        uint256 price;
        uint256 escrowId;
        bool isCompleted;
        bool isCancelled;
        uint256 createdAt;
        uint256 expiryTime;
    }

    // Review structure
    struct Review {
        uint8 rating; // 1-5
        string reviewText;
        address reviewer;
        uint256 timestamp;
        uint256 orderId;
    }

    // User reputation structure
    struct UserReputation {
        uint256 totalRating;
        uint256 reviewCount;
        mapping(uint256 => bool) reviewedOrders; // orderId => reviewed
    }

    uint256 private _orderCounter;
    uint256 public constant ORDER_EXPIRY = 30 days;
    
    mapping(uint256 => Order) public orders;
    mapping(address => UserReputation) public userReputations;
    mapping(uint256 => Review) public reviews; // orderId => Review
    
    Escrow public immutable escrow;

    // Events
    event OrderCreated(uint256 id, uint256 escrowId, address farmer, address buyer);
    event OrderCompleted(uint256 id);
    event OrderCancelled(uint256 id);
    event DisputeRaised(uint256 orderId);
    event ReviewSubmitted(uint256 orderId, address reviewer, address reviewedUser, uint8 rating, string reviewText);
    event ReputationUpdated(address user, uint256 averageRating, uint256 reviewCount);

    constructor(IERC20 _paymentToken) Ownable(msg.sender) {
        escrow = new Escrow(_paymentToken, address(this));
    }

    // Order functions
    function createOrder(address _buyer, uint256 _amount, uint256 _price) 
        external 
        nonReentrant 
        returns (uint256) 
    {
        require(_buyer != address(0), "Invalid buyer");
        require(_amount > 0 && _price > 0, "Invalid amount/price");
        
        uint256 totalValue = _amount * _price;
        uint256 escrowId = escrow.createEscrow(msg.sender, _buyer, totalValue);

        _orderCounter++;
        orders[_orderCounter] = Order({
            id: _orderCounter,
            farmer: msg.sender,
            buyer: _buyer,
            amount: _amount,
            price: _price,
            escrowId: escrowId,
            isCompleted: false,
            isCancelled: false,
            createdAt: block.timestamp,
            expiryTime: block.timestamp + ORDER_EXPIRY
        });

        emit OrderCreated(_orderCounter, escrowId, msg.sender, _buyer);
        return _orderCounter;
    }

    function completeOrder(uint256 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        require(order.id != 0, "Invalid order");
        require(msg.sender == order.buyer || msg.sender == owner(), "Unauthorized");
        require(!order.isCompleted && !order.isCancelled, "Order closed");
        require(block.timestamp <= order.expiryTime, "Order expired");

        escrow.completeEscrow(order.escrowId);
        order.isCompleted = true;
        
        emit OrderCompleted(_orderId);
    }

    function cancelOrder(uint256 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        require(order.id != 0, "Invalid order");
        require(
            msg.sender == order.buyer || 
            msg.sender == order.farmer || 
            msg.sender == owner(),
            "Unauthorized"
        );
        require(!order.isCompleted && !order.isCancelled, "Order closed");

        escrow.refundEscrow(order.escrowId);
        order.isCancelled = true;
        
        emit OrderCancelled(_orderId);
    }

    function cancelExpired(uint256 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        require(order.id != 0, "Invalid order");
        require(block.timestamp > order.expiryTime, "Not expired");
        require(!order.isCompleted && !order.isCancelled, "Order closed");

        escrow.refundEscrow(order.escrowId);
        order.isCancelled = true;
        
        emit OrderCancelled(_orderId);
    }

    // Dispute functions
    function raiseDispute(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(msg.sender == order.buyer, "Only buyer");
        require(block.timestamp <= order.expiryTime, "Order expired");
        escrow.raiseDispute(order.escrowId);
        emit DisputeRaised(_orderId);
    }

    function resolveDispute(uint256 _orderId, bool _approve) external onlyOwner {
        Order storage order = orders[_orderId];
        escrow.resolveDispute(order.escrowId, _approve);
        order.isCompleted = _approve;
        order.isCancelled = !_approve;
    }

    // Reputation functions
    function submitReview(
        uint256 _orderId,
        uint8 _rating,
        string calldata _reviewText
    ) external nonReentrant {
        Order storage order = orders[_orderId];
        require(order.isCompleted, "Order not completed");
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        
        // Ensure the caller is either buyer or farmer of this order
        require(
            msg.sender == order.buyer || msg.sender == order.farmer,
            "Not order participant"
        );
        
        // Ensure this order hasn't been reviewed by this user already
        UserReputation storage reviewerRep = userReputations[msg.sender];
        require(!reviewerRep.reviewedOrders[_orderId], "Already reviewed");
        
        // Determine who is being reviewed (opposite party)
        address reviewedUser = msg.sender == order.buyer ? order.farmer : order.buyer;
        
        // Update the reviewed user's reputation
        UserReputation storage reputation = userReputations[reviewedUser];
        reputation.totalRating += _rating;
        reputation.reviewCount += 1;
        reputation.reviewedOrders[_orderId] = true;
        
        // Store the review details
        reviews[_orderId] = Review({
            rating: _rating,
            reviewText: _reviewText,
            reviewer: msg.sender,
            timestamp: block.timestamp,
            orderId: _orderId
        });
        
        emit ReviewSubmitted(
            _orderId,
            msg.sender,
            reviewedUser,
            _rating,
            _reviewText
        );
        
        emit ReputationUpdated(
            reviewedUser, 
            getAverageRating(reviewedUser), 
            reputation.reviewCount
        );
    }

    // View functions
    function getOrderStatus(uint256 _orderId) external view returns (string memory) {
        Order memory order = orders[_orderId];
        if (order.isCompleted) return "Completed";
        if (order.isCancelled) return "Cancelled";
        if (block.timestamp > order.expiryTime) return "Expired";
        return "Active";
    }

    function getAverageRating(address _user) public view returns (uint256) {
        UserReputation storage rep = userReputations[_user];
        return rep.reviewCount > 0 ? rep.totalRating / rep.reviewCount : 0;
    }

    function getReview(uint256 _orderId) public view returns (Review memory) {
        return reviews[_orderId];
    }

    function hasReviewedOrder(address _user, uint256 _orderId) public view returns (bool) {
        return userReputations[_user].reviewedOrders[_orderId];
    }

    function getTotalOrders() public view returns (uint256) {
        return _orderCounter;
    }
}