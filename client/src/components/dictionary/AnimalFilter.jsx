import React from 'react';
import styles from './AnimalFilter.module.css';

const AnimalFilter = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSearch
}) => {
  const categories = [
    { name: '전체', icon: '🌟' },
    { name: '강아지', icon: '🐕' },
    { name: '고양이', icon: '🐈' },
    { name: '소형동물', icon: '🐰' },
    { name: '조류', icon: '🐦' },
    { name: '파충류', icon: '🦎' },
    { name: '어류', icon: '🐠' }
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterTop}>
        <div className={styles.categoryFilters}>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`${styles.filterBtn} ${
                selectedCategory === category.name ? styles.active : ''
              }`}
              onClick={() => onCategoryChange(category.name)}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="품종명으로 검색해보세요..."
            value={searchQuery}
            onChange={onSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button className={styles.searchBtn} onClick={onSearch}>
            🔍 검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalFilter;
