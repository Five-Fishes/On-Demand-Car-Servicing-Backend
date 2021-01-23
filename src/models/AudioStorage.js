import mongoose from "mongoose";

const AudioStorageSchema = new mongoose.Schema({
  audioURL: String,
  audioType: String,
  audioLength: mongoose.Decimal128,
});

export default mongoose.model("AudioStorage", AudioStorageSchema);
