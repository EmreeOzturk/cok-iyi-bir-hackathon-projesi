module agent_commerce::multi_sig {
    use std::vector;

    use sui::event;
    use sui::object::{ID, UID};
    use sui::tx_context;
    use sui::vec_set::{Self, VecSet};

    use agent_commerce::errors;

    /// Multi-signature wallet for enhanced security against prompt injection
    /// as specified in PRD Non-functional Requirements
    public struct MultiSigWallet has key, store {
        id: UID,
        owners: VecSet<address>,
        threshold: u32,
        nonce: u64,
    }

    /// Transaction proposal for multi-sig execution
    public struct Transaction has key, store {
        id: UID,
        wallet_id: ID,
        to: address,
        value: u64,
        data: vector<u8>,
        executed: bool,
        confirmations: VecSet<address>,
    }

    // Events
    public struct MultiSigCreated has copy, drop {
        wallet_id: ID,
        owners: vector<address>,
        threshold: u32,
    }

    public struct TransactionProposed has copy, drop {
        tx_id: ID,
        proposer: address,
        to: address,
        value: u64,
    }

    public struct TransactionConfirmed has copy, drop {
        tx_id: ID,
        confirmer: address,
    }

    public struct TransactionExecuted has copy, drop {
        tx_id: ID,
        executor: address,
    }

    /// Create a new multi-sig wallet
    public fun create_multi_sig(
        owners: vector<address>,
        threshold: u32,
        ctx: &mut tx_context::TxContext
    ): MultiSigWallet {
        assert!(vector::length(&owners) > 0, errors::invalid_input());
        assert!(threshold > 0 && (threshold as u64) <= vector::length(&owners), errors::invalid_input());

        let mut owners_set = vec_set::empty<address>();
        let mut i = 0;
        while (i < vector::length(&owners)) {
            vec_set::insert(&mut owners_set, *vector::borrow(&owners, i));
            i = i + 1;
        };

        let id = object::new(ctx);
        let wallet_id = object::uid_to_inner(&id);

        event::emit(MultiSigCreated {
            wallet_id,
            owners: *&owners,
            threshold,
        });

        MultiSigWallet {
            id,
            owners: owners_set,
            threshold,
            nonce: 0,
        }
    }

    /// Propose a transaction for multi-sig execution
    public fun propose_transaction(
        wallet: &mut MultiSigWallet,
        to: address,
        value: u64,
        data: vector<u8>,
        ctx: &mut tx_context::TxContext
    ): Transaction {
        let sender = tx_context::sender(ctx);
        assert!(vec_set::contains(&wallet.owners, &sender), errors::not_authorized());

        let mut confirmations = vec_set::empty<address>();
        vec_set::insert(&mut confirmations, sender);

        let id = object::new(ctx);
        let tx_id = object::uid_to_inner(&id);
        let wallet_id = object::uid_to_inner(&wallet.id);

        event::emit(TransactionProposed {
            tx_id,
            proposer: sender,
            to,
            value,
        });

        Transaction {
            id,
            wallet_id,
            to,
            value,
            data,
            executed: false,
            confirmations,
        }
    }

    /// Confirm a proposed transaction
    public fun confirm_transaction(
        wallet: &MultiSigWallet,
        tx: &mut Transaction,
        ctx: &mut tx_context::TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(vec_set::contains(&wallet.owners, &sender), errors::not_authorized());
        assert!(!tx.executed, errors::invalid_input());
        assert!(!vec_set::contains(&tx.confirmations, &sender), errors::invalid_input());

        vec_set::insert(&mut tx.confirmations, sender);

        event::emit(TransactionConfirmed {
            tx_id: object::uid_to_inner(&tx.id),
            confirmer: sender,
        });
    }

    /// Check if a transaction has enough confirmations
    public fun is_confirmed(wallet: &MultiSigWallet, tx: &Transaction): bool {
        (vec_set::size(&tx.confirmations) as u32) >= wallet.threshold
    }

    /// Get wallet owners
    public fun owners(wallet: &MultiSigWallet): &VecSet<address> {
        &wallet.owners
    }

    /// Get wallet threshold
    public fun threshold(wallet: &MultiSigWallet): u32 {
        wallet.threshold
    }

    /// Check if address is an owner
    public fun is_owner(wallet: &MultiSigWallet, addr: &address): bool {
        vec_set::contains(&wallet.owners, addr)
    }

    /// Get transaction confirmations count
    public fun confirmations_count(tx: &Transaction): u64 {
        vec_set::size(&tx.confirmations)
    }
}
