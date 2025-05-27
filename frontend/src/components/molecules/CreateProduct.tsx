"use client";
import React, { useState } from "react";
import { Contract, parseUnits } from "ethers";
import MarketplaceABI from "../../../lib/abis/Marketplace.json";
import { useContract } from "../../context/ContractContext";
import { FiPackage, FiEdit3, FiDollarSign, FiLoader, FiCalendar, FiMapPin, FiCheck, FiImage } from "react-icons/fi";

const MARKETPLACE_ADDRESS = "0x7dd9F0511A4718eff1eBF1dC50FCB383955c706D";

interface FarmerProductCreateProps {
  onProductCreated: () => void;
}

const FarmerProductCreate: React.FC<FarmerProductCreateProps> = ({ onProductCreated }) => {
  const { signer, account } = useContract();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Vegetables", // Default category
    unit: "kg", // Default unit
    pricePerUnit: "",
    initialQuantity: "",
    location: "",
    harvestDate: "",
    isOrganic: false
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Meat", "Other"];
  const units = ["kg", "lb", "unit", "dozen", "bushel"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const isValidDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    return !isNaN(date.getTime()) && date >= now;
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'description', 'pricePerUnit', 'initialQuantity', 'location', 'harvestDate'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return false;
      }
    }
    if (parseFloat(formData.pricePerUnit) <= 0 || parseFloat(formData.initialQuantity) <= 0) {
      return false;
    }
    if (!isValidDate(formData.harvestDate)) {
      return false;
    }
    if (!imageFile) {
      return false;
    }
    return true;
  };

  const createProduct = async () => {
    if (!signer || !account) {
      setError("Please connect your wallet first");
      return;
    }

    // Validate required fields
    const requiredFields = ['name', 'description', 'pricePerUnit', 'initialQuantity', 'location', 'harvestDate'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    if (parseFloat(formData.pricePerUnit) <= 0 || parseFloat(formData.initialQuantity) <= 0) {
      setError("Price and quantity must be greater than zero");
      return;
    }

    if (!isValidDate(formData.harvestDate)) {
      setError("Harvest date must be a valid date and not in the past.");
      return;
    }

    if (!imageFile) {
      setError("Please select a product image.");
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
      const priceInWei = parseUnits(formData.pricePerUnit, 18);
      const quantity = parseInt(formData.initialQuantity, 10);
      const harvestTimestamp = Math.floor(new Date(formData.harvestDate).getTime() / 1000);

      // Since image upload is not handled here, pass empty string for imageHash
      const imageHashPlaceholder = "";

      const tx = await marketplaceContract.createProduct(
        formData.name,
        formData.description,
        formData.category,
        formData.unit,
        priceInWei,
        quantity,
        imageHashPlaceholder,
        formData.location,
        harvestTimestamp,
        formData.isOrganic
      );
      
      await tx.wait();

      // Reset form and image file
      setFormData({
        name: "",
        description: "",
        category: "Vegetables",
        unit: "kg",
        pricePerUnit: "",
        initialQuantity: "",
        location: "",
        harvestDate: "",
        isOrganic: false
      });
      setImageFile(null);

      setSuccessMessage("Product created successfully!");
      onProductCreated();
    } catch (error) {
      console.error("Product creation failed:", error);
      if ((error as Error).message.includes("revert")) {
        setError("Product creation failed due to contract revert. Please check your inputs.");
      } else {
        setError(`Product creation failed: ${(error as Error).message}`);
      }
    } finally {
      setCreatingProduct(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Agricultural Product</h2>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-6 rounded">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiEdit3 />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Product Name (e.g., Organic Tomatoes)"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none placeholder-gray-400"
              disabled={creatingProduct}
            />
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiEdit3 />
            </span>
            <input
              type="text"
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none placeholder-gray-400"
              disabled={creatingProduct}
            />
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiPackage />
            </span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none bg-white text-gray-500"
              disabled={creatingProduct}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiPackage />
            </span>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none bg-white text-gray-500"
              disabled={creatingProduct}
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column - Pricing & Details */}
        <div className="space-y-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiDollarSign />
            </span>
            <input
              type="number"
              name="pricePerUnit"
              placeholder="Price per Unit (ETH)"
              value={formData.pricePerUnit}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none placeholder-gray-400"
              disabled={creatingProduct}
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiPackage />
            </span>
            <input
              type="number"
              name="initialQuantity"
              placeholder="Available Quantity"
              value={formData.initialQuantity}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none placeholder-gray-400"
              disabled={creatingProduct}
              min="1"
              step="1"
            />
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiMapPin />
            </span>
            <input
              type="text"
              name="location"
              placeholder="Farm Location (e.g., California, USA)"
              value={formData.location}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none placeholder-gray-400"
              disabled={creatingProduct}
            />
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="bg-gray-100 p-3 text-gray-500">
              <FiCalendar />
            </span>
            <input
              type="date"
              name="harvestDate"
              placeholder="Harvest Date"
              value={formData.harvestDate}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none placeholder-gray-400 text-gray-500"
              disabled={creatingProduct}
            />
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden p-3">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                name="isOrganic"
                checked={formData.isOrganic}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
                disabled={creatingProduct}
              />
              <span>Certified Organic</span>
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload (Local File) */}
      <div className="mt-6">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-gray-100 p-3 text-gray-500">
            <FiImage />
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 px-3 py-2 outline-none placeholder-gray-400"
            disabled={creatingProduct}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={createProduct}
        className={`mt-6 flex items-center justify-center w-full py-3 px-4 rounded-lg font-medium text-white ${
          creatingProduct ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors`}
        disabled={creatingProduct}
      >
        {creatingProduct ? (
          <>
            <FiLoader className="animate-spin mr-2" />
            Creating Product...
          </>
        ) : (
          <>
            <FiCheck className="mr-2" />
            List Product
          </>
        )}
      </button>
    </div>
  );
};

export default FarmerProductCreate;
