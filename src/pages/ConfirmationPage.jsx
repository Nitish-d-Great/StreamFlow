import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ConfirmationPage.css'

function ConfirmationPage() {
  const [timeWatched, setTimeWatched] = useState(0)
  const [amount, setAmount] = useState(0)
  const [transactionHash, setTransactionHash] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [creatorAddress, setCreatorAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Retrieve transaction details
    const txHash = sessionStorage.getItem('transactionHash')
    const user = sessionStorage.getItem('userAddress')
    const creator = sessionStorage.getItem('creatorAddress')
    const time = sessionStorage.getItem('finalTimeWatched')
    const amt = sessionStorage.getItem('finalAmount')
    const method = sessionStorage.getItem('paymentMethod')

    console.log('Retrieved session data:', { txHash, user, creator, time, amt, method })

    if (!txHash || !user || !creator || !time || !amt) {
      console.log('Missing required data, redirecting to home')
      navigate('/')
      return
    }

    setTransactionHash(txHash)
    setUserAddress(user)
    setCreatorAddress(creator)
    setTimeWatched(parseInt(time))
    setAmount(parseFloat(amt))
    setPaymentMethod(method || 'Payment')
  }, [navigate])

  const handleBackToHome = () => {
    // Clear session data
    sessionStorage.clear()
    navigate('/')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatAmount = (amount) => {
    return amount.toFixed(6)
  }

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Address copied to clipboard!')
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        <h1 className="confirmation-title">Payment Successful!</h1>
        
        <div className="confirmation-info">
          <div className="info-card">
            <div className="card-label">Time Watched</div>
            <div className="card-value">{formatTime(timeWatched)}</div>
          </div>
          
          <div className="info-card">
            <div className="card-label">Amount Paid</div>
            <div className="card-value amount">{formatAmount(amount)} ETH</div>
          </div>
          
          <div className="info-card">
            <div className="card-label">Payment Method</div>
            <div className="card-value">{paymentMethod}</div>
          </div>
          
          <div className="transaction-section">
            <div className="transaction-label">Transaction Hash</div>
            <div className="transaction-hash">
              {transactionHash.startsWith('off-chain') ? (
                <span className="off-chain-hash">{transactionHash}</span>
              ) : (
                <a 
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hash-link"
                >
                  {transactionHash}
                </a>
              )}
            </div>
          </div>
          
          <div className="address-section">
            <div className="address-row">
              <span className="address-label">From:</span>
              <div className="address-container">
                <span className="address-value full-address">{userAddress}</span>
                <button 
                  className="copy-button" 
                  onClick={() => copyToClipboard(userAddress)}
                  title="Copy address"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="address-row">
              <span className="address-label">To:</span>
              <div className="address-container">
                <span className="address-value full-address">{creatorAddress}</span>
                <button 
                  className="copy-button" 
                  onClick={() => copyToClipboard(creatorAddress)}
                  title="Copy address"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>

        <button className="home-button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default ConfirmationPage

