"use client";
import React, { useState } from "react";
import { Contract, parseUnits } from "ethers";
import MarketplaceABI from "../lib/abis/Marketplace.json";
import { useContract } from "../context/ContractContext";
import { Package, Edit3, DollarSign, Loader2 } from "lucide-react";

const MARKETPLACE_ADDRESS = "0x7dd9F0511A4718eff1eBF1dC50FCB383955c706D";

const FarmerProductCreate: React.FC = () => {
  const { signer, account } = useContract();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [initialQuantity, setInitialQuantity] = useState<string>("");
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createProduct = async () => {
    if (!signer || !account) {
      setError("Please connect your wallet first");
      return;
    }
    if (!name || !description || !pricePerUnit || !initialQuantity) {
      setError("Please fill all fields");
      return;
    }
    if (parseFloat(pricePerUnit) <= 0 || parseFloat(initialQuantity) <= 0) {
      setError("Price and quantity must be greater than zero");
      return;
    }

    setCreatingProduct(true);
    setError(null);
    setSuccessMessage(null);

    const marketplaceContract = new Contract(
      MARKETPLACE_ADDRESS,
      MarketplaceABI.abi,
      signer
    );

    try {
      const priceInWei = parseUnits(pricePerUnit, 18);
      const quantity = parseInt(initialQuantity, 10);

      const tx = await marketplaceContract.createProduct(
        name,
        description,
        priceInWei,
        quantity
      );
      await tx.wait();

      setName("");
      setDescription("");
      setPricePerUnit("");
      setInitialQuantity("");
      setSuccessMessage("Product created successfully!");
    } catch (error) {
      console.error("Product creation failed:", error);
      setError(`Product creation failed: ${(error as Error).message}`);
    } finally {
      setCreatingProduct(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Product</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-gray-100 p-3 text-gray-500">
            <Edit3 size={20} />
          </span>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 outline-none"
            disabled={creatingProduct}
          />
        </div>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-gray-100 p-3 text-gray-500">
            <Edit3 size={20} />
          </span>
          <input
            type="text"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 px-3 py-2 outline-none"
            disabled={creatingProduct}
          />
        </div>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-gray-100 p-3 text-gray-500">
            <DollarSign size={20} />
          </span>
          <input
            type="number"
            placeholder="Price per Unit (ETH)"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            className="flex-1 px-3 py-2 outline-none"
            disabled={creatingProduct}
            min="0"
            step="any"
          />
        </div>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-gray-100 p-3 text-gray-500">
            <Package size={20} />
          </span>
          <input
            type="number"
            placeholder="Initial Quantity"
            value={initialQuantity}
            onChange={(e) => setInitialQuantity(e.target.value)}
            className="flex-1 px-3 py-2 outline-none"
            disabled={creatingProduct}
            min="0"
            step="1"
          />
        </div>

        <button
          onClick={createProduct}
          className={`flex items-center justify-center w-full py-3 px-4 rounded-lg font-medium text-white ${
            creatingProduct ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
          disabled={creatingProduct}
        >
          {creatingProduct ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </div>
    </div>
  );
};

export default FarmerProductCreate;
