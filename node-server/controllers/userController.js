import express from "express";

// services
import {
  getUserByUsername,
  searchUserByUsername,
  getAllUsers,
  saveUser,
} from "../services/userService.js";

const router = express.Router();

const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "user not found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("USER_CONTROLLER_GET_USER_ERROR: ", error);
    return res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("USER_CONTROLLER_GET_ALL_USERS_ERROR: ", error);
    return res.status(500).json({ error: error.message });
  }
};

const searchUser = async (req, res) => {
  try {
    const { q: query } = req.query;
    const results = await searchUserByUsername(query);
    return res.status(200).json(results);
  } catch (error) {
    console.error("USER_CONTROLLER_SEARCH_USER_ERROR: ", error);
    return res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username } = req.body;
    const avatarLink = req.file ? `/users/${req.file.filename}` : "";
    const user = await saveUser(username, avatarLink);
    return res.status(200).json(user);
  } catch (error) {
    console.error("USER_CONTROLLER_CREATE_USER_ERROR: ", error);
    return res.staus(500).json({ error: error.message });
  }
};

router.get("/", getUsers);
router.get("/search-users", searchUser);
router.get("/:username", getUser);

router.post("/create-user", createUser);

export default router;
