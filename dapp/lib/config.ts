// Contract configuration and addresses
export const CONTRACT_CONFIG = {
  // Package ID of the deployed agent-commerce package (alias for backward compatibility)
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || '0x0',

  // Object ID of the deployed AgentRegistry
  REGISTRY_ID: process.env.NEXT_PUBLIC_REGISTRY_ID || '0x0',

  // Clock object ID (standard on Sui)
  CLOCK_ID: '0x6',

  // SUI coin type
  SUI_COIN_TYPE: '0x2::sui::SUI',

  // USDC coin type (update if using different stablecoin)
  USDC_COIN_TYPE: '0x2::sui::SUI', // Using SUI for testnet, change to actual USDC

  // Network configuration
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
} as const;
