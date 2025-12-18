import React, { useState, useMemo } from "react";
import styles from "./DictionaryListPage.module.css";
import AnimalCard from "../../components/dictionary/AnimalCard";
import AnimalFilter from "../../components/dictionary/AnimalFilter";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

// 동물 데이터
import {
  malteseProfile,
  goldenRetrieverProfile,
  poodleProfile,
  shihTzuProfile,
} from "../../data/dictionary/dogs";
import {
  munchkinProfile,
  siameseCatProfile,
  persianCatProfile,
  russianBlueProfile,
} from "../../data/dictionary/cats";
import {
  netherlandDwarfProfile,
  hollandLopRabbitProfile,
} from "../../data/dictionary/rabbit";
import {
  syrianHamsterProfile,
  roborovskiHamsterProfile,
} from "../../data/dictionary/Hamsters";
import { americanGuineaPigProfile } from "../../data/dictionary/GuineaPigs";
import {
  budgerigarProfile,
  cockatielProfile,
} from "../../data/dictionary/birds";

// 프로필 데이터를 카드용 데이터로 변환하는 함수
const transformProfileToCard = (profile, category, id) => {
  // 카테고리별 이미지 URL 매핑 (임시 - 실제 이미지로 교체 필요)
  const imageMap = {
    말티즈:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop",
    "골든 리트리버":
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    푸들: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop",
    시츄: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
    먼치킨:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop",
    "샴 고양이":
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop",
    페르시안:
      "https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=400&h=300&fit=crop",
    "러시안 블루":
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400&h=300&fit=crop",
    "네덜란드 드워프":
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
    "홀랜드 롭":
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=300&fit=crop",
    "시리안 햄스터":
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
    "로보로브스키 햄스터":
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=300&fit=crop",
    "아메리칸 기니피그":
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=300&fit=crop",
    "버저리거 (잉꼬)":
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
    코카틸:
      "https://images.unsplash.com/photo-1616781833946-79cad5d0c19c?w=400&h=300&fit=crop",
  };

  return {
    id: id,
    name: profile.breed_kr,
    breed: profile.breed_en,
    category: category,
    image:
      imageMap[profile.breed_kr] ||
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
    description: profile.breedOverview,
    tags: profile.badges || profile.temperamentTags.slice(0, 3),
    size: profile.averageSize,
    personality: profile.temperamentTags.join(", "),
    exercise: profile.dailyCare?.exerciseAndWalk?.[0]?.title || "정보 없음",
    grooming: profile.groomingLevel,
  };
};

// 동물 데이터 배열 생성
const animalData = [
  // 강아지
  transformProfileToCard(malteseProfile, "강아지", 1),
  transformProfileToCard(goldenRetrieverProfile, "강아지", 2),
  transformProfileToCard(poodleProfile, "강아지", 3),
  transformProfileToCard(shihTzuProfile, "강아지", 4),

  // 고양이
  transformProfileToCard(munchkinProfile, "고양이", 5),
  transformProfileToCard(siameseCatProfile, "고양이", 6),
  transformProfileToCard(persianCatProfile, "고양이", 7),
  transformProfileToCard(russianBlueProfile, "고양이", 8),

  // 소형동물
  transformProfileToCard(netherlandDwarfProfile, "소형동물", 9),
  transformProfileToCard(hollandLopRabbitProfile, "소형동물", 10),
  transformProfileToCard(syrianHamsterProfile, "소형동물", 11),
  transformProfileToCard(roborovskiHamsterProfile, "소형동물", 12),
  transformProfileToCard(americanGuineaPigProfile, "소형동물", 13),

  // 조류
  transformProfileToCard(budgerigarProfile, "조류", 14),
  transformProfileToCard(cockatielProfile, "조류", 15),
];

const DictionaryListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    // 검색은 실시간으로 이루어지므로 추가 동작 불필요
  };

  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const displayName = user?.name ?? "집사님";

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
                  <button className={styles.todayBtn}>자세히 보기 →</button>
                </div>
              </div>
            </div>
          )}

          {/* 필터 섹션 */}
          <AnimalFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
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
