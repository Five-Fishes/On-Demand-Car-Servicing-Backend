import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    messages(filter: String!): [Message!]!
    message(id: String): Message!
  }

  extend type Mutation {
    createMessage(messageInput: MessageInput!): Message!
    updateMessage(messageInput: MessageInput!): Message!
    deleteMessage(messageId: String!): Message!
  }

  type Message {
    id: ID!
    chatId: Int!
    messageType: String!
    messageText: String
    image: ImageStorage
    audio: AudioStorage
    video: VideoStorage
    sender: MessageUser!
  }

  type MessageUser {
    id: ID!
    type: String!
    firstName: String!
    lastName: String!
  }

  input MessageInput {
    id: ID!
    chatId: String!
    messageType: String!
    messageText: String!
    imageID: String!
    audioID: String!
    videoID: String!
    senderID: String!
  }
`