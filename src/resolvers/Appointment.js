import { ApolloError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";

import { Appointment, User, Branch, Service } from "../models";
import {
  APPOINTMENT_STATUS,
  USER_TYPE,
  NO_ACCESS_RIGHT_CODE,
} from "../constants";
import { FFInvalidFilterError } from "../utils/error";

/**
 * Validate the appointment to create, considering fields validity of:
 * - appointmentdate
 * - customerID
 * - branchID
 * - serviceID
 * - vehicleID
 * - serviceID
 * @param {Object} appointmentInput
 * @param {Object} user
 */
const appointmentValidator = async (appointmentInput, user) => {
  // validate the appointment date
  const validDate = new Date(appointmentInput.appointmentDate) > Date.now();
  // validate current customer creates an appointment
  const validCustomer = appointmentInput.customerID === user.id;
  // validate the branch
  const validBranch = await Branch.findById(appointmentInput.branchID);
  // validate vehicle
  const customer = await User.findById(user.id);
  const validVehicle = customer.vehicle.find(
    (vehicle) => vehicle._id.toString() === appointmentInput.vehicleID
  );
  // validate the service
  const validService = await Service.findById(appointmentInput.serviceID);

  return (
    validDate && validCustomer && validBranch && validVehicle && validService
  );
};

const AppointmentResolver = {
  Query: {
    appointments: async (root, { filter }, context, info) => {
      if (!filter) {
        return new UserInputError("No filter provided");
      }

      /**
       * parse filter string to json
       */
      try {
        filter = JSON.parse(filter);
      } catch (error) {
        return new FFInvalidFilterError(
          error.message,
          `Filter: ${filter} is invalid`
        );
      }

      /**
       * query db with filter
       */
      try {
        const filteredAppointments = await Appointment.find(filter);
        return filteredAppointments;
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
    appointment: async (root, { id }, context, info) => {
      /**
       * validate id length
       * validate id format
       */
      const invalid_input =
        id.length === 0 || mongoose.Types.ObjectId.isValid(id);
      if (invalid_input) {
        return new UserInputError("Invalid ID number provided");
      }

      /**
       * find by id
       */
      const appointment = await Appointment.findById(id);
      return appointment;
    },
  },
  Mutation: {
    async createAppointment(_, { appointmentInput }, context) {
      /**
       * destructuring context to get user
       */
      const { user } = context;

      /**
       * only customer can create appointment
       */
      const hasAccessRight = user.type === USER_TYPE.CUSTOMER;
      if (!hasAccessRight)
        return new ApolloError(
          `User type ${user.type} cannot create appointment`,
          NO_ACCESS_RIGHT_CODE
        );

      /**
       * check validity for:
       * - input
       * - date
       * - customer
       * - branch
       * - service
       */
      if (appointmentInput === null) {
        return new ApolloError("Invalid input for new Appointment");
      }
      const validInput = await appointmentValidator(appointmentInput, user);
      if (!validInput) {
        return new UserInputError("Invalid input fileds for appoinetment", {
          details: appointmentInput,
        });
      }

      const appointment = await Appointment.create({ ...appointmentInput });
      return appointment;
    },
    async updateAppointment(_, { appointmentInput }) {
      if (!appointmentInput.id) {
        return new UserInputError(
          "Unable to update Appointment with invalid id"
        );
      }
      try {
        let oldAppointment = await Appointment.findById(appointmentInput.id);
        if (oldAppointment) {
          const CustomerID = await User.findById(appointmentInput.CustomerID);
          if (!CustomerID) {
            return new UserInputError("Customer ID does not exist");
          }
          const BranchID = await Branch.findById(appointmentInput.BranchID);
          if (!BranchID) {
            return new UserInputError("Branch ID does not exist");
          }
          // TO DO: Add service data
          // const ServiceID = await Service.findById(appointmentInput.ServiceID);
          // if(!ServiceID){
          //   return new UserInputError("Service ID does not exist")
          // }
          if (
            appointmentInput.AppointmentStatus ===
              APPOINTMENT_STATUS.CANCELLED ||
            appointmentInput.AppointmentStatus === APPOINTMENT_STATUS.REJECTED
          ) {
            return new UserInputError(
              "Cancelled/Rejected Appointment cannot be updated."
            );
          }
          // Unable to check if VehicleID exist or not (NO)
          if (appointmentInput.VehicleID === null) {
            return new UserInputError("Vehicle ID is null");
          }
        } else {
          return new UserInputError("Appointment is not found with id");
        }
        let appointment = await Appointment.findByIdAndUpdate(
          appointmentInput.id,
          {
            ...appointmentInput,
          },
          { new: true }
        );
        return appointment;
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
    async deleteAppointment(_, { id }) {
      if (!id) {
        return new UserInputError("No id is provided");
      } else {
        try {
          const appointment = await Appointment.findById(id);
          if (appointment) {
            let deleted = await Appointment.findByIdAndRemove(id);
            return deleted;
          }
        } catch (err) {
          return new ApolloError(err.message, 500);
        }
      }
    },
  },
};
export default AppointmentResolver;
