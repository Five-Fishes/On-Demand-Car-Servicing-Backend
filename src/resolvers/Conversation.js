import Conversation from "../models/Conversation";
import { CONVERSATION_TYPE } from "../constants/index";
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server-express"

const isMemberOfConversation = (conversation, currentUserId) => {
  const matched = conversation.members.filter(member => currentUserId.toString() === member.id.toString());
  return matched.length > 0;
}

const filterByMembersId = (conversations, users) => {
  if (!users || users.length === 0) {
    return conversations;
  }
  return conversations.filter(data => {
    const member = data.members.filter(user => users.includes(user._id.toString()));
    return member.length > 0;
  })
}

const getConversationName = (conversation, currentUserId) => {
  if (conversation.type === CONVERSATION_TYPE.PERSONAL) {
    const targetPerson = conversation.members.filter(member => {
      return member.id.toString() !== currentUserId.toString();
    })
    conversation.conversationName = targetPerson[0].firstName + " " + targetPerson[0].lastName;
  }
  return conversation;
}

const getUniqueMembersIdList = (members) => {
  return Array.from(new Set(members));
}

const validateConversationName = (conversation) => {
  if (conversation.type === CONVERSATION_TYPE.GROUP && !conversation.conversationName ){
    return false;
  }
  return true;
}

const validateNumberOfMembers = (type, members) => {
  if (members.length < 2) {
    return "Conversation must have at least 2 members";
  }
  if (type === CONVERSATION_TYPE.PERSONAL && members.length !== 2) {
    return "Personal conversation must have 2 and only 2 members";
  }
  return true;
}

const ConversationResolver = {
  Query: {
    async getConversations(_, { filter, users }, context) {
      let filterJson = {};
      if (filter) {
        filterJson = JSON.parse(filter);
      }
      try {
        let conversations = await Conversation.find(filterJson)
          .populate("members");
        conversations = conversations.filter(conversation => isMemberOfConversation(conversation, context.user.id));
        conversations = filterByMembersId(conversations, users);
        conversations.map(conversation => getConversationName(conversation, context.user.id));
        return conversations;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async getConversation(_, { id }, context) {
      try {
        let conversation = await Conversation
          .findById(id)
          .populate("members");
        if (!isMemberOfConversation(conversation, context.user.id)) {
          throw new AuthenticationError("User not belong to the conversation");
        }
        return getConversationName(conversation, context.user.id);
      } catch (err) {
        throw new ApolloError(err.message);
      }
    }
  },
  Mutation: {
    async createConversation(_, { conversationInput }, context) {
      if (conversationInput.id) {
        throw new ApolloError("New Conversation cannot have id");
      }
      if (!validateConversationName(conversationInput)) {
        throw new UserInputError("Conversation name required for GROUP chat");
      }
      conversationInput.members = getUniqueMembersIdList(conversationInput.members);
      const membersNumberCheck = validateNumberOfMembers(conversationInput.type, conversationInput.members);
      if (membersNumberCheck !== true) {
        throw new UserInputError(membersNumberCheck);
      }
      if (!conversationInput.members.includes(context.user.id.toString())) {
        throw new UserInputError("Cannot create a conversation without yourself");
      }
      const newConversation = new Conversation({
        ...conversationInput
      });
      let conversation = await newConversation.save();
      conversation = await conversation
        .populate("members")
        .execPopulate();
      return getConversationName(conversation, context.user.id);
    },
    async updateConversation(_, { conversationInput }, context) {
      if (!conversationInput.id) {
        throw new UserInputError("Update Conversation must have id");
      }
      let originalConversation = await Conversation
        .findById(conversationInput.id)
        .populate("members");
      if (!originalConversation) {
        throw new ApolloError("Conversation is not exist");
      }
      if (!isMemberOfConversation(originalConversation, context.user.id)) {
        throw new AuthenticationError("User not belong to the conversation");
      }

      if (!validateConversationName(conversationInput)) {
        throw new UserInputError("Conversation name required for GROUP chat");
      }
      conversationInput.members = getUniqueMembersIdList(conversationInput.members);
      const membersNumberCheck = validateNumberOfMembers(conversationInput.type, conversationInput.members);
      if (membersNumberCheck !== true) {
        throw new UserInputError(membersNumberCheck);
      }
      try {
        let conversation = await Conversation.findByIdAndUpdate(conversationInput.id, {
          ...conversationInput,
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
  /**
   * Remove due to complex logic
   */
  //   async deleteConversation(_, { id }, context) {
  //     if (!id) {
  //       throw new UserInputError("Delete Conversation must have id");
  //     }
      
  //     try {
  //       const conversation = await Conversation.findById(id);
  //       if (conversation === null) {
  //         throw new ApolloError("Conversation is not exist");
  //       }
  //       if (!isMemberOfConversation(originalConversation, context.user.id)) {
  //         throw new AuthenticationError("User not belong to the conversation");
  //       }
  //       await conversation.delete();
  //       return "Conversation Deleted Successfully";
  //     } catch(err) {
  //       throw new ApolloError(err.message);
  //     }
  //   }
  }
}

export default ConversationResolver;
