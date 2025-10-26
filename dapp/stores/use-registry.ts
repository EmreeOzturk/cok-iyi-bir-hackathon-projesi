"use client";

import { useState, useCallback } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { CONTRACT_CONFIG } from "@/lib/config";
import { useTransactionExecutor } from "@/lib/transaction-executor";

export function useRegistry() {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const [registryId, setRegistryId] = useState<string | null>(null);

  const createRegistry = useCallback(async (): Promise<string | null> => {
    try {
      const tx = new Transaction();

      // Create agent registry using moveCall
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::agent_registry::create_and_transfer_registry`,
        arguments: [],
      });

      const result = await executeTransaction(tx);
      console.log("Registry creation completed:", result.digest);

      // Extract the registry object ID from transaction effects with retry logic
      let effects;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        try {
          effects = await client.getTransactionBlock({
            digest: result.digest,
            options: { showEffects: true, showObjectChanges: true }
          });
          break; // Success, exit retry loop
        } catch (error) {
          attempts++;
          console.log(`Attempt ${attempts} failed to get registry transaction effects, retrying in ${attempts * 1000}ms...`);

          if (attempts >= maxAttempts) {
            console.error(`Failed to get registry transaction effects after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        }
      }

      // Extract registry ID from object changes
      if (effects && effects.objectChanges) {
        const createdObjects = effects.objectChanges.filter(change =>
          change.type === 'created'
        );

        if (createdObjects.length > 0) {
          // The registry object should be the first created object
          const newRegistryId = createdObjects[0].objectId;

          setRegistryId(newRegistryId);
          return newRegistryId;
        }
      }

      console.warn("No registry object found in transaction effects");
      return null;
    } catch (error) {
      console.error("Failed to create registry:", error);
      return null;
    }
  }, [client, executeTransaction]);

  return {
    registryId,
    setRegistryId,
    createRegistry,
  };
}
