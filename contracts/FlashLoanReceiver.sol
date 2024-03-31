// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./FlashLoan.sol";
import "./Token.sol";

contract FlashLoanReceiver
{
    FlashLoan private pool;
    address private owner;

    event LoanReceived(address token, uint256 amount);
    event FundsInvested(uint256 amountInvested);

    constructor(address _poolAddress)
    {
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;
    }

    function receiveTokens(address _tokenAddress, uint _amount) external
    {
        
        require(msg.sender == address(pool), "Sender must be pool");

        //require funds received
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount, 'failed to get loan');
        
        //emit event
        emit LoanReceived(_tokenAddress, _amount);

        //do stuff with money
        investFunds(_tokenAddress, _amount);

        //return funds to the pool
       returnFunds(_tokenAddress);
    }

    function investFunds(address _tokenAddress, uint256 _amount) private 
    {
        // For demonstration purposes, let's emit an event indicating the investment
        emit FundsInvested(_amount);
        // For simplicity, we're just printing a message here
        console.log("Invested", _amount, "tokens of", _tokenAddress);
    }

    function returnFunds(address _tokenAddress) private 
    {
        // Return any remaining funds to the pool
        uint256 remainingBalance = Token(_tokenAddress).balanceOf(address(this));
        require(Token(_tokenAddress).transfer(address(pool), remainingBalance), "Transfer of remaining funds failed");
    }

    function executeFlashLoan(uint _amount) external
    {
        require(msg.sender == owner, "Only owner can execute flash loan");
        pool.flashLoan(_amount);
    }
} 