import React, { useState } from 'react';
import { ShoppingCart, PackageSearch } from 'lucide-react';

interface UserTypeSelectorProps {
  onSelect?: (userType: 'seller' | 'buyer') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<'seller' | 'buyer' | null>(null);

  const handleSelect = (type: 'seller' | 'buyer') => {
    setSelected(type);
    if (onSelect) onSelect(type);
  };

  const baseStyle =
    'flex flex-col items-center justify-center p-6 w-64 h-52 border-2 rounded-xl transition-all duration-300 text-gray-700 bg-white hover:bg-gray-50';

  const selectedStyle = {
    seller: 'border-green-600 bg-green-50 shadow-md',
    buyer: 'border-blue-600 bg-blue-50 shadow-md',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-auto p-8 text-center space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tell us how you’ll use TrustFarm
          </h2>
          <p className="text-gray-600 text-sm">
            Choose your primary role to get started. You can always explore both sides later.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {/* Seller Option */}
          <button
            onClick={() => handleSelect('seller')}
            aria-pressed={selected === 'seller'}
            className={`${baseStyle} ${
              selected === 'seller' ? selectedStyle.seller : 'border-gray-200'
            }`}
          >
            <PackageSearch className="w-10 h-10 mb-3 text-green-700" />
            <h3 className="text-lg font-semibold mb-1">I'm a Seller</h3>
            <p className="text-sm text-center">
              List and manage your produce securely, powered by smart contracts.
            </p>
          </button>

          {/* Buyer Option */}
          <button
            onClick={() => handleSelect('buyer')}
            aria-pressed={selected === 'buyer'}
            className={`${baseStyle} ${
              selected === 'buyer' ? selectedStyle.buyer : 'border-gray-200'
            }`}
          >
            <ShoppingCart className="w-10 h-10 mb-3 text-blue-700" />
            <h3 className="text-lg font-semibold mb-1">I'm a Buyer</h3>
            <p className="text-sm text-center">
              Browse, order, and pay with confidence using our escrow system.
            </p>
          </button>
        </div>

        {selected && (
          <div className="pt-4 text-sm text-gray-700">
            You selected: <strong className="capitalize">{selected}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTypeSelector;
