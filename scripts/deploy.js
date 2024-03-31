const hre = require("hardhat");

async function main() {
  // Deploy other contracts here
  const contracts = ["Attacker", "Bank", "BankNonReentrant", "Counter", "Escrow", "FlashLoan", "FlahLoanReceiver", "RealEstate", "Token"];
  for (const contractName of contracts) {
    const Contract = await hre.ethers.getContractFactory(contractName);
    const contract = await Contract.deploy();
    await contract.deployed();
    console.log(`${contractName} deployed to:`, contract.address);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
