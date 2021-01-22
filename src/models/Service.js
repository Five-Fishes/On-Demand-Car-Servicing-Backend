import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    serviceNm: String,
    serviceType: String,
    isDispatchAvailable: Boolean,
    isInHouseAvailable: Boolean,
    estimatedServiceTime: mongoose.Decimal128,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", ServiceSchema);
