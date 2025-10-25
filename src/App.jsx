import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import VideoPlayerPage from './pages/VideoPlayerPage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import ChatbotPage from './pages/ChatbotPage' // Import the new ChatbotPage
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/video" element={<VideoPlayerPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} /> {/* Add new route for ChatbotPage */}
      </Routes>
    </Router>
  )
}

export default App

