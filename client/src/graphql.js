import { gql } from "@apollo/client";

export const JOIN_ROOM_MUTATION = gql`
  mutation JoinRoom($roomId: ID!, $username: String!) {
    joinRoom(roomId: $roomId, username: $username) {
      room {
        roomId
        title
        description
        picture
        messages {
          timestamp
          username
          avatar
          content
        }
        users {
          username
          avatar
        }
      }
      user {
        username
        avatar
      }
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($roomId: ID!, $message: MessageInput!) {
    sendMessage(roomId: $roomId, message: $message) {
      roomId
      message {
        timestamp
        username
        avatar
        content
      }
    }
  }
`;

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription OnMessageAdded($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      timestamp
      username
      avatar
      content
    }
  }
`;
