import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    VideoStorages(filter: String!): [VideoStorage!]!
    VideoStorage(id: String!): VideoStorage!
  }

  extend type Mutation {
    createVideoStorage(videoStorageInput: VideoStorageInput!): VideoStorage!
    updateVideoStorage(videoStorageInput: VideoStorageInput!): VideoStorage!
  }

  type VideoStorage {
    id: ID!
    videoSize: String!
    videoURL: String!
    videoFileNm: String!
    videoType: String!
  }

  input VideoStorageInput {
    id: ID!
    videoSize: String!
    videoURL: String!
    videoFileNm: String!
    videoType: String!
  }
`;
