import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    appointments(filter: String!): [Appointment!]!
    appointment(id: ID!): Appointment!
  }

  extend type Mutation {
    createAppointment(appointmentInput: AppointmentInput!): Appointment!
    updateAppointment(appointmentInput: AppointmentInput!): Appointment!
    deleteAppointment(id: String!): String!
  }

  input AppointmentInput {
    id: ID!
    AppointmentDate: String!
    CustomerID: Int!
    BranchID: Int!
    VehichleID: Int!
    ServiceID: Int!
    AppointmentStatus: String!
  }

  type Appointment {
    id: ID!
    AppointmentDate: String!
    CustomerID: Int!
    BranchID: Int!
    VehichleID: Int!
    ServiceID: Int!
    AppointmentStatus: String!
  }

`;
