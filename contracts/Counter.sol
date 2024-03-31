// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Counter
{
    //Contract code


    //store a numerical value, increase and decrease the count 
    //store a name and set name
    //illustrate how CRUD works

    uint public count; //will always be positive wont have a sign in the front
    string public name;

    //constructor
    constructor(string memory _name, uint _count)
    {
        name = _name;
        count = _count;
    }

    function increment() public returns (uint newCount)
    {
        count++;
        return count;
    }

    function decrement() public returns (uint newCount)
    {
        count--;
        return count;
    }

    //view will read info from the blockchain and wont modify the variable at all
    function getCount() public view returns(uint)
    {
        return count;
    }

    function getName() public view returns(string memory currName)
    {
        return name;
    }

    function setName(string memory _nameName) public returns (string memory newName)
    {
        name = _nameName;
        return name;
    }
}