import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    companies(filter: String!): [Company!]!
    company(id: ID!): Company!
  }

  extend type Mutation {
    createCompany(companyInput: CompanyInput!): Company!
    updateCompany(companyInput: CompanyInput!): Company!
    deleteCompany(id: String!): Company!
  }

  input CompanyInput {
    id: ID
    companyNm: String!
    companyAddr: String!
    ownerID: String!
  }

  type Company {
    id: ID!
    companyNm: String!
    companyAddr: String!
    ownerID: String!
  }
`;
