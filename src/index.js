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
<<<<<<< HEAD
  mocks: false,
=======
  mocks: !!+process.env.MOCK,
>>>>>>> 2d07af1ce2c2987c325ac48f91126466ada7e0c8
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
