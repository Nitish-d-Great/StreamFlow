# Nitrolite/Yellow Network Integration Guide

This document explains how the Nitrolite SDK (ERC-7824) is integrated into the movie streaming dApp.

## Overview

The application uses **Nitrolite** (formerly Yellow Network) for off-chain payments with instant finality. This provides significant advantages over traditional on-chain transactions:

- ⚡ **Instant Finality**: Payments complete immediately off-chain
- 💰 **Low Fees**: Only pay gas for channel opening and settlement
- 🚀 **High Throughput**: Handle thousands of transactions per second
- 🔄 **Real-time**: Perfect for pay-per-second video streaming

## Architecture

### Components

1. **NitroliteClient** (`src/services/nitrolite.js`)
   - Main SDK client for managing state channels
   - Handles initialization, session creation, and payments
   - Located in the `services` directory

2. **Application Flow**
   - User connects wallet → Initialize Nitrolite client
   - Watch video → Real-time billing counter
   - Stop & Settle → Create application session
   - Payment → Process off-chain → Settle on-chain
   - Confirmation → Display results

## Integration Details

### 1. Initialization (`LandingPage.jsx`)

When a user connects their wallet:

```javascript
import { initializeNitrolite } from '../services/nitrolite'

const nitroliteClient = await initializeNitrolite(provider, signer)
```

### 2. Payment Processing (`PaymentPage.jsx`)

The payment flow uses state channels:

```javascript
// Step 1: Create application session
const session = await createChannelSession(nitroliteClient, creatorAddress, userAddress)

// Step 2: Process payment off-chain
const paymentResult = await processPayment(nitroliteClient, session, amount, creatorAddress)

// Step 3: Close and settle on-chain
const closeResult = await closeSession(nitroliteClient, session)
```

### 3. Fallback Mechanism

If Nitrolite fails to initialize or process the payment, the application automatically falls back to standard on-chain Ethereum transactions:

```javascript
try {
  // Try Nitrolite payment
  await processPayment(nitroliteClient, session, amount, creatorAddress)
} catch (error) {
  // Fallback to on-chain
  await signer.sendTransaction({ to: creatorAddress, value: amountInWei })
}
```

## Configuration

### Contract Addresses Required

The Nitrolite client requires contract addresses to be configured. In `src/services/nitrolite.js`, you need to set:

```javascript
addresses: {
  custody: '0x...', // Custody contract address
  adjudicator: '0x...', // Adjudicator contract address  
  guestAddress: '0x...', // Creator address (set dynamically)
  tokenAddress: '0x0000000000000000000000000000000000000000' // ETH = zero address
}
```

**Important**: You need to deploy or get the contract addresses for:
- Custody contract
- Adjudicator contract

These are typically deployed by the Nitrolite team or you can deploy them yourself following the ERC-7824 standard.

## API Reference

### `initializeNitrolite(provider, signer)`

Initializes the Nitrolite client.

**Parameters:**
- `provider`: ethers.js provider instance
- `signer`: ethers.js signer instance

**Returns:** NitroliteClient instance

### `createChannelSession(client, creatorAddress, userAddress)`

Creates a new application session (state channel).

**Parameters:**
- `client`: NitroliteClient instance
- `creatorAddress`: Creator's wallet address
- `userAddress`: User's wallet address

**Returns:** Session object with `id` and metadata

### `processPayment(client, session, amount, recipientAddress)`

Processes a payment through the state channel.

**Parameters:**
- `client`: NitroliteClient instance
- `session`: Session object from `createChannelSession`
- `amount`: Payment amount in ETH
- `recipientAddress`: Recipient's wallet address

**Returns:** Payment result object

### `closeSession(client, session)`

Closes and settles the application session on-chain.

**Parameters:**
- `client`: NitroliteClient instance
- `session`: Session object to close

**Returns:** Settlement result with transaction hash

## Testing

### Prerequisites

1. Install MetaMask
2. Connect to Sepolia testnet
3. Get Sepolia ETH from a faucet
4. Visit https://apps.yellow.com to set up your channel

### Test Flow

1. Connect wallet on landing page
2. Play video and watch the counter increment
3. Click "Stop and Settle"
4. Review payment details
5. Click "Pay Now" - should use Nitrolite for instant payment
6. View confirmation with transaction details

## Troubleshooting

### "Nitrolite client initialization failed"

**Solution:** Check that you have:
- Valid broker URL configured
- Correct network selected (Sepolia)
- Proper channel setup at apps.yellow.com

### "Session creation failed"

**Solution:** Ensure both addresses are valid Ethereum addresses and have MetaMask connected

### "Payment processing failed"

**Solution:** The app will automatically fall back to on-chain payment. Check:
- You have enough ETH in your wallet
- Network is set to Sepolia
- Creator address is valid

## Benefits for Video Streaming

Nitrolite is particularly well-suited for this use case because:

1. **Real-time Billing**: State channels allow instant off-chain payments as the video plays
2. **Cost Efficiency**: Only two on-chain transactions (open + settle) regardless of watch time
3. **Scalability**: Can handle many concurrent viewers without network congestion
4. **User Experience**: Instant payments feel more natural for streaming content

## Further Reading

- [ERC-7824 Documentation](https://erc7824.org/)
- [Nitrolite Quick Start](https://erc7824.org/guides/quick-start)
- [Yellow Network App Dashboard](https://apps.yellow.com)
- [Nitrolite GitHub](https://github.com/Layer3-Foundation/nitrolite)

## Note on Package Installation

## Package Installation

The correct package is `@erc7824/nitrolite` version `0.4.0`:

```bash
npm install @erc7824/nitrolite@^0.4.0
```

Reference: https://erc7824.org/nitrolite_client/methods

## Note on Package Installation

The Nitrolite SDK package `@erc7824/nitrolite` is now correctly installed from npm. The package provides the `NitroliteClient` class for managing state channels according to the ERC-7824 standard.

