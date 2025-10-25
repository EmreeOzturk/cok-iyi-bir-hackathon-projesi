module agent_commerce::reputation_nft {
    use sui::dynamic_field;
    use sui::event;
    use sui::tx_context::TxContext;

    public struct Metrics has copy, drop, store {
        total_interactions: u64,
        positive: u64,
        negative: u64,
        last_feedback: Option<u64>,
    }

    public struct ReputationNFT has key, store {
        id: UID,
        agent: address,
    }

    const METRICS_KEY: vector<u8> = b"metrics";

    public struct ReputationUpdated has copy, drop, store {
        agent: address,
        total_interactions: u64,
        positive: u64,
        negative: u64,
    }

    public fun init_reputation(agent: address, ctx: &mut TxContext): ReputationNFT {
        let mut id = object::new(ctx);
        dynamic_field::add(&mut id, METRICS_KEY, Metrics {
            total_interactions: 0,
            positive: 0,
            negative: 0,
            last_feedback: option::none(),
        });

        ReputationNFT { id, agent }
    }

    public fun add_positive(nft: &mut ReputationNFT, timestamp: u64) {
        update_metrics(nft, timestamp, true);
    }

    public fun add_negative(nft: &mut ReputationNFT, timestamp: u64) {
        update_metrics(nft, timestamp, false);
    }

    fun update_metrics(nft: &mut ReputationNFT, timestamp: u64, is_positive: bool) {
        let metrics = borrow_metrics_mut(&mut nft.id);
        metrics.total_interactions = metrics.total_interactions + 1;
        if (is_positive) {
            metrics.positive = metrics.positive + 1;
        } else {
            metrics.negative = metrics.negative + 1;
        };
        metrics.last_feedback = option::some(timestamp);

        event::emit(ReputationUpdated {
            agent: nft.agent,
            total_interactions: metrics.total_interactions,
            positive: metrics.positive,
            negative: metrics.negative,
        });
    }

    public fun stats(nft: &ReputationNFT): Metrics {
        *borrow_metrics(&nft.id)
    }

    public fun last_feedback(nft: &ReputationNFT): Option<u64> {
        let metrics = borrow_metrics(&nft.id);
        metrics.last_feedback
    }

    fun borrow_metrics(nft_id: &UID): &Metrics {
        dynamic_field::borrow(nft_id, METRICS_KEY)
    }

    fun borrow_metrics_mut(nft_id: &mut UID): &mut Metrics {
        dynamic_field::borrow_mut(nft_id, METRICS_KEY)
    }
}

