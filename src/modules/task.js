const { gql } = require('apollo-server');

export const typeDef = gql`
  type Task {
    id: ID!
    content: String!
    completed: Boolean!
    project: Project!
  }

  extend type Mutation {
    createTask(projectId: ID!, content: String!): Task!
    updateTask(id: ID!, content: String, completed: Boolean): Task!
    deleteTask(id: ID!): Boolean!
  }
`;