import React, { useEffect, useState } from "react";
import common from "../data/common";
import { Link } from "react-router-dom";
import { logger } from "../utils/logger";
import { omit } from "lodash";
import axios from "axios";

const Filter = ({
  appliedFilters,
  applyAdvanceFilter,
  searchValue,
  setSearchValue,
  isAdvanceFilter,
  types,
  setIsAdvanceFilter,
}) => {
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
    return (
      <li>
        <div>
          <span
            data-value={type}
            className={`radio-button ${appliedFilters[type] ? `active` : ""}`}
            onClick={() => {
              const state = !appliedFilters[type];
              applyAdvanceFilter(type, state);
              logger.info(`radio button for type ${type} is set to ${state}`);
            }}
          ></span>
          <span className={`type ${type.toLowerCase()}-type-color`}>
            {type}
          </span>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="search-container">
        <div className="container search-content">
          <div>
            <label htmlFor="search">
              {common.filter.basic.searchPlaceHolder}
            </label>
            <div>
              <input
                type="text"
                id="search-input"
                autoComplete="off"
                value={searchValue}
                onChange={(event) => {
                  const val = event.target.value || "";
                  logger.info(`Search field input is ${val}`);
                  setSearchValue(val);
                }}
              />
              <input
                type="submit"
                value={common.labels.search}
                id="search"
                className="background-transition"
              />
            </div>
            <p className="additional-info">
              {" "}
              {common.filter.basic.additionalInfo}
            </p>
          </div>
          <div>
            <p className="clarification display-flex-center">
              {" "}
              {common.filter.basic.clarification}
            </p>
          </div>
        </div>
      </div>
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
    </>
  );
};

const Main = ({
  data,
  setFilterDropdownActive,
  filterDrowndownActive,
  selectedDropdownFilter,
}) => {
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
          onClick={() => {
            const state = !filterDrowndownActive;
            setFilterDropdownActive(state);
          }}
        >
          <span id="selected-filter">Ascending PokeID</span>{" "}
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
          <li
            className="background-transition"
            onClick={selectedDropdownFilter}
          >
            Ascending PokeID
          </li>
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
        <FilterDropdown />
      </div>
      <ul className="lst-pokemons">
        {data
          ? data.map((pokemon, idx) => (
              <PokemonCard
                key={idx}
                name={pokemon.poke_name}
                id={pokemon.poke_id}
                types={pokemon.types}
              />
            ))
          : "...Loading"}
      </ul>
    </main>
  );
};

const Home = () => {
  const [data, setData] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [isAdvanceFilter, setIsAdvanceFilter] = useState(false);
  const types = [...common.pokemonTypes];
  // for drop down filter
  const [filterDrowndownActive, setFilterDropdownActive] = useState(false);
  const filterOptions = {
    ascending: "Ascending PokeID",
    descending: "Descending PokeID",
    AZ: "A-Z",
    ZA: "Z-A",
  };
  const [filterDropdownValue, setFilterDropdownValue] = useState(
    filterOptions.ascending
  );

  const applyAdvanceFilter = (type, isActive) => {
    var filterTypes = { ...appliedFilters };
    if (isActive) filterTypes[type] = isActive;
    else filterTypes = omit(filterTypes, [type]);
    logger.info(filterTypes);
    setAppliedFilters(filterTypes);
  };

  const selectedDropdownFilter = (event) => {
    console.log(event);
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8080/getPokemons`)
      .then((res) => {
        const res_data = res.data;
        logger.info("Fetched data from home: ", res_data);
        setData(res_data.pokemons);
      })
      .catch((error) => {
        logger.error(error);
      });
  }, []);

  return (
    <>
      <Filter
        appliedFilters={appliedFilters}
        applyAdvanceFilter={applyAdvanceFilter}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isAdvanceFilter={isAdvanceFilter}
        setIsAdvanceFilter={setIsAdvanceFilter}
        types={types}
      />
      <Main
        data={data}
        filterDrowndownActive={filterDrowndownActive}
        setFilterDropdownActive={setFilterDropdownActive}
        selectedDropdownFilter={selectedDropdownFilter}
      />
    </>
  );
};

export default Home;
