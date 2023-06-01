import React, { useEffect, useRef, useState } from "react";
import common from "../data/common";
import { Link } from "react-router-dom";
import { pokemons } from "../pokemons";
import { logger } from "../utils/logger";

const Filter = ({ searchValue }) => {
  const types = common.pokemonTypes;

  const [isAdvanceFilter, setIsAdvanceFilter] = useState(false);

  const Basic = () => {
    return (
      <div className="search-container">
        <div className="container search-content">
          <div>
            <label htmlFor="Search">
              {common.filter.basic.searchPlaceHolder}
            </label>
            <div>
              <input
                type="text"
                id="search-input"
                autoComplete="off"
                ref={searchValue}
              />
              <input
                type="submit"
                value={common.labels.search}
                id="search"
                className="background-transition"
              />
            </div>
            <p className="additional-info">
              {common.filter.basic.additionalInfo}
            </p>
          </div>
          <div>
            <p className="clarification display-flex-center">
              {common.filter.basic.clarification}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const Advance = () => {
    const FilterButton = ({ name, id }) => {
      return (
        <div
          className="filter-button background-transition"
          id={id}
          role="button"
        >
          {name}
        </div>
      );
    };

    const TypeFilter = ({ type }) => {
      const [isActive, setIsActive] = useState(false);

      return (
        <li>
          <div>
            <span
              data-value={type}
              className={`radio-button ${isActive ? `active` : ""}`}
              onClick={() => setIsActive(!isActive)}
            ></span>
            <span className={`type ${type.toLowerCase()}-type-color`}>
              {type}
            </span>
          </div>
        </li>
      );
    };

    return (
      <div>
        <div className="blocky filter-backgrounnd-color"></div>
        <div
          className="container additional-filter filter-backgrounnd-color"
          style={isAdvanceFilter ? { maxHeight: "100%" } : { maxHeight: "0" }}
        >
          <p className="title">Filter By Type</p>
          <hr />
          <p style={{ marginBottom: "0.5rem" }}>
            Filter by type by selecting one or more type using the circle
            buttons on the left hand of each type.
          </p>
          <p>
            Click the filter button when ready, or reset to reset the Pokédex.
          </p>
          <div className="filter-container">
            <ul className="type-filter">
              {types.map((item, idx) => (
                <TypeFilter key={idx} type={item} />
              ))}
            </ul>
            <div className="filter-button-wrap" style={{ marginTop: "1rem" }}>
              <FilterButton name="Filter" id="filter" />
              <FilterButton name="Reset" id="reset" />
            </div>
          </div>
        </div>
        <div className="container add-dropdown-container">
          <div
            className="filter-backgrounnd-color display-flex-center"
            onClick={() => setIsAdvanceFilter(!isAdvanceFilter)}
          >
            Advance Search{" "}
            <span className="display-flex-center">
              <i
                className="rotate-45deg"
                id="rotate-arrow-dropdown"
                style={
                  isAdvanceFilter
                    ? { borderWidth: "2px 0px 0px 2px" }
                    : { borderWidth: "0px 2px 2px 0px" }
                }
              ></i>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Basic />
      <Advance />
    </>
  );
};

const Main = ({ data }) => {
  const [filterDrowndownActive, setFilterDropdownActive] = useState(false);
  const PokemonCard = ({ name, id, types }) => {
    const Type = ({ type }) => {
      return <span className={`${type.toLowerCase()}-type-color`}>{type}</span>;
    };

    return (
      <li>
        <div className="favorite-star" id={id}></div>
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

  const FilterDropdown = () => {
    return (
      <div className="select-dropdown-filter filter2-buttons">
        <div
          className="select-trigger opacity-transition"
          id="selection-dropdown"
        >
          <span id="selected-filter">Ascending PokeID</span>{" "}
          <span className="trigger-arrow-container display-flex-center">
            <i className="rotate-45deg" id="trigger-select-arrow"></i>
          </span>
        </div>
        <ul className="custom-options" id="custom-options-selection">
          <li className="background-transition">Ascending PokeID</li>
          <li className="background-transition">Descending PokeID</li>
          <li className="background-transition">A-Z</li>
          <li className="background-transition">Z-A</li>
        </ul>
      </div>
    );
  };

  return (
    <main className="container main-pokedex-section">
      <div className="filter2-button-container">
        <div
          id="shuffle-pokedex"
          className="standard-button filter2-buttons display-flex-center opacity-transition"
        >
          Shuffle Pokédex
        </div>
        <FilterDropdown />
      </div>
      <ul className="lst-pokemons">
        {data
          ? data.map((pokemon, idx) => (
              <PokemonCard
                key={idx}
                name={pokemon.name}
                id={pokemon.id}
                types={pokemon.type}
              />
            ))
          : "...Loading"}
      </ul>
    </main>
  );
};

const Home = () => {
  const [data, setData] = useState(pokemons);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <Filter searchValue={searchValue} />
      <Main data={data} />
    </>
  );
};

export default Home;
