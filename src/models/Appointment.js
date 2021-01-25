import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    appointmentDate: String,
    customerID: String,
    branchID: String,
    vehicleID: String,
    serviceID: String,
    appointmentStatus: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", AppointmentSchema);
