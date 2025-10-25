module agent_commerce::ptb_flow_tests {
    use std::option;
    use std::vector;

    use sui::coin::{Self, Coin};
    use sui::object;
    use sui::test_scenario::Scenario;
    use sui::tx_context;

    use crate::access_nft;
    use crate::payment;

    const SERVICE_BYTES: vector<u8> = b"service";

    #[test]
    public fun pay_and_issue_flow() {
        let mut scenario = Scenario::begin();
        let admin = scenario.next_account();
        let buyer = scenario.next_account();
        let seller = scenario.next_account();

        scenario.publish_package(&admin, @agent_commerce);

        // init guard
        let guard = payment::init_spend_guard(1_000, seller, &mut scenario.ctx());

        // mint funds
        let mut buyer_coin = scenario.create_coin(coin::mint(5_000, &admin, &mut scenario.ctx()));

        // pay and issue
        payment::pay_and_issue(
            &guard,
            buyer_coin,
            500,
            vector::copy(&SERVICE_BYTES),
            5,
            option::none(),
            0,
            &mut scenario.ctx(),
        );

        scenario.end();
    }
}

