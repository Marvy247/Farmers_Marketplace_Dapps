"use client";
import React, { useEffect, useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import EscrowABI from '../../../lib/abis/Escrow.json';
import { FiSearch, FiAlertCircle, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import { useContract } from '../../context/ContractContext';

const ESCROW_ADDRESS = '0xfCFc3A73044B5431388b184Dd745fFeaD9Ee9B5A';

interface EscrowDetails {
  orderId: string;
  buyer: string;
  seller: string;
  amount: BigInt;
  isReleased: boolean;
  isRefunded: boolean;
  createdAt: number;
}

const Escrow: React.FC = () => {
  const { provider, signer, account } = useContract();
  const [escrowDetails, setEscrowDetails] = useState<EscrowDetails | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [disputeStatus, setDisputeStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEscrowDetails = async () => {
    if (!provider || !orderId) {
      setError('Please connect wallet and enter an order ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const contract = new Contract(ESCROW_ADDRESS, EscrowABI.abi, provider);
      const details = await contract.getEscrowDetails(orderId);
      const isDisputed = await contract.isDisputed(orderId);
      
      const formattedDetails: EscrowDetails = {
        orderId: details.orderId.toString(),
        buyer: details.buyer,
        seller: details.seller,
        amount: details.amount,
        isReleased: details.isReleased,
        isRefunded: details.isRefunded,
        createdAt: Number(details.createdAt)
      };
      
      setEscrowDetails(formattedDetails);
      setDisputeStatus(isDisputed ? 'Disputed' : 'No Dispute');
    } catch (error) {
      console.error('Error fetching escrow:', error);
      setError(`Failed to fetch escrow: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchEscrowDetails();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Escrow Details</h2>
        
        {/* Search Form */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={fetchEscrowDetails}
            disabled={loading}
            className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Escrow Details */}
        {escrowDetails && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Order #{escrowDetails.orderId}</h3>
              <span className={`px-3 py-1 text-sm rounded-full ${
                disputeStatus === 'Disputed' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {disputeStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Buyer:</span>
                  <span className="font-medium">{formatAddress(escrowDetails.buyer)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Seller:</span>
                  <span className="font-medium">{formatAddress(escrowDetails.seller)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Amount:</span>
                  <span className="font-medium">
                    {ethers.formatUnits(escrowDetails.amount.toString(), 18)} ETH
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Created:</span>
                  <span className="font-medium">{formatDate(escrowDetails.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-2">
              <div className="flex items-center">
                {escrowDetails.isReleased ? (
                  <FiCheck className="text-green-500 mr-1" />
                ) : (
                  <FiX className="text-red-500 mr-1" />
                )}
                <span>Released</span>
              </div>
              <div className="flex items-center">
                {escrowDetails.isRefunded ? (
                  <FiCheck className="text-green-500 mr-1" />
                ) : (
                  <FiX className="text-red-500 mr-1" />
                )}
                <span>Refunded</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Escrow;