import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    branchs(filter: String!): [Branch!]!
    branch(id: ID!): Branch!
  }

  extend type Mutation {
    createBranch(branchInput: BranchInput!): Branch!
    updateBranch(branchInput: BranchInput!): Branch!
    deleteBranch(branchId: String!): Branch!
  }

  input BranchInput {
    id: ID!
    companyId: String!
    branchAddr: String!
    branchContactNo: String!
    hasDispatchService: Boolean
    businesshours: businesshoursInput!
    services: [servicesInput!]
  }

  input businesshoursInput {
    mon: monInput!
    tue: tueInput!
    wed: wedInput!
    thu: thuInput!
    fri: friInput!
    sat: satInput!
    sun: sunInput!
  }

  input monInput {
    open: String!
    break: String!
    close: String!
  }

  input tueInput {
    open: String!
    break: String!
    close: String!
  }

  input wedInput {
    open: String!
    break: String!
    close: String!
  }

  input thuInput {
    open: String!
    break: String!
    close: String!
  }

  input friInput {
    open: String!
    break: String!
    close: String!
  }

  input satInput {
    open: String!
    break: String!
    close: String!
  }

  input sunInput {
    open: String!
    break: String!
    close: String!
  }

  input servicesInput {
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
    hasDispatchService: Boolean
    businesshours: businesshours!
    services: [services!]
  }

  type businesshours {
    mon: mon!
    tue: tue!
    wed: wed!
    thu: thu!
    fri: fri!
    sat: sat!
    sun: sun!
  }

  type mon {
    open: String
    break: String
    close: String
  }

  type tue {
    open: String
    break: String
    close: String
  }

  type wed {
    open: String
    break: String
    close: String
  }

  type thu {
    open: String
    break: String
    close: String
  }

  type fri {
    open: String
    break: String
    close: String
  }

  type sat {
    open: String
    break: String
    close: String
  }

  type sun {
    open: String
    break: String
    close: String
  }

  type services {
    serviceNm: String!
    isDispatchAvailable: Boolean
    isInHouseAvailable: Boolean
    estimatedServiceTime: Float
  }

`;
