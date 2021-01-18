import mongoose from "mongoose";

const AudioStorageSchema = new mongoose.Schema({
  audioContent: Buffer,
  audioURL: String,
  audioType: String,
  audioLength: String,
});

export default mongoose.model("AudioStorage", AudioStorageSchema);
