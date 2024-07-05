import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    joinRoom(roomId: ID!, timestamp: String!, user: User!): RoomResponse
    sendMessage(roomId: ID!, message: Message!): RoomResponse
  }

  type Subscription {
    receiveNewMessage(roomId: ID!): Message
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
