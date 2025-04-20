import { Fab, Webchat } from '@botpress/webchat'
import { useState } from 'react'

function BotpressChat() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)
  
  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState)
  }
  
  return (
    <>
      <Webchat
        clientId="0dfe4add-8a00-4f4e-98ee-01238e0f9266" // Your client ID
        style={{
          width: '400px',
          height: '600px',
          display: isWebchatOpen ? 'flex' : 'none',
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
        }}
      />
      <Fab 
        onClick={() => toggleWebchat()} 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px',
          backgroundColor: '#047857', // Match your site's green color
          zIndex: 1000,
        }} 
      />
    </>
  )
}

export default BotpressChat