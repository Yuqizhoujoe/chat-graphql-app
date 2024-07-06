import React, { useRef, useState } from "react";

import "../styles/RoomCreation.css";

const RoomCreation = ({ createRoom }) => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [picture, setPicture] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const onCreateRoom = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("picture", picture);

    try {
      await createRoom(formData);

      setTitle("");
      setDesc("");
      setPicture(null);
      fileInputRef.current.value = null;
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
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button onClick={onCreateRoom}>Create Room</button>
    </div>
  );
};

export default RoomCreation;
