import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    conversations(filter: String!): [Conversation!]!
    conversation(id: ID!): Conversation!
  }

  extend type Mutation {
    createConversation(conversationInput: ConversationInput!): Conversation!
    updateConversation(conversationInput: ConversationInput!): Conversation!
    deleteConversation(id: String!): String!
  }

  input ConversationInput {
    conversationName: String!
    members: [ID!]
  }

  type Conversation {
    conversationName: String!
    members: [ConversationMember!]!
  }

  type ConversationMember {
    type: String!
    employeeType: String!
    firstName: String!
    lastName: String!
    contactNo: String!
  }

`;
