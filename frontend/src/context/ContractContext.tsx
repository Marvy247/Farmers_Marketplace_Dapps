'use client';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';

// Strongly typed window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

interface ContractContextProps {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const ContractContext = createContext<ContractContextProps | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!account;

  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        if (provider) {
          const signer = await provider.getSigner();
          setSigner(signer);
        }
      } else {
        setAccount(null);
        setSigner(null);
      }
    },
    [provider]
  );

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const ethProvider = new BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      // Request permissions
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const signer = await ethProvider.getSigner();
        setSigner(signer);
      }

      // Listen for account or network changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());

    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [handleAccountsChanged]);

  const disconnectWallet = useCallback(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', () => window.location.reload());
    }
    setAccount(null);
    setSigner(null);
    setProvider(null);
  }, [handleAccountsChanged]);

  // Auto-connect on mount (optional)
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const ethProvider = new BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setProvider(ethProvider);
          setAccount(accounts[0]);
          const signer = await ethProvider.getSigner();
          setSigner(signer);
        }
      }
    };
    autoConnect();
  }, []);

  return (
    <ContractContext.Provider
      value={{
        provider,
        signer,
        account,
        isConnected,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = (): ContractContextProps => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
