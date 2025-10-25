# Nitrolite Contract Deployment Guide

## Required Contracts

You need **2 main contracts** from the Nitrolite repository:

1. **Custody.sol** - [Source Code](https://github.com/erc7824/nitrolite/blob/main/contract/src/Custody.sol)
   - Manages funds in custody
   - Handles deposits and withdrawals
   - Locks funds for state channels

2. **Adjudicator.sol** - [Source Code](https://github.com/erc7824/nitrolite/tree/main/contract/src)
   - Handles dispute resolution
   - Enforces channel rules
   - Settles disputes

## Contract Repository

All contracts are available at: https://github.com/erc7824/nitrolite/tree/main/contract

## Deployment Steps

### 1. Clone the Repository
```bash
git clone https://github.com/erc7824/nitrolite.git
cd nitrolite/contract
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Network
Update `hardhat.config.js` or your deployment config with Sepolia testnet settings

### 4. Deploy Contracts
```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Get Contract Addresses
After deployment, you'll receive addresses like:
- Custody: `0x1234...`
- Adjudicator: `0x5678...`

### 6. Configure Your dApp
Add these addresses to your `.env` file:
```env
REACT_APP_CUSTODY_ADDRESS=0x...
REACT_APP_ADJUDICATOR_ADDRESS=0x...
```

## Alternative: Check for Pre-Deployed Contracts

The Nitrolite team may have already deployed contracts. Check:
- Nitrolite Discord
- Nitrolite GitHub Issues
- Official documentation

## For Contest Demo

If you can't deploy in time:
1. Use standard Ethereum transactions (already implemented)
2. Mention in demo that contracts need deployment
3. Show the integration code structure
4. Explain the architecture

## Contact for Contract Addresses

- Discord: [Nitrolite Community](https://discord.gg/nitrolite)
- GitHub: https://github.com/erc7824/nitrolite/issues
- Website: https://erc7824.org/

## References

- Contract Source: https://github.com/erc7824/nitrolite/tree/main/contract
- Documentation: https://erc7824.org/
- SDK: https://www.npmjs.com/package/@erc7824/nitrolite


