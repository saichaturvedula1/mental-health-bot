import React, { useState, useRef, useEffect } from "react";
import './App.css'; // Import the external CSS file for styling

function ChatApp() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
      if (!input.trim()) {
          alert("Please type a message.");
          return;
      }
  
      const newMessage = { user: input, bot: null };
      setMessages([...messages, newMessage]);
      setInput('');
  
      try {
          const response = await fetch("http://127.0.0.1:5000/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ input }),
          });
  
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1].bot = data.response;
              return updatedMessages;
          });
      } catch (error) {
          alert("Something went wrong, please try again later.");
      }
  };
  

    const chatBoxRef = useRef(null);
useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
}, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className="message-container">
                        {msg.user && (
                            <div className="message user-message">{msg.user}</div>
                        )}
                        {msg.bot && (
                            <div className="message bot-message">{msg.bot}</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatApp;
