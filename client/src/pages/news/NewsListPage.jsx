import React, { useState } from "react";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import styles from "./NewsListPage.module.css";

const NewsListPage = () => {
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";

  const [currentPage, setCurrentPage] = useState(1);

  const headlineNews = {
    id: 1,
    category: "정책/제도",
    categoryIcon: "📢",
    title: "2025년부터 반려동물 등록 의무화 강화... 미등록 시 과태료 100만원",
    description:
      "정부가 반려동물 등록제를 강화하여 2025년 1월부터 미등록 반려동물에 대한 과태료를 기존 60만원에서 100만원으로 상향 조정한다고 발표했습니다. 또한 동물등록 방법도 내장형 마이크로칩으로 일원화될 예정입니다.",
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=600&fit=crop",
    date: "2024.12.10",
    views: 12345,
    comments: 89,
    isHot: true,
  };

  const newsList = [
    {
      id: 2,
      category: "건강/의료",
      categoryIcon: "🏥",
      title: "겨울철 강아지 관리법, 체온 유지가 핵심",
      description:
        "기온이 영하로 떨어지는 겨울철, 반려견의 건강을 지키기 위한 체온 관리법과 주의사항을 전문 수의사가 설명합니다.",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=400&fit=crop",
      date: "2024.12.09",
      views: 8234,
    },
    {
      id: 3,
      category: "영양/사료",
      categoryIcon: "🍖",
      title: "고양이 사료 리콜 사태, 주요 브랜드 3종 포함",
      description:
        "식약처가 특정 고양이 사료에서 기준치를 초과한 중금속이 검출되어 해당 제품의 판매 중지 및 회수 조치를 내렸습니다.",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop",
      date: "2024.12.09",
      views: 15678,
    },
    {
      id: 4,
      category: "교육/훈련",
      categoryIcon: "🎓",
      title: "반려견 사회화 교육, 어릴 때부터 시작해야",
      description:
        "전문가들은 강아지의 사회화 교육이 생후 3-14주 사이에 이루어져야 한다고 강조합니다. 이 시기를 놓치면...",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop",
      date: "2024.12.08",
      views: 6543,
    },
    {
      id: 5,
      category: "꿀팁",
      categoryIcon: "💡",
      title: "햄스터 키우기 전 꼭 알아야 할 10가지",
      description:
        "작고 귀여운 외모로 인기 있는 햄스터, 하지만 제대로 알고 키우는 사람은 많지 않습니다. 초보 집사를 위한 필수 가이드.",
      image:
        "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=400&fit=crop",
      date: "2024.12.08",
      views: 4321,
    },
    {
      id: 6,
      category: "이벤트",
      categoryIcon: "🎉",
      title: "2025 서울 펫페어, 1월 코엑스에서 개최",
      description:
        "국내 최대 규모의 반려동물 박람회가 내년 1월 15일부터 3일간 코엑스에서 열립니다. 사전등록 시 입장료 할인.",
      image:
        "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=500&h=400&fit=crop",
      date: "2024.12.07",
      views: 9876,
    },
  ];

  const popularNews = [
    {
      id: 1,
      title: "반려동물 등록 의무화 강화, 과태료 100만원으로 인상",
      date: "2024.12.10",
    },
    {
      id: 2,
      title: "고양이 사료 리콜 사태, 주요 브랜드 3종 판매중지",
      date: "2024.12.09",
    },
    {
      id: 3,
      title: "2025 서울 펫페어 개최, 사전등록 시작",
      date: "2024.12.07",
    },
    {
      id: 4,
      title: "겨울철 반려견 산책, 이것만은 꼭 지키세요",
      date: "2024.12.09",
    },
    {
      id: 5,
      title: "반려동물 의료비 부담 줄이는 보험 가입 팁",
      date: "2024.12.06",
    },
  ];

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsClick = (newsId) => {
    // TODO: 뉴스 상세 페이지로 이동
    console.log("뉴스 클릭:", newsId);
  };

  return (
    <div className={styles.page}>
      <DashboardHeader displayName={displayName} onLogout={logout} />

      <div className={styles.container}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>📰 반려동물 뉴스</h1>
          <p className={styles.pageSubtitle}>
            최신 반려동물 소식과 유용한 정보를 확인하세요
          </p>
        </div>

        {/* 뉴스 레이아웃 */}
        <div className={styles.newsLayout}>
          {/* 메인 뉴스 섹션 */}
          <div className={styles.mainNewsSection}>
            {/* 헤드라인 뉴스 */}
            <article
              className={styles.headlineNews}
              onClick={() => handleNewsClick(headlineNews.id)}
            >
              <div className={styles.headlineImageWrapper}>
                <img
                  src={headlineNews.image}
                  alt={headlineNews.title}
                  className={styles.headlineImage}
                />
                {headlineNews.isHot && (
                  <span className={styles.headlineBadge}>🔥 HOT</span>
                )}
              </div>
              <div className={styles.headlineContent}>
                <span className={styles.newsCategory}>
                  {headlineNews.categoryIcon} {headlineNews.category}
                </span>
                <h2 className={styles.headlineTitle}>{headlineNews.title}</h2>
                <p className={styles.headlineDescription}>
                  {headlineNews.description}
                </p>
                <div className={styles.newsMeta}>
                  <span className={styles.metaItem}>
                    📅 {headlineNews.date}
                  </span>
                  <span className={styles.metaItem}>
                    👁️ {headlineNews.views.toLocaleString()}
                  </span>
                  <span className={styles.metaItem}>
                    💬 {headlineNews.comments}
                  </span>
                </div>
              </div>
            </article>

            {/* 뉴스 리스트 */}
            <div className={styles.newsList}>
              {newsList.map((news) => (
                <article
                  key={news.id}
                  className={styles.newsCard}
                  onClick={() => handleNewsClick(news.id)}
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className={styles.newsImage}
                  />
                  <div className={styles.newsContent}>
                    <div>
                      <span className={styles.newsCategory}>
                        {news.categoryIcon} {news.category}
                      </span>
                      <h3 className={styles.newsTitle}>{news.title}</h3>
                      <p className={styles.newsDescription}>
                        {news.description}
                      </p>
                    </div>
                    <div className={styles.newsMeta}>
                      <span className={styles.metaItem}>📅 {news.date}</span>
                      <span className={styles.metaItem}>
                        👁️ {news.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`${styles.pageBtn} ${
                    currentPage === page ? styles.active : ""
                  }`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                onClick={() => handlePageClick(Math.min(5, currentPage + 1))}
                disabled={currentPage === 5}
              >
                ▶
              </button>
            </div>
          </div>

          {/* 사이드바 */}
          <aside className={styles.sidebar}>
            {/* 인기 뉴스 */}
            <div className={styles.popularNews}>
              <h3 className={styles.sidebarTitle}>
                <span>🔥</span>
                인기 뉴스
              </h3>
              <div className={styles.popularList}>
                {popularNews.map((news, index) => (
                  <div
                    key={news.id}
                    className={styles.popularItem}
                    onClick={() => handleNewsClick(news.id)}
                  >
                    <div className={styles.popularRank}>{index + 1}</div>
                    <div className={styles.popularContent}>
                      <h4 className={styles.popularTitle}>{news.title}</h4>
                      <span className={styles.popularDate}>{news.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsListPage;
