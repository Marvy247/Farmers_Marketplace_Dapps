import React, { useEffect } from 'react';
import Marketplace from '../molecules/Marketplace';
import BuyerOrders from '../molecules/BuyerOrders';
import { ShoppingBag, ClipboardList, Star } from 'lucide-react';

interface BuyerDashboardProps {
  refreshMarketplace: boolean;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ refreshMarketplace }) => {
  useEffect(() => {
    // Triggered whenever refreshMarketplace toggles
    console.log("Marketplace refresh triggered.");
    // Here, you might want to refetch marketplace data, for example:
    // fetchMarketplaceData();
  }, [refreshMarketplace]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Buyer Dashboard</h1>
        <p className="mb-6 text-gray-600">Welcome back! Explore products and track your activity.</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm flex items-center gap-4">
            <ShoppingBag className="w-10 h-10 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-blue-800">152</h3>
              <p className="text-sm text-blue-700">Total Products</p>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow-sm flex items-center gap-4">
            <ClipboardList className="w-10 h-10 text-green-600" />
            <div>
              <h3 className="text-xl font-semibold text-green-800">7</h3>
              <p className="text-sm text-green-700">Pending Orders</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm flex items-center gap-4">
            <Star className="w-10 h-10 text-yellow-600" />
            <div>
              <h3 className="text-xl font-semibold text-yellow-800">4.8</h3>
              <p className="text-sm text-yellow-700">Seller Ratings</p>
            </div>
          </div>
        </div>

        {/* Marketplace */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Browse Marketplace</h2>
          <Marketplace refreshTrigger={refreshMarketplace} />
        </div>

        {/* Orders Section */}
        <BuyerOrders />
      </div>
    </div>
  );
};

export default BuyerDashboard;
