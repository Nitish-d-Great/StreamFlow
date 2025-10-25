import React, { useState, useEffect, useRef } from 'react'
import './ChatbotPage.css'
import { getMovieSuggestions } from '../services/chatbot'

function ChatbotPage() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm here to help you find some great movies. What kind of movies are you in the mood for? Hollywood or Bollywood?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatWindowRef = useRef(null)

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newUserMessage = { type: 'user', text: input }
      setMessages(prev => [...prev, newUserMessage])
      setInput('')
      setIsLoading(true)

      try {
        const botResponse = await getMovieSuggestions(input)
        setMessages(prev => [...prev, { type: 'bot', text: botResponse }])
      } catch (error) {
        console.error('Error fetching AI response:', error)
        setMessages(prev => [...prev, { type: 'bot', text: "Oops! Something went wrong. Please try again later." }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <h1 className="chatbot-title">Movie Suggestion Chatbot</h1>
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot loading-message">
              <span>.</span><span>.</span><span>.</span>
            </div>
          )}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder={isLoading ? 'Thinking...' : 'Ask me for movie suggestions...'}
            className="chat-input"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="send-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotPage
