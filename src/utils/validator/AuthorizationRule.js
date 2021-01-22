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
  },
  Mutation: {
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createMessage: isAuthenticated,
    deleteMessage: isAuthenticated,
    // Image Storage
    createImageStorage: isAuthenticated,
    updateImageStorage: isAuthenticated,
  },
});

export default permissions;
