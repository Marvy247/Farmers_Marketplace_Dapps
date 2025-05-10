// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Escrow is Ownable, ReentrancyGuard, Pausable {
    struct EscrowOrder {
        address buyer;
        address seller;
        uint256 amount;
        bool isCompleted;
        bool isRefunded;
        uint256 createdAt;
        bool isDisputed;
    }

    mapping(uint256 => EscrowOrder) public escrowOrders;
    uint256 public orderCount;
    IERC20 public immutable paymentToken;
    uint256 public constant DISPUTE_PERIOD = 7 days;

    event EscrowCreated(uint256 indexed orderId, address indexed buyer, address indexed seller, uint256 amount);
    event EscrowCompleted(uint256 indexed orderId);
    event EscrowRefunded(uint256 indexed orderId);
    event EscrowDisputed(uint256 indexed orderId);
    event EscrowResolved(uint256 indexed orderId, bool approved);

    constructor(IERC20 _paymentToken, address initialOwner) Ownable(initialOwner) {
        require(address(_paymentToken) != address(0), "Invalid token");
        require(initialOwner != address(0), "Invalid owner");
        paymentToken = _paymentToken;
    }

    function createEscrow(address _seller, address _buyer, uint256 _amount) 
        external 
        onlyOwner 
        whenNotPaused 
        returns (uint256) 
    {
        require(_seller != address(0), "Invalid seller");
        require(_amount > 0, "Invalid amount");
        
        orderCount++;
        escrowOrders[orderCount] = EscrowOrder({
            buyer: _buyer,
            seller: _seller,
            amount: _amount,
            isCompleted: false,
            isRefunded: false,
            createdAt: block.timestamp,
            isDisputed: false
        });

        emit EscrowCreated(orderCount, _buyer, _seller, _amount);
        return orderCount;
    }

    function _completeEscrow(uint256 _orderId) internal onlyOwner whenNotPaused {
        EscrowOrder storage order = escrowOrders[_orderId];
        require(order.buyer != address(0), "Invalid order");
        require(!order.isCompleted && !order.isRefunded, "Already settled");
        require(!order.isDisputed, "Order disputed");

        order.isCompleted = true;
        require(paymentToken.transfer(order.seller, order.amount), "Transfer failed");

        emit EscrowCompleted(_orderId);
    }

    function _refundEscrow(uint256 _orderId) internal onlyOwner whenNotPaused {
        EscrowOrder storage order = escrowOrders[_orderId];
        require(order.buyer != address(0), "Invalid order");
        require(!order.isCompleted && !order.isRefunded, "Already settled");

        order.isRefunded = true;
        require(paymentToken.transfer(order.buyer, order.amount), "Refund failed");

        emit EscrowRefunded(_orderId);
    }

    function completeEscrow(uint256 _orderId) external onlyOwner nonReentrant whenNotPaused {
        _completeEscrow(_orderId);
    }

    function refundEscrow(uint256 _orderId) external onlyOwner nonReentrant whenNotPaused {
        _refundEscrow(_orderId);
    }

    function resolveDispute(uint256 _orderId, bool _approve) external onlyOwner {
        EscrowOrder storage order = escrowOrders[_orderId];
        require(order.isDisputed, "No dispute");

        order.isDisputed = false;
        _unpause();
        if (_approve) {
            _completeEscrow(_orderId);
        } else {
            _refundEscrow(_orderId);
        }
        emit EscrowResolved(_orderId, _approve);
    }

    function raiseDispute(uint256 _orderId) external {
        EscrowOrder storage order = escrowOrders[_orderId];
        require(msg.sender == order.buyer || msg.sender == owner(), "Unauthorized");
        require(block.timestamp < order.createdAt + DISPUTE_PERIOD, "Dispute period ended");
        order.isDisputed = true;
        _pause();
        emit EscrowDisputed(_orderId);
    }

    function canRefund(uint256 _orderId) public view returns (bool) {
        EscrowOrder memory order = escrowOrders[_orderId];
        return (order.buyer != address(0) &&
               !order.isCompleted &&
               !order.isRefunded &&
               block.timestamp > order.createdAt + DISPUTE_PERIOD);
    }
}
