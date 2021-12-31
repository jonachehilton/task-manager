const { gql } = require('apollo-server');
const bcrypt = require('bcryptjs');
const { getToken } = require('src/utils/auth');

export const typeDef = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    avatar: String
  }

  type AuthUser {
    user: User!
    token: String!
  }

  extend type Mutation {
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!
  } 

  input SignUpInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    avatar: String
  }

  input SignInInput {
    email: String!
    password: String!
  }
`

export const resolvers = {
  User: {
    id: ({ _id, id }) => _id || id,
  },
  
  Mutation: {
    signUp: async (_, { input }, { db }) => {
      const hashedPassword = bcrypt.hashSync(input.password);
      const newUser = {
        ...input,
        password: hashedPassword,
      }

      const result = await db.collection('Users').insertOne(newUser);
      const user = await db.collection('Users').findOne({_id: result.insertedId});

      return {
        user: user,
        token: getToken(user),
      }
    },
  }
};
