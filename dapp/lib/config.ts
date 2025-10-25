// Configuration for SuiPay Agent contracts
// Update these addresses after deploying your contracts

export const CONTRACT_CONFIG = {
  // Package ID of the deployed agent-commerce package
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

export const isConfigured = () => {
  return CONTRACT_CONFIG.PACKAGE_ID !== '0x0' && CONTRACT_CONFIG.REGISTRY_ID !== '0x0';
};

export const getContractAddresses = () => ({
  agent_commerce: CONTRACT_CONFIG.PACKAGE_ID,
  agent_registry: CONTRACT_CONFIG.REGISTRY_ID,
});
