import React, { Component } from 'react';

const SortDropdown = ({ value, handleChange }) => (
  <select value={value} onChange={handleChange}>
    <option value="newest">Newest</option>
    <option value="highest">Highest Rated</option>
    <option value="lowest">Lowest Rated</option>
  </select>
);

const FilterCheckbox = ({ word, onCheck, checked }) => (
  <div className="filter">
    <label>{word}</label>
    <input type="checkbox" name={word} checked={checked} onChange={onCheck} />
  </div>
);

const FilterCheckboxes = ({ words, onCheck, checks }) => (
  <div className="filters">
    {words.map((word, idx) => <FilterCheckbox key={idx} word={word} onCheck={onCheck} checked={checks[word]} />)}
  </div>
);

export { SortDropdown, FilterCheckbox, FilterCheckboxes };