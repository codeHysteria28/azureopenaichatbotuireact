import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { FaRobot } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

import './App.css';

function App() {
  const lastMessageRef = useRef();
  const [aiMessage, setAiMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: aiMessage }]);
    setAiMessage("");

    axios({
        method: 'post',
        url: 'http://localhost:7071/api/enhanceText',
        data: {aiMessage},
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: res.data }]);
    });
}

  useEffect(() => {
    if(lastMessageRef.current){
      lastMessageRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [messages])

  return (
      <div className='aiInterfaceVisible'>
          <div className="chat">
              <div className="assistaneChatMessage">
                  <FaRobot className="messageAiIcon"/>
                  Hello I'm your assistant. How can I help you today ?
              </div>
              {/* {
                  messages.map((message, index) => {
                      return (
                          <div key={index} ref={index === messages.length -1 ? lastMessageRef : null} className={message.sender === 'user' ? 'chatMessage' : 'assistaneChatMessage'}>
                              {message.sender === 'user' ? <FaUser className="messageAiIcon"/> : <FaRobot className="messageAiIcon"/>}
                              {message.text}
                          </div>
                      )
                  })
              } */}
          </div>
          <div className="userPromtArea">
              <textarea 
                  className="userInput" 
                  value={aiMessage} 
                  placeholder="Type your message here..." 
                  onChange={e => setAiMessage(e.target.value)} 
                  onKeyDown={e => { if (e.key === "Enter" && aiMessage.trim() !== ""){ e.preventDefault(); sendMessage(); } }}></textarea>
              <Button className="primary sendChat" onClick={sendMessage}><IoSend className="sendIcon"/></Button>
          </div>
      </div>
  );
}

export default App;
