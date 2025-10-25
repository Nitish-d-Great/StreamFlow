# Quick Start Guide

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - Make sure MetaMask is installed and configured for Sepolia testnet

## How to Use

### Step 1: Connect Wallet
- Click "Connect MetaMask Wallet" on the landing page
- Approve the connection in MetaMask

### Step 2: Watch Video
- The video will start when you click Play
- Watch the real-time billing counter:
  - Time Watched: Shows how long you've been watching
  - Amount Due: Shows the accumulated cost (0.0001 ETH per second)

### Step 3: Stop and Settle
- Click "Stop and Settle" when you're done
- Review the payment details

### Step 4: Make Payment
- Click "Pay Now" to initiate the transaction
- MetaMask will prompt you to sign the transaction
- Wait for confirmation

### Step 5: View Confirmation
- See transaction details including:
  - Time watched
  - Amount paid
  - Transaction hash (clickable link to Etherscan)
  - From and To addresses

## Important Notes

- **Testnet Only**: This app uses Sepolia testnet
- **Test Tokens**: You need Sepolia ETH in your MetaMask wallet
- **Creator Address**: The creator address is hardcoded in `VideoPlayerPage.jsx` (line 10)
- **Network**: Make sure MetaMask is set to Sepolia testnet

## Configuration

### Changing the Creator Address
Edit `src/pages/VideoPlayerPage.jsx`:
```javascript
const CREATOR_ADDRESS = '0xYourCreatorAddressHere'
```

### Changing the Price Rate
Edit `src/pages/VideoPlayerPage.jsx`:
```javascript
const PRICE_PER_SECOND = 0.0001 // Change this value
```

## Troubleshooting

**Problem**: Can't connect wallet
- **Solution**: Make sure MetaMask is installed and unlocked

**Problem**: Transaction fails
- **Solution**: Check you have enough Sepolia ETH in your wallet

**Problem**: Video doesn't play
- **Solution**: Check your internet connection and try refreshing

## Yellow Network (Nitrolite) Integration

The app uses the **Nitrolite SDK** (ERC-7824) for off-chain state channel payments through Yellow Network. When users make a payment:

1. A state channel session is created between user and creator
2. Payment is processed off-chain for instant finality
3. Session is closed and settled on-chain
4. Transaction hash is displayed for verification

### Benefits:
- ⚡ Instant payments (no waiting for block confirmations)
- 💰 Low fees (only gas for opening and settling channels)
- 🚀 High throughput (thousands of transactions per second)

See `NITROLITE_INTEGRATION.md` for detailed information about the integration.

### Fallback:
If Nitrolite fails, the app automatically falls back to standard on-chain Ethereum transactions where:
1. A transaction is created with the calculated amount
2. The user signs via MetaMask
3. The transaction is submitted to Sepolia network
4. Confirmation is displayed with transaction hash

