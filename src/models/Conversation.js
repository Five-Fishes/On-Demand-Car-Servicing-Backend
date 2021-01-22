import mongoose, { Schema } from "mongoose";
import User from "./User";

const ConversationSchema = new mongoose.Schema({
  type: String,
  conversationName: String,
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

export default mongoose.model("Conversation", ConversationSchema);
