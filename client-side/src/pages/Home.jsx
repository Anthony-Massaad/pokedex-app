import React, { useEffect, useState } from "react";
import common from "../data/common";
import { omit, isEmpty, chain } from "lodash";
import axios from "axios";
import { useToastProviderContext } from "../utils/toast/Toast";
import Main from "../components/homeComponents/Main";
import Filter from "../components/homeComponents/Filter";

const Home = ({ onFavoriteClick, user, isSignedIn, showOnlyFavorites }) => {
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
  const [activefilterDropdownValue, setActiveFilterDropdownValue] = useState(
    filterOptions.ascending
  );

  const setToast = useToastProviderContext();

  const applyAdvanceFilter = (type, isActive) => {
    var filterTypes = { ...appliedFilters };
    if (isActive) filterTypes[type] = isActive;
    else filterTypes = omit(filterTypes, [type]);
    setAppliedFilters(filterTypes);
  };

  const changeOrderFilter = (filterName) => {
    setActiveFilterDropdownValue(filterName);
    setFilterDropdownActive(false);
    setData(null);
    onSearch();
  };

  useEffect(() => {
    const grabFavs = isSignedIn ? `?username=${user.username}` : "";

    const getLink = showOnlyFavorites
      ? `http://127.0.0.1:8080/getFavoritePokemons${grabFavs}`
      : `http://127.0.0.1:8080/getPokemons${grabFavs}`;

    axios
      .get(getLink)
      .then((res) => {
        const res_data = res.data;
        setData(res_data.pokemons);
      })
      .catch((error) => {
        console.error(error);
        setToast({
          severity: "error",
          title: "Load Pokemons",
          description: "Can't Load Pokemons",
        });
      });
  }, [isSignedIn, setToast, showOnlyFavorites, user.username]);

  const onSearch = () => {
    let name = "";
    let filters = "";
    if (!isEmpty(appliedFilters)) {
      filters = `&filters=${chain(appliedFilters).keysIn().join(",").value()}`;
    }

    if (!isEmpty(searchValue)) {
      name = `&pokeName=${searchValue}`;
    }

    const grabFavs = isSignedIn ? `&username=${user.username}` : "";
    const isFavoriteOnly = showOnlyFavorites
      ? `&isFavoriteOnly=${showOnlyFavorites}`
      : "";

    axios
      .get(
        `http://127.0.0.1:8080/searchPokemons?order=${activefilterDropdownValue}${name}${filters}${grabFavs}${isFavoriteOnly}`
      )
      .then((res) => {
        const res_data = res.data;
        setData(res_data.pokemons);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
        onSearch={onSearch}
      />
      <Main
        data={data}
        filterDrowndownActive={filterDrowndownActive}
        setFilterDropdownActive={setFilterDropdownActive}
        activefilterDropdownValue={activefilterDropdownValue}
        filterOptions={filterOptions}
        changeOrderFilter={changeOrderFilter}
        onFavoriteClick={onFavoriteClick}
      />
    </>
  );
};

export default Home;
