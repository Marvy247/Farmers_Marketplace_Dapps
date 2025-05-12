"use client";
import React, { useEffect, useState } from "react";
import { Contract, formatUnits, parseUnits, BigNumberish } from "ethers";
import MarketplaceABI from "../../lib/abis/Marketplace.json";
import { useContract } from "../../context/ContractContext";
import {
  FiUser ,
  FiDollarSign,
  FiPackage,
  FiLoader,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";

const MARKETPLACE_ADDRESS = "0x7dd9F0511A4718eff1eBF1dC50FCB383955c706D";

interface Order {
  id: BigNumberish;
  farmer: string;
  buyer: string;
  amount: BigNumberish;
  price: BigNumberish;
  escrowId: BigNumberish;
  isCompleted: boolean;
  isCancelled: boolean;
  createdAt: BigNumberish;
  expiryTime: BigNumberish;
}

interface Product {
  id: BigNumberish;
  farmer: string;
  name: string;
  description: string;
  price: BigNumberish;
  quantity: BigNumberish;
  isActive: boolean;
}

const Marketplace: React.FC = () => {
  const { provider, signer, account } = useContract();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ amount: "", price: "" });
  const [loading, setLoading] = useState({
    fetchingOrders: false,
    fetchingProducts: false,
    creating: false,
  });
  const [error, setError] = useState<string | null>(null);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const marketplaceContract = () =>
    new Contract(MARKETPLACE_ADDRESS, MarketplaceABI.abi, signer || provider);

  const fetchOrders = async () => {
    if (!provider) return;
    setLoading((prev) => ({ ...prev, fetchingOrders: true }));
    setError(null);

    try {
      const contract = marketplaceContract();
      // Try to get ordersCount using bracket notation
      const totalOrders = await contract['ordersCount']();
      const ordersArray: Order[] = [];
      for (let i = 1; i <= Number(totalOrders); i++) {
        const order = await contract.orders(i);
        ordersArray.push(order);
      }
      setOrders(ordersArray);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading((prev) => ({ ...prev, fetchingOrders: false }));
    }
  };

  const fetchProducts = async () => {
    if (!provider) return;
    setLoading((prev) => ({ ...prev, fetchingProducts: true }));
    setError(null);

    try {
      const contract = marketplaceContract();
      const productsArray: Product[] = await contract.getActiveProducts();
      setProducts(productsArray);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading((prev) => ({ ...prev, fetchingProducts: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [provider]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openBuyForm = (product: Product) => {
    setSelectedProduct(product);
    setForm({ amount: "", price: formatUnits(product.price, 18) });
    setError(null);
  };

  const closeBuyForm = () => {
    setSelectedProduct(null);
    setForm({ amount: "", price: "" });
    setError(null);
  };

  const createOrder = async () => {
    if (!selectedProduct) return setError("No product selected.");
    const { amount, price } = form;

    if (!signer || !account) return setError("Please connect your wallet.");
    if (!amount || !price) return setError("All fields are required.");
    if (parseFloat(amount) <= 0 || parseFloat(price) <= 0)
      return setError("Amount and price must be > 0.");
    if (parseFloat(amount) > Number(formatUnits(selectedProduct.quantity, 18)))
      return setError("Amount exceeds available product quantity.");

    setError(null);
    setLoading((prev) => ({ ...prev, creating: true }));

    try {
      const contract = marketplaceContract();
      const tx = await contract.createOrder(
        account,
        parseUnits(amount, 18),
        parseUnits(price, 18)
      );
      await tx.wait();
      closeBuyForm();
      fetchOrders();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Order creation failed. See console.");
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Marketplace</h2>

      {/* Products List */}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Available Products</h3>
      {loading.fetchingProducts ? (
        <div className="flex justify-center py-6">
          <FiLoader className="animate-spin text-xl text-blue-500" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No products available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {products.map((product) => (
            <div
              key={product.id.toString()}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800">{product.name}</span>
                <button
                  onClick={() => openBuyForm(product)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Buy
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="text-sm text-gray-600">
                Price: {formatUnits(product.price, 18)} ETH
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {formatUnits(product.quantity, 18)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Buy Form */}
      {selectedProduct && (
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Buy {selectedProduct.name}
          </h3>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded mb-4 text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 mb-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="bg-gray-100 p-3 text-gray-500">
                <FiPackage />
              </span>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 outline-none"
                disabled={loading.creating}
                min="0"
                max={Number(formatUnits(selectedProduct.quantity, 18))}
                step="any"
              />
            </div>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="bg-gray-100 p-3 text-gray-500">
                <FiDollarSign />
              </span>
              <input
                type="number"
                name="price"
                placeholder="Price in ETH"
                value={form.price}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 outline-none"
                disabled={loading.creating}
                min="0"
                step="any"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={createOrder}
              disabled={loading.creating}
              className={`py-3 px-4 rounded-lg font-medium text-white flex justify-center items-center ${
                loading.creating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              { loading.creating ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <FaEthereum className="mr-2" />
                  Confirm Purchase
                </>
              )}
            </button>
            <button
              onClick={closeBuyForm}
              disabled={loading.creating}
              className="py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Orders</h3>
      {loading.fetchingOrders ? (
        <div className="flex justify-center py-6">
          <FiLoader className="animate-spin text-xl text-blue-500" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No orders yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.id.toString()}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800">
                  Order #{order.id.toString()}
                </span>
                <div className="flex gap-2 text-xs">
                  {order.isCancelled ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Cancelled <FiX className="inline-block ml-1" />
                    </span>
                  ) : order.isCompleted ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Completed <FiCheck className="inline-block ml-1" />
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                  <FiUser  className="mr-2" /> Farmer: {formatAddress(order.farmer)}
                </p>
                <p className="flex items-center">
                  <FiUser  className="mr-2" /> Buyer: {formatAddress(order.buyer)}
                </p>
                <p className="flex items-center">
                  <FiPackage className="mr-2" /> Amount:{" "}
                  {formatUnits(order.amount, 18)}
                </p>
                <p className="flex items-center">
                  <FaEthereum className="mr-2" /> Price:{" "}
                  {formatUnits(order.price, 18)} ETH
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;