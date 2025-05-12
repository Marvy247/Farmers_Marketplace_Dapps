import React, { useState, useCallback } from 'react';
import FarmerProductCreate from '../FarmerProductCreate';
import {
  BarChart2,
  PlusCircle,
  Eye,
  TrendingUp,
  Star,
  FileDown,
} from 'lucide-react';

interface FarmerDashboardProps {
  onProductCreated: () => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onProductCreated }) => {
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const toggleCreateProduct = () => {
    setShowCreateProduct((prev) => !prev);
  };

  const handleProductCreated = useCallback(() => {
    onProductCreated(); // Notify parent (e.g., Home) to trigger marketplace refresh
    setShowCreateProduct(false); // Optionally hide the form after creation
  }, [onProductCreated]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-8">
        <header className="border-b pb-6">
          <h1 className="text-4xl font-bold text-green-700 mb-2">🌾 Your Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Manage your inventory, monitor your performance, and grow your farm-to-market sales with ease.
          </p>
        </header>

        {/* Dashboard Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-100 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2" /> Sales Overview
            </h3>
            <p className="text-sm text-gray-700">You’ve sold 124 units this month. Keep growing!</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
              <Eye className="w-5 h-5 mr-2" /> Product Views
            </h3>
            <p className="text-sm text-gray-700">Your products have 2,340 views in the last 30 days.</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" /> Add Product
            </h3>
            <button
              onClick={toggleCreateProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded text-sm"
            >
              {showCreateProduct ? 'Hide Form' : 'Create New Product'}
            </button>
          </div>
        </section>

        {/* Product Creation Form */}
        {showCreateProduct && (
          <section className="mt-6 border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Product Details</h2>
            <FarmerProductCreate onProductCreated={handleProductCreated} />
          </section>
        )}

        {/* Upcoming Features Section */}
        <section className="mt-10 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">✨ Upcoming Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-3 text-green-700 font-semibold">
                <TrendingUp className="w-5 h-5 mr-2" />
                Product Sales & Trends
              </div>
              <p className="text-sm text-gray-600">
                Track how each of your products is performing with detailed analytics.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-3 text-yellow-700 font-semibold">
                <Star className="w-5 h-5 mr-2" />
                Buyer Feedback & Reviews
              </div>
              <p className="text-sm text-gray-600">
                See what buyers are saying and build trust with ratings and feedback.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-3 text-blue-700 font-semibold">
                <FileDown className="w-5 h-5 mr-2" />
                Export Reports
              </div>
              <p className="text-sm text-gray-600">
                Export your product and sales reports to CSV or PDF for accounting or sharing.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FarmerDashboard;
