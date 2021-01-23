import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    branches(filter: String!): [Branch!]!
    branch(id: ID!): Branch!
  }

  extend type Mutation {
    createBranch(branchInput: BranchInput!): Branch!
    updateBranch(branchInput: BranchInput!): Branch!
    deleteBranch(id: String!): Branch!
  }

  input BranchInput {
    id: ID
    companyId: String!
    branchAddr: String!
    branchContactNo: String!
    hasDispatchService: Boolean
    businesshours: BusinessHoursInput!
    services: [String!]
  }

  input BusinessHoursInput {
    mon: DayInput!
    tue: DayInput!
    wed: DayInput!
    thu: DayInput!
    fri: DayInput!
    sat: DayInput!
    sun: DayInput!
  }

  input DayInput {
    open: String!
    break: String!
    close: String!
  }

  type Branch {
    id: ID!
    companyId: String!
    branchAddr: String!
    branchContactNo: String!
    hasDispatchService: Boolean!
    businesshours: BusinessHours!
    services: [Service!]
  }

  type BusinessHours {
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
`;
