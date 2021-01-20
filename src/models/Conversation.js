import mongoose, { Schema } from "mongoose";

const ConversationSchema = new mongoose.Schema({
  conversationName: String,
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

export default mongoose.model("Conversation", ConversationSchema);
