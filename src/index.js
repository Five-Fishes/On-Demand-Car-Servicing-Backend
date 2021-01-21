import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  mocks: !!+process.env.MOCK,
});
const app = express();
server.applyMiddleware({ app });
const port = process.env.PORT || 5000;

mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.CONNECTION_STRING, { useUnifiedTopology: true })
  .then(() => {
    return app.listen({ port: port });
  })
  .then((res) => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
