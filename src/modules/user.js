const { gql } = require('apollo-server');

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
  } 

  input SignUpInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    avatar: String
  }
  
`
