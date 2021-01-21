import express from "express";
import expressJwt from "express-jwt";
import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { makeExecutableSchema } from "apollo-server";

import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { permissions } from "./utils/validator";

dotenv.config();

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, permissions);
const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req }) => {
    const user = req.user || null;
    return { user };
  },
  playground: true,
  mocks: !!+process.env.MOCK,
});
const app = express();
app.use(
  expressJwt({
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);
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
