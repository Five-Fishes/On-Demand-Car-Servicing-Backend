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
    serivces: [PromotionService!]!
    branches: [PromotionBranch!]!
    promoCode: String!
    discountAm: String!
  }

  type PromotionBranch {
    id: ID!
    branchAddr: String!
    branchContactNo: String!
  }

  type PromotionService {
    id: ID!
    serviceNm: String!
    isDispatchAvailable: Boolean!
    isInHouseAvailable: Boolean!
    estimatedServiceTime: String!
  }

  input PromotionBranchInput {
    id: ID!
    branchAddr: String
    branchContactNo: String
  }

  input PromotionServiceInput {
    id: ID!
    serviceNm: String
    isDispatchAvailable: Boolean
    isInHouseAvailable: Boolean
    estimatedServiceTime: String
  }

  input PromotionInput {
    id: ID!
    promotionNm: String!
    promotionStart: Date!
    promotionEnd: Date!
    image: ImageStorageInput!
    serivces: [PromotionServiceInput!]!
    branches: [PromotionBranchInput!]!
    promoCode: String!
    discountAm: String!
  }
`;
