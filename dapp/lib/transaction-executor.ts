import { Transaction } from '@mysten/sui';

export interface TransactionResult {
  digest: string;
  effects?: any;
  events?: any;
  balanceChanges?: any;
}

/**
 * Execute a transaction using the connected Sui wallet
 */
export async function executeTransaction(tx: Transaction): Promise<TransactionResult> {
  if (typeof window === 'undefined' || !window.suiWallet) {
    throw new Error('No Sui wallet available');
  }

  try {
    // Build the transaction
    const transactionBytes = await tx.build({ client: window.suiWallet });

    // Sign and execute using wallet
    const result = await window.suiWallet.signAndExecuteTransactionBlock({
      transactionBlock: transactionBytes,
      options: {
        showEffects: true,
        showEvents: true,
        showBalanceChanges: true,
      },
    });

    return {
      digest: result.digest,
      effects: result.effects,
      events: result.events,
      balanceChanges: result.balanceChanges,
    };
  } catch (error) {
    console.error('Transaction execution failed:', error);
    throw error;
  }
}

/**
 * Sign a transaction without executing it
 */
export async function signTransaction(tx: Transaction): Promise<{
  signature: string;
  transactionBytes: string;
}> {
  if (typeof window === 'undefined' || !window.suiWallet) {
    throw new Error('No Sui wallet available');
  }

  try {
    const transactionBytes = await tx.build({ client: window.suiWallet });

    const signed = await window.suiWallet.signTransactionBlock({
      transactionBlock: transactionBytes,
    });

    return {
      signature: signed.signature,
      transactionBytes: signed.transactionBlockBytes,
    };
  } catch (error) {
    console.error('Transaction signing failed:', error);
    throw error;
  }
}
