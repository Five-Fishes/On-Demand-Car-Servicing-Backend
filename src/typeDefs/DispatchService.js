import { gql } from "apollo-server-express";

export default gql`
  
  extend type Query {
    getDispatchServices(filter: String): [DispatchService!]!
    getDispatchService(id: ID!): DispatchService!
  }

  extend type Mutation {
    createDispatchService(dispatchServiceInput: DispatchServiceInput!): DispatchService!
    updateDispatchService(dispatchServiceInput: DispatchServiceInput!): DispatchService!
  }

  enum DispatchServiceStatus {
    PENDING
    REJECTED
    ACCEPTED
    COMPLETED
    CANCELLED
  }

  input DispatchServiceInput {
    id: ID
    dispatchTimeStamp: String!
    branch: ID!
    employee: ID!
    customer: ID!
    service: ID!
    vehicle: DispatchServiceVehicleInput!
    customerLocationDesc: String!
    serviceLocation: String!
    foremanCurrentLocation: String!
    foremanDepartTime: String!
    estimatedArrivalTime: String!
    status: DispatchServiceStatus!
  }

  input DispatchServiceVehicleInput {
    id: ID!
    vehicleType: String!
    vehicleBrand: String!
    vehicleModel: String!
    vehiclePlateNumber: String!
  }

  type DispatchService {
    dispatchTimeStamp: String
    branch: DispacthServiceBranch!
    employee: DispatchServiceEmployee
    customer: DispatchServiceCustomer!
    service: DispatchServiceDetails!
    vehicle: DispatchServiceVehicle!
    customerLocationDesc: String!
    serviceLocation: String!
    foremanCurrentLocation: String!
    foremanDepartTime: String!
    estimatedArrivalTime: String!
    status: DispatchServiceStatus!
  }

  type DispacthServiceBranch {
    branchAddr: String!
    branchContactNo: String!
  }

  type DispatchServiceEmployee {
    firstName: String!
    lastName: String!
    contactNo: String!
    ip: String!
    employeeType: String!
    employementBranch: String!
  }

  type DispatchServiceCustomer {
    firstName: String!
    lastName: String!
    contactNo: String!
    ip: String!
  }

  type DispatchServiceVehicle {
    vehicleType: String!
    vehicleBrand: String!
    vehicleModel: String!
    vehiclePlateNumber: String!
  }

  type DispatchServiceDetails {
    serviceNm: String!
    estimatedServiceTime: Float!
  }
`;
