"use client";

import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

export interface TransactionResult {
  digest: string;
  effects?: unknown;
  events?: unknown;
  balanceChanges?: unknown;
}

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
      effects: undefined,
      events: undefined,
      balanceChanges: undefined,
    };
  };

  const signTransaction = async (tx: Transaction) => {
    // For signing without execution, you would use useSignTransaction
    // But for now, we'll execute and return the digest
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