import React from "react";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from "apollo-link-context";

import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// const wsLink = new WebSocketLink({
//   uri: "ws://localhost:5000/notfications",
//   options: {
//     reconnect: true,
//   },
// });

// const splitLink = split(({ query }) => {
//   const definition = getMainDefinition(query);
//   return (
//     definition.kind === "OperationDefinition" &&
//     definition.operation === "subscription"
//   );
// }, wsLink);

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App />
    </ApolloHooksProvider>
  </ApolloProvider>
);
