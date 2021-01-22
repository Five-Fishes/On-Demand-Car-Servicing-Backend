import Message from "../models/Message";
import User from "../models/User";
import Conversation from "../models/Conversation";
import { ApolloError, UserInputError } from "apollo-server-express";

const MessageType = {
  "TEXT": "TEXT",
  "AUDIO": "AUDIO",
  "IMAGE": "IMAGE",
  "VIDEO": "VIDEO"
}

const MessageResolver = {
  Query: {
    async getMessages(_, { filter }) {
      let filterJson = {};
      if (filter) {
        filterJson = JSON.parse(filter);
      }
      try {
        let messages = await Message.find(filterJson)
          .populate("sender")
          .sort({createdAt: "desc"});
        messages.map(data => convertMessageDecimalContent(data));
        return messages;
      } catch(err) {
        return new ApolloError(err.message);
      }
    },
    async getMessage(_, { id }) {
      try {
        let message = await Message.findById(id)
          .populate("sender");
        return convertMessageDecimalContent(message);
      } catch(err) {
        return new ApolloError(err.message);
      }
    }
  },
  Mutation: {
    async createMessage(_, { messageInput }, context) {
      if (messageInput.id) {
        return new UserInputError("New Message cannot have id");
      }
      try {
        const chatChecked = await validateChat(messageInput.chatID, context.user.id);
        if (chatChecked !== true) {
          return new ApolloError(chatChecked);
        }
        const newMessage = new Message({
          ...messageInput,
          sender: context.user.id,
          createdAt: new Date().toISOString()
        });
        let message = await newMessage.save();
        message = await message
          .populate("sender")
          .execPopulate();
        return convertMessageDecimalContent(message);
      } catch(err) {
        return new ApolloError(err.message);
      }
    },
    async deleteMessage(_, { id }, context) {
      if (!id) {
        return new UserInputError("Delete Message must have id");
      }
      try {
        const message = await Message.findById(id)
          .populate("sender");
        if (message === null) {
          return new ApolloError("Message is not exist");
        }
        const res = await validateChat(message.chatID, context.user.id);
        if (res !== true) {
          return new ApolloError(res);
        }
        if (message._doc.sender.id !== context.user.id) {
          return new ApolloError("Message is not belong to logged in user");
        }
        await message.delete();
        return "Message Deleted Successfully";
      } catch(err) {
        return new ApolloError(err.message);
      }
    }
  }
}

const convertMessageDecimalContent = (message) => {
  if (message._doc.messageType === MessageType.AUDIO) {
    message._doc.audio.audioLength = message._doc.audio.audioLength.toString();
  }
  if (message._doc.messageType === MessageType.IMAGE) {
    message._doc.image.imageSize = message._doc.image.imageSize.toString();
  }
  if (message._doc.messageType === MessageType.VIDEO) {
    message._doc.video.videoSize = message._doc.video.videoSize.toString();
  }
  return message;
}

const validateChat = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId)
  if (!conversation) {
    return "Conversation not exist";
  }
  const matched = conversation._doc.members.filter(member => member.toString() === userId.toString());
  if (matched.length < 1) {
    return "User is not member of chat";
  } else {
    return true;
  }
}

export default MessageResolver;