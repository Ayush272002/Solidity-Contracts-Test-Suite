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

10. Also, if you have any confusion about which contacts are linked to other check the `Diagram for Contacts` directory.

## Running Tests

To run the test suite, ensure that you have Node installed
(if you dont have node follow this [link](https://nodejs.org/en/download) to download node and add it to the path i.e., system variables) 

Also Hardhat is required<br>
More things about hardhat can be found [here](https://hardhat.org/hardhat-runner/docs/getting-started) if you are facing any issues<br>
To set up Hardhat for your project, follow these steps:

1. **Open Terminal**: Launch your terminal application.

2. **Change Directory**: Navigate to your project directory using the `cd` command. For example:
   ```shell
   cd /path/to/your/project/directory
   ```
3. **Install Hardhat**: Run the following Script to install Hardhat
   ```shell
   npm install hardhat
   ```
   or
   ```shell
   npm install --save-dev hardhat
   ```
   or
   ```shell
   npm insall
   ```
   this will insall the required dependencies and modules required

Then, execute the following command to run all tests:

```shell
npx hardhat test
```

This command will execute all test cases defined in the `test/` directory and provide feedback on the contract behavior.

Feel free to read more about secure deploy at [Open Zepplin](https://www.openzeppelin.com/)

Feel free to extend the test suite or provide additional contracts as needed. Happy testing!

Project Inspiration from https://github.com/OpenZeppelin/damn-vulnerable-defi
