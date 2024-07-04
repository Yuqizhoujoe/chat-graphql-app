import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { setRoom, setUser } from "../state/actions";

// const socket = io("http://127.0.0.1:5000");

const useSocket = (url, options) => {
  // const location = useLocation();
  // const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(url, options);

    socketInstance.on("connect", () => {
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url, options]);

  return {
    socket,
    connected,
  };

  // // redux
  // const dispatch = useDispatch();
  // const room = useSelector((state) => state.room.room);
  // const user = useSelector((state) => state.user.user);

  // const init = (roomData, userData) => {
  //   if (!userData || !roomData) {
  //     console.error("useSocket Error init: No user or room!");
  //     return navigate("/");
  //   }

  //   // setRoom(roomData);
  //   // setUser(userData);
  //   dispatch(setUser(userData));
  //   dispatch(setRoom(roomData));
  // };

  // const joinRoom = useCallback(() => {
  //   console.log("useSocket Join Room", { user, room });
  //   if (user && room && room.room_id) {
  //     socket.emit("join", {
  //       room_id: room.room_id,
  //       username: user.username,
  //       avatar: user.avatar,
  //     });
  //   }
  // }, [user, room]);

  // const leaveRoom = useCallback(() => {
  //   console.log("useSocket Leave Room", { user, room });
  //   if (user && room && room.room_id) {
  //     socket.emit("leave", {
  //       room_id: room.room_id,
  //       username: user.username,
  //       avatar: user.avatar,
  //     });
  //     dispatch(setRoom(null));
  //   }
  // }, [user, room]);

  // const sendMessage = (roomData, userData, message) => {
  //   console.log("useSocket Send Message: ", roomData, userData, message);

  //   if (message) {
  //     socket.emit("message", {
  //       room_id: roomData.room_id,
  //       message,
  //       username: userData.username,
  //       avatar: userData.avatar,
  //     });
  //   }
  // };

  // const handleError = () => {
  //   socket.on("error", (error) => {
  //     console.error("WebSocket ChatRoom Error: ", error);
  //     leaveRoom();
  //     navigate("/"); // Redirect to the home page or handle the error appropriately
  //   });
  // };

  // const handleNewMessages = (cb) => {
  //   socket.on("message", (message) => {
  //     cb(message);
  //   });
  // };

  // useEffect(() => {
  //   joinRoom();

  //   return () => leaveRoom();
  // }, [user, room]);

  // useEffect(() => {
  //   handleError();
  // }, []);
};

export default useSocket;
