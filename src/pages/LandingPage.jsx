import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { initializeNitrolite } from '../services/nitrolite'
import './LandingPage.css'

function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const navigate = useNavigate()

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true)
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        // Create provider
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        
        // Store wallet info in sessionStorage
        sessionStorage.setItem('walletAddress', address)
        
       // In LandingPage.jsx, replace lines 26-31 with:
    try {
      console.log('Attempting to initialize Nitrolite client...')
      const nitroliteClient = await initializeNitrolite(provider, signer)
      sessionStorage.setItem('nitroliteClient', JSON.stringify({
        initialized: true,
      }))
      console.log('Nitrolite client initialized successfully')
    } catch (nitroliteError) {
      console.warn('Nitrolite initialization failed, will use fallback:', nitroliteError)
      sessionStorage.setItem('nitroliteClient', JSON.stringify({
        initialized: false,
        error: nitroliteError.message
      }))
    }

        console.log('Wallet connected successfully (using standard transactions)')
        
        // Navigate to video player
        navigate('/video')
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Failed to connect wallet. Please try again.')
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert('Please install MetaMask to use this application.')
    }
  }

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="title">Movie Streaming dApp</h1>
        <p className="subtitle">Pay as you watch with Yellow Network</p>
        
        <div className="wallet-connect-section">
          <button 
            className="connect-button" 
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
          </button>
          
          {typeof window.ethereum === 'undefined' && (
            <p className="warning">
              MetaMask is not installed. Please install it to continue.
            </p>
          )}
        </div>
        
        <div className="info-section">
          <div className="info-card">
            <h3>Pay Per Second</h3>
            <p>0.0001 Sepolia ETH per second</p>
          </div>
          <div className="info-card">
            <h3>Secure Payments</h3>
            <p>Powered by Yellow Network</p>
          </div>
          <div className="info-card">
            <h3>Blockchain Based</h3>
            <p>Transparent and decentralized</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

