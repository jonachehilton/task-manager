import { gql } from 'apollo-server';
import { ObjectId } from 'mongodb';

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
      const completedTasks = tasks.filter((Task) => Task.completed);

      if (tasks.length === 0) return 0;

      return (completedTasks.length / tasks.length) * 100;
    },
    users: async ({ userIds }, _, { db }) => {
      Promise.all(userIds.map((userId) => db.collection('Users').findOne({ _id: ObjectId(userId) })));
    },
    tasks: async ({ _id }, _, { db }) => db.collection('Tasks').find({ projectId: ObjectId(_id) }).toArray(),
  },

  Query: {
    myProjects: async (_, __, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      return db.collection('Projects').find({ userIds: user._id }).toArray();
    },
    getProject: async (_, { id }, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      return db.collection('Projects').findOne({ _id: ObjectId(id) });
    },
  },

  Mutation: {
    createProject: async (_, { title }, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      const newProject = {
        title,
        createdAt: new Date().toISOString(),
        userIds: [user._id],
      };

      const result = await db.collection('Projects').insertOne(newProject);
      return db.collection('Projects').findOne({ _id: result.insertedId });
    },
    updateProject: async (_, { id, title }, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      await db.collection('Projects').updateOne({ _id: ObjectId(id) }, { $set: { title } });

      return db.collection('Projects').findOne({ _id: ObjectId(id) });
    },
    deleteProject: async (_, { id }, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      await db.collection('Projects').deleteOne({ _id: ObjectId(id) });

      return true;
    },
    addUserToProject: async (_, { projectId, userId }, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      const project = await db.collection('Projects').findOne({ _id: ObjectId(projectId) });
      if (!project) throw new Error('Project not found');

      await db.collection('Projects')
        .updateOne({ _id: ObjectId(projectId) }, { $addToSet: { userIds: ObjectId(userId) } });

      return db.collection('Projects').findOne({ _id: ObjectId(projectId) });
    },
  },
};
