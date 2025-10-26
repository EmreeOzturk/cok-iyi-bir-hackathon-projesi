module agent_commerce::reputation_nft {
    use sui::dynamic_field;
    use sui::event;
    use sui::tx_context;
    use agent_commerce::errors;
    use sui::transfer;

    public struct Metrics has copy, drop, store {
        total_interactions: u64,
        basarili_islem: u64, // successful_operations as specified in PRD
        positive: u64,
        negative: u64,
        last_feedback: option::Option<u64>,
    }

    // Events for transparency
    public struct FeedbackAuthorityCreated has copy, drop {
        service_provider: address,
        service_id: vector<u8>,
        agent_reputation_id: object::ID,
        expiration: u64,
    }

    public struct ReputationUpdated has copy, drop {
        agent: address,
        total_interactions: u64,
        basarili_islem: u64,
        positive: u64,
        negative: u64,
    }

    public struct ReputationNFT has key, store {
        id: object::UID,
        agent: address,
    }

    const METRICS_KEY: vector<u8> = b"metrics";

    /// Authority granted to service providers to give feedback for completed services
    public struct FeedbackAuthority has key, store {
        id: object::UID,
        service_provider: address,
        service_id: vector<u8>,
        agent_reputation_id: object::ID,
        expiration: u64,
    }


    /// Init reputation NFT for an agent
    public entry fun init_reputation(agent: address, ctx: &mut tx_context::TxContext) {
        let mut id = object::new(ctx);
        dynamic_field::add(&mut id, METRICS_KEY, Metrics {
            total_interactions: 0,
            basarili_islem: 0,
            positive: 0,
            negative: 0,
            last_feedback: option::none(),
        });

        let nft = ReputationNFT { id, agent };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

      /// Create feedback authority for a service provider
    public fun create_feedback_authority(
        service_provider: address,
        service_id: vector<u8>,
        agent_reputation_id: object::ID,
        expiration_seconds: u64,
        ctx: &mut tx_context::TxContext
    ): FeedbackAuthority {
        let current_time = tx_context::epoch(ctx);
        let expiration = current_time + expiration_seconds;

        let authority = FeedbackAuthority {
            id: object::new(ctx),
            service_provider,
            service_id,
            agent_reputation_id,
            expiration,
        };

        event::emit(FeedbackAuthorityCreated {
            service_provider,
            service_id,
            agent_reputation_id,
            expiration,
        });

        authority
    }

    /// Add positive feedback - ONLY callable by authorized feedback providers
    public fun add_positive(
        nft: &mut ReputationNFT,
        authority: &FeedbackAuthority,
        timestamp: u64,
        ctx: &tx_context::TxContext
    ) {
        verify_feedback_authority(authority, nft, ctx);
        update_metrics(nft, timestamp, true);
    }

    /// Add negative feedback - ONLY callable by authorized feedback providers
    public fun add_negative(
        nft: &mut ReputationNFT,
        authority: &FeedbackAuthority,
        timestamp: u64,
        ctx: &tx_context::TxContext
    ) {
        verify_feedback_authority(authority, nft, ctx);
        update_metrics(nft, timestamp, false);
    }

    fun update_metrics(nft: &mut ReputationNFT, timestamp: u64, is_positive: bool) {
        let metrics = borrow_metrics_mut(&mut nft.id);
        metrics.total_interactions = metrics.total_interactions + 1;
        if (is_positive) {
            metrics.basarili_islem = metrics.basarili_islem + 1;
            metrics.positive = metrics.positive + 1;
        } else {
            metrics.negative = metrics.negative + 1;
        };
        metrics.last_feedback = option::some(timestamp);

        event::emit(ReputationUpdated {
            agent: nft.agent,
            total_interactions: metrics.total_interactions,
            basarili_islem: metrics.basarili_islem,
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

    /// Verify that the caller is authorized to provide feedback
    fun verify_feedback_authority(
        authority: &FeedbackAuthority,
        nft: &ReputationNFT,
        ctx: &tx_context::TxContext
    ) {
        let caller = tx_context::sender(ctx);

        // Only the authorized service provider can give feedback
        assert!(caller == authority.service_provider, errors::not_authorized());

        // The authority must be for this specific reputation NFT
        assert!(authority.agent_reputation_id == object::uid_to_inner(&nft.id), errors::not_authorized());

        // The authority must not be expired
        let current_time = tx_context::epoch(ctx);
        assert!(current_time <= authority.expiration, errors::not_authorized());
    }

    /// Check if a feedback authority is valid
    public fun is_feedback_authority_valid(
        authority: &FeedbackAuthority,
        nft: &ReputationNFT,
        ctx: &tx_context::TxContext
    ): bool {
        let caller = tx_context::sender(ctx);
        let current_time = tx_context::epoch(ctx);

        caller == authority.service_provider &&
        authority.agent_reputation_id == object::uid_to_inner(&nft.id) &&
        current_time <= authority.expiration
    }

    /// Get the service provider from a feedback authority
    public fun feedback_authority_provider(authority: &FeedbackAuthority): address {
        authority.service_provider
    }

    /// Get the expiration time from a feedback authority
    public fun feedback_authority_expiration(authority: &FeedbackAuthority): u64 {
        authority.expiration
    }

    /// Get the agent address from a ReputationNFT
    public fun agent_address(nft: &ReputationNFT): address {
        nft.agent
    }

    /// Get successful operations (basarili_islem) count
    public fun basarili_islem(nft: &ReputationNFT): u64 {
        let metrics = stats(nft);
        metrics.basarili_islem
    }

    // Test-only getters for accessing metrics fields
    #[test_only]
    public fun positive_feedback(nft: &ReputationNFT): u64 {
        let metrics = stats(nft);
        metrics.positive
    }

    #[test_only]
    public fun total_interactions(nft: &ReputationNFT): u64 {
        let metrics = stats(nft);
        metrics.total_interactions
    }
}

