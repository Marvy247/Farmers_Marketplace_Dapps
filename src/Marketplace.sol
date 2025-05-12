// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Escrow.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 pricePerUnit; // Price per unit in wei
        uint256 availableQuantity;
        address farmer;
        bool isActive;
    }

    struct Order {
        uint256 id;
        uint256 productId;     
        address farmer;
        address buyer;
        uint256 amount;
        uint256 price;
        uint256 escrowId;
        bool isCompleted;
        bool isCancelled;
        uint256 createdAt;
    }

    uint256 private _orderCounter;
    uint256 private _productCounter;
    uint256 public constant ORDER_EXPIRY = 30 days;
    
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public farmerProducts; // farmer => product IDs
    mapping(uint256 => uint256[]) public productOrders; // productId => order IDs
    
    Escrow public immutable escrow;

    event ProductCreated(uint256 indexed productId, address indexed farmer);
    event OrderCreated(uint256 id, uint256 escrowId, address farmer, address buyer);
    event OrderCompleted(uint256 id);
    event OrderCancelled(uint256 id);

    constructor(IERC20 _paymentToken) Ownable(msg.sender) {
        escrow = new Escrow(_paymentToken, address(this));
    }

    // Product Management Functions
    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _pricePerUnit,
        uint256 _initialQuantity
    ) external nonReentrant returns (uint256) {
        require(bytes(_name).length > 0, "Name required");
        require(_pricePerUnit > 0, "Price must be positive");
        require(_initialQuantity > 0, "Quantity must be positive");
        
        _productCounter++;
        products[_productCounter] = Product({
            id: _productCounter,
            name: _name,
            description: _description,
            pricePerUnit: _pricePerUnit,
            availableQuantity: _initialQuantity,
            farmer: msg.sender,
            isActive: true
        });
        
        farmerProducts[msg.sender].push(_productCounter);
        
        emit ProductCreated(_productCounter, msg.sender);
        return _productCounter;
    }

    function updateProduct(
        uint256 _productId,
        string memory _name,
        string memory _description,
        uint256 _pricePerUnit,
        uint256 _availableQuantity
    ) external nonReentrant {
        Product storage product = products[_productId];
        require(product.farmer == msg.sender, "Only product owner");
        require(product.isActive, "Product inactive");
        
        product.name = _name;
        product.description = _description;
        product.pricePerUnit = _pricePerUnit;
        product.availableQuantity = _availableQuantity;
    }

    function deactivateProduct(uint256 _productId) external {
        Product storage product = products[_productId];
        require(product.farmer == msg.sender, "Only product owner");
        require(product.isActive, "Already inactive");
        
        product.isActive = false;
    }

    function createOrder(uint256 _productId, uint256 _amount) external nonReentrant returns (uint256) {
        Product storage product = products[_productId];
        require(product.isActive, "Product unavailable");
        require(product.availableQuantity >= _amount, "Insufficient stock");
        
        uint256 totalValue = _amount * product.pricePerUnit;
        uint256 escrowId = escrow.createEscrow(product.farmer, msg.sender, totalValue);

        _orderCounter++;
        orders[_orderCounter] = Order({
            id: _orderCounter,
            productId: _productId,
            farmer: product.farmer,
            buyer: msg.sender,
            amount: _amount,
            price: product.pricePerUnit,
            escrowId: escrowId,
            isCompleted: false,
            isCancelled: false,
            createdAt: block.timestamp
        });

        product.availableQuantity -= _amount;
        productOrders[_productId].push(_orderCounter);
        
        emit OrderCreated(_orderCounter, escrowId, product.farmer, msg.sender);
        return _orderCounter;
    }

    function completeOrder (uint256 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        require(order.id != 0, "Invalid order");
        
        escrow.completeEscrow(_orderId);
        order.isCompleted = true;
        
        emit OrderCompleted(_orderId);
    }

    function cancelOrder(uint256 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        require(order.id != 0, "Invalid order");
        
        escrow.refundEscrow(_orderId);
        order.isCancelled = true;
        
        emit OrderCancelled(_orderId);
    }

    function getProduct(uint256 _productId) public view returns (Product memory) {
        return products[_productId];
    }

    function getActiveProducts() public view returns (Product[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= _productCounter; i++) {
            if (products[i].isActive) {
                activeCount++;
            }
        }
        
        Product[] memory activeProducts = new Product[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= _productCounter; i++) {
            if (products[i].isActive) {
                activeProducts[index] = products[i];
                index++;
            }
        }
        return activeProducts;
    }

    function getOrdersForProduct(uint256 _productId) public view returns (Order[] memory) {
        uint256[] storage orderIds = productOrders[_productId];
        Order[] memory productOrdersList = new Order[](orderIds.length);
        
        for (uint256 i = 0; i < orderIds.length; i++) {
            productOrdersList[i] = orders[orderIds[i]];
        }
        
        return productOrdersList;
    }
}