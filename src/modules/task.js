const { gql } = require('apollo-server');

export const typeDef = gql`
  type Task {
    id: ID!
    content: String!
    completed: Boolean!
    project: Project!
  }
`;