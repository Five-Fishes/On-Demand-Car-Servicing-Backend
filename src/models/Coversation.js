import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  conversationID: Number,
  conversationName: String,
});

export default mongoose.model("Conversation", ConversationSchema);
