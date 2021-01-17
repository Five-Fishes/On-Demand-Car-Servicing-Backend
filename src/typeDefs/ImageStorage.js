import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getImageStorages(filter: String): [ImageStorage!]!
    getImageStorage(id: String!): ImageStorage!
  }

  extend type Mutation {
    createImageStorage(imageStorageInput: ImageStorageInput!): ImageStorage!
    updateImageStorage(imageStorageInput: ImageStorageInput!): ImageStorage!
  }

  type ImageStorage {
    id: ID!
    imageSize: Float!
    imageURL: String!
    imageFileNm: String!
    imageType: String!
  }

  input ImageStorageInput {
    id: ID!
    imageSize: Float!
    imageURL: String!
    imageFileNm: String!
    imageType: String!
  }
`