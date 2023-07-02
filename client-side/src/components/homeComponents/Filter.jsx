import React from "react";
import common from "../../data/common";

const FilterButton = ({ name, id, click }) => {
  return (
    <div
      className="filter-button background-transition"
      id={id}
      role="button"
      onClick={click}
    >
      {name}
    </div>
  );
};

const TypeFilter = ({ type, appliedFilters, applyAdvanceFilter }) => {
  return (
    <li>
      <div>
        <span
          data-value={type}
          className={`radio-button ${appliedFilters[type] ? `active` : ""}`}
          onClick={() => {
            const state = !appliedFilters[type];
            applyAdvanceFilter(type, state);
          }}
        ></span>
        <span className={`type ${type.toLowerCase()}-type-color`}>{type}</span>
      </div>
    </li>
  );
};

const Filter = ({
  appliedFilters,
  applyAdvanceFilter,
  searchValue,
  setSearchValue,
  isAdvanceFilter,
  types,
  setIsAdvanceFilter,
  onSearch,
}) => {
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
                  setSearchValue(val);
                }}
              />
              <input
                type="submit"
                value={common.labels.search}
                id="search"
                className="background-transition"
                onClick={onSearch}
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
                <TypeFilter
                  key={idx}
                  type={item}
                  appliedFilters={appliedFilters}
                  applyAdvanceFilter={applyAdvanceFilter}
                />
              ))}
            </ul>
            <div className="filter-button-wrap" style={{ marginTop: "1rem" }}>
              <FilterButton name="Filter" id="filter" click={onSearch} />
              <FilterButton name="Reset" id="reset" click={undefined} />
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

export default Filter;
