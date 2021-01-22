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
    promotionStart: String!
    promotionEnd: String!
    image: ImageStorage!
    promotionService: [PromotionService!]!
    promotionBranch: [PromotionBranch!]!
    promoCode: String!
    discountAmt: Float!
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
    estimatedServiceTime: Float!
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
    estimatedServiceTime: Float
  }

  input PromotionInput {
    id: ID
    promotionNm: String!
    promotionStart: String!
    promotionEnd: String!
    image: ImageStorageInput!
    promotionService: [PromotionServiceInput!]!
    promotionBranch: [PromotionBranchInput!]!
    promoCode: String!
    discountAmt: Float!
  }
`;
