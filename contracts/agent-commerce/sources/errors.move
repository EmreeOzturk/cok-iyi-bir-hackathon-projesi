module agent_commerce::errors {
    /// General authorization failure.
    const E_NOT_AUTHORIZED: u64 = 1;

    /// Requested operation requires a positive credit balance.
    const E_NO_CREDITS: u64 = 2;

    /// Dynamic field metadata is missing.
    const E_METADATA_MISSING: u64 = 3;

    /// Attempted to create an object or record that already exists.
    const E_ALREADY_EXISTS: u64 = 4;

    /// Requested data not found.
    const E_NOT_FOUND: u64 = 5;

    /// Credit consumption would underflow.
    const E_CREDIT_UNDERFLOW: u64 = 6;

    /// Registry not initialized or misconfigured.
    const E_REGISTRY_NOT_INITIALIZED: u64 = 7;

    public(package) fun not_authorized(): u64 {
        E_NOT_AUTHORIZED
    }

    public(package) fun no_credits(): u64 {
        E_NO_CREDITS
    }

    public(package) fun metadata_missing(): u64 {
        E_METADATA_MISSING
    }

    public(package) fun already_exists(): u64 {
        E_ALREADY_EXISTS
    }

    public(package) fun not_found(): u64 {
        E_NOT_FOUND
    }

    public(package) fun credit_underflow(): u64 {
        E_CREDIT_UNDERFLOW
    }

    public(package) fun registry_not_initialized(): u64 {
        E_REGISTRY_NOT_INITIALIZED
    }
}

