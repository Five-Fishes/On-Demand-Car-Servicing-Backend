import { ApolloError, UserInputError } from "apollo-server-express";
import Appointment from "../models/Appointment";

const AppointmentResolver = {
  Query: {
    appointments: async(root, { filter } , context, info) => {
      if (!filter){
        throw new UserInputError("No filter provided");
      }
      const filteredAppointments = await Appointment.find(JSON.parse(filter));
      return filteredAppointments;
    },
    appointment: async (root, { id }, context, info) => {
      const invalid_input = id.length === 0;
      if (invalid_input) {
        throw new UserInputError("Invalid ID number provided");
      }
      const appointment = await Appointment.findById(id);
      return appointment;
    }
  },
  Mutation: {
    async createAppointment(_, {appointmentInput}) {
      if (appointmentInput === null) {
        throw new ApolloError("Invalid input for new Appointment");
      }
      const newAppointment = new Appointment({
        ...appointmentInput,
      });
      const appointment = await newAppointment.save();
      return appointment;
    },
    async updateAppointment(_, {appointmentInput}) {
      if(!appointmentInput.id) {
        throw new UserInputError("Unable to update Appointment with invalid id");
      }
      try{
        return await Appointment.findByIdAndUpdate(appointmentInput.id, {
          AppointmentDate: appointmentInput.AppointmentDate,
          CustomerID: appointmentInput.CustomerID,
          BranchID: appointmentInput.BranchID,
          VehicleID: appointmentInput.VehicleID,
          ServiceID: appointmentInput.ServiceID,
          AppointmentStatus: appointmentInput.AppointmentStatus
        }, {new: true})
      } catch (err) {
        throw new ApolloError(err);
      }

    },
    async deleteAppointment(_, { id } ) {
      if(!id){
        throw new UserInputError ("Unable to delete Appointment");
      }
      const appointment = Appointment.findById(id);
      if (appointment){
        Appointment.findByIdAndRemove(id, () => {});
        return "Appointment deleted.";
      } else {
        throw new UserInputError ("Appointment ID is not found.");
      }
    },
  } ,
};
export default AppointmentResolver;