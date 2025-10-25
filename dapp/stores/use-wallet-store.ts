"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState, useCallback } from "react";
import { formatBalance } from "@/lib/sui";
import { CONTRACT_CONFIG } from "@/lib/config";

export function useWalletStore() {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();

  const [dailyLimit, setDailyLimit] = useState(1000);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [spendGuardId, setSpendGuardId] = useState<string | null>(null);

  // Refresh balances when account changes
  const refreshBalances = useCallback(async () => {
    if (!currentAccount?.address) return;

    try {
      // Get SUI balance
      const suiBalance = await client.getBalance({
        owner: currentAccount.address,
        coinType: CONTRACT_CONFIG.SUI_COIN_TYPE,
      });

      // Get USDC balance (if available)
      let usdcBalance = { totalBalance: "0" };
      try {
        usdcBalance = await client.getBalance({
          owner: currentAccount.address,
          coinType: CONTRACT_CONFIG.USDC_COIN_TYPE,
        });
      } catch {
        // USDC might not be available in testnet
        console.log("USDC balance not available");
      }

      const newBalances = {
        SUI: parseFloat(formatBalance(BigInt(suiBalance.totalBalance))),
        USDC: parseFloat(formatBalance(BigInt(usdcBalance.totalBalance))),
      };

      setBalances(newBalances);
    } catch (error) {
      console.error("Failed to refresh balances:", error);
    }
  }, [currentAccount, client]);

  // Auto-refresh balances when account changes
  useEffect(() => {
    const updateBalances = async () => {
      if (currentAccount?.address) {
        await refreshBalances();
      } else {
        setBalances({});
        setSpendGuardId(null);
      }
    };

    updateBalances();
  }, [currentAccount?.address, refreshBalances]);

  const createSpendGuard = useCallback(async (maxPerTx: number): Promise<string | null> => {
    if (!currentAccount?.address) return null;

    try {
      // This would create a SpendGuard on-chain
      // For now, return a mock ID
      const mockGuardId = `guard_${Date.now()}`;
      setSpendGuardId(mockGuardId);
      setDailyLimit(maxPerTx);
      return mockGuardId;
    } catch (error) {
      console.error("Failed to create spend guard:", error);
      return null;
    }
  }, [currentAccount?.address]);

  const updateSpendGuardLimit = useCallback(async (guardId: string, newLimit: number) => {
    // This would update the spend guard on-chain
    // For now, just update local state
    setDailyLimit(newLimit);
  }, []);

  return {
    // Wallet state from dapp-kit
    connectedAccount: currentAccount?.address || null,
    isConnecting: false, // dapp-kit doesn't provide connecting state directly

    // Custom state
    dailyLimit,
    balances,
    spendGuardId,

    // Actions - wallet connection is handled by dapp-kit components
    connectWallet: () => {
      // Wallet connection is handled by WalletProvider and wallet selector components
      console.log("Use wallet selector component for connection");
    },
    disconnectWallet: () => {
      // Wallet disconnection is handled by dapp-kit
      console.log("Use wallet selector component for disconnection");
    },
    setDailyLimit,
    setBalances,
    setSpendGuard: setSpendGuardId,
    refreshBalances,
    createSpendGuard,
    updateSpendGuardLimit,
  };
}

