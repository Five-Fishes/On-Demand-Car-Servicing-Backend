import mongoose from "mongoose";

const AudioStorageSchema = new mongoose.Schema(
  {
    audioContent: Buffer,
    audioURL: String,
    audioType: String,
    audioLength: mongoose.Decimal128,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AudioStorage", AudioStorageSchema);
