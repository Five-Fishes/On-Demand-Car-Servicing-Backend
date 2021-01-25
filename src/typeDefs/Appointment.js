import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    appointments(filter: String!): [Appointment!]!
    appointment(id: ID!): Appointment!
  }

  extend type Mutation {
    createAppointment(appointmentInput: AppointmentInput!): Appointment!
    updateAppointment(appointmentInput: AppointmentInput!): Appointment!
    deleteAppointment(id: String!): Appointment!
  }

  input AppointmentInput {
    id: ID
    appointmentDate: String!
    customerID: String!
    branchID: String!
    vehicleID: String!
    serviceID: String!
    appointmentStatus: AppointmentStatus!
  }

  enum AppointmentStatus {
    PENDING
    REJECTED
    ACCEPTED
    COMPLETED
    CANCELLED
  }

  type Appointment {
    id: ID!
    appointmentDate: String!
    customerID: AppointmentCustomer!
    branchID: AppointmentBranch!
    vehicleID: String!
    serviceID: AppointmentService!
    appointmentStatus: AppointmentStatus!
  }

  type AppointmentCustomer {
    firstName: String
    lastName: String
    contactNo: String
  }

  type AppointmentService {
    serviceNm: String
  }

  type AppointmentBranch {
    branchAddr: String
    branchContactNo: String
  }
`;
