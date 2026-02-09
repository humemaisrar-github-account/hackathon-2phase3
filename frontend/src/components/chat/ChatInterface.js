import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../services/api';

const ChatInterface = ({ userId, onTaskUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message to the chat
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Send message to the backend
      const response = await chatAPI.sendMessage(userId, userMessage);

      // Log the response for debugging
      console.log('Chat response:', response);

      // Add AI response to the chat
      const aiText = response.response || response.message || 'Done.';

       const aiMessage = {
        id: Date.now() + 1,
        text: `${aiText}\n\n🔄 Please refresh the dashboard to see updates.`,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };


      setMessages(prev => [...prev, aiMessage]);

      // Check if the response indicates an operation was performed
      if (response.operation_performed && response.action !== 'general' && response.action !== 'error') {
        // Trigger dashboard refresh to show updated tasks immediately
        // Use multiple approaches to ensure dashboard updates
        
        // Method 1: Direct callback if available (most reliable)
        if (onTaskUpdate) {
          setTimeout(() => {
            onTaskUpdate();
          }, 100); // Minimal delay to ensure DB operations complete
        }
        
        // Method 2: Direct window function call
        setTimeout(() => {
          if (window.updateDashboard && typeof window.updateDashboard === 'function') {
            window.updateDashboard();
          }
        }, 150);
        
        // Method 3: Custom event dispatching
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('taskUpdated', { 
            detail: response,
            bubbles: true,
            cancelable: true
          }));
        }, 200);
        
        // Method 4: Force a global refresh signal
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('forceDashboardRefresh'));
        }, 250);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to the chat
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.detail || error.response?.data?.message || 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString()
   };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex-grow">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Hello! I'm your AI Todo Assistant.</p>
            <p className="mt-2">Try saying:</p>
            <ul className="mt-2 text-sm space-y-1">
              <li>"Add a task to buy groceries"</li>
              <li>"Show me my pending tasks"</li>
              <li>"Mark task 1 as complete"</li>
              <li>"Delete the meeting task"</li>
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="border-t p-4 flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white px-6 py-2 rounded-r-lg ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={isLoading || !inputValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
