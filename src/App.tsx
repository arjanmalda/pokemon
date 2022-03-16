import React, { ChangeEvent, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  ApolloLink,
  HttpLink,
} from "@apollo/client";

import Pokemon from "./components/Pokemon";

const App: React.FC = () => {
  const pokemon2 = new HttpLink({
    uri: "https://graphql-pokemon2.vercel.app",
    // other link options...
  });

  const pokeapiImages = new HttpLink({
    uri: "https://graphql-pokeapi.graphcdn.app/",
    // other link options...
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === "pokemon2",
      pokemon2, // <= apollo will send to this if clientName is "pokemon2"

      ApolloLink.split(
        (operation) => operation.getContext().clientName === "pokeapiImages",
        pokeapiImages // <= apollo will send to this if clientName is "pokeapiImages"
      )
    ),
  });

  return (
    <ApolloProvider client={client}>
      <Pokemon
        data={{
          pokemons: [],
        }}
        loading={false}
      />
    </ApolloProvider>
  );
};

export default App;
function myLink(
  arg0: (operation: import("@apollo/client").Operation) => boolean,
  thirdPartyLink: any,
  myLink: any
): ApolloLink | undefined {
  throw new Error("Function not implemented.");
}
