import User from "../models/user.js";
import { Op } from "sequelize";
/*
    users: {
        username: {username, avatar}
    }
*/

export const getUserByUsername = async (username) => {
  const results = await User.findOne({
    where: {
      username: username,
    },
  });
  return results;
};

export const getAllUsers = async () => {
  const results = await User.findAll();
  return results;
};

export const searchUserByUsername = async (query) => {
  const results = await User.findAll({
    where: {
      username: {
        [Op.iLike]: `%${query}%`,
      },
    },
  });

  return results;
};

export const saveUser = async (username, avatarLink) => {
  const user = {
    username,
    avatar: avatarLink,
  };
  const savedUser = await User.create(user);
  return savedUser;
};
