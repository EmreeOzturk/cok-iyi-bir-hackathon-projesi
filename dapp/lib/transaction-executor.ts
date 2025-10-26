"use client";

import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import type { TransactionResult } from './types';

/**
 * Transaction executor hook using dapp-kit
 */
export function useTransactionExecutor() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const executeTransaction = async (tx: Transaction): Promise<TransactionResult> => {
    const result = await signAndExecute({
      transaction: tx,
    });

    return {
      digest: result.digest,
      effects: result.effects,
      events: undefined, // Events need to be fetched separately
      balanceChanges: undefined, // Balance changes need to be fetched separately
    };
  };

  const signTransaction = async (tx: Transaction) => {
    // Note: dapp-kit's useSignAndExecuteTransaction combines signing and execution
    // For separate signing, you would use useSignTransaction
    // This method currently executes the transaction and returns the digest
    const result = await executeTransaction(tx);
    return {
      signature: '', // dapp-kit handles this internally
      transactionBytes: result.digest,
    };
  };

  return {
    executeTransaction,
    signTransaction,
  };
}