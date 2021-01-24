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
    login(email: String!, password: String!): User!

    """
    Do not provide ID while creating user
    """
    signUp(userInput: UserInput!): User!
    updateUser(userInput: UserInput!): User!
    deleteUser(userId: String!): User!
  }

  """
  No need to provide ip during creation, but should have IP while updating
  """
  input UserInput {
    id: ID
    type: UserType!
    firstName: String!
    lastName: String!
    password: String!
    confirmPassword: String
    dateOfBirth: String!
    contactNo: String!
    email: String!
    ip: String
    vehicle: [VehicleInput!]
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
    type: UserType!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    contactNo: String!
    email: String!
    ip: String
    vehicle: [Vehicle!]
    employeeType: String
    employmentBranch: String
    favouriteBranch: [FavouriteBranch!]
    token: String
  }

  type Vehicle {
    id: String!
    vehicleType: String!
    vehicleBrand: String!
    vehicleModel: String!
    vehiclePlateNumber: String!
  }

  type FavouriteBranch {
    favouriteBranchID: String!
  }

  enum UserType {
    EMPLOYEE
    CUSTOMER
    BRANDOWNER
  }

  enum EmployeeType {
    MANAGER
    STAFF
    NONE
  }
`;
