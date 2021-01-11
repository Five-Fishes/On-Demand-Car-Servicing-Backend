import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatID: Number, // link back to chat collection
    messageTime: Date,
    messageType: String, // Image|Audio|Video|Text
    messageText: String, // Text|URL
    imageID: Number,
    audioID: Number,
    videoID: Number,
    senderID: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", MessageSchema);
