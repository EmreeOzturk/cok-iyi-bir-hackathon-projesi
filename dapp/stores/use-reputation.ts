"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import { useTransactionExecutor } from "@/lib/transaction-executor";
import { CONTRACT_CONFIG } from "@/lib/config";
import type { ReputationNFT } from "@/lib/types";

type ReputationNFTFields = {
  agent: string;
};

type ReputationNFTMetrics = {
  total_interactions: number;
  basarili_islem: number;
  positive: number;
  negative: number;
  last_feedback: { Some: number } | null;
};

export function useReputation() {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const [reputationNft, setReputationNft] = useState<ReputationNFT | null>(null);

  const loadReputationNft = useCallback(async (agentAddress: string) => {
    try {
      // Query for ReputationNFT owned by the agent
      const ownedObjects = await client.getOwnedObjects({
        owner: agentAddress,
        filter: {
          StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::reputation_nft::ReputationNFT`
        },
        options: { showContent: true }
      });

      if (ownedObjects.data.length > 0) {
        const obj = ownedObjects.data[0];
        if (obj.data?.content?.dataType === 'moveObject') {
          const fields = obj.data.content.fields as ReputationNFTFields;

          // Get metrics from dynamic field
          let metricsFields: ReputationNFTMetrics = {
            total_interactions: 0,
            basarili_islem: 0,
            positive: 0,
            negative: 0,
            last_feedback: null
          };

          try {
            const metrics = await client.getDynamicFieldObject({
              parentId: obj.data.objectId,
              name: {
                type: `${obj.data.type?.split('::')[0]}::reputation_nft::Metrics`,
                value: {}
              }
            });

            if (metrics.data?.content?.dataType === 'moveObject') {
              metricsFields = metrics.data.content.fields as ReputationNFTMetrics;
            }
          } catch {
            console.warn('Could not load metrics for ReputationNFT:', obj.data.objectId);
          }

          const reputationNft: ReputationNFT = {
            id: obj.data.objectId,
            agent: fields.agent,
            total_interactions: metricsFields.total_interactions || 0,
            basarili_islem: metricsFields.basarili_islem || 0,
            positive: metricsFields.positive || 0,
            negative: metricsFields.negative || 0,
            last_feedback: metricsFields.last_feedback?.Some,
          };

          setReputationNft(reputationNft);
        } else {
          setReputationNft(null);
        }
      } else {
        setReputationNft(null);
      }
    } catch (error) {
      console.error("Failed to load reputation NFT:", error);
      setReputationNft(null);
    }
  }, [client]);

  const provideFeedback = useCallback(async (
    reputationNftId: string,
    feedbackAuthorityId: string,
    isPositive: boolean
  ) => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = isPositive
        ? await contract.addPositiveFeedback(reputationNftId, feedbackAuthorityId, Date.now())
        : await contract.addNegativeFeedback(reputationNftId, feedbackAuthorityId, Date.now());

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Feedback transaction completed:", result.digest);

      // Refresh reputation data
      if (reputationNft) {
        await loadReputationNft(reputationNft.agent);
      }
    } catch (error) {
      console.error("Failed to provide feedback:", error);
      throw error;
    }
  }, [client, executeTransaction, reputationNft, loadReputationNft]);

  return {
    reputationNft,
    loadReputationNft,
    provideFeedback,
  };
}
