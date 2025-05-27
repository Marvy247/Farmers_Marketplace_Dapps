"use client";
import React, { useState } from "react";
import { Contract, ethers } from "ethers";
import EscrowABI from "../../../lib/abis/Escrow.json";
import { useContract } from "../../context/ContractContext";
import {
  FiCheck,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiPlusCircle,
  FiRefreshCw,
} from "react-icons/fi";

const ESCROW_ADDRESS = "0xfCFc3A73044B5431388b184Dd745fFeaD9Ee9B5A";

const EscrowManagement: React.FC = () => {
  const { provider, signer, account } = useContract();
  const [orderId, setOrderId] = useState<string>("");
  const [seller, setSeller] = useState<string>("");
  const [buyer, setBuyer] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [disputeOrderId, setDisputeOrderId] = useState<string>("");
  const [resolveOrderId, setResolveOrderId] = useState<string>("");
  const [resolveApprove, setResolveApprove] = useState<boolean>(true);
  const [canRefundOrderId, setCanRefundOrderId] = useState<string>("");
  const [canRefundResult, setCanRefundResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const contract = new Contract(ESCROW_ADDRESS, EscrowABI.abi, signer || provider) as any;

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleCreateEscrow = async () => {
    resetMessages();
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    if (!seller || !buyer || !amount) {
      setError("Seller, buyer, and amount are required.");
      return;
    }
    setLoading(true);
    try {
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await contract.connect(signer).createEscrow(seller, buyer, amountWei);
      await tx.wait();
      setSuccess(`Escrow created successfully.`);
      setSeller("");
      setBuyer("");
      setAmount("");
    } catch (err) {
      setError(`Create escrow failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteEscrow = async () => {
    resetMessages();
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    if (!orderId) {
      setError("Order ID is required.");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.connect(signer).completeEscrow(parseInt(orderId));
      await tx.wait();
      setSuccess(`Escrow order ${orderId} completed.`);
      setOrderId("");
    } catch (err) {
      setError(`Complete escrow failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundEscrow = async () => {
    resetMessages();
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    if (!orderId) {
      setError("Order ID is required.");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.connect(signer).refundEscrow(parseInt(orderId));
      await tx.wait();
      setSuccess(`Escrow order ${orderId} refunded.`);
      setOrderId("");
    } catch (err) {
      setError(`Refund escrow failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    resetMessages();
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    if (!disputeOrderId) {
      setError("Order ID is required to raise dispute.");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.connect(signer).raiseDispute(parseInt(disputeOrderId));
      await tx.wait();
      setSuccess(`Dispute raised for order ${disputeOrderId}.`);
      setDisputeOrderId("");
    } catch (err) {
      setError(`Raise dispute failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async () => {
    resetMessages();
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    if (!resolveOrderId) {
      setError("Order ID is required to resolve dispute.");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract
        .connect(signer)
        .resolveDispute(parseInt(resolveOrderId), resolveApprove);
      await tx.wait();
      setSuccess(
        `Dispute for order ${resolveOrderId} resolved with approval: ${resolveApprove}`
      );
      setResolveOrderId("");
    } catch (err) {
      setError(`Resolve dispute failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCanRefund = async () => {
    resetMessages();
    if (!canRefundOrderId) {
      setError("Order ID is required to check refund eligibility.");
      return;
    }
    setLoading(true);
    try {
      const result = await contract.canRefund(parseInt(canRefundOrderId));
      setCanRefundResult(result ? "Yes" : "No");
    } catch (err) {
      setError(`Can refund check failed: ${(err as Error).message}`);
      setCanRefundResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Escrow Management</h2>

      {/* Create Escrow */}
      <section className="border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Create Escrow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Seller Address"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Buyer Address"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded px-3 py-2"
            min="0"
            step="0.0001"
          />
        </div>
        <button
          onClick={handleCreateEscrow}
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Creating...
            </>
          ) : (
            "Create Escrow"
          )}
        </button>
      </section>

      {/* Complete Escrow */}
      <section className="border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Complete Escrow</h3>
        <input
          type="number"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          min="1"
        />
        <button
          onClick={handleCompleteEscrow}
          disabled={loading}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Completing...
            </>
          ) : (
            "Complete Escrow"
          )}
        </button>
      </section>

      {/* Refund Escrow */}
      <section className="border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Refund Escrow</h3>
        <input
          type="number"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          min="1"
        />
        <button
          onClick={handleRefundEscrow}
          disabled={loading}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-400"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Refunding...
            </>
          ) : (
            "Refund Escrow"
          )}
        </button>
      </section>

      {/* Raise Dispute */}
      <section className="border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Raise Dispute</h3>
        <input
          type="number"
          placeholder="Order ID"
          value={disputeOrderId}
          onChange={(e) => setDisputeOrderId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          min="1"
        />
        <button
          onClick={handleRaiseDispute}
          disabled={loading}
          className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:bg-yellow-400"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Raising Dispute...
            </>
          ) : (
            "Raise Dispute"
          )}
        </button>
      </section>

      {/* Resolve Dispute */}
      <section className="border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Resolve Dispute</h3>
        <input
          type="number"
          placeholder="Order ID"
          value={resolveOrderId}
          onChange={(e) => setResolveOrderId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          min="1"
        />
        <div className="flex items-center space-x-4 mt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="resolveApprove"
              checked={resolveApprove}
              onChange={() => setResolveApprove(true)}
              className="form-radio"
            />
            <span>Approve</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="resolveApprove"
              checked={!resolveApprove}
              onChange={() => setResolveApprove(false)}
              className="form-radio"
            />
            <span>Reject</span>
          </label>
        </div>
        <button
          onClick={handleResolveDispute}
          disabled={loading}
          className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-purple-400"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Resolving...
            </>
          ) : (
            "Resolve Dispute"
          )}
        </button>
      </section>

      {/* Can Refund */}
      <section className="border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Check Refund Eligibility</h3>
        <input
          type="number"
          placeholder="Order ID"
          value={canRefundOrderId}
          onChange={(e) => setCanRefundOrderId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          min="1"
        />
        <button
          onClick={handleCanRefund}
          disabled={loading}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Checking...
            </>
          ) : (
            "Check Refund"
          )}
        </button>
        {canRefundResult && (
          <p className="mt-2 font-semibold">
            Refund Eligible: {canRefundResult}
          </p>
        )}
      </section>
    </div>
  );
};

export default EscrowManagement;
