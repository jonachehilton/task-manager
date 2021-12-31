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

export const resolvers = {
  Project: {
    id: ({ _id, id }) => _id || id,
    progress: async ({ _id }, _, { db }) => {
      const tasks = await db.collection('Tasks').find({ projectId: _id }).toArray();
      const completedTasks = tasks.filter(Task => Task.completed);

      if (tasks.length === 0) return 0;

      return (completedTasks.length / tasks.length) * 100;
    },
    users: async ({ userIds }, _, { db }) => await Promise.all(userIds.map(userId => db.collection('Users').findOne({ _id: ObjectId(userId) }))) ,
    tasks: async ({ _id }, _, { db }) => await db.collection('Tasks').find({ projectId: ObjectId(_id) }).toArray(),
  },
}