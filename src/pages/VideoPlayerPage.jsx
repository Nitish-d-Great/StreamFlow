import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './VideoPlayerPage.css'

function VideoPlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeWatched, setTimeWatched] = useState(0)
  const [amount, setAmount] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef(null)
  const intervalRef = useRef(null)
  const navigate = useNavigate()

  const PRICE_PER_SECOND = 0.0001 // Sepolia tokens per second
  const CREATOR_ADDRESS = '0x53A50d231569437f969EF1c1Aa034230FD032241' // Example creator address

  useEffect(() => {
    // Check if wallet is connected
    const walletAddress = sessionStorage.getItem('walletAddress')
    if (!walletAddress) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeWatched(prev => prev + 1)
        setAmount(prev => (prev + PRICE_PER_SECOND))
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleStopAndSettle = () => {
    // Store session data
    sessionStorage.setItem('timeWatched', timeWatched.toString())
    sessionStorage.setItem('amount', amount.toString())
    sessionStorage.setItem('creatorAddress', CREATOR_ADDRESS)
    
    // Navigate to payment page
    navigate('/payment')
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
    <div className="video-player-page">
      <div className="video-container">
        <div className="video-header">
          <h2 className="video-title">Big Buck Bunny</h2>
          <p className="creator-address">Creator: {CREATOR_ADDRESS}</p>
        </div>
        
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="video-element"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(e) => {
              const video = e.target
              const progress = (video.currentTime / video.duration) * 100
              setVideoProgress(progress)
            }}
          />
          
          <div className="video-controls">
            <button className="play-pause-btn" onClick={handlePlayPause}>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${videoProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="counter-section">
            <div className="counter-card">
              <div className="counter-label">Time Watched</div>
              <div className="counter-value">{formatTime(timeWatched)}</div>
            </div>
            <div className="counter-card">
              <div className="counter-label">Amount Due</div>
              <div className="counter-value">{formatAmount(amount)} ETH</div>
            </div>
          </div>

          <button 
            className="settle-button" 
            onClick={handleStopAndSettle}
            disabled={amount === 0}
          >
            Stop and Settle
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerPage

