import { SuiClient, Transaction } from '@mysten/sui';
import { CONTRACT_ADDRESSES, ServiceProfile, AccessNFT, ReputationNFT } from './sui';

export class AgentCommerceContract {
  constructor(private client: SuiClient) {}

  // Agent Registry functions
  async registerAgent(
    registryId: string,
    agentId: string,
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
        tx.pure(agentId),
        tx.pure(owner),
        tx.pure(description),
        tx.pure(pricingModel),
        tx.object(reputationNftId),
        tx.pure(serviceEndpoint),
        tx.pure(signerAddress),
      ],
    });

    return tx;
  }

  async lookupAgent(registryId: string, agentId: string): Promise<ServiceProfile | null> {
    try {
      const result = await this.client.call('sui_getObject', [
        registryId,
        {
          showContent: true,
          showType: true,
        },
      ]);

      // Parse the dynamic field data
      // This is a simplified version - in practice you'd need to parse the actual Sui object structure
      return null; // Placeholder
    } catch (error) {
      console.error('Failed to lookup agent:', error);
      return null;
    }
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

    const expiryOption = expiry ? { Some: expiry } : { None: null };

    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.AGENT_COMMERCE_PACKAGE}::payment::pay_and_issue`,
      arguments: [
        tx.object(guardId),
        tx.object(paymentCoinId),
        tx.pure(amount),
        tx.pure(serviceId),
        tx.pure(credits),
        tx.pure(expiryOption),
        tx.pure(tier),
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
        tx.pure(timestamp),
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
        tx.pure(timestamp),
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
        tx.pure(caller),
      ],
    });

    return tx;
  }

  // Query functions for reading data
  async getReputationStats(reputationNftId: string): Promise<ReputationNFT | null> {
    try {
      const object = await this.client.getObject({
        id: reputationNftId,
        options: {
          showContent: true,
        },
      });

      if (object.data?.content?.dataType === 'moveObject') {
        // Parse the reputation NFT data
        // This would need proper parsing of the Sui object structure
        return null; // Placeholder
      }
      return null;
    } catch (error) {
      console.error('Failed to get reputation stats:', error);
      return null;
    }
  }

  async getAccessNftCredits(accessNftId: string): Promise<number | null> {
    try {
      const object = await this.client.getObject({
        id: accessNftId,
        options: {
          showContent: true,
        },
      });

      if (object.data?.content?.dataType === 'moveObject') {
        // Parse the AccessNFT dynamic field for credits_remaining
        // This would need proper parsing of dynamic fields
        return null; // Placeholder
      }
      return null;
    } catch (error) {
      console.error('Failed to get AccessNFT credits:', error);
      return null;
    }
  }
}
