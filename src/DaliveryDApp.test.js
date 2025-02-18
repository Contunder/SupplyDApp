import { render, screen, fireEvent } from "@testing-library/react";
import DeliveryDApp from "./App/DeliveryDApp";
import { ethers } from "ethers";

jest.mock("ethers", () => ({
    ethers: {
        BrowserProvider: jest.fn(),
        Contract: jest.fn(),
    },
}));

describe("DeliveryDApp Component", () => {
    test("Affiche correctement le bouton Connect Wallet", () => {
        render(<DeliveryDApp />);
        expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    });

    test("Crée un package et appelle la fonction du smart contract", async () => {
        const mockCreatePackage = jest.fn();
        ethers.Contract.mockImplementation(() => ({
            createPackage: mockCreatePackage,
        }));

        render(<DeliveryDApp />);

        fireEvent.change(screen.getByPlaceholderText("Recipient"), { target: { value: "0xRecipientAddress" } });
        fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "100" } });
        fireEvent.change(screen.getByPlaceholderText("Delivery File (IPFS Hash)"), { target: { value: "QmTestHash" } });

        fireEvent.click(screen.getByText("Create"));

        expect(mockCreatePackage).toHaveBeenCalledWith("0xRecipientAddress", "100", "QmTestHash");
    });

    test("Approuve un transfert et appelle la fonction approve", async () => {
        const mockApprove = jest.fn();
        ethers.Contract.mockImplementation(() => ({
            approve: mockApprove,
        }));

        render(<DeliveryDApp />);

        fireEvent.change(screen.getByPlaceholderText("Spender"), { target: { value: "0xSpenderAddress" } });
        fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "50" } });

        fireEvent.click(screen.getByText("Approve"));

        expect(mockApprove).toHaveBeenCalledWith("0xSpenderAddress", "50");
    });

    test("Transfère un package et appelle la fonction transferFrom", async () => {
        const mockTransferFrom = jest.fn();
        ethers.Contract.mockImplementation(() => ({
            transferFrom: mockTransferFrom,
        }));

        render(<DeliveryDApp />);

        fireEvent.change(screen.getByPlaceholderText("Package ID"), { target: { value: "1" } });
        fireEvent.change(screen.getByPlaceholderText("New Holder"), { target: { value: "0xNewHolderAddress" } });

        fireEvent.click(screen.getByText("Transfer"));

        expect(mockTransferFrom).toHaveBeenCalledWith(expect.any(String), "0xNewHolderAddress", "1");
    });

    test("Confirme la livraison et appelle confirmDelivery", async () => {
        const mockConfirmDelivery = jest.fn();
        ethers.Contract.mockImplementation(() => ({
            confirmDelivery: mockConfirmDelivery,
        }));

        render(<DeliveryDApp />);

        fireEvent.change(screen.getByPlaceholderText("Package ID"), { target: { value: "1" } });
        fireEvent.change(screen.getByPlaceholderText("Proof of Delivery"), { target: { value: "QmProofHash" } });

        fireEvent.click(screen.getByText("Confirm"));

        expect(mockConfirmDelivery).toHaveBeenCalledWith("1", "QmProofHash");
    });
});
