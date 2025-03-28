import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { ApolloServer } from "apollo-server-express"; // Используем apollo-server-express
import { WebSocketServer } from "ws";
import http from "http";
import { typeDefs, resolvers } from "./graphqlSchema.js"; // Подключаем схему и резолверы

const app = express();
const PORT = 3000;
const PRODUCTS_FILE = path.join(process.cwd(), "products.json");

app.use(cors());

// Функция для запуска Apollo Server
async function startApolloServer() {
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start(); // Ожидаем старта сервера
  apolloServer.applyMiddleware({ app, path: '/graphql' }); // Подключаем Apollo Server к Express
}

// Запускаем сервер GraphQL
startApolloServer().then(() => {
  console.log("GraphQL Server ready at http://localhost:3000/graphql");
});

// WebSocket Server
const httpServer = http.createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const messageText = message.toString();
    console.log("Received:", messageText);
    
    const messageObject = { text: messageText };

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(messageObject));  // Отправляем как строку JSON
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});




// Запуск WebSocket-сервера на порту 5000
httpServer.listen(5000, () => {
  console.log("WebSocket server running on ws://localhost:5000");
});

// Запуск Express сервера на порту 3000
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
