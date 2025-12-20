import React, { useState, useMemo } from "react";
import styles from "./DictionaryListPage.module.css";
import AnimalCard from "../../components/dictionary/AnimalCard";
import AnimalFilter from "../../components/dictionary/AnimalFilter";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { animalData } from "../../utils/animalData";

const DictionaryListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchInput, setSearchInput] = useState(""); // 입력 중인 검색어
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색에 사용되는 검색어

  // 오늘의 동물 (랜덤 선택 - 초기에 한 번만)
  const [todayAnimal] = useState(() => {
    const randomIndex = Math.floor(Math.random() * animalData.length);
    return animalData[randomIndex];
  });

  // 필터링된 동물 목록 (useMemo로 최적화)
  const filteredAnimals = useMemo(() => {
    let result = animalData;

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      result = result.filter((animal) => animal.category === selectedCategory);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      result = result.filter(
        (animal) =>
          animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const displayName = user?.name ?? "집사님";

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleTodayAnimalClick = () => {
    navigate(`/dictionary/${todayAnimal.id}`);
  };

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      <div className={styles.dashboardPage}>
        <DashboardHeader displayName={displayName} onLogout={handleLogout} />

        <div className={styles.container}>
          {/* 페이지 헤더 */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>📚 동물 사전</h1>
            <p className={styles.pageSubtitle}>
              다양한 동물들의 품종과 특성을 알아보세요
            </p>
          </div>

          {/* 오늘의 동물 */}
          {todayAnimal && (
            <div className={styles.todayAnimal}>
              <span className={styles.todayBadge}>⭐ 오늘의 동물</span>
              <div className={styles.todayContent}>
                <img
                  src={todayAnimal.image}
                  alt={todayAnimal.name}
                  className={styles.todayImage}
                />
                <div className={styles.todayInfo}>
                  <span className={styles.todayCategory}>
                    {todayAnimal.category === "강아지"
                      ? "🐕"
                      : todayAnimal.category === "고양이"
                      ? "🐈"
                      : todayAnimal.category === "조류"
                      ? "🐦"
                      : "🐰"}{" "}
                    {todayAnimal.category}
                  </span>
                  <h2 className={styles.todayTitle}>
                    {todayAnimal.name} ({todayAnimal.breed})
                  </h2>
                  <p className={styles.todayDescription}>
                    {todayAnimal.description}
                  </p>
                  <div className={styles.todayDetails}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>크기</div>
                      <div className={styles.detailValue}>
                        {todayAnimal.size}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>성격</div>
                      <div className={styles.detailValue}>
                        {todayAnimal.personality}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>털 관리</div>
                      <div className={styles.detailValue}>
                        {todayAnimal.grooming}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>운동량</div>
                      <div className={styles.detailValue}>
                        {todayAnimal.exercise}
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.todayBtn}
                    onClick={handleTodayAnimalClick}
                  >
                    자세히 보기 →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 필터 섹션 */}
          <AnimalFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchInput}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
          />

          {/* 결과 카운트 */}
          <div className={styles.resultsCount}>
            총 <strong>{filteredAnimals.length}</strong>종의 동물 정보가
            있습니다
          </div>

          {/* 동물 그리드 */}
          <div className={styles.animalsGrid}>
            {filteredAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>

          {/* 검색 결과가 없을 때 */}
          {filteredAnimals.length === 0 && (
            <div className={styles.noResults}>
              <p>검색 결과가 없습니다.</p>
              <p>다른 검색어를 입력해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DictionaryListPage;
