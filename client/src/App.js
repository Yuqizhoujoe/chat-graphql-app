import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./components/Home";
import RoomEntry from "./components/RoomEntry";
import ChatRoom from "./components/ChatRoom";
import { AppContextProvider } from "./shared/context";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/room-entry/:roomId" element={<RoomEntry />} />
            <Route path="/chat-room/:roomId" element={<ChatRoom />} />
          </Routes>
        </Router>
      </div>
    </AppContextProvider>
  );
}

export default App;
