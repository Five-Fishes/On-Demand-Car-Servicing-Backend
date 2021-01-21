import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getMessages(filter: String): [Message!]!
    getMessage(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(messageInput: MessageInput!): Message!
    deleteMessage(id: ID!): String!
  }

  enum MessageType {
    TEXT
    AUDIO
    IMAGE
    VIDEO
  }

  type Message {
    id: ID!
    chatID: ID!
    messageType: MessageType!
    messageText: String
    image: MessageImage
    audio: MessageAudio
    video: MessageVideo
    sender: MessageSender
    createdAt: String!
  }

  type MessageVideo {
    videoSize: Float
    videoURL: String
    videoFileNm: String
    videoType: String
  }

  type MessageImage {
    imageSize: Float
    imageURL: String
    imageFileNm: String
    imageType: String
  }

  type MessageAudio {
    audioContent: [Int!]
    audioURL: String
    audioType: String
    audioLength: Float
  }

  type MessageSender {
    id: ID!
    type: String!
    firstName: String!
    lastName: String!
  }

  input AudioStorageInput {
    id: ID
    audioContent: [Int!]!
    audioURL: String!
    audioType: String!
    audioLength: Float!
  }

  input MessageInput {
    id: ID
    chatID: ID!
    messageType: MessageType!
    messageText: String
    image: ImageStorageInput
    audio: AudioStorageInput
    video: VideoStorageInput
  }
`