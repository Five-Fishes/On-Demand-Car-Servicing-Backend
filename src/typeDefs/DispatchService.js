import { gql } from "apollo-server-express";

export default gql`
  
  extend type Query {
    dispatchServices(filter: String!): [DispatchService!]!
    dispatchService(id: ID!): DispatchService!
  }

  extend type Mutation {
    createDispatchService(dispatchServiceInput: DispatchServiceInput!): DispatchService!
    updateDispatchService(dispatchServiceInput: DispatchServiceInput!): DispatchService!
    deleteDispatchService(dispatchServiceId: String!): DispatchService!
  }

  input DispatchServiceInput {
    dispatchTimeStamp: Date
    brandID: ID!
    employeeID: ID!
    customerID: ID!
    serviceID: ID!
    customerLocationDesc: String!
    serviceLocation: Float
    foremanCurrentLocation: Float
    foremanDepartTime: Date
    estimatedArrivalTime: Date
  }

  type DispatchService {
    dispatchTimeStamp: Date
    brandID: ID!
    employeeID: ID!
    customerID: ID!
    serviceID: ID!
    customerLocationDesc: String!
    serviceLocation: Float
    foremanCurrentLocation: Float
    foremanDepartTime: Date
    estimatedArrivalTime: Date
  }

`;
