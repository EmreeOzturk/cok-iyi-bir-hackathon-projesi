module agent_commerce::agent_registry {
    use std::option;

    use sui::dynamic_field;
    use sui::event;
    use sui::object::{ID, UID};
    use sui::transfer;
    use sui::tx_context;

    use agent_commerce::errors;
    use agent_commerce::reputation_nft;

    /// Pricing model for agent services.
    public struct PricingModel has copy, drop, store {
        model_type: u8, // 0: per_credit, 1: subscription, 2: free
        amount: u64,    // amount for per_credit or subscription, ignored for free
    }

    /// Pricing model types
    const PER_CREDIT: u8 = 0;
    const SUBSCRIPTION: u8 = 1;
    const FREE: u8 = 2;

    public struct Profile has copy, drop, store {
        agent_name: vector<u8>, // Agent name as specified in PRD
        owner: address,
        description: vector<u8>,
        pricing: PricingModel,
        reputation: ID,
        service_endpoint: vector<u8>,
    }

    // Events for transparency
    public struct AgentRegistered has copy, drop {
        agent_id: vector<u8>,
        agent_name: vector<u8>,
        owner: address,
        service_endpoint: vector<u8>,
    }

    public struct AgentUpdated has copy, drop {
        agent_id: vector<u8>,
        pricing: PricingModel,
    }

    public struct AgentRegistry has key, store {
        id: UID,
    }

    public struct ProfileKey has copy, drop, store {
        id: vector<u8>,
    }

    public fun create_registry(ctx: &mut TxContext): AgentRegistry {
        AgentRegistry { id: object::new(ctx) }
    }

    public entry fun create_and_share_registry(ctx: &mut TxContext) {
        let registry = create_registry(ctx);
        transfer::public_share_object(registry);
    }

    public entry fun register_agent(
        registry: &mut AgentRegistry,
        agent_id: vector<u8>,
        agent_name: vector<u8>,
        owner: address,
        description: vector<u8>,
        model_type: u8,
        amount: u64,
        reputation_nft: &reputation_nft::ReputationNFT,
        service_endpoint: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        // Check vector lengths for non-empty strings
        assert!(vector::length(&agent_name) > 0, errors::invalid_input());
        assert!(vector::length(&description) > 0, errors::invalid_input());
        assert!(vector::length(&service_endpoint) > 0, errors::invalid_input());

        assert!(reputation_nft::agent_address(reputation_nft) == owner, errors::not_authorized());
        assert!(sender == owner, errors::not_authorized());

        let key = profile_key(agent_id);
        assert!(
            !dynamic_field::exists_with_type<ProfileKey, Profile>(&registry.id, key),
            errors::already_exists(),
        );

        let reputation_id = object::id(reputation_nft);

        let pricing = PricingModel { model_type, amount };

        dynamic_field::add(
            &mut registry.id,
            key,
            Profile {
                agent_name: *&agent_name,
                owner,
                description,
                pricing,
                reputation: reputation_id,
                service_endpoint,
            },
        );

        event::emit(AgentRegistered {
            agent_id,
            agent_name: *&agent_name,
            owner,
            service_endpoint,
        });
    }

    public fun update_pricing(
        registry: &mut AgentRegistry,
        agent_id: vector<u8>,
        caller: address,
        pricing: PricingModel,
    ) {
        let profile = borrow_profile_mut(&mut registry.id, agent_id);
        assert!(profile.owner == caller, errors::not_authorized());
        profile.pricing = pricing;

        event::emit(AgentUpdated {
            agent_id: *&agent_id,
            pricing,
        });
    }

    public fun lookup_agent(
        registry: &AgentRegistry,
        agent_id: &vector<u8>,
    ): Option<Profile> {
        let key = profile_key(*agent_id);
        if (!dynamic_field::exists_with_type<ProfileKey, Profile>(&registry.id, key)) {
            return option::none()
        };
        option::some(*dynamic_field::borrow<ProfileKey, Profile>(&registry.id, key))
    }

    fun borrow_profile_mut(registry_id: &mut UID, agent_id: vector<u8>): &mut Profile {
        dynamic_field::borrow_mut(registry_id, profile_key(agent_id))
    }

    /// Create a per-credit pricing model
    public fun per_credit_pricing(cost_per_credit: u64): PricingModel {
        assert!(cost_per_credit > 0, errors::no_credits());
        PricingModel {
            model_type: PER_CREDIT,
            amount: cost_per_credit,
        }
    }

    /// Create a subscription pricing model
    public fun subscription_pricing(monthly_cost: u64): PricingModel {
        assert!(monthly_cost > 0, errors::no_credits());
        PricingModel {
            model_type: SUBSCRIPTION,
            amount: monthly_cost,
        }
    }

    /// Create a free pricing model
    public fun free_pricing(): PricingModel {
        PricingModel {
            model_type: FREE,
            amount: 0,
        }
    }

    /// Calculate the total cost for a given number of credits
    public fun calculate_cost(pricing: &PricingModel, credits: u64): u64 {
        if (pricing.model_type == PER_CREDIT) {
            pricing.amount * credits
        } else if (pricing.model_type == SUBSCRIPTION) {
            pricing.amount  // Fixed monthly cost
        } else if (pricing.model_type == FREE) {
            0  // Free service
        } else {
            abort errors::not_found()  // Invalid pricing model
        }
    }

    /// Check if a pricing model is valid
    public fun is_valid_pricing(pricing: &PricingModel): bool {
        pricing.model_type == PER_CREDIT ||
        pricing.model_type == SUBSCRIPTION ||
        pricing.model_type == FREE
    }

    /// Get pricing model type
    public fun pricing_model_type(pricing: &PricingModel): u8 {
        pricing.model_type
    }

    /// Get pricing amount
    public fun pricing_amount(pricing: &PricingModel): u64 {
        pricing.amount
    }

    /// Get agent name from profile
    public fun profile_agent_name(profile: &Profile): vector<u8> {
        *&profile.agent_name
    }

    // Test-only getter for accessing profile pricing
    #[test_only]
    public fun profile_pricing(profile: &Profile): &PricingModel {
        &profile.pricing
    }

    fun profile_key(agent_id: vector<u8>): ProfileKey {
        ProfileKey { id: *&agent_id }
    }
}

