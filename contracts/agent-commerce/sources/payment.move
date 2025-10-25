module agent_commerce::payment {
    use sui::coin::Coin;
    use sui::event;
    use sui::transfer;
    use sui::tx_context::TxContext;

    use agent_commerce::access_nft;
    use agent_commerce::errors;

    public struct SpendGuard has key, store {
        id: UID,
        max_per_tx: u64,
        recipient: address,
    }

    public struct PayAndIssueEvent has copy, drop, store {
        buyer: address,
        seller: address,
        amount: u64,
        service_id: vector<u8>,
    }

    public fun init_spend_guard(
        max_per_tx: u64,
        recipient: address,
        ctx: &mut TxContext,
    ): SpendGuard {
        SpendGuard {
            id: sui::object::new(ctx),
            max_per_tx,
            recipient,
        }
    }

    public fun pay_and_issue<SUI>(
        guard: &SpendGuard,
        mut funds: Coin<SUI>,
        amount: u64,
        service_id: vector<u8>,
        credits: u64,
        expiry: Option<u64>,
        tier: u8,
        ctx: &mut TxContext,
    ) {
        assert!(amount <= guard.max_per_tx, errors::not_authorized());
        assert!(sui::coin::value(&funds) >= amount, errors::no_credits());

        let payment = sui::coin::split(&mut funds, amount, ctx);
        transfer::public_transfer(payment, guard.recipient);
        transfer::public_transfer(funds, sui::tx_context::sender(ctx));

        let nft = access_nft::mint_access(
            tx_context::sender(ctx),
            *&service_id,
            credits,
            expiry,
            tier,
            ctx,
        );
        event::emit(PayAndIssueEvent {
            buyer: tx_context::sender(ctx),
            seller: guard.recipient,
            amount,
            service_id,
        });
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }
}

