import express from 'express';
import {customers} from './mock_db/mock_customer.js';
import {ApolloServer, gql} from 'apollo-server-express';
import dotenv from 'dotenv'

dotenv.config()

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const server = new ApolloServer({
  typeDefs,
  mocks: true,
});
const app = express();
server.applyMiddleware({app})

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
})
