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
    sender: User!
  }

  # type ImageStorage {
  #   id: ID!
  #   imageSize: Float!
  #   imageURL: String!
  #   imageFileNm: String!
  #   imageType: String!
  # }

  # type VideoStorage {
  #   id: ID!
  #   videoSize: Float!
  #   videoURL: String!
  #   videoFileNm: String!
  #   videoType: String!
  # }

  type AudioStorage {
    id: ID!
    audioContent: [Int!]!
    audioURL: String!
    audioType: String!
    audioLength: Float!
  }

  # type User {
  #   id: ID!
  #   type: String!
  #   firstName: String!
  #   lastName: String!
  # }

  input MessageInput {
    id: ID!
    chatId: Int!
    messageType: String!
    messageText: String!
    imageID: Int!
    audioID: Int!
    videoID: Int!
    senderID: Int!
  }
`