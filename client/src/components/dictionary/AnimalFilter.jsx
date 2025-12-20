import React from "react";
import styles from "./AnimalFilter.module.css";

const AnimalFilter = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSearch,
}) => {
  const categories = [
    { name: "전체", icon: "🌟" },
    { name: "강아지" },
    { name: "고양이" },
    { name: "토끼" },
    { name: "기니피그" },
    { name: "햄스터" },
    { name: "새" },
    { name: "파충류" },
    { name: "어류" },
    { name: "거북이" },
  ];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <>
      <div className={styles.filterSection}>
        <div className={styles.filterTop}>
          <div className={styles.categoryFilters}>
            {categories.map((category) => (
              <button
                key={category.name}
                className={`${styles.filterBtn} ${
                  selectedCategory === category.name ? styles.active : ""
                }`}
                onClick={() => onCategoryChange(category.name)}
              >
                {category.icon && <span>{category.icon}</span>}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.searchBoxSpace}>
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
    </>
  );
};

export default AnimalFilter;
