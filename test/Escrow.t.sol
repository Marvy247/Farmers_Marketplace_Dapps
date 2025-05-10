// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../src/Escrow.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockERC20 is IERC20 {
    string public constant name = "MockToken";
    string public constant symbol = "MTK";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        balanceOf[from] -= amount;
        allowance[from][msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}

contract EscrowTest is Test {
    Escrow escrow;
    MockERC20 token;
    address owner = address(0x1);
    address buyer = address(0x2);
    address seller = address(0x3);

    function setUp() public {
        token = new MockERC20();
        escrow = new Escrow(IERC20(address(token)), owner);
        token.mint(owner, 1000 ether);
        token.mint(buyer, 1000 ether);
        token.mint(seller, 1000 ether);
        vm.prank(owner);
        token.approve(address(escrow), 1000 ether);
        assertEq(escrow.owner(), owner);
    }

    function testCreateEscrow() public {
        vm.prank(owner);
        uint256 orderId = escrow.createEscrow(seller, buyer, 100 ether);
        (address b, address s, uint256 amount, bool completed, bool refunded,, bool disputed) = escrow.escrowOrders(orderId);
        assertEq(b, buyer);
        assertEq(s, seller);
        assertEq(amount, 100 ether);
        assertFalse(completed);
        assertFalse(refunded);
        assertFalse(disputed);
    }

    function testCompleteEscrow() public {
        vm.prank(owner);
        uint256 orderId = escrow.createEscrow(seller, buyer, 100 ether);
        token.mint(address(escrow), 100 ether);
        vm.prank(owner);
        escrow.completeEscrow(orderId);
        (, , , bool completed, , ,) = escrow.escrowOrders(orderId);
        assertTrue(completed);
        assertEq(token.balanceOf(seller), 1100 ether);
    }

    function testRefundEscrow() public {
        vm.prank(owner);
        uint256 orderId = escrow.createEscrow(seller, buyer, 100 ether);
        token.mint(address(escrow), 100 ether);
        vm.prank(owner);
        escrow.refundEscrow(orderId);
        (, , , , bool refunded, ,) = escrow.escrowOrders(orderId);
        assertTrue(refunded);
        assertEq(token.balanceOf(buyer), 1100 ether);
    }

    function testRaiseDispute() public {
        vm.prank(owner);
        uint256 orderId = escrow.createEscrow(seller, buyer, 100 ether);
        vm.prank(buyer);
        escrow.raiseDispute(orderId);
        (, , , , , , bool disputed) = escrow.escrowOrders(orderId);
        assertTrue(disputed);
    }

    function testResolveDisputeApprove() public {
        assertEq(escrow.owner(), owner);
        vm.prank(owner);
        uint256 orderId = escrow.createEscrow(seller, buyer, 100 ether);
        vm.prank(buyer);
        escrow.raiseDispute(orderId);
        token.mint(address(escrow), 100 ether);
        vm.startPrank(owner);
        escrow.resolveDispute(orderId, true);
        vm.stopPrank();
        (, , , bool completed, , ,) = escrow.escrowOrders(orderId);
        assertTrue(completed);
        assertEq(token.balanceOf(seller), 1100 ether);
    }

    function testResolveDisputeReject() public {
        vm.prank(owner);
        uint256 orderId = escrow.createEscrow(seller, buyer, 100 ether);
        vm.prank(buyer);
        escrow.raiseDispute(orderId);
        token.mint(address(escrow), 100 ether);
        vm.startPrank(owner);
        escrow.resolveDispute(orderId, false);
        vm.stopPrank();
        (, , , , bool refunded, ,) = escrow.escrowOrders(orderId);
        assertTrue(refunded);
        assertEq(token.balanceOf(buyer), 1100 ether);
    }
}
