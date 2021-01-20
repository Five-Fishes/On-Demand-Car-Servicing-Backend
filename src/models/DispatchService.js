import mongoose, { Schema } from "mongoose";

const DispatchServiceSchema = new mongoose.Schema(
  {
    dispatchTimeStamp: Date,
    customerLocationDesc: String,
    serviceLocation: String,
    foremanCurrentLocation: String,
    foremanDepartTime: Date,
    estimatedArrivalTime: Date,
    vehicle: {
      vehicleType: String,
      vehicleBrand: String,
      vehicleModel: String,
      vehiclePlateNumber: String
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch"
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service"
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DispatchService", DispatchServiceSchema);
