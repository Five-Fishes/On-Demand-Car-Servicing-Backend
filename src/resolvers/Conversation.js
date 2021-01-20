import Conversation from "../models/Conversation";
import { ApolloError, UserInputError } from "apollo-server-express"

const ConversationResolver = {
  Query: {
    async getConversations(_, { filter }) {
      let filterJson = {};
      if (filter) {
        filterJson = JSON.parse(filter);
      }
      try {
        let conversations = await Conversation.find(filterJson);
        conversations.map(data => data.populate("members"));
        return conversations;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async getConversation(_, { id }) {
      try {
        let conversation = await Conversation
          .findById(id)
          .populate("members");
        return conversation
      } catch (err) {
        throw new ApolloError(err.message);
      }
    }
  },
  Mutation: {
    async createConversation(_, { conversationInput }) {
      if (conversationInput.id) {
        throw new ApolloError("New Conversation cannot have id");
      }
      const newConversation = new Conversation({
        ...conversationInput
      });
      let conversation = await newConversation.save();
      return conversation
        .populate("members")
        .execPopulate();
    },
    async updateConversation(_, { conversationInput }) {
      if (!conversationInput.id) {
        throw new UserInputError("Update Conversation must have id");
      }
      let originalConversation = Conversation.findById(conversationInput.id);
      if (!originalConversation) {
        throw new ApolloError("Conversation is not exist");
      }
      // TODO: Construct unique list of members
      try {
        let conversation = await Conversation.findByIdAndUpdate(conversationInput.id, {
          ...conversationInput,
          members: originalConversation._doc.members.push(...conversationInput.members)
        }, {new: true})
        .then(res => {
          return res;
        })
        return conversation
          .populate("members")
          .execPopulate();
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async deleteConversation(_, { id }) {
      if (!id) {
        throw new UserInputError("Delete Conversation must have id");
      }
      try {
        const conversation = await Conversation.findById(id);
        if (conversation === null) {
          throw new ApolloError("Conversation is not exist");
        }
        await conversation.delete();
        return "Conversation Deleted Successfully";
      } catch(err) {
        throw new ApolloError(err.message);
      }
    }
  }
}

export default ConversationResolver;
