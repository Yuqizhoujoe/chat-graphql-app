import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    _: Boolean
  }

  input MessageInput {
    username: String!
    avatar: String!
    content: String!
  }

  type Mutation {
    joinRoom(roomId: ID!, username: String!): RoomResponse
    sendMessage(roomId: ID!, message: MessageInput!): MessageResponse
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

  type Room {
    roomId: String!
    title: String!
    description: String!
    picture: String!
    messages: [Message]
    users: [User]
  }

  type RoomResponse {
    room: Room!
    user: User!
  }

  type MessageResponse {
    roomId: ID!
    message: Message
  }
`;

export default typeDefs;
