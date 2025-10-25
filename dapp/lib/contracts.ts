import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_ADDRESSES } from './config';
import { ServiceProfile, ReputationNFT } from './types';

export class AgentCommerceContract {
  constructor(private client: SuiClient) {}

  // Agent Registry functions
  async registerAgent(
    registryId: string,
    agentId: string,
    agentName: string,
    owner: string,
    description: string,
    pricingModel: { model_type: number; amount: number },
    reputationNftId: string,
    serviceEndpoint: string,
    signerAddress: string
  ) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::agent_registry::register_agent`,
      arguments: [
        tx.object(registryId),
        tx.pure.id(agentId),
        tx.pure.string(agentName),
        tx.pure.address(owner),
        tx.pure.string(description),
        // PricingModel struct fields
        tx.pure.u8(pricingModel.model_type),
        tx.pure.u64(pricingModel.amount),
        tx.object(reputationNftId),
        tx.pure.string(serviceEndpoint),
        tx.pure.address(signerAddress),
      ],
    });

    return tx;
  }

  async lookupAgent(registryId: string): Promise<ServiceProfile | null> {
    // TODO: Implement actual agent lookup from contract
    throw new Error('Agent lookup not implemented yet');
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
      target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::payment::pay_and_issue`,
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
    const clockId = '0x6';

    // PTB: Atomic payment and NFT minting
    // 1. Split payment from user's coin
    const paymentCoin = tx.splitCoins(tx.object(paymentCoinId), [tx.pure.u64(amount)]);

    // 2. Call pay_and_issue_ptb for atomic operation
    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::payment::pay_and_issue_ptb`,
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
  async addPositiveFeedback(
    reputationNftId: string,
    feedbackAuthorityId: string,
    timestamp: number
  ) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::reputation_nft::add_positive`,
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
      target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::reputation_nft::add_negative`,
      arguments: [
        tx.object(reputationNftId),
        tx.object(feedbackAuthorityId),
        tx.pure.u64(timestamp),
      ],
    });

    return tx;
  }

  // Access NFT functions
  async consumeCredit(accessNftId: string, clockId: string, caller: string) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::access_nft::consume_credit`,
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
    // TODO: Implement actual reputation stats query from contract
    throw new Error('Reputation stats query not implemented yet');
  }

  async getAccessNftCredits(accessNftId: string): Promise<number | null> {
    // TODO: Implement actual AccessNFT credits query from contract
    throw new Error('AccessNFT credits query not implemented yet');
  }
}
