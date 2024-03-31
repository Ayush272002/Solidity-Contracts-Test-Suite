// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface IERC721
{
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow
{

    address public nftAddress;
    uint256 public nftId;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable buyer; 
    address payable seller;
    address public inspector;
    address public lender;

    bool public inspectionPassed = false;
    mapping(address => bool) public approval;

    receive() external payable {} // to receive ether to the contract

    constructor(address _nftAddress, uint256 _nftId, uint256 _purchasePrice, uint256 _escrowAmount, address payable _seller, address payable _buyer, address _inspector, address _lender)
    {
        nftAddress = _nftAddress;
        nftId = _nftId;
        seller = _seller;
        buyer = _buyer;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        lender = _lender;
        inspector = _inspector;
    }

    modifier onlyBuyer()
    {
        require(msg.sender == buyer, "Only Buyer can call this function");
        _;
    }

    //only buyer can call this function
    function depositEarnest() public payable onlyBuyer()
    {
        require(msg.value >= escrowAmount);
    }

    modifier onlyInspector()
    {
        require(msg.sender == inspector, "Only Inspector can call this function");
        _;
    }

    function updateInspectionStatus(bool _passed) public onlyInspector()
    {
        inspectionPassed = _passed;
    }

    function getBalance() public view returns(uint)
    {
        return address(this).balance;
    }

    function approveSale() public
    {
        approval[msg.sender] = true;
    }

    function cancelSale() public
    {
        if(inspectionPassed == false)
        {
            payable(buyer).transfer(address(this).balance);
        }
        else
        {
            payable(seller).transfer(address(this).balance);
        }
    }

    function finalizeSale() public
    {
        require(inspectionPassed, 'must pass inspection');
        require(approval[buyer], 'must be approved by buyer');
        require(approval[seller], 'must be approved by seller');
        require(approval[lender], 'must be approved by lender');
        require(address(this).balance >= purchasePrice, 'must have enough ether for sale');

        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);

        //transfer ownership of a property
        IERC721(nftAddress).transferFrom(seller, buyer, nftId);
    }
}