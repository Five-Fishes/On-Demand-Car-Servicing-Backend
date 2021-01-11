import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    AppointmantDate: Date,
    CustomerID: Number,
    BranchID: Number,
    VehicleID: Number,
    ServiceID: Number,
    AppointmentStatus: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", AppointmentSchema);
