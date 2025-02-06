const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedDeliveryToken", function () {
    let token;
    let owner;
    let addr1;
    let addr2;
    let initialSupply;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        initialSupply = ethers.parseUnits("1000", 10);

        const Token = await ethers.getContractFactory("DecentralizedDeliveryToken");
        token = await Token.deploy(initialSupply);
    });

    it("should deploy the contract with correct initial supply", async function () {
        const ownerBalance = await token.balances(owner.address);

        const expectedSupply = ethers.parseUnits("1000", 20);

        expect(await token.totalSupply()).to.equal(expectedSupply);
        expect(ownerBalance).to.equal(expectedSupply);
    });

    it("should allow owner to transfer tokens", async function () {
        await token.transfer(addr1.address, ethers.parseUnits("100", 10));
        const addr1Balance = await token.balances(addr1.address);
        expect(addr1Balance).to.equal(ethers.parseUnits("100", 10));
    });

    it("should allow owner to create a package", async function () {
        await token.createPackage(addr1.address, ethers.parseUnits("100", 10), "deliveryFile.txt");

        const package = await token.packages(0);
        expect(package.sender).to.equal(owner.address);
        expect(package.recipient).to.equal(addr1.address);
        expect(package.amount).to.equal(ethers.parseUnits("100", 10));
        expect(package.status).to.equal("Created");
    });

    it("should prevent non-sender from transferring a package", async function () {
        await token.createPackage(addr1.address, ethers.parseUnits("100", 10), "deliveryFile.txt");

        await expect(
            token.transferPackage(0, addr2.address)
        ).to.be.revertedWith("Cooldown period not over");

        await ethers.provider.send("evm_increaseTime", [5 * 60]);
        await ethers.provider.send("evm_mine", []);

        await token.transferPackage(0, addr2.address);
        const package = await token.packages(0);
        expect(package.lastTransferAt).to.be.greaterThan(0);
        expect(package.status).to.equal("Transfer");
    });


    it("should prevent transferring package if cooldown period not over", async function () {
        await token.createPackage(addr1.address, ethers.parseUnits("100", 10), "deliveryFile.txt");

        await expect(
            token.transferPackage(0, addr2.address)
        ).to.be.revertedWith("Cooldown period not over");

        await ethers.provider.send("evm_increaseTime", [5 * 60]);
        await ethers.provider.send("evm_mine", []);

        await token.transferPackage(0, addr2.address);
        const package = await token.packages(0);
        expect(package.lastTransferAt).to.be.greaterThan(0);
        expect(package.status).to.equal("Transfer");
    });

    it("should allow recipient to confirm delivery", async function () {
        await token.createPackage(addr1.address, ethers.parseUnits("100", 10), "deliveryFile.txt");

        await token.connect(addr1).confirmDelivery(0, "proofOfDeliveryFile.txt");

        const package = await token.packages(0);
        expect(package.status).to.equal("Delivered");
        expect(package.proofOfDelivery).to.equal("proofOfDeliveryFile.txt");
    });

    it("should revert if recipient tries to confirm delivery twice", async function () {
        await token.createPackage(addr1.address, ethers.parseUnits("100", 10), "deliveryFile.txt");

        await token.connect(addr1).confirmDelivery(0, "proofOfDeliveryFile.txt");

        await expect(
            token.connect(addr1).confirmDelivery(0, "newProof.txt")
        ).to.be.revertedWith("Already delivered");
    });
});
