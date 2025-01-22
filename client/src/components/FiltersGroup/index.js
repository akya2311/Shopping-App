import React from 'react';
import { BsSearch } from 'react-icons/bs';
import './index.css';

const FiltersGroup = props => {
  const renderCategoriesList = () => {
    const { categoryOptions, changeCategory, activeCategoryId } = props;

    return categoryOptions.map(category => {
      const isActive = activeCategoryId === category.name;
      const categoryClassName = isActive
        ? 'category-name active-category-name'
        : 'category-name';

      const onClickCategoryItem = () => changeCategory(category.name);

      return (
        <li
          className="category-item"
          key={category.name}
          onClick={onClickCategoryItem}
        >
          <p className={categoryClassName}>{category.name}</p>
        </li>
      );
    });
  };

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      props.enterSearchInput();
    }
  };

  const onChangeSearchInput = event => {
    props.changeSearchInput(event.target.value);
  };

  const renderSearchInput = () => (
    <div className="search-input-container">
      <input
        type="search"
        value={props.searchInput}
        className="search-input"
        placeholder="Search"
        onChange={onChangeSearchInput}
        onKeyDown={onEnterSearchInput}
      />
      <BsSearch className="search-icon" />
    </div>
  );

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      <h1 className="category-heading">Category</h1>
      <ul className="categories-list">{renderCategoriesList()}</ul>
      <button
        type="button"
        className="clear-filters-btn"
        onClick={props.clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FiltersGroup;
