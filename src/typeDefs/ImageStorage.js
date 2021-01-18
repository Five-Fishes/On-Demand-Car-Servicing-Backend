import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    imageStorages(filter: String!): [ImageStorage!]!
    imageStorage(id: String!): ImageStorage!
  }

  extend type Mutation {
    createImageStorage(imageStorageInput: ImageStorageInput!): ImageStorage!
    updateImageStorage(imageStorageInput: ImageStorageInput!): ImageStorage!
  }

  type ImageStorage {
    id: ID!
    imageSize: String!
    imageURL: String!
    imageFileNm: String!
    imageType: String!
  }

  input ImageStorageInput {
    id: ID!
    imageSize: String!
    imageURL: String!
    imageFileNm: String!
    imageType: String!
  }
`;
