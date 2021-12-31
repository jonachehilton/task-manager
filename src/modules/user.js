const { gql } = require('apollo-server');

export const typeDef = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    avatar: String
  }
`
