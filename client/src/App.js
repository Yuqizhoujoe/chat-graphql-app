import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./components/Home";
import RoomEntry from "./components/RoomEntry";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/room-entry/:roomId" element={<RoomEntry />} />
          <Route path="/chat-room/:roomId/:username" element={<ChatRoom />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
