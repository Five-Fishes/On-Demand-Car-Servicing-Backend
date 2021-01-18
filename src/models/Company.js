import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyNm: String,
    companyAddr: String,
    ownerID: mongoose.Decimal128, // UserID
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", CompanySchema);
