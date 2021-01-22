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
    AppointmentDate: String!
    CustomerID: String!
    BranchID: String!
    VehicleID: String!
    ServiceID: String!
    AppointmentStatus: AppointmentStatus!
  }

  enum AppointmentStatus {
    PENDING
    REJECTED
    ACCEPTED
    COMPLETED
    CANCELLED
  }

  type Appointment {
    id: ID
    AppointmentDate: String!
    CustomerID: String!
    BranchID: String!
    VehicleID: String!
    ServiceID: String!
    AppointmentStatus: AppointmentStatus!
  }

`;
