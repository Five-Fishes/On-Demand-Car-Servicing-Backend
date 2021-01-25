import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatID: String, // link back to chat collection
    messageTime: Date,
    messageType: String, // Image|Audio|Video|Text
    messageText: String, // Text|URL
    messageImage: {
      imageSize: mongoose.Decimal128,
      imageURL: String,
      imageFileNm: String,
      imageType: String,
    },
    messageAudio: {
      audioContent: Buffer,
      audioURL: String,
      audioType: String,
      audioLength: mongoose.Decimal128,
    },
    messageVideo: {
      videoSize: mongoose.Decimal128,
      videoURL: String,
      videoFileNm: String,
      videoType: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", MessageSchema);
