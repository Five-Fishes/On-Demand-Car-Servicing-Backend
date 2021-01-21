import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getConversations(filter: String, users: [ID!]): [Conversation!]!
    getConversation(id: ID!): Conversation!
  }

  extend type Mutation {
    createConversation(conversationInput: ConversationInput!): Conversation!
    updateConversation(conversationInput: ConversationInput!): Conversation!
    deleteConversation(id: String!): String!
  }

  input ConversationInput {
    id: String
    conversationName: String!
    members: [ID!]
  }

  type Conversation {
    id: String!
    conversationName: String!
    members: [ConversationMember!]
  }

  type ConversationMember {
    type: String!
    employeeType: String
    firstName: String!
    lastName: String!
    contactNo: String!
  }

`;
