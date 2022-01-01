import { gql } from 'apollo-server';
import { ObjectId } from 'mongodb';

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
    project: async ({ projectId }, _, { db }) => db.collection('Projects').findOne({ _id: ObjectId(projectId) }),
  },

  Mutation: {
    createTask: async (_, { projectId, content }, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      const newTask = {
        projectId: ObjectId(projectId),
        content,
        completed: false,
      };

      await db.collection('Tasks').insertOne(newTask);
      return db.collection('Tasks').findOne({ _id: ObjectId(newTask._id) });
    },
    updateTask: async (_, data, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      await db.collection('Tasks').updateOne({ _id: ObjectId(data.id) }, { $set: data });

      return db.collection('Tasks').findOne({ _id: ObjectId(data.id) });
    },
    deleteTask: async (_, { id }, { db, user }) => {
      if (!user) throw new Error('Authentication Error. Please sign in.');

      await db.collection('Tasks').deleteOne({ _id: ObjectId(id) });

      return true;
    },
  },
};
