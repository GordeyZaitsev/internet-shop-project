import { gql } from "apollo-server";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Int!
    description: String!
    category: [String]!
  }

  type Query {
    products: [Product]
  }
`;

export const resolvers = {
  Query: {
    products: async () => {
      const fs = await import("fs/promises");
      const data = await fs.readFile("products.json", "utf8");
      return JSON.parse(data);
    },
  },
};
