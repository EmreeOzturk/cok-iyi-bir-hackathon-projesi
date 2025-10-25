"use client";

import { useState, useCallback } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { CONTRACT_ADDRESSES } from "@/lib/config";
import { useTransactionExecutor } from "@/lib/transaction-executor";

export function useRegistry() {
  const { executeTransaction } = useTransactionExecutor();

  const [registryId, setRegistryId] = useState<string | null>(null);

  const createRegistry = useCallback(async (): Promise<string | null> => {
    try {
      const tx = new Transaction();

      // Create agent registry using moveCall
      tx.moveCall({
        target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::agent_registry::create_and_transfer_registry`,
        arguments: [],
      });

      const result = await executeTransaction(tx);
      console.log("Registry creation completed:", result.digest);

      // The registry ID would be extracted from the transaction effects
      // For now, return a mock ID - in real implementation, parse the effects
      const newRegistryId = "0xnew-registry-id";
      setRegistryId(newRegistryId);

      return newRegistryId;
    } catch (error) {
      console.error("Failed to create registry:", error);
      return null;
    }
  }, [executeTransaction]);

  return {
    registryId,
    setRegistryId,
    createRegistry,
  };
}
