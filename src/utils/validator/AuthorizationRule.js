import { rule, shield } from "graphql-shield";

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const permissions = shield({
  Query: {
    users: isAuthenticated,
    user: isAuthenticated,
    getMessages: isAuthenticated,
    getMessage: isAuthenticated,
    // Dispatch Service
    getDispatchServices: isAuthenticated,
    getDispatchService: isAuthenticated,
  },
  Mutation: {
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createMessage: isAuthenticated,
    deleteMessage: isAuthenticated,
    // Dispatch Service
    createDispatchService: isAuthenticated,
    updateDispatchService: isAuthenticated,
  },
});

export default permissions;
