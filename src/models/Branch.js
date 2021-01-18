import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    companyId: String,
    branchAddr: String,
    branchContactNo: String,
    hasDispatchService: Boolean,
    businesshours: {
      mon: {
        open: String,
        break: String,
        close: String,
      },
      tue: {
        open: String,
        break: String,
        close: String,
      },
      wed: {
        open: String,
        break: String,
        close: String,
      },
      thu: {
        open: String,
        break: String,
        close: String,
      },
      fri: {
        Open: String,
        break: String,
        close: String,
      },
      sat: {
        open: String,
        break: String,
        close: String,
      },
      sun: {
        open: String,
        break: String,
        close: String,
      },
    },
    services: [
      {
        serviceNm: String,
        isDispatchAvailable: Boolean,
        isInHouseAvailable: Boolean,
        estimatedServiceTime: mongoose.Decimal128,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Branch", BranchSchema);
