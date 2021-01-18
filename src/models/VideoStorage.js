import mongoose from "mongoose";

const VideoStorageSchema = new mongoose.Schema({
  videoSize: String,
  videoURL: String,
  videoFileNm: String,
  videoType: String,
});

export default mongoose.model("VideoStorage", VideoStorageSchema);
