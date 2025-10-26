/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { AgentCommerceContract } from "@/lib/contracts";
import { useTransactionExecutor } from "@/lib/transaction-executor";
import { CONTRACT_CONFIG } from "@/lib/config";

export function useContractTransactions(registryId: string | null) {
  const client = useSuiClient();
  const { executeTransaction } = useTransactionExecutor();

  const createAgentRegistry = useCallback(async () => {
    console.log("🏗️ Creating agent registry...");
    try {
      console.log("🏭 Creating AgentCommerceContract for registry...");
      const contract = new AgentCommerceContract(client);
      console.log("📄 Building registry creation transaction...");
      const tx = await contract.createAgentRegistry();

      console.log("🚀 Executing registry creation transaction...");
      const result = await executeTransaction(tx);
      console.log("✅ Agent registry created:", result.digest);

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
          console.log(`Attempt ${attempts} failed to get transaction effects, retrying in ${attempts * 1000}ms...`);

          if (attempts >= maxAttempts) {
            throw new Error(`Failed to get transaction effects after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        }
      }

      if (effects && effects.objectChanges) {
        const createdObjects = effects.objectChanges.filter(change =>
          change.type === 'created'
        );

        if (createdObjects.length > 0) {
          return createdObjects[0].objectId;
        }
      }

      throw new Error("Registry object not found in transaction effects");
    } catch (error) {
      console.error("Failed to create agent registry:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      throw error;
    }
  }, [client, executeTransaction]);

  const mintReputationNFT = useCallback(async (agentAddress: string): Promise<string> => {
    console.log("🎨 Minting ReputationNFT for agent:", agentAddress);
    try {
      console.log("🏭 Creating AgentCommerceContract for NFT minting...");
      const contract = new AgentCommerceContract(client);
      console.log("📄 Building NFT minting transaction...");
      const tx = await contract.mintReputationNFT(agentAddress);

      console.log("🚀 Executing NFT minting transaction...");
      const result = await executeTransaction(tx);
      console.log("✅ ReputationNFT minted:", result.digest);

      // Extract the NFT object ID from transaction effects with retry logic
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
          console.log(`Attempt ${attempts} failed to get ReputationNFT transaction effects, retrying in ${attempts * 1000}ms...`);

          if (attempts >= maxAttempts) {
            throw new Error(`Failed to get ReputationNFT transaction effects after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        }
      }

      if (effects && effects.objectChanges) {
        // Find the actual ReputationNFT object, not dynamic fields
        const reputationNftObjects = effects.objectChanges.filter(change =>
          change.type === 'created' &&
          change.objectType?.includes('ReputationNFT')
        );

        if (reputationNftObjects.length > 0) {
          return reputationNftObjects[0].objectId;
        }

        // Fallback: if no ReputationNFT found, take the first created object that is not a dynamic field
        const nonDynamicFieldObjects = effects.objectChanges.filter(change =>
          change.type === 'created' &&
          !change.objectType?.includes('dynamic_field')
        );

        if (nonDynamicFieldObjects.length > 0) {
          return nonDynamicFieldObjects[0].objectId;
        }

        // Last resort: take first created object
        const createdObjects = effects.objectChanges.filter(change =>
          change.type === 'created'
        );

        if (createdObjects.length > 0) {
          return createdObjects[0].objectId;
        }
      }

      throw new Error("ReputationNFT object not found in transaction effects");
    } catch (error) {
      console.error("Failed to mint ReputationNFT:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      throw error;
    }
  }, [client, executeTransaction]);

  const registerAgent = useCallback(async (
    registryIdParam: string,
    reputationNftId: string,
    agentId: string,
    agentName: string,
    owner: string,
    description: string,
    pricing: { model_type: number; amount: number },
    serviceEndpoint: string,
    signerAddress: string
  ) => {
    console.log("🔧 registerAgent function called with:", {
      registryIdParam,
      reputationNftId,
      agentId,
      agentName,
      owner,
      description,
      pricing,
      serviceEndpoint,
      signerAddress
    });

    if (!registryIdParam) {
      console.error("❌ Registry not initialized - registryIdParam is null/undefined");
      throw new Error("Registry not initialized");
    }

    try {
      console.log("🏭 Creating AgentCommerceContract instance...");
      const contract = new AgentCommerceContract(client);

      console.log("📄 Building transaction with contract.registerAgent...");
      const tx = await contract.registerAgent(
        registryIdParam,
        reputationNftId, // Use reputation NFT ID as agent ID
        agentId,
        agentName,
        owner,
        description,
        pricing,
        serviceEndpoint,
        signerAddress
      );

      console.log("🚀 Executing transaction...");
      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("✅ Agent registration transaction completed:", result.digest);

      return result;
    } catch (error) {
      console.error("❌ Failed to register agent:", error);
      console.error("🔍 Detailed error info:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error,
        params: {
          registryIdParam,
          reputationNftId,
          agentId,
          agentName,
          owner,
          description,
          pricing,
          serviceEndpoint,
          signerAddress
        }
      });
      throw error;
    }
  }, [client, executeTransaction]);

  const purchaseService = useCallback(async (
    guardId: string,
    paymentCoinId: string,
    serviceId: string,
    amount: number,
    credits: number
  ): Promise<string | null> => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.payAndIssue(
        guardId,
        paymentCoinId,
        amount,
        serviceId,
        credits
      );

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("Purchase transaction completed:", result.digest);

      // Fetch transaction effects using the digest with retry logic
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
          console.log(`Attempt ${attempts} failed to get purchase transaction effects, retrying in ${attempts * 1000}ms...`);

          if (attempts >= maxAttempts) {
            console.error(`Failed to get purchase transaction effects after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        }
      }

      // Extract NFT ID from object changes
      if (effects && effects.objectChanges) {
        const createdObjects = effects.objectChanges.filter(change =>
          change.type === 'created'
        );

        if (createdObjects.length > 0) {
          // Return the first created object ID (should be the NFT)
          return createdObjects[0].objectId;
        }
      }

      console.warn("No NFT object found in transaction effects");
      return null;
    } catch (error) {
      console.error("Failed to purchase service:", error);
      return null;
    }
  }, [client, executeTransaction]);

  const purchaseServicePTB = useCallback(async (
    guardId: string,
    paymentCoinId: string,
    serviceId: string,
    amount: number,
    credits: number
  ): Promise<string | null> => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.payAndIssuePTB(
        guardId,
        paymentCoinId,
        amount,
        serviceId,
        credits
      );

      // Execute transaction
      const result = await executeTransaction(tx);
      console.log("PTB Purchase transaction completed:", result.digest);

      // Fetch transaction effects using the digest with retry logic
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
          console.log(`Attempt ${attempts} failed to get PTB purchase transaction effects, retrying in ${attempts * 1000}ms...`);

          if (attempts >= maxAttempts) {
            console.error(`Failed to get PTB purchase transaction effects after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        }
      }

      // Extract NFT ID from object changes
      if (effects && effects.objectChanges) {
        const createdObjects = effects.objectChanges.filter(change =>
          change.type === 'created'
        );

        if (createdObjects.length > 0) {
          // Return the first created object ID (should be the NFT)
          return createdObjects[0].objectId;
        }
      }

      console.warn("No NFT object found in PTB transaction effects");
      return null;
    } catch (error) {
      console.error("Failed to purchase service with PTB:", error);
      return null;
    }
  }, [client, executeTransaction]);

  const registerAgentWithNFT = useCallback(async (
    agentId: string,
    agentName: string,
    description: string,
    pricing: { model_type: number; amount: number },
    serviceEndpoint: string,
    signerAddress: string
  ): Promise<{ agentId: string; reputationNftId: string; registryId: string }> => {
    console.log("🚀 STARTING AGENT REGISTRATION PROCESS");
    console.log("📝 Input parameters:", {
      agentId,
      agentName,
      description,
      pricing,
      serviceEndpoint,
      signerAddress
    });

    try {
      // Use the shared registry from environment config
      const currentRegistryId = CONTRACT_CONFIG.REGISTRY_ID;
      console.log("🔍 Using shared registry from config:", currentRegistryId);

      if (!currentRegistryId || currentRegistryId === '0x0') {
        throw new Error("No registry ID configured. Please set NEXT_PUBLIC_REGISTRY_ID in .env");
      }

      // Mint ReputationNFT
      console.log("🎨 Minting ReputationNFT for agent:", signerAddress);
      const reputationNftId = await mintReputationNFT(signerAddress);
      console.log("✅ ReputationNFT minted successfully with ID:", reputationNftId);

      // Register agent with the ReputationNFT
      console.log("📋 Registering agent on-chain with parameters:");
      console.log("   - Registry ID:", currentRegistryId);
      console.log("   - Reputation NFT ID:", reputationNftId);
      console.log("   - Agent Name:", agentName);
      console.log("   - Owner:", signerAddress);
      console.log("   - Description:", description);
      console.log("   - Pricing:", pricing);
      console.log("   - Service Endpoint:", serviceEndpoint);

      await registerAgent(
        currentRegistryId,
        reputationNftId, // Use reputation NFT ID as agent ID
        agentId,
        agentName,
        signerAddress, // owner
        description,
        pricing,
        serviceEndpoint,
        signerAddress
      );

      console.log("🎉 Agent registered successfully!");
      console.log("📊 Final result:", {
        agentId,
        reputationNftId,
        registryId: currentRegistryId,
      });

      return {
        agentId,
        reputationNftId,
        registryId: currentRegistryId,
      };
    } catch (error) {
      console.error("❌ FAILED TO REGISTER AGENT WITH NFT");
      console.error("🔍 Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error,
        inputParams: {
          agentId,
          agentName,
          description,
          pricing,
          serviceEndpoint,
          signerAddress,
          registryId
        }
      });
      throw error;
    }
  }, [registryId, createAgentRegistry, mintReputationNFT, registerAgent]);

  const createSpendGuard = useCallback(async (
    maxPerTx: number,
    recipient: string
  ): Promise<string | null> => {
    try {
      const contract = new AgentCommerceContract(client);
      const tx = await contract.createSpendGuard(maxPerTx, recipient);

      const result = await executeTransaction(tx);
      console.log("SpendGuard created:", result.digest);

      // Extract the spend guard object ID from transaction effects with retry logic
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
          console.log(`Attempt ${attempts} failed to get SpendGuard transaction effects, retrying in ${attempts * 1000}ms...`);

          if (attempts >= maxAttempts) {
            console.error(`Failed to get SpendGuard transaction effects after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        }
      }

      if (effects && effects.objectChanges) {
        const createdObjects = effects.objectChanges.filter(change =>
          change.type === 'created'
        );

        if (createdObjects.length > 0) {
          // Return the first created object ID (should be the spend guard)
          return createdObjects[0].objectId;
        }
      }

      console.warn("No spend guard object found in transaction effects");
      return null;
    } catch (error) {
      console.error("Failed to create spend guard:", error);
      return null;
    }
  }, [client, executeTransaction]);

  return {
    createAgentRegistry,
    mintReputationNFT,
    registerAgent,
    registerAgentWithNFT,
    purchaseService,
    purchaseServicePTB,
    createSpendGuard,
  };
}
