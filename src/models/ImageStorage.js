import mongoose from "mongoose";

const ImageStorageSchema = new mongoose.Schema({
  imageSize: String,
  imageURL: String,
  imageFileNm: String,
  imageType: String,
});

export default mongoose.model("ImageStorage", ImageStorageSchema);
