import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { initializeNitrolite, depositFunds, createChannel, closeChannel, getAccountInfo } from '../services/nitrolite'
import './PaymentPage.css'

function PaymentPage() {
  const [timeWatched, setTimeWatched] = useState(0)
  const [amount, setAmount] = useState(0)
  const [creatorAddress, setCreatorAddress] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUsingNitrolite, setIsUsingNitrolite] = useState(false) // Start with false since contracts aren't configured
  const navigate = useNavigate()

  useEffect(() => {
    // Retrieve session data
    const watched = sessionStorage.getItem('timeWatched')
    const amt = sessionStorage.getItem('amount')
    const creator = sessionStorage.getItem('creatorAddress')
    const walletAddress = sessionStorage.getItem('walletAddress')
    const nitroliteStatus = sessionStorage.getItem('nitroliteClient')

    if (!watched || !amt || !creator || !walletAddress) {
      navigate('/')
      return
    }

    setTimeWatched(parseInt(watched))
    setAmount(parseFloat(amt))
    setCreatorAddress(creator)
    
    // Check if Nitrolite is available
    try {
      const nitroliteData = JSON.parse(nitroliteStatus || '{}')
      if (nitroliteData.initialized === true) {
        setIsUsingNitrolite(true)
        console.log('Nitrolite is available for payments')
      } else {
        setIsUsingNitrolite(false)
        console.log('Nitrolite not available, using standard transactions:', nitroliteData.reason || 'Unknown')
      }
    } catch (error) {
      setIsUsingNitrolite(false)
      console.log('Error parsing Nitrolite status, using standard transactions')
    }
  }, [navigate])

  const handlePayment = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask')
      return
    }

    try {
      setIsProcessing(true)

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      let txHash = ''
      let paymentMethod = ''

      if (isUsingNitrolite) {
        // Use Nitrolite/Yellow Network for off-chain payment
        try {
          console.log('Processing payment via Nitrolite (Yellow Network)...')
          
          // Initialize Nitrolite client
          const nitroliteClient = await initializeNitrolite(provider, signer)
          
          // Deposit funds into custody contract
          const depositTxHash = await depositFunds(nitroliteClient, amount)
          console.log('Funds deposited:', depositTxHash)
          
          // Create state channel
          const channelResult = await createChannel(nitroliteClient, creatorAddress, ethers.parseEther(amount.toString()))
          console.log('Channel created:', channelResult.channelId)
          
          // For now, we'll simulate the payment by immediately closing the channel
          // In a real implementation, you'd have off-chain state updates
          const finalAllocations = [
            { destination: creatorAddress, token: '0x0000000000000000000000000000000000000000', amount: ethers.parseEther(amount.toString()) },
            { destination: userAddress, token: '0x0000000000000000000000000000000000000000', amount: 0n }
          ]
          
          const closeTxHash = await closeChannel(nitroliteClient, channelResult.channelId, finalAllocations)
          console.log('Channel closed:', closeTxHash)
          
          txHash = closeTxHash
          paymentMethod = 'Nitrolite (State Channel)'
          
        } catch (nitroliteError) {
          console.error('Nitrolite payment failed, falling back to on-chain:', nitroliteError)
          // Fall back to on-chain payment
          setIsUsingNitrolite(false)
        }
      }

      // Fallback: Standard on-chain transaction
      if (!txHash) {
        console.log('Processing payment via standard on-chain transaction...')
        console.log('Payment details:', { amount, creatorAddress, userAddress })
        
        // Convert amount to wei
        //const amountInWei = ethers.parseEther(amount.toString())
        //console.log('Amount in wei:', amountInWei.toString())
        // Round to 5 decimal places to avoid floating-point precision errors
        const roundedAmount = parseFloat(amount.toFixed(5))
        console.log('Rounded amount:', roundedAmount)

        const amountInWei = ethers.parseEther(roundedAmount.toString())
        // Create transaction
        const tx = {
          to: creatorAddress,
          value: amountInWei
        }
        console.log('Transaction object:', tx)

        // Send transaction
        const transaction = await signer.sendTransaction(tx)
        console.log('Transaction submitted:', transaction.hash)
        
        // Wait for transaction confirmation
        const receipt = await transaction.wait()
        console.log('Transaction confirmed:', transaction.hash)

        txHash = transaction.hash
        paymentMethod = 'On-Chain (Ethereum)'
        console.log('Final txHash:', txHash)
      }

      // Validate transaction hash before storing
      if (!txHash) {
        throw new Error('Transaction failed - no transaction hash received')
      }

      // Store transaction details
      console.log('Storing session data:', {
        transactionHash: txHash,
        userAddress: userAddress,
        finalTimeWatched: timeWatched.toString(),
        finalAmount: amount.toString(),
        paymentMethod: paymentMethod
      })
      
      sessionStorage.setItem('transactionHash', txHash)
      sessionStorage.setItem('userAddress', userAddress)
      sessionStorage.setItem('finalTimeWatched', timeWatched.toString())
      sessionStorage.setItem('finalAmount', amount.toString())
      sessionStorage.setItem('paymentMethod', paymentMethod)

      // Navigate to confirmation page
      navigate('/confirmation')
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatAmount = (amount) => {
    return amount.toFixed(6)
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="payment-title" style={{ gridColumn: '1 / -1' }}>Payment Details</h1>
        
        <div className="payment-content">
          <div className="payment-info">
            <div className="info-row">
              <span className="label">Time Watched:</span>
              <span className="value">{formatTime(timeWatched)}</span>
            </div>
            <div className="info-row">
              <span className="label">Amount Due:</span>
              <span className="value amount-highlight">{formatAmount(amount)} ETH</span>
            </div>
            <div className="info-row">
              <span className="label">Creator Address:</span>
              <span className="value address">{creatorAddress}</span>
            </div>
          </div>

        </div>

        <div className="button-section">
          <button 
            className="pay-button" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : 'Pay Now'}
          </button>

          <button 
            className="back-button" 
            onClick={() => navigate('/video')}
            disabled={isProcessing}
          >
            Back to Video
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

