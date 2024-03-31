# Contracts Test Suite

This repository contains a set of Solidity contracts along with corresponding test cases for each contract. Below is a brief description of each contract and its purpose:

1. **Attacker.sol**: This contract represents a potential attacker contract, which may interact with other contracts in unexpected ways. Test cases should ensure that other contracts are resilient against potential attacks.

2. **Bank.sol**: The Bank contract presumably implements banking functionalities such as deposit, withdrawal, and balance inquiry. Test cases should cover various scenarios to validate the correctness and security of the banking operations.

3. **BankNonReentrant.sol**: Similar to Bank.sol, but with additional protection against reentrancy attacks. Test cases should validate the effectiveness of the non-reentrant mechanism.

4. **Counter.sol**: A simple counter contract that allows incrementing and decrementing a counter value. Test cases should ensure that counter operations work as expected and handle edge cases properly.

5. **Escrow.sol**: An escrow contract facilitates secure transactions by holding funds until certain conditions are met. Test cases should cover different transaction scenarios and verify the escrow's functionality.

6. **FlashLoan.sol**: This contract implements a flash loan mechanism, allowing users to borrow funds temporarily without collateral. Test cases should validate the correctness and security of flash loan operations.

7. **FlashLoanReceiver.sol**: A contract designed to receive and handle flash loans. Test cases should ensure that the flash loan receiver contract behaves as expected when interacting with flash loan providers.

8. **RealEstate.sol**: This contract represents a real estate marketplace or property ownership system. Test cases should cover various real estate transactions, including buying, selling, and transferring ownership.

9. **Token.sol**: A basic ERC20 token contract that implements a standard token interface. Test cases should verify the functionality of token transfers, approvals, and other ERC20 standard operations.

## Running Tests

To run the test suite, ensure that you have Node installed:

Open Terminal and then install Hardhat
```shell
npm install hardhat
```

Then, execute the following command to run all tests:

```shell
npx hardhat test
```

This command will execute all test cases defined in the `test/` directory and provide feedback on the contract behavior.

Feel free to extend the test suite or provide additional contracts as needed. Happy testing!