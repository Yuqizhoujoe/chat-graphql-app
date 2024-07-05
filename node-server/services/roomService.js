import Room from "../models/room.js";
import { getUserByUsername } from "./userService.js";

export const getRoomById = async (roomId) => {
  const room = await Room.findOne({ roomId });
  if (room) {
    room.messages.sort((a, b) => a.timestamp - b.timestamp);
  }
  return room;
};

export const getAllRooms = async () => {
  const rooms = await Room.find();
  return rooms;
};

export const createNewRoom = async ({ title, description, pictureLink }) => {
  const room = new Room({
    title,
    description,
    picture: pictureLink,
  });

  const savedRoom = await room.save();

  return savedRoom;
};

export const saveMessage = async (
  roomId,
  { timestamp, username, avatar, content }
) => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw Error(`ROOM_NOT_FOUND: ${roomId}`);
  }

  const message = {
    timestamp,
    username,
    avatar,
    content,
  };

  room.messages.push(message);

  await room.save();
};

export const addUserToRoom = async ({ room, username }) => {
  console.log("ROOM_SERVICES_ADD_USER_TO_ROOM: ", { room, username });
  // find user
  const user = await getUserByUsername(username);
  // add user to the room
  const users = room.users || [];
  if (!users.length || users.some((user) => user.username !== username)) {
    room.users.push({ username: user.username, avatar: user.avatar });
  }
  console.log("ROOM_SERVICE_ADD_USER_TO_ROOM: ", room);
  const result = await room.save();
  return { user, room: result };
};
