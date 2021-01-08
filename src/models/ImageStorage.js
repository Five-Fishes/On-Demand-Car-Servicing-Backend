import mongoose from "mongoose";

const ImageStorageSchema = new mongoose.Schema(
  {
    imageSize: mongoose.Decimal128,
    imageURL: String,
    imageFileNm: String,
    imageType: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ImageStorage", ImageStorageSchema);
