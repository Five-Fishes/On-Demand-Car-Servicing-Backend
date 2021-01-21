import { rule, shield } from "graphql-shield";

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const permissions = shield({
  Query: {
    users: isAuthenticated,
    user: isAuthenticated,
  },
  Mutation: {
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
  },
});

export default permissions;
