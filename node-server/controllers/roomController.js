import express from "express";

// services
import {
  getRoomById,
  getAllRooms,
  createNewRoom,
  addUserToRoom,
} from "../services/roomService.js";

const router = express.Router();

const getRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    console.log("ROOM_CONTROLLER_GET_ROOMS_ERROR: ", error);
    res.status(500).json({ error: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const { roomId, username } = req.params;
    console.log("ROOM_CONTROLLER_GET_ROOM: ", { roomId, username });

    const room = await getRoomById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not exist!" });
    }

    // add user to room
    const { user, room: updatedRoom } = await addUserToRoom({ room, username });

    console.log("ROOM_CONTROLLER_GET_ROOM_RESULT: ", { updatedRoom, user });

    return res.status(200).json({ room: updatedRoom, user });
  } catch (error) {
    console.log("ROOM_CONTROLLER_GET_ROOM_ERROR: ", error);
    return res.status(500).json({ error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { title, description } = req.body;
    const pictureLink = req.file ? `/rooms/${req.file.filename}` : "";
    const room = await createNewRoom({ title, description, pictureLink });
    return res.status(200).json(room);
  } catch (error) {
    console.error("ROOM_CONTROLLER_CREATE_ROOM_ERROR: ", error);
    return res.status(500).json({ error: error.message });
  }
};

router.get("/", getRooms);
router.get("/:roomId/:username", getRoom);
router.post("/create-room", createRoom);

export default router;
