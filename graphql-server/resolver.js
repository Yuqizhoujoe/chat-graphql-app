import axios from "axios";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const MESSAGE_ADDED = "MESSAGE_ADDED";

const resolvers = {
  Query: {
    _: () => true,
  },

  Mutation: {
    joinRoom: async (_, { roomId, timestamp, user }) => {
      const message = {
        timestamp,
        username: user.username,
        avatar: user.avatar,
        content: `${user.username} joined the room`,
      };

      pubsub.publish(`${MESSAGE_ADDED}_${roomId}`, { messageAdded: message });

      return { roomId, message };
    },
    sendMessage: async (_, { roomId, message }) => {
      // add message to the room
      const response = await axios.post(
        "http://localhost:8000/chats/send-message",
        {
          roomId,
          message,
        }
      );
      console.log(
        "GRAPHQL_SERVER_SEND_MESSAGE_RESPONSE: ",
        response && response.data
      );

      pubsub.publish(`${MESSAGE_ADDED}_${roomId}`, { messageAdded: message });

      return { roomId, message };
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
