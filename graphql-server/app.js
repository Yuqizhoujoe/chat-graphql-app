import express from "express";
import cors from "cors";

// GraphQL and WebSocket Set Up
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

// GraphQL Schema and Resolvers
import typeDefs from "./schema.js";
import resolvers from "./resolver.js";

// https://www.apollographql.com/docs/apollo-server/data/subscriptions/
const startGraphQLService = async () => {
  const app = express();
  app.use(cors());

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
  });

  await server.start();

  server.applyMiddleware({ app });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: server.graphqlPath,
  });

  useServer({ schema }, wsServer);

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `Subscriptions are running on ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

startGraphQLService();
