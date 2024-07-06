import React, { useEffect, useState } from "react";
import RoomCreation from "./RoomCreation";
import axios from "../apis/axios";
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";

const Home = () => {
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // fetch inital rooms from server if necessary
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, []);

  const navigateToRoom = (roomId) => {
    navigate(`/room-entry/${roomId}`);
  };

  const onCreateRoom = async (formData) => {
    try {
      const response = await axios.post("/rooms/create-room", formData);
      if (response && response.data) {
        setRooms((prevRooms) => [...prevRooms, response.data]);
      }
    } catch (error) {
      console.error("ON_CREATE_ROOM_HOME_PAGE_ERROR: ", error);
    }
  };

  const renderRoom = (room) => {
    return (
      <div key={room.roomId} className="room-card">
        <div className="room-picture">
          <img src={`http://127.0.0.1:8000${room.picture}`} alt={room.title} />
        </div>
        <div className="room-info">
          <h3>{room.title}</h3>
          <p>{room.description}</p>
          <button onClick={() => navigateToRoom(room.roomId)}>
            Enter Room
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">
      <h1>Chat rooms</h1>
      <RoomCreation createRoom={onCreateRoom} />
      <div className="grid-container">
        {rooms.map((room) => renderRoom(room))}
      </div>
    </div>
  );
};

export default Home;
