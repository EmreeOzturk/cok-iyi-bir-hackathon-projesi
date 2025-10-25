# SuiPay Agent Frontend

A Next.js 16 + React 19 frontend for the SuiPay Agent protocol - enabling agent-to-agent (A2A) commerce on Sui blockchain.

## Features

- **Wallet Integration**: Connect Sui wallets (Sui Wallet, Suiet, etc.)
- **Service Marketplace**: Browse and purchase AI agent services
- **Agent Dashboard**: Monitor agent performance and reputation
- **Transaction Composer**: Create programmable transactions (PTBs)
- **Spend Guards**: Set spending limits for agent operations
- **AccessNFT Management**: View and consume service credits

## Architecture

- **Framework**: Next.js 16 with React 19 and App Router
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand stores
- **Blockchain**: Sui integration with @mysten/sui
- **Type Safety**: Full TypeScript coverage

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment

Copy the environment template and update with your deployed contract addresses:

```bash
cp .env.example .env.local
```

Update `.env.local` with your contract addresses:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=0x_your_package_id_here
NEXT_PUBLIC_REGISTRY_ID=0x_your_registry_id_here
```

### 3. Deploy Contracts First

Before running the frontend, you need to deploy the smart contracts:

```bash
# In the contracts directory
cd ../contracts/agent-commerce
sui move build
sui client publish --gas-budget 10000000
```

Update the package and registry IDs in your `.env.local` file.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
dapp/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Agent dashboard route group
│   ├── (marketplace)/     # Service marketplace route group
│   ├── (wallet)/         # Wallet controls route group
│   ├── globals.css       # Global styles with Tailwind
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── agent-dashboard/  # Dashboard-specific components
│   ├── service-marketplace/ # Marketplace components
│   ├── wallet-controls/  # Wallet control components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and integrations
│   ├── sui.ts           # Sui client and utilities
│   ├── contracts.ts     # Contract interaction layer
│   ├── config.ts        # Configuration management
│   └── utils.ts         # General utilities
├── stores/              # Zustand state management
│   ├── use-wallet-store.ts    # Wallet state
│   └── use-contract-store.ts  # Contract interactions
└── types/               # TypeScript type definitions
```

## Key Features Implementation

### Wallet Integration

The app integrates with Sui wallets through the `@mysten/sui` library. Connect to wallets like Sui Wallet, Suiet, etc.

### Contract Integration

- **Agent Registry**: Browse registered AI services
- **AccessNFT**: Purchase and consume service credits
- **Reputation System**: View agent reputation scores
- **Spend Guards**: Create and manage spending limits

### PTB (Programmable Transaction Blocks)

Compose complex transactions that:
1. Pay for services
2. Mint AccessNFTs
3. Update reputation scores
4. All in a single atomic transaction

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_NETWORK` | Sui network (devnet/testnet/mainnet) | Yes |
| `NEXT_PUBLIC_PACKAGE_ID` | Deployed package ID | Yes |
| `NEXT_PUBLIC_REGISTRY_ID` | Agent registry object ID | Yes |

### Testing

The frontend includes integration with the smart contract tests. Make sure contracts are deployed before testing frontend features.

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
