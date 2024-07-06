import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../apis/axios";

import "../styles/ChatRoom.css"; // Import the CSS file

// import useSocket from "../shared/useSocket";
import UserPanel from "./UserPanel";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../state/actions";
import { useMutation, useSubscription } from "@apollo/client";
import {
  JOIN_ROOM_MUTATION,
  MESSAGE_ADDED_SUBSCRIPTION,
  SEND_MESSAGE_MUTATION,
} from "../graphql";

const ChatRoom = () => {
  const { roomId, username } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({});

  // WebSocket Hook
  // const { socket, connected } = useSocket("http://localhost:8000");

  /*
  // joinRoom
  useEffect(() => {
    if (user && socket) {
      const data = {
        roomId: roomId,
        timestamp: new Date().toISOString(),
        user: user,
      };
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
  */

  // GraphQL WebSocket Streaming
  const [joinRoom] = useMutation(JOIN_ROOM_MUTATION);
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
  useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { roomId },
    onData: (response) => {
      const { messageAdded } = response.data.data || {};
      if (messageAdded) {
        setMessages((prevMessages) => [...prevMessages, messageAdded]);
      }
    },
    onError: (error) => console.error("GRAPHQL_SUBSCRIPTION_ERROR: ", error),
  });

  // Context
  // const { user } = useAppContext();

  // User Reducer
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // join room
  useEffect(() => {
    const existedUser =
      room.users &&
      room.users.length &&
      room.users.find((u) => u.username === user.username);

    if (user && !existedUser && room && room.roomId) {
      joinRoom({
        variables: {
          roomId,
          timestamp: new Date().toISOString(),
          user: {
            username: user.username,
            avatar: user.avatar,
          },
        },
      });
    }
  }, [user, roomId, room]);

  // fetch room
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/rooms/${roomId}/${username}`);
        const { room: roomData, user: userData } = response.data || {};

        if (roomData) {
          setRoom(roomData);
          dispatch(setUser(userData));
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
  }, [roomId, username, navigate]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage(event);
    }
  };

  const handleSendMessage = (event) => {
    if (event) event.preventDefault();
    // sendMessage(room, user, message);
    sendMessage({
      variables: {
        roomId,
        message: {
          timestamp: new Date().toISOString(),
          username: user.username,
          avatar: user.avatar,
          content: message,
        },
      },
    });
    setMessage("");
  };

  const renderUserAndMessages = () => {
    return (
      <div className="chat-room-user-messages-container">
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
        <UserPanel users={room.users} />
      </div>
    );
  };

  const renderMessageInput = () => {
    return (
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
    );
  };

  return (
    <div className="chat-room-container">
      {renderUserAndMessages()}
      {renderMessageInput()}
    </div>
  );
};

export default ChatRoom;
