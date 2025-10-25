module agent_commerce::payment {
    use sui::coin::Coin;
    use sui::object;
    use sui::transfer;
    use sui::tx_context;

    use agent_commerce::access_nft;
    use agent_commerce::errors;

    public struct SpendGuard has key, store {
        id: object::UID,
        max_per_tx: u64,
        recipient: address,
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
        assert!(amount <= guard.max_per_tx, errors::not_authorized());
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

        // event::emit(PayAndIssueEvent {
        //     buyer: sender,
        //     seller: guard.recipient,
        //     amount,
        //     service_id,
        // });

        transfer::public_transfer(nft, sender);
    }
}

