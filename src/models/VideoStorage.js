import mongoose from "mongoose";

const VideoStorageSchema = new mongoose.Schema({
  videoSize: mongoose.Decimal128,
  videoURL: String,
  videoFileNm: String,
  videoType: String,
});

export default mongoose.model("VideoStorage", VideoStorageSchema);
