import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { MongoClient } from 'mongodb';
import merge from 'lodash/merge.js'

import { getUserFromToken } from './utils/auth.js';
import { typeDef as User, resolvers as userResolvers } from './modules/user.js'
import { typeDef as Project, resolvers as projectResolvers } from './modules/project.js'
import { typeDef as Task, resolvers as taskResolvers } from './modules/task.js'

const Query = `type Query`;
const Mutation = `type Mutation`;

async function start() {
  const client = new MongoClient(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect()
  const db = client.db();

  const schema = makeExecutableSchema({
    typeDefs: [Query, Mutation, User, Project, Task],
    resolvers: merge({}, userResolvers, projectResolvers, taskResolvers),
  });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const user = await getUserFromToken(req.headers.authorization, db);

      return {
        db,
        user,
      }
    },
  });
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
}

start()
