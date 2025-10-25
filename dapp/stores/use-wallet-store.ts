"use client";

import { create } from "zustand";
import { SuiClient } from "@mysten/sui/client";
import { suiClient, formatBalance } from "@/lib/sui";

type WalletState = {
  client: SuiClient;
  connectedAccount: string | null;
  isConnecting: boolean;
  dailyLimit: number;
  balances: Record<string, number>;
  spendGuardId: string | null;

  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setAccount: (account: string | null) => void;
  setDailyLimit: (limit: number) => void;
  setBalances: (balances: Record<string, number>) => void;
  setSpendGuard: (guardId: string) => void;
  refreshBalances: () => Promise<void>;
  createSpendGuard: (maxPerTx: number) => Promise<string | null>;
  updateSpendGuardLimit: (guardId: string, newLimit: number) => Promise<void>;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  client: suiClient,
  connectedAccount: null,
  isConnecting: false,
  dailyLimit: 1_000,
  balances: {},
  spendGuardId: null,

  connectWallet: async () => {
    set({ isConnecting: true });
    try {
      // Check if Sui Wallet is available (standard Sui wallet interface)
      if (typeof window !== 'undefined' && window.suiWallet) {
        const suiWallet = window.suiWallet;

        // Check if wallet is connected
        const { isConnected } = await suiWallet.hasPermissions();
        if (!isConnected) {
          throw new Error('Wallet not connected. Please connect your wallet first.');
        }

        // Get accounts
        const accounts = await suiWallet.requestAccounts();
        const account = accounts[0];

        set({
          connectedAccount: account,
          isConnecting: false
        });

        // Load balances after connection
        await get().refreshBalances();
      } else {
        throw new Error('No Sui wallet detected. Please install Sui Wallet or another Sui-compatible wallet.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      set({ isConnecting: false });
      throw error;
    }
  },

  disconnectWallet: () => {
    set({
      connectedAccount: null,
      balances: {},
      spendGuardId: null
    });
  },

  setAccount: (account) => set({ connectedAccount: account }),
  setDailyLimit: (limit) => set({ dailyLimit: limit }),
  setBalances: (balances) => set({ balances }),
  setSpendGuard: (guardId) => set({ spendGuardId: guardId }),

  refreshBalances: async () => {
    const { connectedAccount, client } = get();
    if (!connectedAccount) return;

    try {
      // Get SUI balance
      const suiBalance = await client.getBalance({
        owner: connectedAccount,
        coinType: '0x2::sui::SUI'
      });

      // Get USDC balance (if available)
      let usdcBalance = { totalBalance: '0' };
      try {
        usdcBalance = await client.getBalance({
          owner: connectedAccount,
          coinType: '0x2::sui::SUI' // Using SUI for now, would be USDC in production
        });
      } catch (error) {
        // USDC might not be available in testnet
        console.log('USDC balance not available');
      }

      const balances = {
        SUI: parseFloat(formatBalance(BigInt(suiBalance.totalBalance))),
        USDC: parseFloat(formatBalance(BigInt(usdcBalance.totalBalance))),
      };

      set({ balances });
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  },

  createSpendGuard: async (maxPerTx: number): Promise<string | null> => {
    const { connectedAccount } = get();
    if (!connectedAccount) return null;

    try {
      // This would create a SpendGuard on-chain
      // For now, return a mock ID
      const mockGuardId = `guard_${Date.now()}`;
      set({ spendGuardId: mockGuardId, dailyLimit: maxPerTx });
      return mockGuardId;
    } catch (error) {
      console.error('Failed to create spend guard:', error);
      return null;
    }
  },

  updateSpendGuardLimit: async (guardId: string, newLimit: number) => {
    // This would update the spend guard on-chain
    // For now, just update local state
    set({ dailyLimit: newLimit });
  },
}));

