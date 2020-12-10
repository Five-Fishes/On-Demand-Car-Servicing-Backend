import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  mocks: true,
});
const app = express();
server.applyMiddleware({ app });

mongoose.set("useFindAndModify", false);
mongoose
  .connect(procees.env.CONNECTION_STRING, { userNewUrlParser: true })
  .then(() => {
    return app.listen({ port: procees.env.PORT });
  })
  .then((res) => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  });
