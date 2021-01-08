import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    conversationID: Number,
    conversationName: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);
