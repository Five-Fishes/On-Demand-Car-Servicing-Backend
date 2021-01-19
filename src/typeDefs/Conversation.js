import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    conversations(filter: String!): [Conversation!]!
    conversation(id: ID!): Conversation!
  }

  extend type Mutation {
    createConversation(conversationInput: ConversationInput!): Conversation!
    updateConversation(conversationInput: ConversationInput!): Conversation!
    deleteConversation(conversationId: String!): Conversation!
  }

  input ConversationInput {
    conversationID: ID!
    conversationName: String!
  }

  type Conversation {
    conversationID: ID!
    conversationName: String!
  }

`;
