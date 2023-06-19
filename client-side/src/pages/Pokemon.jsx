import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Attribute = ({ attribute }) => {
  return (
    <li className={`${attribute.toLowerCase()}-type-color`}>{attribute}</li>
  );
};

const Evolution = ({ pokeName, pokeId, types }) => {
  return (
    <li>
      <Link to={`/Pokemons/${pokeName}`}>
        <img
          src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeId}.png`}
          alt=""
        />
        <p>
          {pokeName} <span>#{pokeId}</span>
        </p>
        <ul className="type-description">
          {types.map((attribute, idx) => (
            <Attribute key={idx} attribute={attribute} />
          ))}
        </ul>
      </Link>
    </li>
  );
};

const Pokemon = ({ onFavoriteClick }) => {
  const [data, setData] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [evolutionData, setEvolutionData] = useState(null);
  const [nextPokemon, setNextPokemon] = useState(null);
  const [previousPokemon, setPreviousPokemon] = useState(null);
  const { pokemonName } = useParams();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8080/getPokemonByName?pokemonName=${pokemonName}`)
      .then((res) => {
        const fetchedData = res.data;
        setData(fetchedData);
        setPokemonData(fetchedData.pokemon);
        setEvolutionData(fetchedData.evolution);
        setNextPokemon(fetchedData.next_pokemon);
        setPreviousPokemon(fetchedData.previous_pokemon);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [pokemonName]);

  return (
    <>
      {data ? (
        <>
          <div className="top-bar-nav-container container">
            <div className="top-bar-navigation container">
              <Link
                to={`/Pokemons/${previousPokemon.poke_name}`}
                className="nav-left background-transition"
              >
                <span className="nav-arrow-container display-flex-center background-transition">
                  <i className="nav-arrow pointed-left rotate-45deg"></i>
                </span>
                <span>#{previousPokemon.poke_id}</span>
                <span className="pokeName">{previousPokemon.poke_name}</span>
              </Link>
              <Link
                to={`/Pokemons/${nextPokemon.poke_name}`}
                className="nav-right background-transition"
              >
                <span>#{nextPokemon.poke_id}</span>
                <span className="pokeName">{nextPokemon.poke_name}</span>
                <span className="nav-arrow-container display-flex-center background-transition">
                  <i className="nav-arrow pointed-right rotate-45deg"></i>
                </span>
              </Link>
            </div>
          </div>
          <div className="container single-pokemon-title">
            <div className="display-flex-center">
              <div
                className="favorite-star"
                id={pokemonData.id}
                role="button"
                onClick={() =>
                  onFavoriteClick(pokemonData.id, pokemonData.poke_name)
                }
              ></div>
              {pokemonData.poke_name} <span>#{pokemonData.poke_id}</span>
            </div>
          </div>
          <main className="container main-pokedex-section poke-single-content">
            <div className="pokemon-content">
              <img
                src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonData.poke_id}.png`}
                alt=""
              />
              <div className="pokemon-information">
                <div className="information">
                  <strong>Description:</strong>
                  <p>{pokemonData.description}</p>
                </div>
                <div className="information">
                  <strong>Type(s):</strong>
                  <ul className="type-description">
                    {pokemonData.types.map((attribute, idx) => (
                      <Attribute key={idx} attribute={attribute} />
                    ))}
                  </ul>
                </div>
                <div className="information">
                  <strong>Weakness(es):</strong>
                  <ul className="type-description">
                    {pokemonData.weaknesses.map((attribute, idx) => (
                      <Attribute key={idx} attribute={attribute} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="pokemon-evolution">
              <h2>Evolution(s)</h2>
              <ul className="evolution-pokemons">
                {evolutionData.map((evolution, idx) => (
                  <Evolution
                    key={idx}
                    pokeName={evolution.poke_name}
                    pokeId={evolution.poke_id}
                    types={evolution.types}
                  />
                ))}
              </ul>
            </div>
          </main>
        </>
      ) : (
        "...Loading"
      )}
    </>
  );
};

export default Pokemon;
