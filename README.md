# FarmerXBuyers DApps

## Overview

This project implements a decentralized marketplace and escrow system for secure transactions between farmers and buyers using Ethereum smart contracts. The system ensures trustless and secure payments by holding funds in escrow until the transaction conditions are met, with dispute resolution and reputation management features.

The project consists of two main smart contracts:

- **Marketplace.sol**: Manages orders between farmers and buyers, including order creation, completion, cancellation, dispute handling, and reputation management.
- **Escrow.sol**: Handles the secure holding and release of funds for orders, ensuring payments are only released when conditions are met or disputes are resolved.

## Features

### Marketplace Contract

- **Order Management**: Farmers can create orders specifying buyer, amount, and price. Orders can be completed, cancelled, or expired.
- **Dispute Resolution**: Buyers can raise disputes within a specified period. The contract owner can resolve disputes by approving or rejecting them.
- **Reputation System**: Buyers and farmers can submit reviews and ratings after order completion, which contribute to user reputation scores.
- **Access Control**: Functions are protected with ownership and authorization checks to ensure security.

### Escrow Contract

- **Secure Fund Holding**: Holds payments in escrow until order completion or refund.
- **Completion and Refund**: Allows only the owner (Marketplace contract) to complete or refund escrowed payments.
- **Dispute Handling**: Supports raising and resolving disputes with pausing mechanisms to prevent fund release during disputes.
- **Reentrancy and Pausable Guards**: Protects against reentrancy attacks and allows pausing contract operations during disputes.

## Technologies Used

- **Solidity 0.8.22**: Smart contract programming language.
- **OpenZeppelin Contracts**: For secure and tested implementations of Ownable, ReentrancyGuard, Pausable, and IERC20 interfaces.
- **Foundry**: Development framework for compiling, testing, and deploying smart contracts.
- **Forge Std**: Standard library for Foundry tests.
- **MockERC20**: Mock ERC20 token used for testing.

## Project Structure

- `src/`
  - `Marketplace.sol`: Marketplace contract source code.
  - `Escrow.sol`: Escrow contract source code.
- `test/`
  - `Marketplace.t.sol`: Test suite for Marketplace and Escrow contracts using Foundry.
- `lib/`: External dependencies including OpenZeppelin and forge-std.
- `foundry.toml`: Foundry configuration file.
- `README.md`: Project documentation.

## Installation and Setup

1. **Install Foundry**: Follow instructions at https://getfoundry.sh to install Foundry.
2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd FarmerXBuyers DApps
   ```
3. **Install dependencies**:
   Dependencies are managed via git submodules or manually placed in `lib/`.
4. **Compile contracts**:
   ```bash
   forge build
   ```
5. **Run tests**:
   ```bash
   forge test
   ```

## Usage

- Deploy the `Marketplace` contract with the address of the ERC20 payment token.
- The `Marketplace` contract automatically deploys an `Escrow` contract and manages orders.
- Use the Marketplace contract functions to create orders, complete or cancel them, raise disputes, resolve disputes, and submit reviews.

## Testing

- The project includes comprehensive tests for Marketplace and Escrow contracts.
- Tests cover order lifecycle, dispute handling, and reputation system.
- Tests use a `MockERC20` token to simulate payments.
- Run tests with:
  ```bash
  forge test --match-path test/Marketplace.t.sol
  ```

## Security Considerations

- The contracts use OpenZeppelin's `Ownable`, `ReentrancyGuard`, and `Pausable` for security.
- Only the contract owner can perform sensitive operations like dispute resolution.
- Reentrancy guards prevent reentrancy attacks on critical functions.
- Pausing functionality is used during disputes to prevent fund release.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. Please open issues or pull requests for improvements or bug fixes.

## Contact

For questions or support, please contact the project maintainer.

UtilityToken deployed at: 0xA8B0A977098463E58630C50e6A5D218e505932f5
Marketplace deployed at: 0x7dd9F0511A4718eff1eBF1dC50FCB383955c706D
Escrow deployed at: 0xfCFc3A73044B5431388b184Dd745fFeaD9Ee9B5A
