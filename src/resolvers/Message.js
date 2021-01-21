import Message from "../models/Message";
import User from "../models/User";
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
          .populate("sender");
        messages.map(data => convertMessageDecimalContent(data));
        return messages;
      } catch(err) {
        throw new ApolloError(err.message);
      }
    },
    async getMessage(_, { id }) {
      try {
        let message = await Message.findById(id)
          .populate("sender");
        return convertMessageDecimalContent(message);
      } catch(err) {
        throw new ApolloError(err.message);
      }
    }
  },
  Mutation: {
    async createMessage(_, { messageInput }) {
      if (messageInput.id) {
        throw new UserInputError("New Message cannot have id");
      }
      try {
        // TODO: replace userId as senderID
        const newMessage = new Message({
          ...messageInput,
          sender: "60067460b53560c199d970d4",
          createdAt: new Date().toISOString()
        });
        let message = await newMessage.save();
        // TODO: populate sender failed
        return convertMessageDecimalContent(message);
      } catch(err) {
        throw new ApolloError(err.message);
      }
    },
    async deleteMessage(_, { id }) {
      if (!id) {
        throw new UserInputError("Delete Message must have id");
      }
      try {
        const message = await Message.findById(id)
          .populate("sender");
        if (message === null) {
          throw new ApolloError("Message is not exist");
        }
        // TODO: check if senderID is userId
        // if (message._doc.sender.id === user.id)
        await message.delete();
        return "Message Deleted Successfully";
      } catch(err) {
        throw new ApolloError(err.message);
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

export default MessageResolver;