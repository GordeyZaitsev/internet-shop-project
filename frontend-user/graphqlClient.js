// frontend-user/graphqlClient.js
import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:4000/graphql'; // Адрес твоего серверного API для GraphQL

const client = new GraphQLClient(endpoint, {
  headers: {
    // Здесь можно добавить авторизационные заголовки, если они нужны
  },
});

export default client;
