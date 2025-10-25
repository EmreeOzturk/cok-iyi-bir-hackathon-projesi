module agent_commerce::payment {
    use sui::coin::Coin;
    use sui::object;
    use sui::transfer;
    use sui::tx_context;
    use sui::event;

    use agent_commerce::access_nft::{Self, AccessNFT};
    use agent_commerce::errors;

    public struct SpendGuard has key, store {
        id: object::UID,
        max_per_tx: u64,
        recipient: address,
    }

    // Events for transparency
    public struct PayAndIssueEvent has copy, drop {
        buyer: address,
        seller: address,
        amount: u64,
        service_id: vector<u8>,
        credits: u64,
        tier: u8,
    }

    public struct SpendLimitExceededEvent has copy, drop {
        user: address,
        attempted_amount: u64,
        limit: u64,
    }

    public fun max_per_tx(guard: &SpendGuard): u64 {
        guard.max_per_tx
    }

    public fun recipient(guard: &SpendGuard): address {
        guard.recipient
    }


    public fun init_spend_guard(
        max_per_tx: u64,
        recipient: address,
        ctx: &mut TxContext,
    ): SpendGuard {
        SpendGuard {
            id: object::new(ctx),
            max_per_tx,
            recipient,
        }
    }

    public fun pay_and_issue<CoinType>(
        guard: &SpendGuard,
        mut funds: Coin<CoinType>,
        amount: u64,
        service_id: vector<u8>,
        credits: u64,
        expiry: Option<u64>,
        tier: u8,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);

        // Check spend limit
        if (amount > guard.max_per_tx) {
            event::emit(SpendLimitExceededEvent {
                user: sender,
                attempted_amount: amount,
                limit: guard.max_per_tx,
            });
            assert!(false, errors::not_authorized());
        };

        assert!(sui::coin::value(&funds) >= amount, errors::no_credits());

        let payment = sui::coin::split(&mut funds, amount, ctx);
        transfer::public_transfer(payment, guard.recipient);
        transfer::public_transfer(funds, sender);

        let nft = access_nft::mint_access(
            sender,
            *&service_id,
            credits,
            expiry,
            tier,
            ctx,
        );

        event::emit(PayAndIssueEvent {
            buyer: sender,
            seller: guard.recipient,
            amount,
            service_id: *&service_id,
            credits,
            tier,
        });

        transfer::public_transfer(nft, sender);
    }

    /// PTB-based atomic payment and access flow as specified in PRD Epic 1.2
    /// This implements the programmable transaction block for atomic operations
    public fun pay_and_issue_ptb<CoinType>(
        guard: &SpendGuard,
        payment_coin: &mut Coin<CoinType>,
        amount: u64,
        service_id: vector<u8>,
        credits: u64,
        expiry: Option<u64>,
        tier: u8,
        ctx: &mut TxContext,
    ): AccessNFT {
        let sender = tx_context::sender(ctx);

        // Check spend limit
        if (amount > guard.max_per_tx) {
            event::emit(SpendLimitExceededEvent {
                user: sender,
                attempted_amount: amount,
                limit: guard.max_per_tx,
            });
            assert!(false, errors::not_authorized());
        };

        assert!(sui::coin::value(payment_coin) >= amount, errors::no_credits());

        // Split payment atomically within PTB context
        let payment = sui::coin::split(payment_coin, amount, ctx);
        transfer::public_transfer(payment, guard.recipient);

        // Mint AccessNFT atomically as part of the same transaction
        let nft = access_nft::mint_access(
            sender,
            *&service_id,
            credits,
            expiry,
            tier,
            ctx,
        );

        event::emit(PayAndIssueEvent {
            buyer: sender,
            seller: guard.recipient,
            amount,
            service_id: *&service_id,
            credits,
            tier,
        });

        nft
    }

    /// Helper function to prepare PTB commands for atomic execution
    /// This can be used by clients to construct PTBs
    public fun prepare_ptb_commands<CoinType>(
        guard_id: object::ID,
        coin_id: object::ID,
        amount: u64,
        service_id: vector<u8>,
        credits: u64,
        expiry: Option<u64>,
        tier: u8,
    ): (vector<u8>, vector<u8>) {
        // Return the function name and arguments for PTB construction
        // This helps clients build PTBs programmatically
        let function_name = b"pay_and_issue_ptb";
        let args = vector::empty<u8>();

        // In a real PTB, these would be object IDs and arguments
        // This is a simplified version for demonstration

        (function_name, args)
    }
}

