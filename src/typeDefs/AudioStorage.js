import { gql } from "apollo-server-express";

export default gql`

  scalar byteArray

  extend type Query {
    audioStorages(filter: String!): [AudioStorage!]!
    audioStorage(id: ID!): AudioStorage!
    audioUploads: [AudioStorage]
  }

  extend type Mutation {
    createAudioStorage(audioStorageInput: AudioStorageInput!): AudioStorage!
    updateAudioStorage(audioStorageInput: AudioStorageInput!): AudioStorage!
    deleteAudioStorage(audioStorageId: String!): AudioStorage!
    uploadAudioStorage(audioStorage: Upload!): AudioStorage!
  }

  input AudioStorageInput {
    id: ID!
    audioContent: byteArray
    audioURL: String!
    audioType: String!
    audioLength: Float
    mimetype: String!
    encoding: String!
  }

  type AudioStorage {
    id: ID!
    audioContent: byteArray
    audioURL: String!
    audioType: String!
    audioLength: Float
    mimetype: String!
    encoding: String!
  }

`;
