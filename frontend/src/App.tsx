import React, { useState, useEffect } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { sendMessage, getHistory, type Message } from './api';
import './index.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load session ID from local storage
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      getHistory(storedSessionId)
        .then(setMessages)
        .catch(console.error);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    // Optimistic update
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessage(text, sessionId);
      
      // Update session ID if new
      if (!sessionId && response.sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem('chatSessionId', response.sessionId);
      }

      const aiMsg: Message = { role: 'ai', content: response.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error: Could not reach the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
      localStorage.removeItem('chatSessionId');
      setSessionId(undefined);
      setMessages([]);
  };

  return (
    <div className="app-container">
      <header className="chat-header">
        <h1>Spur Support Agent</h1>
        <button onClick={handleClearChat} className="clear-button">New Chat</button>
      </header>
      <main className="chat-main">
        <ChatWindow messages={messages} isLoading={isLoading} />
      </main>
      <footer className="chat-footer">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
}

export default App;
