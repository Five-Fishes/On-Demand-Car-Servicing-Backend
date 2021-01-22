import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    videoStorages(filter: String!): [VideoStorage!]!
    videoStorage(id: String!): VideoStorage!
  }

  extend type Mutation {
    createVideoStorage(videoStorageInput: VideoStorageInput!): VideoStorage!
    updateVideoStorage(videoStorageInput: VideoStorageInput!): VideoStorage!
  }

  type VideoStorage {
    id: ID!
    videoSize: Float!
    videoURL: String!
    videoFileNm: String!
    videoType: String!
  }

  input VideoStorageInput {
    id: ID
    videoSize: Float!
    videoURL: String!
    videoFileNm: String!
    videoType: String!
  }
`;
