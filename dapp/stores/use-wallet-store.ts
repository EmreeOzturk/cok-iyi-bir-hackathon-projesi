"use client";

import { create } from "zustand";

type WalletState = {
  connectedAccount: string | null;
  dailyLimit: number;
  balances: Record<string, number>;
  setAccount: (account: string | null) => void;
  setDailyLimit: (limit: number) => void;
  setBalances: (balances: Record<string, number>) => void;
  refreshBalances: () => void;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  connectedAccount: null,
  dailyLimit: 1_000,
  balances: {},
  setAccount: (account) => set({ connectedAccount: account }),
  setDailyLimit: (limit) => set({ dailyLimit: limit }),
  setBalances: (balances) => set({ balances }),
  refreshBalances: () => {
    const { connectedAccount } = get();
    if (!connectedAccount) {
      return;
    }
    // TODO: integrate Sui RPC query
  },
}));

