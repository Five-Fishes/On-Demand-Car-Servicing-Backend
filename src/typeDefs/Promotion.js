import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    promotions(filter: String!): [Promotion!]!
    promotion(id: String): Promotion!
  }

  extend type Mutation {
    createPromotion(promotionInput: PromotionInput!): Promotion!
    updatePromotion(promotionInput: PromotionInput!): Promotion!
    deletePromotion(id: String!): Promotion!
  }

  type Promotion {
    id: ID!
    promotionNm: String!
    promotionStart: Date!
    promotionEnd: Date!
    image: ImageStorage!
    serivces: [Service!]!
    branches: [Branch!]!
    promoCode: String!
    discountAm: Float!
  }

  # type ImageStorage {
  #   id: ID!
  #   imageSize: Float!
  #   imageURL: String!
  #   imageFileNm: String!
  #   imageType: String!
  # }

  type Branch {
    id: ID!
    branchAddr: String!
    branchContactNo: String!
  }

  input BranchInput {
    branchAddr: String!
    branchContactNo: String!
  }

  # type Service {
  #   id: ID!
  #   serviceNm: String!
  #   isDispatchAvailable: Boolean!
  #   isInHouseAvailable: Boolean!
  #   estimatedServiceTime: Float!
  # }

  input PromotionInput {
    id: ID!
    promotionNm: String!
    promotionStart: Date!
    promotionEnd: Date!
    image: ImageStorageInput!
    serivces: [ServiceInput!]!
    branches: [BranchInput!]!
    promoCode: String!
    discountAm: Float!
  }
`