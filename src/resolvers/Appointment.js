import { ApolloError, UserInputError } from "apollo-server-express";
import Appointment from "../models/Appointment";
import User from "../models/User";
import Branch from "../models/Branch";
import Service from "../models/Service";

const AppointmentStatus = {
  "PENDING": "PENDING",
  "REJECTED": "REJECTED",
  "ACCEPTED": "ACCEPTED",
  "COMPLETED": "COMPLETED",
  "CANCELLED": "CANCELLED"
}

const AppointmentResolver = {
  Query: {
    appointments: async(root, { filter } , context, info) => {
      if (!filter){
        throw new UserInputError("No filter provided");
      }
      try{
        const filteredAppointments = await Appointment.find(JSON.parse(filter));
        return filteredAppointments;
      } catch(err){
        throw new ApolloError(err.message,500);
      }
      
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
      const appointment = await Appointment.create({...appointmentInput});
      return appointment;
    },
    async updateAppointment(_, {appointmentInput}) {
      if(!appointmentInput.id) {
        throw new UserInputError("Unable to update Appointment with invalid id");
      }
      try{
        let oldAppointment = await Appointment.findById(appointmentInput.id);
        if(oldAppointment){
          const CustomerID = await User.findById(appointmentInput.CustomerID);
          if(!CustomerID){
            throw new UserInputError("Customer ID does not exist")
          }
          const BranchID = await Branch.findById(appointmentInput.BranchID);
          if(!BranchID){
            throw new UserInputError("Branch ID does not exist")
          }
          // TO DO: Add service data
          // const ServiceID = await Service.findById(appointmentInput.ServiceID);
          // if(!ServiceID){
          //   throw new UserInputError("Service ID does not exist")
          // }
          if (appointmentInput.AppointmentStatus === AppointmentStatus.CANCELLED || appointmentInput.AppointmentStatus === AppointmentStatus.REJECTED){
            throw new UserInputError("Cancelled/Rejected Appointment cannot be updated.")
          }
          // Unable to check if VehicleID exist or not (NO)
          if(appointmentInput.VehicleID === null){
            throw new UserInputError("Vehicle ID is null")
          }
        } else{
          throw new UserInputError("Appointment is not found with id")
        }
        let appointment = await Appointment.findByIdAndUpdate(appointmentInput.id, {
          ...appointmentInput
        }, {new: true});
        return appointment;
      } catch (err) {
        throw new ApolloError(err.message,500);
      }

    },
    async deleteAppointment(_, { id } ) {
      if(!id){
        throw new UserInputError ("No id is provided");
      } else{
      try{
        const appointment = await Appointment.findById(id);
        if (appointment){
          let deleted = await Appointment.findByIdAndRemove(id);
          return deleted;
        }} catch(err) {
        throw new ApolloError (err.message,500);
        }
       }
      }
    }
  
};
export default AppointmentResolver;