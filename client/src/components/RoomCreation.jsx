import React, { useState } from "react";
import axios from "../apis/axios";

import "../styles/RoomCreation.css";

const RoomCreation = () => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [picture, setPicture] = useState(null);

  const handleFileChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const createRoom = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("picture", picture);

    try {
      await axios.post("/rooms/create-room", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDesc("");
      setPicture(null);
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  return (
    <div className="room-creation-form">
      <h2>Create a new room</h2>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="Room Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        name="description"
        id="description"
        placeholder="Enter home description..."
        value={description}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        type="file"
        name="picture"
        id="picture"
        onChange={handleFileChange}
      />
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default RoomCreation;
