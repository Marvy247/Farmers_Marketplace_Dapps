import React from 'react';
import { useContract } from '../../context/ContractContext';
import { FiLogIn, FiUser, FiAlertCircle  } from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';

interface WalletConnectionProps {
  className?: string;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ className }) => {
  const { 
    account, 
    isConnected, 
    isLoading, 
    error, 
    connectWallet, 
    disconnectWallet 
  } = useContract();

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 bg-red-100 text-red-700 p-2 rounded-lg">
        <span className="text-red-500">
          <FiAlertCircle />
        </span>
        <span className="text-sm">Wallet connection error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <>
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
            <FaEthereum color="#3b82f6" />
            <span className="font-medium">{formatAddress(account!)}</span>
          </div>
          <button 
            onClick={disconnectWallet}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button 
          onClick={connectWallet}
          className={className ? className : "flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-4 py-2 transition-colors"}
        >

          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
};

export default WalletConnection;
