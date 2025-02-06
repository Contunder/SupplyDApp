// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecentralizedDeliveryToken {
    string public name = "DeliveryToken";
    string public symbol = "DLV";
    uint8 public decimals = 10;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    uint256 public constant MAX_DELIVERIES = 5;
    uint256 public constant COOLDOWN_TIME = 5 minutes;

    struct Package {
        address sender;
        address recipient;
        uint256 amount;
        uint256 createdAt;
        uint256 lastTransferAt;
        string status;
        string deliveryFile;
        string proofOfDelivery;
    }

    mapping(uint256 => Package) public packages;
    uint256 public nextPackageId;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event PackageCreated(uint256 indexed packageId, address indexed sender, address recipient, uint256 amount, string deliveryFile);
    event PackageTransferred(uint256 indexed packageId, address indexed from, address indexed to, uint256 amount);
    event PackageDelivered(uint256 indexed packageId, address indexed recipient, string proofOfDelivery);

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10**uint256(decimals);
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(balances[msg.sender] >= value, "Insufficient balance");
        require(to != address(0), "Invalid address");

        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowances[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balances[from] >= value, "Insufficient balance");
        require(allowances[from][msg.sender] >= value, "Allowance exceeded");
        require(to != address(0), "Invalid address");

        balances[from] -= value;
        balances[to] += value;
        allowances[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    function createPackage(address recipient, uint256 amount, string memory deliveryFile) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than zero");

        uint256 packageId = nextPackageId++;
        packages[packageId] = Package({
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            createdAt: block.timestamp,
            lastTransferAt: block.timestamp,
            status: "Created",
            deliveryFile: deliveryFile,
            proofOfDelivery: ""
        });

        balances[msg.sender] -= amount;
        emit PackageCreated(packageId, msg.sender, recipient, amount, deliveryFile);
    }

    function transferPackage(uint256 packageId, address newHolder) external {
        require(packages[packageId].sender == msg.sender, "Only sender can transfer");
        require(block.timestamp >= packages[packageId].lastTransferAt + COOLDOWN_TIME, "Cooldown period not over");
        require(newHolder != address(0), "Invalid address");

        packages[packageId].lastTransferAt = block.timestamp;
        packages[packageId].status = "Transfer";
        emit PackageTransferred(packageId, msg.sender, newHolder, packages[packageId].amount);
    }

    function confirmDelivery(uint256 packageId, string memory proofOfDelivery) external {
        require(packages[packageId].recipient == msg.sender, "Only recipient can confirm delivery");
        require(keccak256(abi.encodePacked(packages[packageId].status)) != keccak256(abi.encodePacked("Delivered")), "Already delivered");

        balances[msg.sender] += packages[packageId].amount;
        packages[packageId].status = "Delivered";
        packages[packageId].proofOfDelivery = proofOfDelivery;
        emit PackageDelivered(packageId, msg.sender, proofOfDelivery);
    }
}
