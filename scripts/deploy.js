const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();

    // Log the account being used for deployment
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the provider and deployer's balance
    const provider = ethers.provider;
    const balance = await provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

    // Get the contract factory
    const ContractFactory = await ethers.getContractFactory("DecentralizedDeliveryToken");

    // Set the initial supply for the contract
    const initialSupply = 1000;

    // Deploy the contract
    const contract = await ContractFactory.deploy(initialSupply);
    console.log("Deploying contract...");

    // Wait for the contract deployment transaction to be mined
    const receipt = await contract.waitForDeployment();
    console.log("Contract deployed to:", contract.getAddress());
    console.log("Deployment transaction:", receipt.deploymentTransaction());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
