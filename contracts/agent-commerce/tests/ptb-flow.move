module agent_commerce::ptb_flow_tests {
    use sui::test_scenario;
    use sui::clock;

    use agent_commerce::access_nft;
    use agent_commerce::agent_registry;
    use agent_commerce::payment;
    use agent_commerce::reputation_nft;

    const SERVICE_ID: vector<u8> = b"hotel_finder_service";
    const SERVICE_ENDPOINT: vector<u8> = b"https://api.hotelfinder.ai";

    #[test]
    public fun test_simple_assert() {
        let x = 2 + 2;
        assert!(x == 4, 0);
    }

    #[test]
    public fun test_pay_and_issue_simple() {
        let seller = @0xC;
        let buyer = @0xB;

        let mut scene = test_scenario::begin(seller);

        // Initialize spend guard
        let guard = payment::init_spend_guard(1_000, seller, test_scenario::ctx(&mut scene));

        // Switch to buyer transaction
        test_scenario::next_tx(&mut scene, buyer);

        // Create test coin for buyer
        let buyer_coin = sui::coin::mint_for_testing<sui::sui::SUI>(5_000, test_scenario::ctx(&mut scene));

        // Call pay_and_issue
        payment::pay_and_issue(
            &guard,
            buyer_coin,
            500,
            SERVICE_ID,
            5,
            std::option::none(),
            0,
            test_scenario::ctx(&mut scene),
        );

        // Transfer guard to avoid drop error
        sui::transfer::public_transfer(guard, seller);

        test_scenario::end(scene);
    }

    #[test]
    public fun test_full_agent_to_agent_flow() {
        let service_provider = @0xA;
        let client_agent = @0xB;
        let registry_admin = @0x0;

        let mut scene = test_scenario::begin(registry_admin);

        // Create registry
        let registry = agent_registry::create_registry(test_scenario::ctx(&mut scene));
        sui::transfer::public_transfer(registry, registry_admin);

        test_scenario::next_tx(&mut scene, service_provider);

        // Service provider creates reputation NFT
        let reputation_nft = reputation_nft::init_reputation(
            service_provider,
            test_scenario::ctx(&mut scene)
        );

        // Register agent in registry
        let mut registry = test_scenario::take_from_address<agent_registry::AgentRegistry>(
            &scene, registry_admin
        );

        let pricing = agent_registry::per_credit_pricing(100); // 100 units per credit

        agent_registry::register_agent(
            &mut registry,
            sui::object::id(&reputation_nft),
            service_provider,
            b"Hotel Finder AI Service",
            pricing,
            &reputation_nft,
            SERVICE_ENDPOINT,
            test_scenario::ctx(&mut scene),
        );

        // Transfer reputation NFT to service provider
        sui::transfer::public_transfer(reputation_nft, service_provider);
        sui::transfer::public_transfer(registry, registry_admin);

        // Client agent looks up the service
        test_scenario::next_tx(&mut scene, client_agent);

        let registry = test_scenario::take_from_address<agent_registry::AgentRegistry>(
            &scene, registry_admin
        );

        let profile_opt = agent_registry::lookup_agent(
            &registry,
            &sui::object::id_from_address(service_provider)
        );

        assert!(std::option::is_some(&profile_opt), 0);
        let profile = std::option::destroy_some(profile_opt);

        // Verify pricing
        let pricing = agent_registry::profile_pricing(&profile);
        let cost = agent_registry::calculate_cost(pricing, 5);
        assert!(cost == 500, 0); // 5 credits * 100 per credit

        sui::transfer::public_transfer(registry, registry_admin);

        // Client agent pays and gets AccessNFT
        let registry = test_scenario::take_from_address<agent_registry::AgentRegistry>(
            &scene, registry_admin
        );

        // Initialize spend guard for service provider
        let guard = payment::init_spend_guard(1000, service_provider, test_scenario::ctx(&mut scene));

        // Create payment coin
        let payment_coin = sui::coin::mint_for_testing<sui::sui::SUI>(1000, test_scenario::ctx(&mut scene));

        // Pay and issue AccessNFT
        payment::pay_and_issue(
            &guard,
            payment_coin,
            500, // 5 credits * 100 per credit
            SERVICE_ID,
            5, // 5 credits
            std::option::none(), // no expiry
            0, // tier 0
            test_scenario::ctx(&mut scene),
        );

        sui::transfer::public_transfer(guard, service_provider);
        sui::transfer::public_transfer(registry, registry_admin);

        // Service provider consumes credits and provides feedback
        test_scenario::next_tx(&mut scene, service_provider);

        // Take the AccessNFT from client agent
        let mut access_nft = test_scenario::take_from_address<access_nft::AccessNFT>(
            &scene, client_agent
        );

        // Create clock for expiry check
        let clock_obj = clock::create_for_testing(test_scenario::ctx(&mut scene));

        // Consume 3 credits (simulate service usage)
        access_nft::consume_credit(&mut access_nft, &clock_obj, client_agent);
        access_nft::consume_credit(&mut access_nft, &clock_obj, client_agent);
        access_nft::consume_credit(&mut access_nft, &clock_obj, client_agent);

        // Check remaining credits
        assert!(access_nft::credits_remaining(&access_nft) == 2, 0);

        // Service provider gives positive feedback
        let mut reputation_nft = test_scenario::take_from_address<reputation_nft::ReputationNFT>(
            &scene, service_provider
        );

        // Create feedback authority
        let feedback_authority = reputation_nft::create_feedback_authority(
            service_provider,
            SERVICE_ID,
            sui::object::id(&reputation_nft),
            3600, // 1 hour expiration
            test_scenario::ctx(&mut scene)
        );

        // Add positive feedback
        reputation_nft::add_positive(
            &mut reputation_nft,
            &feedback_authority,
            1234567890, // timestamp
            test_scenario::ctx(&mut scene)
        );

        // Verify reputation was updated
        assert!(reputation_nft::positive_feedback(&reputation_nft) == 1, 0);
        assert!(reputation_nft::total_interactions(&reputation_nft) == 1, 0);

        // Clean up
        sui::transfer::public_transfer(access_nft, client_agent);
        sui::transfer::public_transfer(reputation_nft, service_provider);
        sui::transfer::public_transfer(feedback_authority, service_provider);
        clock::destroy_for_testing(clock_obj);

        test_scenario::end(scene);
    }
}

