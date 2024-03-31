// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

// 1. import contract
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// 2. inherit from ReentrancyGuard

contract BankNonReentrant is ReentrancyGuard
{
    using Address for address payable;
    mapping(address => uint256) public balanceOf;

    //deposit ether funds
    function deposit() external payable
    {
        balanceOf[msg.sender] += msg.value; 
    }


    //withdraw ether funds
    function withdraw() external nonReentrant
    {
        //withdraw all amount
        uint256 depositedAmount = balanceOf[msg.sender];
        payable(msg.sender).sendValue(depositedAmount);
        balanceOf[msg.sender] = 0;
    }
}