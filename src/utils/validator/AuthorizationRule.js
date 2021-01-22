import { rule, shield } from "graphql-shield";

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const permissions = shield({
  Query: {
    users: isAuthenticated,
    user: isAuthenticated,
    // Message
    getMessages: isAuthenticated,
    getMessage: isAuthenticated,
    // Conversation
    getConversations: isAuthenticated,
    getConversation: isAuthenticated,
  },
  Mutation: {
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    // Message
    createMessage: isAuthenticated,
    deleteMessage: isAuthenticated,
    // Image Storage
    createImageStorage: isAuthenticated,
    updateImageStorage: isAuthenticated,
    // Conversation
    createConversation: isAuthenticated,
    updateConversation: isAuthenticated,
  },
});

export default permissions;
