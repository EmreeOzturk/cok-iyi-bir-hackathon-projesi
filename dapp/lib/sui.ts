export type { ServiceProfile, AccessNFT, ReputationNFT } from './types';

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
        options?: {
          showEffects?: boolean;
          showEvents?: boolean;
          showBalanceChanges?: boolean;
        };
      }): Promise<{
        digest: string;
        effects?: unknown;
        events?: unknown;
        balanceChanges?: unknown;
      }>;
      signTransactionBlock(input: {
        transactionBlock: Uint8Array;
      }): Promise<{ signature: string; transactionBlockBytes: string }>;
    };
  }
}
