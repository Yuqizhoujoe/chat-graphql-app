import express from "express";

// services
import {
  getRoomById,
  getAllRooms,
  createNewRoom,
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
    const { roomId } = req.params;
    const room = await getRoomById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not exist!" });
    }
    return res.status(200).json(room);
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
router.get("/:roomId", getRoom);
router.post("/create-room", createRoom);

export default router;
