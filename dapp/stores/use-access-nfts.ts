"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import { useTransactionExecutor } from "@/lib/transaction-executor";
import { CONTRACT_CONFIG } from "@/lib/config";
import type { AccessNFT } from "@/lib/types";

type AccessNFTFields = {
  service_id: string;
  kullanici_id: string;
  owner: string;
};

type AccessNFTMetadata = {
  credits_remaining: number;
  expiry: { Some: number } | null;
  tier: number;
};

export function useAccessNFTs() {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const [accessNfts, setAccessNfts] = useState<AccessNFT[]>([]);

  const loadAccessNfts = useCallback(async (owner: string) => {
    try {
      // Query for AccessNFTs owned by the user
      const ownedObjects = await client.getOwnedObjects({
        owner,
        filter: {
          StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::access_nft::AccessNFT`
        },
        options: { showContent: true }
      });

      const accessNfts: AccessNFT[] = [];

      for (const obj of ownedObjects.data) {
        if (obj.data?.content?.dataType === 'moveObject') {
          const fields = obj.data.content.fields as AccessNFTFields;

          // Get metadata from dynamic field
          let metadata: Pick<AccessNFT, 'credits_remaining' | 'expiry' | 'tier'> = { credits_remaining: 0, expiry: undefined, tier: 0 };
          try {
            const metadataField = await client.getDynamicFieldObject({
              parentId: obj.data.objectId,
              name: {
                type: `${obj.data.type?.split('::')[0]}::access_nft::MetadataKey`,
                value: {}
              }
            });

            if (metadataField.data?.content?.dataType === 'moveObject') {
              const metaFields = metadataField.data.content.fields as AccessNFTMetadata;
              metadata = {
                credits_remaining: metaFields.credits_remaining || 0,
                expiry: metaFields.expiry?.Some || undefined,
                tier: metaFields.tier || 0,
              };
            }
          } catch {
            console.warn('Could not load metadata for AccessNFT:', obj.data.objectId);
          }

          accessNfts.push({
            id: obj.data.objectId,
            service_id: fields.service_id,
            kullanici_id: fields.kullanici_id,
            owner: fields.owner,
            credits_remaining: metadata.credits_remaining,
            expiry: metadata.expiry,
            tier: metadata.tier,
          });
        }
      }

      setAccessNfts(accessNfts);
    } catch (error) {
      console.error("Failed to load AccessNFTs:", error);
      setAccessNfts([]);
    }
  }, [client]);

  const consumeCredit = useCallback(async (accessNftId: string, clockId: string, caller: string) => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.consumeCredit(accessNftId, clockId, caller);

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Consume credit transaction completed:", result.digest);

      // Refresh AccessNFTs after consumption
      await loadAccessNfts(caller);
    } catch (error) {
      console.error("Failed to consume credit:", error);
      throw error;
    }
  }, [client, executeTransaction, loadAccessNfts]);

  return {
    accessNfts,
    loadAccessNfts,
    consumeCredit,
  };
}
