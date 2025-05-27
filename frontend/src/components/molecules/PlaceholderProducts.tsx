"use client";
import React, { useState } from "react";
import { BigNumberish, parseUnits, formatUnits } from "ethers";
import { FaEthereum } from "react-icons/fa";
import { FiPackage, FiDollarSign, FiLoader } from "react-icons/fi";
import { useContract } from "../../context/ContractContext";

interface Product {
  id: BigNumberish;
  farmer: string;
  name: string;
  description: string;
  price: BigNumberish;
  quantity: BigNumberish;
  isActive: boolean;
  imageUrl: string;
  category: string;
}

const placeholderProducts: Product[] = [
  {
    id: 1,
    farmer: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Organic Apples",
    description: "Crisp, juicy organic apples grown without synthetic pesticides.",
    price: parseUnits("0.05", 18),
    quantity: parseUnits("100", 18),
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Fruits"
  },
  {
    id: 2,
    farmer: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    name: "Valencia Oranges",
    description: "Sweet and seedless oranges packed with vitamin C.",
    price: parseUnits("0.08", 18),
    quantity: parseUnits("50", 18),
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Fruits"
  },
  {
    id: 3,
    farmer: "0x0987654321abcdef0987654321abcdef09876543",
    name: "Heirloom Tomatoes",
    description: "Vine-ripened heirloom tomatoes with rich flavor.",
    price: parseUnits("0.12", 18),
    quantity: parseUnits("75", 18),
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6895fdfa9a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Vegetables"
  },
  {
    id: 4,
    farmer: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "Organic Carrots",
    description: "Sweet and crunchy organic carrots, perfect for snacking.",
    price: parseUnits("0.03", 18),
    quantity: parseUnits("120", 18),
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Vegetables"
  },
  {
    id: 5,
    farmer: "0x567890abcdef1234567890abcdef1234567890ab",
    name: "Artisanal Honey",
    description: "Raw, unfiltered honey from local wildflowers.",
    price: parseUnits("0.25", 18),
    quantity: parseUnits("30", 18),
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Pantry"
  },
  {
    id: 6,
    farmer: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Free-Range Eggs",
    description: "Farm-fresh eggs from pasture-raised chickens.",
    price: parseUnits("0.15", 18),
    quantity: parseUnits("60", 18),
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Dairy"
  },
  
    {
      id: 7,
      farmer: "0x9abcdef0123456789abcdef0123456789abcdef0",
      name: "Grass-Fed Beef",
      description: "Premium grass-fed beef, dry-aged for 21 days for maximum flavor and tenderness.",
      price: parseUnits("0.35", 18),
      quantity: parseUnits("40", 18),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Meat"
    },
    {
      id: 8,
      farmer: "0x3456789abcdef0123456789abcdef0123456789ab",
      name: "Free-Range Chicken",
      description: "Organic free-range chicken raised without antibiotics or hormones.",
      price: parseUnits("0.20", 18),
      quantity:  parseUnits("80", 18),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1601342630314-8427c38bf5e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Meat"
    },
    {
      id: 9,
      farmer: "0x6789abcdef0123456789abcdef0123456789abcd",
      name: "Heritage Pork",
      description: "Juicy heritage breed pork with exceptional marbling and flavor.",
      price: parseUnits("0.30", 18),
      quantity: parseUnits("20", 18),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Meat"
    },
    {
      id: 10,
      farmer: "0x23456789abcdef0123456789abcdef0123456789",
      name: "Organic Quinoa",
      description: "High-protein ancient grain perfect for salads and side dishes.",
      price: parseUnits("0.18", 18),
      quantity: parseUnits("100", 18),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Grains"
    },
    {
      id: 11,
      farmer: "0x789abcdef0123456789abcdef0123456789abcde",
      name: "Whole Wheat Flour",
      description: "Stone-ground whole wheat flour for baking nutritious breads.",
      price: parseUnits("0.05", 18),
      quantity:  parseUnits("150", 18),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Grains"
    },
    {
      id: 12,
      farmer: "0x456789abcdef0123456789abcdef0123456789ab",
      name: "Organic Brown Rice",
      description: "Nutrient-rich brown rice with a delicious nutty flavor.",
      price: parseUnits("0.10", 18),
      quantity: parseUnits("200", 18),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1604977046802-80a8758e1eec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Grains"
    }
  
  
];

const PlaceholderProducts: React.FC = () => {
  const { signer, account } = useContract();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ amount: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...new Set(placeholderProducts.map(p => p.category))];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const { amount, price } = form;
    if (!amount || !price) return false;
    if (parseFloat(amount) <= 0 || parseFloat(price) <= 0) return false;
    if (selectedProduct && parseFloat(amount) > Number(formatUnits(selectedProduct.quantity, 18))) return false;
    return true;
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
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(`Order created for ${amount} of ${selectedProduct.name} at ${price} ETH each.`);
      closeBuyForm();
    } catch (err) {
      setError("Order creation failed. See console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory === "All" 
    ? placeholderProducts 
    : placeholderProducts.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Farm Fresh Products</h2>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id.toString()}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                  <span className="text-green-600 font-semibold flex items-center">
                    <FaEthereum className="mr-1" />
                    {formatUnits(product.price, 18)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Available: {formatUnits(product.quantity, 18)}
                  </span>
                  <button
                    onClick={() => openBuyForm(product)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                  >
                    <FiPackage className="mr-2" />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Buy {selectedProduct.name}
              </h3>
              <button 
                onClick={closeBuyForm}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    disabled={loading}
                    min="0"
                    max={Number(formatUnits(selectedProduct.quantity, 18))}
                    step="any"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    <FiPackage />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per unit</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    placeholder="Price in ETH"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    disabled={loading}
                    min="0"
                    step="any"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    <FaEthereum />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-medium">
                    {form.amount && form.price 
                      ? (parseFloat(form.amount) * parseFloat(form.price)).toFixed(6)
                      : '0'} ETH
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={createOrder}
                disabled={loading || !isFormValid()}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white flex justify-center items-center transition ${
                  loading || !isFormValid() 
                    ? "bg-green-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Processing...
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
                disabled={loading}
                className="py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceholderProducts;