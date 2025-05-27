"use client";
import React, { useEffect, useState } from "react";
import { Contract, BigNumberish, ethers } from "ethers";
import MarketplaceABI from "../../../lib/abis/Marketplace.json";
import { useContract } from "../../context/ContractContext";
import { FiCheck, FiX, FiLoader } from "react-icons/fi";

const MARKETPLACE_ADDRESS = "0x7dd9F0511A4718eff1eBF1dC50FCB383955c706D";

interface Order {
  id: BigNumberish;
  productId: BigNumberish;
  farmer: string;
  buyer: string;
  amount: BigNumberish;
  price: BigNumberish;
  escrowId: BigNumberish;
  isCompleted: boolean;
  isCancelled: boolean;
  createdAt: BigNumberish;
}

const BuyerOrders: React.FC = () => {
  const { provider, signer, account } = useContract();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  const marketplaceContract = () =>
    new Contract(MARKETPLACE_ADDRESS, MarketplaceABI.abi, signer || provider);

  const fetchOrders = async () => {
    if (!provider || !account) return;
    setLoading(true);
    setError(null);
    try {
      const contract = marketplaceContract();
      // Since contract does not have getOrdersByBuyer, fetch all products and filter orders client-side
      const products = await contract.getActiveProducts();
      let allOrders: Order[] = [];
      for (const product of products) {
        const productOrders: Order[] = await contract.getOrdersForProduct(product.id);
        allOrders = allOrders.concat(productOrders);
      }
      const buyerOrders = allOrders.filter(
        (order) => order.buyer.toLowerCase() === account.toLowerCase()
      );
      setOrders(buyerOrders);
    } catch (err) {
      setError(`Failed to fetch orders: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [provider, account]);

  const handleCompleteOrder = async (orderId: BigNumberish) => {
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    setActionLoading((prev) => ({ ...prev, [orderId.toString()]: true }));
    setError(null);
    try {
      const contract = marketplaceContract();
      const tx = await contract.completeOrder(orderId);
      await tx.wait();
      fetchOrders();
    } catch (err) {
      setError(`Complete order failed: ${(err as Error).message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId.toString()]: false }));
    }
  };

  const handleCancelOrder = async (orderId: BigNumberish) => {
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    setActionLoading((prev) => ({ ...prev, [orderId.toString()]: true }));
    setError(null);
    try {
      const contract = marketplaceContract();
      const tx = await contract.cancelOrder(orderId);
      await tx.wait();
      fetchOrders();
    } catch (err) {
      setError(`Cancel order failed: ${(err as Error).message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId.toString()]: false }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-6">
          <FiLoader className="animate-spin text-xl text-blue-500" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You have no orders.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Farmer</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Price (ETH)</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id.toString()}>
                <td className="border border-gray-300 px-4 py-2">{order.id.toString()}</td>
                <td className="border border-gray-300 px-4 py-2">{order.productId.toString()}</td>
                <td className="border border-gray-300 px-4 py-2">{order.farmer}</td>
                <td className="border border-gray-300 px-4 py-2">{order.amount.toString()}</td>
                <td className="border border-gray-300 px-4 py-2">{ethers.formatUnits(order.price.toString(), 18)}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.isCompleted ? (
                    <span className="text-green-600 font-semibold">Completed</span>
                  ) : order.isCancelled ? (
                    <span className="text-red-600 font-semibold">Cancelled</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  {!order.isCompleted && !order.isCancelled && (
                    <>
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        disabled={actionLoading[order.id.toString()]}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-green-400"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={actionLoading[order.id.toString()]}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-red-400"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BuyerOrders;
