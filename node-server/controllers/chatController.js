import express from "express";
import { sendMessage } from "../services/chatService.js";

const router = express.Router();

const sendMessageController = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const result = await sendMessage({ roomId, message });
    console.log("SEND_MESSAGE_CONTROLLER_RESULT: ", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("SEND_MESSAGE_CONTROLLER_ERROR: ", error);
    return res.status(500).json({ error: error.message });
  }
};

router.post("/send-message", sendMessageController);

export default router;
