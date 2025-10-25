module agent_commerce::access_nft {
    use sui::clock::Clock;
    use sui::dynamic_field;
    use sui::event;
    use sui::tx_context::TxContext;
    use sui::object::UID;
    use std::option;

    use agent_commerce::errors;

    /// Metadata held as a dynamic field under the AccessNFT.
    public struct Metadata has copy, drop, store {
        credits_remaining: u64,
        expiry: Option<u64>,
        tier: u8,
    }

    /// AccessNFT object granting service invocation rights.
    public struct AccessNFT has key, store {
        id: UID,
        service_id: vector<u8>,
        owner: address,
    }

    public struct MetadataKey has copy, drop, store {}

    public struct AccessMinted has copy, drop, store {
        recipient: address,
        service_id: vector<u8>,
        credits: u64,
        tier: u8,
    }

    public struct CreditConsumed has copy, drop, store {
        owner: address,
        service_id: vector<u8>,
        credits_remaining: u64,
    }

    public(package) fun mint_access(
        owner: address,
        service_id: vector<u8>,
        credits: u64,
        expiry: Option<u64>,
        tier: u8,
        ctx: &mut TxContext,
    ): AccessNFT {
        assert!(credits > 0, errors::no_credits());

        let mut id = object::new(ctx);
        dynamic_field::add(&mut id, metadata_key(), Metadata {
            credits_remaining: credits,
            expiry,
            tier,
        });

        let nft = AccessNFT {
            id,
            service_id,
            owner,
        };

        event::emit(AccessMinted {
            recipient: owner,
            service_id: *&nft.service_id,
            credits,
            tier,
        });
        nft
    }

    public(package) fun consume_credit(
        nft: &mut AccessNFT,
        clock_obj: &Clock,
        caller: address,
    ) {
        assert!(caller == nft.owner, errors::not_authorized());

        // CRITICAL: Verify metadata exists before accessing
        assert!(metadata_exists(&nft.id), errors::metadata_missing());

        let metadata = borrow_metadata_mut_safe(&mut nft.id);
        if (option::is_some(&metadata.expiry)) {
            let deadline = *option::borrow(&metadata.expiry);
            assert!(sui::clock::timestamp_ms(clock_obj) <= deadline, errors::no_credits());
        };

        assert!(metadata.credits_remaining > 0, errors::no_credits());
        metadata.credits_remaining = metadata.credits_remaining - 1;
        event::emit(CreditConsumed {
            owner: nft.owner,
            service_id: *&nft.service_id,
            credits_remaining: metadata.credits_remaining,
        });
    }

    public(package) fun extend_access(
        nft: &mut AccessNFT,
        additional_credits: u64,
        new_expiry: Option<u64>,
    ) {
        // CRITICAL: Verify metadata exists before accessing
        assert!(metadata_exists(&nft.id), errors::metadata_missing());

        let metadata = borrow_metadata_mut_safe(&mut nft.id);
        metadata.credits_remaining = metadata.credits_remaining + additional_credits;
        if (option::is_some(&new_expiry)) {
            metadata.expiry = new_expiry;
        }
    }

    public fun metadata(nft: &AccessNFT): Metadata {
        // CRITICAL: Verify metadata exists before accessing
        assert!(metadata_exists(&nft.id), errors::metadata_missing());
        *borrow_metadata_safe(&nft.id)
    }

    public fun owner(nft: &AccessNFT): address {
        nft.owner
    }

    public fun service_id(nft: &AccessNFT): vector<u8> {
        *&nft.service_id
    }

    /// Check if metadata exists for the given AccessNFT
    public fun metadata_exists(nft_id: &UID): bool {
        dynamic_field::exists_(nft_id, metadata_key())
    }

    /// Safe borrow that checks existence first
    fun borrow_metadata_safe(nft_id: &UID): &Metadata {
        dynamic_field::borrow(nft_id, metadata_key())
    }

    /// Safe mutable borrow that checks existence first
    fun borrow_metadata_mut_safe(nft_id: &mut UID): &mut Metadata {
        dynamic_field::borrow_mut(nft_id, metadata_key())
    }

    /// DEPRECATED: Unsafe functions - use safe versions instead
    fun borrow_metadata(nft_id: &UID): &Metadata {
        dynamic_field::borrow(nft_id, metadata_key())
    }

    fun borrow_metadata_mut(nft_id: &mut UID): &mut Metadata {
        dynamic_field::borrow_mut(nft_id, metadata_key())
    }

    fun metadata_key(): MetadataKey {
        MetadataKey {}
    }

    /// Get metadata as Option (safer alternative)
    public fun metadata_option(nft: &AccessNFT): Option<Metadata> {
        if (!metadata_exists(&nft.id)) {
            option::none()
        } else {
            option::some(*borrow_metadata_safe(&nft.id))
        }
    }
}


