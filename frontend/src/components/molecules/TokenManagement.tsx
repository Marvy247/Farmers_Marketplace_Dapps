'use client';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import UtilityTokenABI from '../../lib/abis/UtilityToken.json';
import { FiDollarSign, FiPlusCircle, FiRefreshCw } from 'react-icons/fi';
import { useContract } from '../../context/ContractContext';

const UTILITY_TOKEN_ADDRESS = '0xA8B0A977098463E58630C50e6A5D218e505932f5';

const TokenManagement: React.FC = () => {
  const { provider, signer, account } = useContract();
  const [balance, setBalance] = useState<string>('0');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);

  const fetchBalance = async () => {
    if (!provider || !account) return;
    
    setLoading(true);
    setError(null);
    try {
      const tokenContract = new ethers.Contract(
        UTILITY_TOKEN_ADDRESS, 
        UtilityTokenABI.abi, 
        provider
      );
      const bal = await tokenContract.balanceOf(account);
      setBalance(ethers.formatUnits(bal, 18));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch token balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account, provider]);

  const mintTokens = async () => {
    if (!signer || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      setError('Please enter a valid amount to mint');
      return;
    }

    setLoading(true);
    setError(null);
    setTxSuccess(false);
    
    try {
      const tokenContract = new ethers.Contract(
        UTILITY_TOKEN_ADDRESS, 
        UtilityTokenABI.abi, 
        signer
      );
      
      const tx = await tokenContract.mint(
        account, 
        ethers.parseUnits(mintAmount, 18)
      );
      
      await tx.wait();
      setTxSuccess(true);
      await fetchBalance();
      setMintAmount('');
    } catch (error) {
      console.error('Minting failed:', error);
      setError(`Minting failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Token Management</h2>
      
      {/* Balance Card */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiDollarSign className="text-blue-500 text-xl" />
            <span className="text-gray-600">Your Balance:</span>
          </div>
          <div className="flex items-center space-x-2">
            {loading ? (
              <FiRefreshCw className="animate-spin text-gray-500" />
            ) : (
              <span className="text-xl font-bold text-gray-800">
                {parseFloat(balance).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mint Form */}
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {txSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
            <p>Tokens minted successfully!</p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Amount to mint"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
          <button
            onClick={mintTokens}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiPlusCircle />
                <span>Mint</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={fetchBalance}
          disabled={loading}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          <span>Refresh Balance</span>
        </button>
      </div>
    </div>
  );
};

export default TokenManagement;