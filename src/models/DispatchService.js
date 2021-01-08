import mongoose from "mongoose";

const DispatchServiceSchema = new mongoose.Schema(
  {
    dispatchTimeStamp: Date,
    branchID: Number,
    employeeID: Number,
    customerID: Number,
    vehicleID: Number,
    serviceID: Number,
    customerLocationDesc: String,
    serviceLocation: mongoose.Decimal128,
    foremanCurrentLocation: mongoose.Decimal128,
    foremanDepartTime: Date,
    estimatedArrivalTime: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DispatchService", DispatchServiceSchema);
