import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "./DecentralizedDeliveryToken.json";

// Replace with your contract's deployed address on the Hardhat network
const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export default function DeliveryDApp() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [events, setEvents] = useState([]);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [deliveryFile, setDeliveryFile] = useState("");
    const [packageId, setPackageId] = useState("");
    const [proofOfDelivery, setProofOfDelivery] = useState("");
    const [newHolder, setNewHolder] = useState("");
    const [spender, setSpender] = useState("");
    const [approveAmount, setApproveAmount] = useState("");

    useEffect(() => {
        const intervalId = setInterval(fetchEvents, 5000);
        return () => clearInterval(intervalId);
    }, []);

    async function fetchEvents() {
        if (!contract) return;

        const blockNumber = await provider.getBlockNumber();
        const eventFilter = contract.filters.PackageCreated();
        const events = await contract.queryFilter(eventFilter, blockNumber - 5, "latest");

        if (events.length > 0) {
            setEvents(prevEvents => [...events, ...prevEvents]);
        }
    }

    // Connect to the local Hardhat network
    async function connectWallet() {
        const localProvider = new ethers.JsonRpcProvider("http://localhost:8545");

        const signer = localProvider.getSigner(0);
        setProvider(localProvider);
        setSigner(signer);

        // Load the contract
        const contractInstance = new ethers.Contract(contractAddress, contractABI, await signer);
        setContract(contractInstance);

        console.log("✅ Wallet connected and contract loaded.");
    }

    function handleEvent(eventName, eventData) {
        setEvents(prevEvents => [{ eventName, eventData }, ...prevEvents]);
        console.log(`📡 Event received: ${eventName}`, eventData);
    }

    async function createPackage() {
        if (!contract) return;
        const tx = await contract.createPackage(recipient, amount, deliveryFile);
        await tx.wait();
        console.log("📦 Package created successfully!");
    }

    async function approveTransfer() {
        if (!contract) return;
        const tx = await contract.approve(spender, approveAmount);
        await tx.wait();
        console.log("✅ Transfer approved!");
    }

    async function transferPackage() {
        if (!contract) return;
        const tx = await contract.transferFrom(signer.address, newHolder, packageId);
        await tx.wait();
        console.log("📦🔄 Package transferred!");
    }

    async function confirmDelivery() {
        if (!contract) return;
        const tx = await contract.confirmDelivery(packageId, proofOfDelivery);
        await tx.wait();
        console.log("📦✅ Delivery confirmed!");
    }

    return (
        <div className="p-4">
            <button onClick={connectWallet} className="p-2 bg-blue-500 text-white">Connect Wallet</button>

            <div className="mt-4">
                <h2>Create Package</h2>
                <input type="text" placeholder="Recipient" value={recipient} onChange={e => setRecipient(e.target.value)} className="border p-1" />
                <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-1" />
                <input type="text" placeholder="Delivery File (IPFS Hash)" value={deliveryFile} onChange={e => setDeliveryFile(e.target.value)} className="border p-1" />
                <button onClick={createPackage} className="p-2 bg-green-500 text-white">Create</button>
            </div>

            <div className="mt-4">
                <h2>Approve Transfer</h2>
                <input type="text" placeholder="Spender" value={spender} onChange={e => setSpender(e.target.value)} className="border p-1" />
                <input type="text" placeholder="Amount" value={approveAmount} onChange={e => setApproveAmount(e.target.value)} className="border p-1" />
                <button onClick={approveTransfer} className="p-2 bg-yellow-500 text-white">Approve</button>
            </div>

            <div className="mt-4">
                <h2>Transfer Package</h2>
                <input type="text" placeholder="Package ID" value={packageId} onChange={e => setPackageId(e.target.value)} className="border p-1" />
                <input type="text" placeholder="New Holder" value={newHolder} onChange={e => setNewHolder(e.target.value)} className="border p-1" />
                <button onClick={transferPackage} className="p-2 bg-blue-500 text-white">Transfer</button>
            </div>

            <div className="mt-4">
                <h2>Confirm Delivery</h2>
                <input type="text" placeholder="Package ID" value={packageId} onChange={e => setPackageId(e.target.value)} className="border p-1" />
                <input type="text" placeholder="Proof of Delivery" value={proofOfDelivery} onChange={e => setProofOfDelivery(e.target.value)} className="border p-1" />
                <button onClick={confirmDelivery} className="p-2 bg-purple-500 text-white">Confirm</button>
            </div>

            <div className="mt-4">
                <h2>Event Log</h2>
                <div className="border p-2 h-40 overflow-y-auto bg-gray-100">
                    {events.map((event, index) => (
                        <div key={index} className="p-1 border-b">
                            <strong>{event.eventName}</strong>: {JSON.stringify(event.eventData)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
