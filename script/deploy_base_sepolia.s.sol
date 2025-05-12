// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/Marketplace.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/UtilityToken.sol";

contract DeployBaseSepolia is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy UtilityToken first
        uint256 initialSupply = 1000000 * 10 ** 18;
        address deployer = msg.sender;
        UtilityToken token = new UtilityToken(initialSupply, deployer);
        console.log("UtilityToken deployed at:", address(token));

        // Deploy Marketplace with UtilityToken address
        Marketplace marketplace = new Marketplace(IERC20(address(token)));
        console.log("Marketplace deployed at:", address(marketplace));
        console.log("Escrow deployed at:", address(marketplace.escrow()));

        vm.stopBroadcast();
    }
}
