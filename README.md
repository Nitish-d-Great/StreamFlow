# Movie Streaming dApp

A decentralized movie streaming platform built on Yellow Network with pay-per-second billing.

## Features

- **Wallet Connection**: Connect MetaMask wallet to access the platform
- **Video Streaming**: Watch videos with a built-in player
- **Real-time Billing**: Automatic price counter showing costs in real-time (0.0001 Sepolia ETH per second)
- **Yellow Network Integration**: Secure payment processing via Yellow Network
- **Transaction Tracking**: View transaction details and hash on Etherscan

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Sepolia testnet ETH

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Connect Wallet**: Click "Connect MetaMask Wallet" on the landing page
2. **Watch Video**: Play the video to start the billing counter
3. **Stop and Settle**: Click "Stop and Settle" when done watching
4. **Make Payment**: Review details and click "Pay Now" to complete the transaction
5. **Confirmation**: View transaction details on the confirmation page

## Technical Details

- **Framework**: React with Vite
- **Blockchain**: Ethereum Sepolia Testnet
- **Wallet**: MetaMask integration via ethers.js
- **Payment Network**: Yellow Network
- **Rate**: 0.0001 Sepolia ETH per second

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx       # Wallet connection page
│   ├── VideoPlayerPage.jsx   # Video player with billing counter
│   ├── PaymentPage.jsx       # Payment processing page
│   └── ConfirmationPage.jsx  # Transaction confirmation page
├── App.jsx                    # Main router component
└── main.jsx                  # Entry point
```

## Yellow Network Integration

The application now uses the **Nitrolite SDK** (ERC-7824 standard) for Yellow Network integration. When users click "Pay Now", the application:

1. **Initializes Nitrolite Client**: Sets up connection to Yellow Network/ClearNode
2. **Creates State Channel Session**: Establishes an off-chain application session between user and creator
3. **Processes Payment Off-Chain**: Sends payment through state channel for instant finality
4. **Settles On-Chain**: Closes and finalizes the session on the blockchain
5. **Displays Transaction Hash**: Shows the settlement transaction or off-chain reference

### Benefits of Nitrolite

- **Instant Finality**: Off-chain transactions settle immediately
- **Low Fees**: Minimal gas costs (only for channel opening and settlement)
- **High Throughput**: Can handle thousands of transactions per second
- **Flexible Payments**: Perfect for real-time payment scenarios like video streaming

### Fallback Mechanism

If Nitrolite state channel setup fails, the application automatically falls back to standard on-chain Ethereum transactions to ensure payment reliability.

## Important Setup Notes

⚠️ **Contract Addresses Required**: The Nitrolite integration requires contract addresses for custody and adjudicator contracts. These need to be configured in `src/services/nitrolite.js`:

```javascript
addresses: {
  custody: '0x...', // Custody contract address
  adjudicator: '0x...', // Adjudicator contract address
  guestAddress: '0x...', // Creator address
  tokenAddress: '0x0000000000000000000000000000000000000000' // ETH
}
```

Without these addresses, the app will fall back to standard on-chain transactions.

## License

MIT

