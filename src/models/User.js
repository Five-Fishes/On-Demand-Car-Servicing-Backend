import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    type: String,
    firstName: String,
    lastName: String,
    password: String,
    dateOfBirth: Date,
    contactNo: String,
    email: String,
    ip: String,
    vehicle: [{
      vehicleType: String,
      vehicleBrand: String,
      vehicleModel: String,
      vehiclePlateNumber: String,
    }],
    employeeType: String,
    favouriteBranch: [
      {
        favouriteBranchID: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
