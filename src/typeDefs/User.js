import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    """
    The filter is actually stringified JSON to be passed into mongoose
    """
    users(filter: String!): [User!]!
    user(id: String!): User!
  }

  extend type Mutation {
    createUser(userInput: UserInput!): User!
    updateUser(userInput: UserInput!): User!
    deleteUser(useId: String!): User!
  }

  input UserInput {
    id: ID!
    type: String!
    firstName: String!
    lastName: String!
    password: String!
    dateOfBirth: String!
    contactNo: String!
    email: String!
    ip: String!
    vehicle: VehicleInput
    employeeType: String
    employmentBranch: String
    favouriteBranch: [FavouriteBranchInput!]
  }

  input VehicleInput {
    vehicleType: String!
    vehicleBrand: String!
    vehicleModel: String!
    vehiclePlateNumber: String!
  }

  input FavouriteBranchInput {
    favouriteBranchID: String!
  }

  type User {
    id: ID!
    type: String!
    firstName: String!
    lastName: String!
    password: String!
    dateOfBirth: String!
    contactNo: String!
    email: String!
    ip: String!
    vehicle: Vehicle!
    employeeType: String!
    employmentBranch: String
    favouriteBranch: [FavouriteBranch!]!
  }

  type Vehicle {
    vehicleType: String!
    vehicleBrand: String!
    vehicleModel: String!
    vehiclePlateNumber: String!
  }

  type FavouriteBranch {
    favouriteBranchID: String!
  }
`;
