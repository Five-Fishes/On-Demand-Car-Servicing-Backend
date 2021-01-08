import mongoose from "mongoose";

const VideoStorageSchema = new mongoose.Schema(
  {
    videoSize: mongoose.Decimal128,
    videoURL: String,
    videoFileNm: String,
    videoType: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("VideoStorage", VideoStorageSchema);
