module agent_commerce::agent_registry {
    use sui::dynamic_field;
    use sui::event;
    use sui::tx_context::TxContext;

    use agent_commerce::errors;
    use agent_commerce::reputation_nft;

    /// Pricing model for agent services.
    public struct PricingModel has copy, drop, store {
        model_type: u8, // 0: per_credit, 1: subscription, 2: free
        amount: u64,    // amount for per_credit or subscription, ignored for free
    }

    public struct Profile has copy, drop, store {
        owner: address,
        description: vector<u8>,
        pricing: PricingModel,
        reputation: ID,
        service_endpoint: vector<u8>,
    }

    public struct AgentRegistry has key, store {
        id: UID,
    }

    public struct ProfileKey has copy, drop, store {
        id: ID,
    }

    public struct AgentRegistered has copy, drop, store {
        agent_id: ID,
        owner: address,
    }

    public struct AgentUpdated has copy, drop, store {
        agent_id: ID,
        pricing: PricingModel,
    }

    fun init(ctx: &mut TxContext) {
        // This would be called during package initialization
        // For now, we'll create registries on-demand
    }

    public fun register_agent(
        registry: &mut AgentRegistry,
        agent_id: ID,
        owner: address,
        description: vector<u8>,
        pricing: PricingModel,
        reputation_nft: &reputation_nft::ReputationNFT,
        service_endpoint: vector<u8>,
    ) {
        assert!(vector::length(&description) > 0, errors::not_found());
        assert!(vector::length(&service_endpoint) > 0, errors::not_found());
        let key = profile_key(agent_id);
        assert!(
            !dynamic_field::exists_(&registry.id, key),
            errors::already_exists(),
        );

        let reputation_id = object::id(reputation_nft);
        dynamic_field::add(
            &mut registry.id,
            key,
            Profile {
                owner,
                description,
                pricing,
                reputation: reputation_id,
                service_endpoint,
            },
        );
        event::emit(AgentRegistered { agent_id, owner });
    }

    public fun update_pricing(
        registry: &mut AgentRegistry,
        agent_id: ID,
        caller: address,
        pricing: PricingModel,
    ) {
        let profile = borrow_profile_mut(&mut registry.id, agent_id);
        assert!(profile.owner == caller, errors::not_authorized());
        profile.pricing = pricing;
        event::emit(AgentUpdated { agent_id, pricing });
    }

    public fun lookup_agent(
        registry: &AgentRegistry,
        agent_id: &ID,
    ): Option<Profile> {
        let key = profile_key(*agent_id);
        if (!dynamic_field::exists_(&registry.id, key)) {
            return option::none()
        };
        option::some(*dynamic_field::borrow<ProfileKey, Profile>(&registry.id, key))
    }

    fun borrow_profile_mut(registry_id: &mut UID, agent_id: ID): &mut Profile {
        dynamic_field::borrow_mut(registry_id, profile_key(agent_id))
    }

    fun profile_key(agent_id: ID): ProfileKey {
        ProfileKey { id: agent_id }
    }
}

