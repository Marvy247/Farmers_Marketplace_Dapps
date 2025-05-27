"use client";
import React, { useEffect, useState } from "react";
import { Contract, formatUnits, parseUnits, BigNumberish } from "ethers";
import MarketplaceABI from "../../../lib/abis/Marketplace.json";
import { useContract } from "../../context/ContractContext";
import {
  FiUser,
  FiDollarSign,
  FiPackage,
  FiLoader,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";
import PlaceholderProducts from "./PlaceholderProducts";

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

interface MarketplaceProps {
  refreshTrigger?: boolean;
}

const Marketplace: React.FC<MarketplaceProps> = ({ refreshTrigger }) => {
  const { provider, signer, account } = useContract();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ amount: "", price: "" });
  const [loading, setLoading] = useState({
    fetchingProducts: false,
    creating: false,
    updating: false,
    deactivating: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = React.useState({
    name: "",
    description: "",
    pricePerUnit: "",
    availableQuantity: "",
  });
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const marketplaceContract = () =>
    new Contract(MARKETPLACE_ADDRESS, MarketplaceABI.abi, signer || provider);

  const fetchProducts = async () => {
    if (!provider) return;
    setLoading((prev) => ({ ...prev, fetchingProducts: true }));
    setError(null);

    // Set a timeout to stop loading after 3 seconds if no response
    let timeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      setLoading((prev) => ({ ...prev, fetchingProducts: false }));
    }, 3000);

    try {
      const contract = marketplaceContract();
      const productsArray: Product[] = await contract.getActiveProducts();
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      setProducts(productsArray);
    } catch (err) {
      console.error(err);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      setError("Failed to load products.");
      setProducts([]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      setLoading((prev) => ({ ...prev, fetchingProducts: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [provider]);

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      fetchProducts();
    }
  }, [refreshTrigger]);

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

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    if (
      !updateForm.name ||
      !updateForm.description ||
      !updateForm.pricePerUnit ||
      !updateForm.availableQuantity
    ) {
      setError("All fields are required for update.");
      return;
    }
    setLoading((prev) => ({ ...prev, updating: true }));
    setError(null);
    try {
      const contract = marketplaceContract();
      const priceWei = parseUnits(updateForm.pricePerUnit, 18);
      const quantity = parseInt(updateForm.availableQuantity, 10);
      const tx = await contract.updateProduct(
        editingProduct.id,
        updateForm.name,
        updateForm.description,
        priceWei,
        quantity
      );
      await tx.wait();
      fetchProducts();
      closeEditForm();
    } catch (err) {
      setError(`Update failed: ${(err as Error).message}`);
    } finally {
      setLoading((prev) => ({ ...prev, updating: false }));
    }
  };

  const handleDeactivateProduct = async (productId: BigNumberish) => {
    if (!signer) {
      setError("Please connect your wallet.");
      return;
    }
    setLoading((prev) => ({ ...prev, deactivating: true }));
    setError(null);
    try {
      const contract = marketplaceContract();
      const tx = await contract.deactivateProduct(productId);
      await tx.wait();
      fetchProducts();
    } catch (err) {
      setError(`Deactivate failed: ${(err as Error).message}`);
    } finally {
      setLoading((prev) => ({ ...prev, deactivating: false }));
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setUpdateForm({
      name: product.name,
      description: product.description,
      pricePerUnit: formatUnits(product.price, 18),
      availableQuantity: formatUnits(product.quantity, 18),
    });
    setError(null);
  };

  const closeEditForm = () => {
    setEditingProduct(null);
    setUpdateForm({
      name: "",
      description: "",
      pricePerUnit: "",
      availableQuantity: "",
    });
    setError(null);
  };

  const isFormValid = () => {
    const { amount, price } = form;
    if (!amount || !price) return false;
    if (parseFloat(amount) <= 0 || parseFloat(price) <= 0) return false;
    if (
      selectedProduct &&
      parseFloat(amount) > Number(formatUnits(selectedProduct.quantity, 18))
    )
      return false;
    return true;
  };

  const createOrder = async () => {
    if (!selectedProduct) return setError("No product selected.");
    const { amount, price } = form;

    if (!signer || !account) return setError("Please connect your wallet.");
    if (!amount || !price) return setError("All fields are required.");
    if (parseFloat(amount) <= 0 || parseFloat(price) <= 0)
      return setError("Amount and price must be > 0.");
    if (
      parseFloat(amount) > Number(formatUnits(selectedProduct.quantity, 18))
    )
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
      fetchProducts();
    } catch (err) {
      console.error(err);
      if ((err as Error).message.includes("revert")) {
        setError(
          "Order creation failed due to contract revert. Please check your inputs."
        );
      } else {
        setError("Order creation failed. See console.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  return (
    <div>
      {/* Products List */}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Available Products
      </h3>
      {loading.fetchingProducts ? (
        <div className="flex justify-center py-6">
          <FiLoader className="animate-spin text-xl text-blue-500" />
        </div>
      ) : products.length === 0 ? (
        <PlaceholderProducts />
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {products.map((product) => (
            <div
              key={product.id.toString()}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800">{product.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openBuyForm(product)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Buy
                  </button>
                  {account?.toLowerCase() === product.farmer.toLowerCase() && (
                    <>
                      <button
                        onClick={() => openEditForm(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeactivateProduct(product.id)}
                        disabled={loading.deactivating}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-red-400"
                      >
                        {loading.deactivating ? "Deactivating..." : "Deactivate"}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
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
              disabled={loading.creating || !isFormValid()}
              className={`py-3 px-4 rounded-lg font-medium text-white flex justify-center items-center ${
                loading.creating || !isFormValid()
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading.creating ? (
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

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Update Product: {editingProduct.name}
          </h3>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded mb-4 text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={updateForm.name}
              onChange={handleUpdateInputChange}
              className="w-full px-3 py-2 border rounded"
              disabled={loading.updating}
            />
            <input
              type="text"
              name="description"
              placeholder="Product Description"
              value={updateForm.description}
              onChange={handleUpdateInputChange}
              className="w-full px-3 py-2 border rounded"
              disabled={loading.updating}
            />
            <input
              type="number"
              name="pricePerUnit"
              placeholder="Price per Unit (ETH)"
              value={updateForm.pricePerUnit}
              onChange={handleUpdateInputChange}
              className="w-full px-3 py-2 border rounded"
              disabled={loading.updating}
              min="0"
              step="0.01"
            />
            <input
              type="number"
              name="availableQuantity"
              placeholder="Available Quantity"
              value={updateForm.availableQuantity}
              onChange={handleUpdateInputChange}
              className="w-full px-3 py-2 border rounded"
              disabled={loading.updating}
              min="0"
              step="1"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleUpdateProduct}
              disabled={loading.updating}
              className={`py-3 px-4 rounded-lg font-medium text-white flex justify-center items-center ${
                loading.updating
                  ? "bg-yellow-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {loading.updating ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </button>
            <button
              onClick={closeEditForm}
              disabled={loading.updating}
              className="py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;