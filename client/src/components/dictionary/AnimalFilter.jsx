import React from 'react';

const AnimalFilter = ({ onFilterChange }) => {
  return (
    <div className="animal-filter">
      <select onChange={(e) => onFilterChange(e.target.value)}>
        <option value="all">전체</option>
        <option value="dog">강아지</option>
        <option value="cat">고양이</option>
      </select>
    </div>
  );
};

export default AnimalFilter;
