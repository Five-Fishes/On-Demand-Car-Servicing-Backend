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
    // Dispatch Service
    getDispatchServices: isAuthenticated,
    getDispatchService: isAuthenticated,
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
    // Dispatch Service
    createDispatchService: isAuthenticated,
    updateDispatchService: isAuthenticated,
    // Conversation
    createConversation: isAuthenticated,
    updateConversation: isAuthenticated,
  },
});

export default permissions;
