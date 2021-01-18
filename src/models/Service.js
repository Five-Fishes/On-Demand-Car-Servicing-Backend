import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    serviceNm: String,
    isDispatchAvailable: Boolean,
    isInHouseAvailable: Boolean,
    estimatedServiceTime: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", ServiceSchema);
