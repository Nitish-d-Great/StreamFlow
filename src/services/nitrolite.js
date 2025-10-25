import { NitroliteClient } from '@erc7824/nitrolite'
import { ethers } from 'ethers'

// Initialize Nitrolite Client
export const initializeNitrolite = async (provider, signer) => {
  try {
    // Get user address
    const userAddress = await signer.getAddress()
    
    // Note: Contract addresses need to be obtained from Nitrolite team or deployed
    // For demo purposes, we'll use placeholder addresses
    // In production, deploy Custody.sol and Adjudicator.sol from:
    // https://github.com/erc7824/nitrolite/tree/main/contract
    
    const CUSTODY_ADDRESS = '0x019B65A265EB3363822f2752141b3dF16131b262'
    const ADJUDICATOR_ADDRESS = '0x7c7ccbc98469190849BCC6c926307794fDfB11F2'
    
    if (CUSTODY_ADDRESS === '0x0000000000000000000000000000000000000000' || 
        ADJUDICATOR_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract addresses not configured. Please deploy Custody.sol and Adjudicator.sol from https://github.com/erc7824/nitrolite/tree/main/contract')
    }
    
    // Initialize Nitrolite Client with proper configuration
    const client = new NitroliteClient({
      publicClient: provider,
      walletClient: signer,
      addresses: {
        custody: CUSTODY_ADDRESS,
        adjudicator: ADJUDICATOR_ADDRESS,
        guestAddress: '0x53A50d231569437f969EF1c1Aa034230FD032241', // Will be set dynamically
        tokenAddress: '0x0000000000000000000000000000000000000000' // ETH = zero address
      },
      chainId: 11155111, // Sepolia testnet
      challengeDuration: 100n // Challenge duration in blocks
    })

    return client
  } catch (error) {
    console.error('Error initializing Nitrolite:', error)
    throw error
  }
}

// Create a state channel
export const createChannel = async (client, creatorAddress, depositAmount) => {
  try {
    // Create a new state channel
    const result = await client.createChannel({
      initialAllocationAmounts: [depositAmount, 0n], // [user amount, creator amount]
      stateData: '0x' // Application-specific data (can be encoded video info)
    })

    return result
  } catch (error) {
    console.error('Error creating channel:', error)
    throw error
  }
}

// Deposit funds into custody contract
export const depositFunds = async (client, amount) => {
  try {
    // Convert amount to wei
    const amountInWei = ethers.parseEther(amount.toString())
    
    // Deposit funds into custody contract
    const txHash = await client.deposit(amountInWei)
    
    return txHash
  } catch (error) {
    console.error('Error depositing funds:', error)
    throw error
  }
}

// Close the state channel
export const closeChannel = async (client, channelId, finalAllocations) => {
  try {
    // Close the channel with final state
    const txHash = await client.closeChannel({
      finalState: {
        channelId,
        stateData: '0x', // Final application data
        allocations: finalAllocations,
        version: 1n, // State version
        serverSignature: '0x' // Creator's signature (would need to be obtained)
      }
    })

    return txHash
  } catch (error) {
    console.error('Error closing channel:', error)
    throw error
  }
}

// Get account information
export const getAccountInfo = async (client) => {
  try {
    const accountInfo = await client.getAccountInfo()
    return accountInfo
  } catch (error) {
    console.error('Error getting account info:', error)
    throw error
  }
}

// Get account channels
export const getAccountChannels = async (client) => {
  try {
    const channels = await client.getAccountChannels()
    return channels
  } catch (error) {
    console.error('Error getting account channels:', error)
    throw error
  }
}

