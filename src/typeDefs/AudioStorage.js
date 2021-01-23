import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    audioStorages(filter: String!): [AudioStorage!]!
    audioStorage(id: ID!): AudioStorage!
  }

  extend type Mutation {
    createAudioStorage(audioStorageInput: AudioStorageInput!): AudioStorage!
    updateAudioStorage(audioStorageInput: AudioStorageInput!): AudioStorage!
    deleteAudioStorage(id: String!): AudioStorage!
  }

  input AudioStorageInput {
    id: ID
    audioURL: String!
    audioType: String!
    audioLength: Float!
  }

  type AudioStorage {
    id: ID!
    audioURL: String!
    audioType: String!
    audioLength: Float!
  }
`;
