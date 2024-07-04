import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../apis/axios";

import "../styles/ChatRoom.css"; // Import the CSS file
import { useAppContext } from "../shared/context";
import useSocket from "../shared/useSocket";

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({});

  // WebSocket Hook
  const { socket, connected } = useSocket("http://localhost:8000");

  // Context
  const { user } = useAppContext();

  // joinRoom
  useEffect(() => {
    if (user && socket) {
      const data = {
        roomId: roomId,
        timestamp: new Date().toISOString(),
        user: user,
      };
      console.log("JOIN_ROOM: ", data);
      socket.emit("joinRoom", data);
    }
  }, [user, socket]);

  // listen to message event
  useEffect(() => {
    if (socket && connected) {
      socket.on("message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket, connected]);

  // fetch room
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/rooms/${roomId}`);
        const roomData = response.data || {};

        if (roomData) {
          setRoom(roomData);
          if (roomData.messages.length) {
            setMessages(roomData.messages);
          }
        }
      } catch (error) {
        console.error("Error fetching room: ", error);
        navigate("/");
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  // handle new message
  const sendMessage = () => {
    console.log(socket, connected, user, message);
    if (socket && connected && user && message) {
      const data = {
        roomId: roomId,
        message: {
          content: message,
          username: user.username,
          avatar: user.avatar,
          timestamp: new Date().toISOString(),
        },
      };

      console.log("SEND_MESSAGE: ", data);
      socket.emit("message", data);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage(event);
    }
  };

  const handleSendMessage = (event) => {
    if (event) event.preventDefault();
    // sendMessage(room, user, message);
    sendMessage();
    setMessage("");
  };

  return (
    <div className="chat-room-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <img
              src={`http://127.0.0.1:8000${message.avatar}`}
              alt={`${message.username} avatar`}
              className="avatar"
            />
            <div className="message-content">
              <strong>{message.username}: </strong> {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
