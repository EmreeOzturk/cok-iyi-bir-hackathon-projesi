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
