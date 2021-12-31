const { gql } = require('apollo-server');

export const typeDef = gql`
  type Project {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!
    users: [User!]!
    tasks: [Task!]!
  }

  extend type Query {
    myProjects: [Project!]!
    getProject(id: ID!): Project
  }

  extend type Mutation {
    createProject(title: String!): Project!
    updateProject(id: ID!, title: String!): Project!
    deleteProject(id: ID!): Boolean!
    addUserToProject(projectId: ID!, userId: ID!): Project!
  }
`;