import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MessageSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
      index: true,
      primaryKey: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
    users: [userSchema],
  },
  { id: false }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
