import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    services(filter: String!): [Service!]!
    service(id: String): Service!
  }

  extend type Mutation {
    createService(serviceInput: ServiceInput!): Service!
    updateService(serviceInput: ServiceInput!): Service!
    deleteService(id: String!): Service!
  }

  type Service {
    id: ID!
    serviceNm: String!
    isDispatchAvailable: Boolean!
    isInHouseAvailable: Boolean!
    estimatedServiceTime: String!
  }

  input ServiceInput {
    id: ID!
    serviceNm: String!
    isDispatchAvailable: Boolean!
    isInHouseAvailable: Boolean!
    estimatedServiceTime: String!
  }
`;
