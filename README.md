# Movie Streaming dApp

A decentralized movie streaming platform built on Yellow Network with an AI chatbot for movie suggestions.

## Features

- **Wallet Connection**: Connect MetaMask wallet to access the platform
- **Video Streaming**: Watch videos with a built-in player
- **Real-time Billing**: Automatic price counter showing costs in real-time (0.0001 Sepolia ETH per second)
- **Yellow Network Integration**: Secure payment processing via Yellow Network
- **AI Chatbot**: Get movie suggestions (Hollywood & Bollywood) powered by OpenAI
- **Secure Payments**: Payment processing via standard Ethereum transactions (with Yellow Network fallback intention)
- **Transaction Tracking**: View transaction details and hash on Etherscan

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Sepolia testnet ETH
- OpenAI API Key (for the chatbot functionality)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API Keys:
   Create a `.env` file in the project root and add your OpenAI API Key:
   ```
   VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   ```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Connect Wallet**: Click "Connect MetaMask Wallet" on the landing page
2. **Use Chatbot**: Click "Try Movie Chatbot" to get movie suggestions
3. **Watch Video**: Play the video to start the billing counter
4. **Stop and Settle**: Click "Stop and Settle" when done watching
5. **Make Payment**: Review details and click "Pay Now" to complete the transaction
6. **Confirmation**: View transaction details on the confirmation page

## AI Chatbot

This dApp includes an AI-powered chatbot that can suggest movies from Hollywood and Bollywood based on your preferences. It is integrated with the OpenAI API using the `gpt-3.5-turbo` model.

### How to use the Chatbot

- Navigate to the "Try Movie Chatbot" page from the landing page.
- Type your movie preferences (e.g., "Suggest a Bollywood comedy," "Hollywood action movies") into the input field.
- The chatbot will provide real-time suggestions.

## Technical Details

- **Framework**: React with Vite
- **Blockchain**: Ethereum Sepolia Testnet
- **Wallet**: MetaMask integration via ethers.js
│   └── ConfirmationPage.jsx  # Transaction confirmation page
- **AI Chatbot**: OpenAI (ChatGPT) API with `gpt-4o-mini`
- **Payment Mechanism**: Standard Ethereum transactions (Yellow Network integration is intended but currently uses fallback due to unconfigured contracts)
- **Rate**: 0.0001 Sepolia ETH per second

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx       # Wallet connection page
│   ├── VideoPlayerPage.jsx   # Video player with billing counter
│   ├── PaymentPage.jsx       # Payment processing page
│   ├── ConfirmationPage.jsx  # Transaction confirmation page
│   └── ChatbotPage.jsx       # AI Movie Suggestion Chatbot page
├── services/
│   ├── nitrolite.js          # Yellow Network (Nitrolite) SDK integration (currently in fallback mode)
│   └── chatbot.js            # OpenAI API integration for chatbot
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

### Important Notes:
- The `src/services/nitrolite.js` file contains the logic for Nitrolite initialization. If you wish to enable full Nitrolite functionality, you will need to deploy the required `Custody.sol` and `Adjudicator.sol` contracts and update their addresses in the `initializeNitrolite` function.
- Detailed deployment instructions can be found in `DEPLOYMENT_GUIDE.md`.

## License

MIT

