import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    _: Boolean
  }

  input UserInput {
    username: String!
    avatar: String!
  }

  input MessageInput {
    timestamp: String!
    username: String!
    avatar: String!
    content: String!
  }

  type Mutation {
    joinRoom(roomId: ID!, timestamp: String!, user: UserInput!): RoomResponse
    sendMessage(roomId: ID!, message: MessageInput!): RoomResponse
  }

  type Subscription {
    messageAdded(roomId: ID!): Message
  }

  type Message {
    timestamp: String!
    username: String!
    avatar: String!
    content: String!
  }

  type User {
    username: String!
    avatar: String!
  }

  type RoomResponse {
    roomId: ID!
    message: Message
  }
`;

export default typeDefs;
