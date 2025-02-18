const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const provider = ethers.provider;
    const balance = await provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

    const ContractFactory = await ethers.getContractFactory("DecentralizedDeliveryToken");

    const initialSupply = 1000;

    const contract = await ContractFactory.deploy(initialSupply);
    console.log("Deploying contract...");

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
