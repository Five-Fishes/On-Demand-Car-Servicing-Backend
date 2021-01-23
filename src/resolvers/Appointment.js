import { ApolloError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";

import { Appointment, User, Branch } from "../models";
import { FFInvalidFilterError } from "../utils/error";
import { appointmentInputValidator, roleValidator } from "../utils/validator";
import {
  APPOINTMENT_STATUS,
  USER_TYPE,
  NO_ACCESS_RIGHT_CODE,
} from "../constants";

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
      const validInput = await appointmentInputValidator(
        appointmentInput,
        user
      );
      if (validInput !== true) {
        return validInput === false
          ? new UserInputError("Please check Date/Vehicle input", {
              Details: appointmentInput,
            })
          : validInput;
      }

      /**
       * after passing validity check, create appointment
       */
      const appointment = await Appointment.create(appointmentInput);
      return appointment;
    },
    async updateAppointment(_, { appointmentInput }, context, info) {
      /**
       * - check input validity
       * - create appointment
       */

      /**
       * destructure user
       */
      const { user } = context;

      if (!appointmentInput.id) {
        return new UserInputError(
          "Unable to update Appointment with invalid id"
        );
      }

      /**
       * validate input
       */
      const validInput = await appointmentInputValidator(
        appointmentInput,
        user
      );
      if (validInput !== true) {
        return validInput === false
          ? new UserInputError("Please check Date/Vehicle input", {
              Details: appointmentInput,
            })
          : validInput;
      }

      /**
       * get original appointment
       */
      let originalAppointment = null;
      try {
        originalAppointment = await Appointment.findById(appointmentInput.id);

        if (originalAppointment === null) {
          return new ApolloError(`No appointment with ID: ${id}`);
        }
      } catch (error) {
        return ApolloError(
          `Error whiile searching Appoontment with ID: ${appointmentInput.id}`
        );
      }

      /**
       * disallow update of appointments that are:
       * - rejected
       * - cancelled
       * - completed
       */
      const isImmutable =
        originalAppointment.appointmentStatus ===
          APPOINTMENT_STATUS.CANCELLED ||
        originalAppointment.appointmentStatus === APPOINTMENT_STATUS.REJECTED ||
        originalAppointment.appointmentStatus === APPOINTMENT_STATUS.COMPLETED;
      if (isImmutable) {
        return new UserInputError(
          `Appointment has been ${originalAppointment.appointmentState}. Update is prohibited`
        );
      }

      /**
       * perform updates
       */
      try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
          appointmentInput.id,
          appointmentInput,
          { new: true }
        );
        return updatedAppointment;
      } catch (error) {
        return new ApolloError(
          `Unable to update appointment ${appointmentInput.id}`,
          { Details: appointmentInput }
        );
      }
    },
    async deleteAppointment(_, { id }, context) {
      /**
       * - only allow creator to delete
       * - started/ended appointment cannot be deleted
       * - cancelled/rejected/completed cannot be deleted
       */

      /**
       * destructure context to get user
       */
      const { user } = context;

      /**
       * only customer can delete appointment
       */
      const hasAccessRight = user.type === USER_TYPE.CUSTOMER;
      if (!hasAccessRight)
        return new ApolloError(
          `User type ${user.type} cannot delete appointment`,
          NO_ACCESS_RIGHT_CODE
        );

      /**
       * get original appointment to check whether user is the customer
       */
      let originalAppointment = null;
      try {
        originalAppointment = await Appointment.findById(id);

        if (originalAppointment === null) {
          return new ApolloError(`No appointment with ID: ${id}`);
        }
      } catch (error) {
        return new ApolloError(
          `Error while looking for appointment with ID: ${id}`,
          500,
          { Details: error }
        );
      }

      const isCreator = roleValidator(originalAppointment.customerID, user.id);
      if (!isCreator) {
        return UserInputError(
          "User cannot delete because this appointment is created by another user"
        );
      }

      /**
       * check started/ended
       */
      const startedOrEnded =
        new Date(originalAppointment.appointmentDate) < Date.now();
      if (startedOrEnded) {
        return new ApolloError(
          "Started or Ended apppointemnt cannot be deleted",
          500
        );
      }

      /**
       * check completed/cancelled/rejected
       */
      const isImmutable =
        originalAppointment.appointmentStatus ===
          APPOINTMENT_STATUS.CANCELLED ||
        originalAppointment.appointmentStatus === APPOINTMENT_STATUS.REJECTED ||
        originalAppointment.appointmentStatus === APPOINTMENT_STATUS.COMPLETED;
      if (isImmutable) {
        return new UserInputError(
          `Appointment has been ${originalAppointment.appointmentState}. Delete is prohibited`
        );
      }

      /**
       * perform deletion
       */
      try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        return deletedAppointment;
      } catch (error) {
        return new ApolloError("Error while deleting appointment", 500, {
          Details: error,
        });
      }
    },
  },
};
export default AppointmentResolver;
