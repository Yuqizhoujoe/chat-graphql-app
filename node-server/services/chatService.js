import { saveMessage } from "./roomService.js";

export const joinRoom = ({ roomId, timestamp, user }) => {
  console.log("CHAT_SERVICE_JOIN_ROOM_DATA: ", { roomId, timestamp, user });

  const message = {
    timestamp,
    username: user.username,
    avatar: user.avatar,
    content: `${user.username} joined the room`,
  };

  return { roomId, message };
};

export const sendMessage = async ({ roomId, message }) => {
  console.log("CHAT_SERVICE_SEND_MESSAGE_DATA: ", { roomId, message });
  await saveMessage(roomId, message);
  return { roomId, message };
};
