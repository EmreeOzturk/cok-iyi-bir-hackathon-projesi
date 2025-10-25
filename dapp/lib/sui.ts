import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';
import { CONTRACT_CONFIG } from './config';

// Network configuration
export const networkConfig = createNetworkConfig({
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

// Sui client based on configured network
export const suiClient = new SuiClient({
  url: networkConfig[CONTRACT_CONFIG.NETWORK as keyof typeof networkConfig]?.url || networkConfig.testnet.url,
});

// Contract addresses from config
export const CONTRACT_ADDRESSES = {
  AGENT_COMMERCE_PACKAGE: CONTRACT_CONFIG.PACKAGE_ID,
  AGENT_REGISTRY: CONTRACT_CONFIG.REGISTRY_ID,
} as const;

// Common types for contract interactions
export type ServiceProfile = {
  owner: string;
  description: string;
  pricing: {
    model_type: number;
    amount: number;
  };
  reputation: string;
  service_endpoint: string;
};

export type AccessNFT = {
  id: string;
  service_id: string;
  owner: string;
  credits_remaining: number;
  expiry?: number;
  tier: number;
};

export type ReputationNFT = {
  id: string;
  agent: string;
  total_interactions: number;
  positive: number;
  negative: number;
  last_feedback?: number;
};

// Helper functions
export const formatAddress = (address: string, length: number = 6): string => {
  if (address.length <= length * 2 + 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const formatBalance = (balance: number | bigint, decimals: number = 9): string => {
  const num = typeof balance === 'bigint' ? Number(balance) : balance;
  return (num / Math.pow(10, decimals)).toFixed(4);
};

// Type declarations for Sui Wallet interface
declare global {
  interface Window {
    suiWallet?: {
      hasPermissions(): Promise<{ isConnected: boolean }>;
      requestAccounts(): Promise<string[]>;
      signAndExecuteTransactionBlock(input: {
        transactionBlock: Uint8Array;
        options?: any;
      }): Promise<any>;
      signTransactionBlock(input: {
        transactionBlock: Uint8Array;
      }): Promise<{ signature: string; transactionBlockBytes: string }>;
    };
  }
}
