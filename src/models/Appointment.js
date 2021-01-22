import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    AppointmentDate: Date,
    CustomerID: String,
    BranchID: String,
    VehicleID: String,
    ServiceID: String,
    AppointmentStatus: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", AppointmentSchema);
