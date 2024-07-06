import axios from "./axios.js";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const MESSAGE_ADDED = "MESSAGE_ADDED";

const resolvers = {
  Query: {
    _: () => true,
  },

  Mutation: {
    // TODO: custom error handler for graphql
    joinRoom: async (_, { roomId, username }) => {
      const response = await axios.get(`/rooms/${roomId}/${username}`);
      const { room, user } = response.data || {};

      const message = {
        timestamp: new Date().toISOString(),
        username: user.username,
        avatar: user.avatar,
        content: `${user.username} joined the room`,
      };

      // console.log("JOIN_ROOM_GRAPHQL_SERVER: ", { message, room, user });

      pubsub.publish(`${MESSAGE_ADDED}_${roomId}`, { messageAdded: message });

      return { room, user };
    },
    sendMessage: async (_, { roomId, message }) => {
      const messageData = {
        ...message,
        timestamp: new Date().toISOString(),
      };
      // add message to the room
      const response = await axios.post("/chats/send-message", {
        roomId,
        message: messageData,
      });
      console.log(
        "GRAPHQL_SERVER_SEND_MESSAGE_RESPONSE: ",
        response && response.data
      );

      pubsub.publish(`${MESSAGE_ADDED}_${roomId}`, {
        messageAdded: messageData,
      });

      return { roomId, message: messageData };
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: (_, { roomId }) =>
        pubsub.asyncIterator(`${MESSAGE_ADDED}_${roomId}`),
    },
  },
};

export default resolvers;
