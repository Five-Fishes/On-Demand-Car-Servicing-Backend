import { gql } from "apollo-server-express";

export default gql`

  extend type Query {
    audioStorages(filter: String!): [AudioStorage!]!
    audioStorage(id: ID!): AudioStorage!
    audioUploads: [AudioStorage]
  }

  extend type Mutation {
    createAudioStorage(audioStorageInput: AudioStorageInput!): AudioStorage!
    updateAudioStorage(audioStorageInput: AudioStorageInput!): AudioStorage!
    deleteAudioStorage(id: String!): AudioStorage!
    uploadAudioStorage(audioStorage: Upload!): AudioStorage!
  }

  input AudioStorageInput {
    id: ID
    """ audio Content should be Buffer """
    audioContent: [Int!] 
    audioURL: String!
    audioType: String!
    audioLength: Float
    """ upload File properties """
    mimetype: String!
    encoding: String!
  }

  type AudioStorage {
    id: ID
    """ should be Buffer """
    audioContent:[Int!] 
    audioURL: String!
    audioType: String!
    audioLength: Float
    """ upload File properties """
    mimetype: String!
    encoding: String!
  }

`;
