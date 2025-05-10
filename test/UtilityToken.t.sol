// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../src/UtilityToken.sol";

contract UtilityTokenTest is Test {
    UtilityToken token;
    address owner = address(0x1);
    address user1 = address(0x2);
    address user2 = address(0x3);

    function setUp() public {
        token = new UtilityToken(1000 ether, owner);
    }

    function testMint() public {
        uint256 initialBalance = token.balanceOf(owner);
        vm.prank(owner);
        token.mint(owner, 100 ether);
        assertEq(token.balanceOf(owner), initialBalance + 100 ether);
    }

    function testTransfer() public {
        vm.prank(owner);
        token.mint(user1, 100 ether);
        vm.prank(user1);
        token.transfer(user2, 50 ether);
        assertEq(token.balanceOf(user2), 50 ether);
        assertEq(token.balanceOf(user1), 50 ether);
    }
}
