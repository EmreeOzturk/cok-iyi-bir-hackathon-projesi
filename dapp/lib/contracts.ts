import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from './config';
import { ReputationNFT } from './types';

export class AgentCommerceContract {
  constructor(private client: SuiClient) {}

  // Registry management
  async createAgentRegistry() {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::agent_registry::create_and_share_registry`,
    });

    return tx;
  }

  // Agent Registry functions
  async registerAgent(
    registryId: string,
    reputationNftId: string,
    agentId: string,
    agentName: string,
    owner: string,
    description: string,
    pricingModel: { model_type: number; amount: number },
    serviceEndpoint: string,
    signerAddress: string
  ) {
    // Validate required parameters
    if (!registryId || registryId.trim().length === 0) {
      throw new Error('Registry ID cannot be empty');
    }
    if (!reputationNftId || reputationNftId.trim().length === 0) {
      throw new Error('Reputation NFT ID cannot be empty');
    }
    if (!owner || owner.trim().length === 0) {
      throw new Error('Owner address cannot be empty');
    }
    if (!agentId || agentId.trim().length === 0) {
      throw new Error('Agent ID cannot be empty');
    }
    if (!agentName || agentName.trim().length === 0) {
      throw new Error('Agent name cannot be empty');
    }
    if (!description || description.trim().length === 0) {
      throw new Error('Description cannot be empty');
    }
    if (!serviceEndpoint || serviceEndpoint.trim().length === 0) {
      throw new Error('Service endpoint cannot be empty');
    }

    console.log('🔧 Contract registerAgent called with:', {
      registryId,
      reputationNftId,
      agentId,
      agentName,
      owner,
      description,
      pricingModel,
      serviceEndpoint,
      signerAddress,
      packageId: CONTRACT_CONFIG.PACKAGE_ID,
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::agent_registry::register_agent`,
    });

    const tx = new Transaction();

    try {
      console.log('🏗️ Building moveCall transaction...');

      // Debug: Log parameter lengths before serialization
      console.log('🔍 Parameter validation:', {
        agentId: { value: agentId, length: agentId?.length || 0 },
        agentName: { value: agentName, length: agentName?.length || 0 },
        description: { value: description, length: description?.length || 0 },
        serviceEndpoint: { value: serviceEndpoint, length: serviceEndpoint?.length || 0 },
      });
      console.log('🔍 Parameter values:', {
        agentId,
        agentName,
        description,
        serviceEndpoint,
      });

      // Use sharedObjectRef for the shared registry object
      console.log('🔍 Using sharedObjectRef for registry access');

      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::agent_registry::register_agent`,
        arguments: [
          tx.sharedObjectRef({ objectId: registryId, mutable: true, initialSharedVersion: 349180468 }),
          tx.pure.vector('u8', Array.from(Buffer.from(agentId, 'utf8'))),
          tx.pure.vector('u8', Array.from(Buffer.from(agentName, 'utf8'))),
          tx.pure.address(owner),
          tx.pure.vector('u8', Array.from(Buffer.from(description, 'utf8'))),
          tx.pure.u8(pricingModel.model_type),
          tx.pure.u64(BigInt(pricingModel.amount)),
          tx.object(reputationNftId),
          tx.pure.vector('u8', Array.from(Buffer.from(serviceEndpoint, 'utf8'))),
        ],
      });
      console.log('✅ Transaction built successfully');
    } catch (buildError) {
      console.error('❌ Failed to build transaction:', buildError);
      throw buildError;
    }

    return tx;
  }
  // Payment functions
  async payAndIssue(
    guardId: string,
    paymentCoinId: string,
    amount: number,
    serviceId: string,
    credits: number,
    expiry?: number,
    tier: number = 0
  ) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::payment::pay_and_issue`,
      arguments: [
        tx.object(guardId),
        tx.object(paymentCoinId),
        tx.pure.u64(amount),
        tx.pure.string(serviceId),
        tx.pure.u64(credits),
        tx.pure.option('u64', expiry),
        tx.pure.u8(tier),
      ],
    });

    return tx;
  }

  // PTB-based atomic payment and access flow
  async payAndIssuePTB(
    guardId: string,
    paymentCoinId: string,
    amount: number,
    serviceId: string,
    credits: number,
    expiry?: number,
    tier: number = 0
  ) {
    const tx = new Transaction();

    // Get the clock object (required for expiry checks)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _clockId = '0x6';

    // PTB: Atomic payment and NFT minting
    // 1. Split payment from user's coin
    const paymentCoin = tx.splitCoins(tx.object(paymentCoinId), [tx.pure.u64(amount)]);

    // 2. Call pay_and_issue_ptb for atomic operation
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::payment::pay_and_issue_ptb`,
      arguments: [
        tx.object(guardId),
        paymentCoin, // Pass the split coin directly
        tx.pure.u64(amount),
        tx.pure.string(serviceId),
        tx.pure.u64(credits),
        tx.pure.option('u64', expiry),
        tx.pure.u8(tier),
      ],
    });

    return tx;
  }

  // Reputation functions
  async mintReputationNFT(agentAddress: string) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::reputation_nft::init_reputation`,
      arguments: [
        tx.pure.address(agentAddress),
      ],
    });

    return tx;
  }

  async addPositiveFeedback(
    reputationNftId: string,
    feedbackAuthorityId: string,
    timestamp: number
  ) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::reputation_nft::add_positive`,
      arguments: [
        tx.object(reputationNftId),
        tx.object(feedbackAuthorityId),
        tx.pure.u64(timestamp),
      ],
    });

    return tx;
  }

  async addNegativeFeedback(
    reputationNftId: string,
    feedbackAuthorityId: string,
    timestamp: number
  ) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::reputation_nft::add_negative`,
      arguments: [
        tx.object(reputationNftId),
        tx.object(feedbackAuthorityId),
        tx.pure.u64(timestamp),
      ],
    });

    return tx;
  }

  // Spend Guard functions
  async createSpendGuard(maxPerTx: number, recipient: string) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::payment::create_spend_guard`,
      arguments: [
        tx.pure.u64(maxPerTx),
        tx.pure.address(recipient),
      ],
    });

    return tx;
  }

  // Access NFT functions
  async consumeCredit(accessNftId: string, clockId: string, caller: string) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::access_nft::consume_credit`,
      arguments: [
        tx.object(accessNftId),
        tx.object(clockId),
        tx.pure.address(caller),
      ],
    });

    return tx;
  }

  // Query functions for reading data
  async getReputationStats(reputationNftId: string): Promise<ReputationNFT | null> {
    try {
      // Get the ReputationNFT object
      const object = await this.client.getObject({
        id: reputationNftId,
        options: { showContent: true, showType: true },
      });

      if (!object.data?.content ||
          !('dataType' in object.data.content) ||
          object.data.content.dataType !== 'moveObject' ||
          !('fields' in object.data.content)) {
        return null;
      }

      const fields = object.data.content.fields as { agent: string };
      if (!fields || typeof fields.agent !== 'string') {
        return null;
      }

      // Get metrics from dynamic field
      const metricsObj = await this.client.getDynamicFieldObject({
        parentId: reputationNftId,
        name: {
          type: `${CONTRACT_CONFIG.PACKAGE_ID}::reputation_nft::Metrics`,
          value: {}
        }
      });

      if (!metricsObj.data?.content ||
          !('dataType' in metricsObj.data.content) ||
          metricsObj.data.content.dataType !== 'moveObject' ||
          !('fields' in metricsObj.data.content)) {
        return null;
      }

      const metricsFields = metricsObj.data.content.fields as {
        total_interactions: string | number;
        basarili_islem: string | number;
        positive: string | number;
        negative: string | number;
        last_feedback: { Some?: string | number } | null;
      };
      if (!metricsFields) {
        return null;
      }

      return {
        id: reputationNftId,
        agent: fields.agent,
        total_interactions: Number(metricsFields.total_interactions || 0),
        basarili_islem: Number(metricsFields.basarili_islem || 0),
        positive: Number(metricsFields.positive || 0),
        negative: Number(metricsFields.negative || 0),
        last_feedback: metricsFields.last_feedback?.Some ? Number(metricsFields.last_feedback.Some) : undefined,
      };
    } catch (error) {
      console.error('Reputation stats query error:', error);
      return null;
    }
  }


}
