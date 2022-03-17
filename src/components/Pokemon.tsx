import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Container } from "./styles/Container.styled";
import { PokemonPopup } from "./styles/Pokemon.styled";
import { BsInfoCircle } from "react-icons/bs";

export interface PokemonData {
  data: {
    pokemons:
      | Array<{
          id: string;
          number: string;
          name: string;
          weight?: PokemonDimension;
          height?: PokemonDimension;
          classification?: string;
          types?: [string];
          resistant?: [string];
          attacks?: PokemonAttack;
          weaknesses?: [string];
          fleeRate?: number;
          maxCP?: number;
          evolutions?: [PokemonData];
          evolutionRequirements?: PokemonEvolutionRequirement;
          maxHP?: number;
          image?: string;
        }>
      | undefined;
  };
  loading: boolean;
}

interface Search {
  map: any;
  searchResult: Array<{
    __typename: string;
    name: string;
  }>;
}

interface PokemonDimension {
  minimum?: string;
  maximum?: string;
}

interface PokemonAttack {
  fast?: Array<Attack>;
  special?: Array<Attack>;
}

interface Attack {
  name?: string;
  type?: string;
  damage?: number;
}

interface PokemonEvolutionRequirement {
  amount?: number;
  name?: string;
}

interface ChangeProps {
  searchPokemon?(event: React.ChangeEvent<HTMLInputElement>): void;
}

const Pokemon: React.FC<PokemonData> = (): JSX.Element => {
  const QUERY_POKEMON_DATA = gql`
    query {
      pokemons(first: 151) {
        id
        name
      }
    }
  `;

  const QUERY_ABILITY_DATA = gql`
    query Pokemon($name: String!) {
      pokemon(name: $name) {
        id
        name
        weight {
          minimum
          maximum
        }
        height {
          minimum
          maximum
        }
        weaknesses
        classification
        types
        resistant
        attacks {
          fast {
            name
          }
        }
      }
    }
  `;

  const QUERY_IMAGE_DATA = gql`
    query PokemonImages($name: String!) {
      pokemon(name: $name) {
        sprites {
          front_default
        }
      }
    }
  `;

  const { data, loading } = useQuery(QUERY_POKEMON_DATA, {
    context: { clientName: "pokemon2" },
  });
  const [fetchAbilities, { data: pokemonAbilityData, error: pokemonError }] =
    useLazyQuery(QUERY_ABILITY_DATA);
  const [fetchImages, { data: pokemonImageData, error: pokemonImageError }] =
    useLazyQuery(QUERY_IMAGE_DATA);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Array<{}>>([{}]);

  const searchPokemon = (event: {
    preventDefault: () => void;
    target: { value: React.SetStateAction<string> };
  }) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
    let search: any = event.target.value;
    const result = data.pokemons.filter((pokemon: { name: any }): void =>
      // Now is't always one behind when you search - event.target.value.toLowerCase gives an error that Type 'String' has no call signatures
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResult(result);
  };

  if (loading) {
    return (
      <>
        <h1>Pokemons are loading</h1>
      </>
    );
  }

  if (pokemonError) {
    return (
      <>
        <h1>Pokemons could not be loaded</h1>
      </>
    );
  }

  if (pokemonImageError) {
    return (
      <>
        <h1>Pokemon could not be loaded</h1>
      </>
    );
  }

  if (searchResult) {
    return (
      <>
        <h1>Search Pokemons</h1>
        <input type="search" onChange={searchPokemon} />
        <button>Search</button>
        {searchResult.map((pokemon: any) => (
          <div key={pokemon.name}>
            {pokemon.name}

            <PokemonPopup>
              <BsInfoCircle
                className="info-icon"
                onMouseEnter={() => {
                  fetchAbilities({
                    context: { clientName: "pokemon2" },
                    variables: {
                      name: pokemon.name,
                    },
                  });
                  fetchImages({
                    variables: { name: pokemon.name.toLowerCase() },
                    context: { clientName: "pokeapiImages" },
                  });
                }}
              />

              <div className="pokemon-info">
                <h1>
                  <img
                    src={
                      pokemonImageData &&
                      pokemonAbilityData &&
                      pokemonImageData.pokemon.sprites.front_default
                    }
                  ></img>
                  {pokemonImageData &&
                    pokemonAbilityData &&
                    pokemonAbilityData.pokemon.name}
                </h1>
                <table>
                  <tbody>
                    <tr>
                      <td>Weight minimum</td>
                      <td>
                        {pokemonImageData &&
                          pokemonAbilityData &&
                          pokemonAbilityData.pokemon.weight.minimum}
                      </td>
                    </tr>
                    <tr>
                      <td>Weight maximum</td>
                      <td>
                        {pokemonImageData &&
                          pokemonAbilityData &&
                          pokemonAbilityData.pokemon.weight.maximum}
                      </td>
                    </tr>

                    <tr>
                      <td>Height minimum</td>
                      <td>
                        {pokemonImageData &&
                          pokemonAbilityData &&
                          pokemonAbilityData.pokemon.height.maximum}
                      </td>
                    </tr>
                    <tr>
                      <td>Height maximum</td>
                      <td>
                        {pokemonImageData &&
                          pokemonAbilityData &&
                          pokemonAbilityData.pokemon.height.maximum}
                      </td>
                    </tr>
                    <tr>
                      <td>Weaknesses</td>
                      <td>
                        {pokemonImageData &&
                          pokemonAbilityData &&
                          pokemonAbilityData.pokemon.weaknesses}
                      </td>
                    </tr>
                    <tr>
                      <td>Fast attacks</td>
                      <td>
                        {pokemonImageData &&
                          pokemonAbilityData &&
                          pokemonAbilityData.pokemon.attacks.fast.map(
                            (attack: {
                              name: string;
                              type: string;
                              damage: number;
                            }) => (
                              <ul key={attack.name}>
                                <li>Attack: {attack.name}</li>
                                <li>Type: {attack.type}</li>
                                <li>Damage: {attack.damage}</li>
                              </ul>
                            )
                          )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </PokemonPopup>
          </div>
        ))}
      </>
    );
  }

  if (!searchTerm) {
    return (
      <>
        <h1>Search Pokemons</h1>
        <input type="search" onChange={searchPokemon} />
        <button>Search</button>
      </>
    );
  } else {
    return <></>;
  }
};

export default Pokemon;
