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

export const resolvers = {
  Task: {
    id: ({ _id, id }) => _id || id,
    project: async ({ projectId }, _, { db }) => await db.collection('Projects').findOne({ _id: ObjectId(projectId) }),
  },
};