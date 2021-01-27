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
    branch: String!
    employee: String!
    customer: String!
    service: String!
    vehicle: DispatchServiceVehicleInput!
    customerLocationDesc: String!
    serviceLocation: String!
    foremanCurrentLocation: String
    foremanDepartTime: String
    estimatedArrivalTime: String
    status: DispatchServiceStatus!
  }

  input DispatchServiceVehicleInput {
    vehicleType: String!
    vehicleBrand: String!
    vehicleModel: String!
    vehiclePlateNumber: String!
  }

  type DispatchService {
    id: ID!
    dispatchTimeStamp: String!
    branch: DispacthServiceBranch!
    employee: DispatchServiceEmployee
    customer: DispatchServiceCustomer!
    service: DispatchServiceDetails
    vehicle: DispatchServiceVehicle!
    customerLocationDesc: String!
    serviceLocation: String!
    foremanCurrentLocation: String
    foremanDepartTime: String
    estimatedArrivalTime: String
    status: DispatchServiceStatus!
    createdAt: String
  }

  type DispacthServiceBranch {
    id: ID
    branchAddr: String!
    branchContactNo: String!
  }

  type DispatchServiceEmployee {
    id: ID
    firstName: String!
    lastName: String!
    contactNo: String!
    ip: String
    employeeType: String!
    employmentBranch: ID
  }

  type DispatchServiceCustomer {
    id: ID
    firstName: String!
    lastName: String!
    contactNo: String!
    ip: String
  }

  type DispatchServiceVehicle {
    id: ID
    vehicleType: String!
    vehicleBrand: String!
    vehicleModel: String!
    vehiclePlateNumber: String!
  }

  type DispatchServiceDetails {
    id: ID
    serviceNm: String!
    estimatedServiceTime: Float!
  }
`;
