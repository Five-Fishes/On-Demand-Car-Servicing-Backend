import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    branches(filter: String!): [Branch!]!
    branch(id: ID!): Branch!
  }

  extend type Mutation {
    createBranch(branchInput: BranchInput!): Branch!
    updateBranch(branchInput: BranchInput!): Branch!
    deleteBranch(id: String!): String!
  }

  input BranchInput {
    id: ID!
    companyId: String!
    branchAddr: String!
    branchContactNo: String!
    hasDispatchService: Boolean
    businesshours: BusinesshoursInput!
    services: [ServicesInput!]
  }

  input BusinesshoursInput {
    mon: DayInput!
    tue: DayInput!
    wed: DayInput!
    thu: DayInput!
    fri: DayInput!
    sat: DayInput!
    sun: DayInput!
  }

  input DayInput{
    open: String!
    break: String!
    close: String!
  }

  input ServicesInput {
    serviceNm: String!
    isDispatchAvailable: Boolean
    isInHouseAvailable: Boolean
    estimatedServiceTime: Float
  }

  type Branch{
    id: ID!
    companyId: String!
    branchAddr: String!
    branchContactNo: String!
    hasDispatchService: Boolean!
    businesshours: Businesshours!
    services: [Services!]
  }

  type Businesshours {
    mon: Day!
    tue: Day!
    wed: Day!
    thu: Day!
    fri: Day!
    sat: Day!
    sun: Day!
  }

  type Day {
    open: String!
    break: String!
    close: String!
  }

  type Services {
    serviceNm: String!
    isDispatchAvailable: Boolean!
    isInHouseAvailable: Boolean!
    estimatedServiceTime: Float!
  }

`;
