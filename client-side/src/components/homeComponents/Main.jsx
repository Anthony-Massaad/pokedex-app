import { map, mapValues } from "lodash";
import React from "react";
import { Link } from "react-router-dom";

const PokemonCard = ({
  name,
  id,
  types,
  isFavorite,
  unique_id,
  onFavoriteClick,
  data,
}) => {
  const Type = ({ type }) => {
    return <span className={`${type.toLowerCase()}-type-color`}>{type}</span>;
  };

  return (
    <li>
      <div
        className={`favorite-star ${isFavorite ? "fav-added" : ""}`}
        id={id}
        role="button"
        onClick={() => {
          if (onFavoriteClick(id, name)) {
            mapValues(data, (poke) => {
              if (poke.id === unique_id) {
                poke.isFavorite = !isFavorite;
                return;
              }
            });
          }
        }}
      ></div>
      <Link to={`/pokemons/${name}`}>
        <img
          src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png`}
          alt=""
        />
        <div className="pokemon-info">
          <p className="pokeID">#{id}</p>
          <p className="pokeName">{name}</p>
          <div>
            {types.map((type, idx) => (
              <Type key={idx} type={type} />
            ))}
          </div>
        </div>
      </Link>
    </li>
  );
};

const FilterDropdown = ({
  filterDrowndownActive,
  setFilterDropdownActive,
  activefilterDropdownValue,
  changeOrderFilter,
  filterOptions,
}) => {
  return (
    <div className="select-dropdown-filter filter2-buttons">
      <div
        className="select-trigger opacity-transition"
        id="selection-dropdown"
        onClick={() => {
          const state = !filterDrowndownActive;
          setFilterDropdownActive(state);
        }}
      >
        <span id="selected-filter">{activefilterDropdownValue}</span>{" "}
        <span className="trigger-arrow-container display-flex-center">
          <i className="rotate-45deg" id="trigger-select-arrow"></i>
        </span>
      </div>
      <ul
        className={`custom-options ${
          filterDrowndownActive ? "custom-active" : ""
        }`}
        id="custom-options-selection"
      >
        {map(filterOptions, (option, idx) =>
          option !== activefilterDropdownValue ? (
            <li
              key={idx}
              className="background-transition"
              onClick={() => changeOrderFilter(option)}
            >
              {option}
            </li>
          ) : undefined
        )}
      </ul>
    </div>
  );
};

const Main = ({
  data,
  setFilterDropdownActive,
  filterDrowndownActive,
  activefilterDropdownValue,
  filterOptions,
  changeOrderFilter,
  onFavoriteClick,
}) => {
  return (
    <main className="container main-pokedex-section">
      <div className="filter2-button-container">
        <FilterDropdown
          filterDrowndownActive={filterDrowndownActive}
          setFilterDropdownActive={setFilterDropdownActive}
          activefilterDropdownValue={activefilterDropdownValue}
          changeOrderFilter={changeOrderFilter}
          filterOptions={filterOptions}
        />
      </div>
      <ul className="lst-pokemons">
        {data
          ? data.map((pokemon, idx) => (
              <PokemonCard
                key={idx}
                name={pokemon.poke_name}
                id={pokemon.poke_id}
                types={pokemon.types}
                isFavorite={pokemon.isFavorite}
                unique_id={pokemon.id}
                onFavoriteClick={onFavoriteClick}
                data={data}
              />
            ))
          : "...Loading"}
      </ul>
    </main>
  );
};

export default Main;
