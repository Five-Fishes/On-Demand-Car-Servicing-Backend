import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyNm: String,
    companyAddr: String,
    ownerID: String, // UserID
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", CompanySchema);
