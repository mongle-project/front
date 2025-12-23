import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { getNewsList } from "../../api/news";
import styles from "./NewsListPage.module.css";

const NewsListPage = () => {
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";

  const [currentPage, setCurrentPage] = useState(1);
  const [newsData, setNewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [famliyInfoData, setFamliyInfoData] = useState(null);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await getNewsList();

        setNewsData(response.news);
        setFamliyInfoData(response.familyInfo);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("뉴스를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (pcUrl) => {
    if (pcUrl) {
      window.open(pcUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <DashboardHeader displayName={displayName} onLogout={logout} />
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>📰 반려동물 뉴스</h1>
            <p className={styles.pageSubtitle}>
              최신 반려동물 소식과 유용한 정보를 확인하세요
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "40px" }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <DashboardHeader displayName={displayName} onLogout={logout} />
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>📰 반려동물 뉴스</h1>
            <p className={styles.pageSubtitle}>
              최신 반려동물 소식과 유용한 정보를 확인하세요
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없거나 빈 배열인 경우
  if (!newsData || newsData.length === 0) {
    return (
      <div className={styles.page}>
        <DashboardHeader displayName={displayName} onLogout={logout} />
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>📰 반려동물 뉴스</h1>
            <p className={styles.pageSubtitle}>
              최신 반려동물 소식과 유용한 정보를 확인하세요
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "40px" }}>
            뉴스가 없습니다.
          </div>
        </div>
      </div>
    );
  }

  // 페이지당 표시할 뉴스 개수
  const newsPerPage = 10;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(newsData.length / newsPerPage);

  // 첫 페이지만 헤드라인 뉴스 포함
  let headlineNewsData = null;
  let newsListData = [];

  if (currentPage === 1) {
    // 첫 페이지: 헤드라인 1개 + 리스트 9개
    headlineNewsData = newsData[0];
    newsListData = newsData.slice(1, newsPerPage);
  } else {
    // 나머지 페이지: 리스트 10개
    const startIndex = (currentPage - 1) * newsPerPage;
    const endIndex = startIndex + newsPerPage;
    newsListData = newsData.slice(startIndex, endIndex);
  }

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
            {/* 헤드라인 뉴스 - 첫 페이지만 표시 */}
            {headlineNewsData && (
              <article
                className={styles.headlineNews}
                onClick={() => handleNewsClick(headlineNewsData.pcUrl)}
              >
                <div className={styles.headlineImageWrapper}>
                  <img
                    src={headlineNewsData.imageUrl}
                    alt={headlineNewsData.title}
                    className={styles.headlineImage}
                  />
                  <span className={styles.headlineBadge}>🔥 HOT</span>
                </div>
                <div className={styles.headlineContent}>
                  <h2 className={styles.headlineTitle}>
                    {headlineNewsData.title}
                  </h2>
                  <p className={styles.headlineDescription}>
                    {headlineNewsData.summary}
                  </p>
                  <div className={styles.newsMeta}>
                    <span className={styles.metaItem}>
                      📰 {headlineNewsData.cpName || ""}
                    </span>
                    <span className={styles.metaItem}>
                      📅 {headlineNewsData.createdAt}
                    </span>
                  </div>
                </div>
              </article>
            )}

            {/* 뉴스 리스트 */}
            <div className={styles.newsList}>
              {newsListData.map((news) => (
                <article
                  key={news.id}
                  className={styles.newsCard}
                  onClick={() => handleNewsClick(news.pcUrl)}
                >
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className={styles.newsImage}
                  />
                  <div className={styles.newsContent}>
                    <div>
                      <h3 className={styles.newsTitle}>{news.title}</h3>
                    </div>
                    <div className={styles.newsMeta}>
                      <span className={styles.metaItem}>
                        📰 {news.cpName || ""}
                      </span>
                      <span className={styles.metaItem}>
                        📅 {news.createdAt}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${
                      currentPage === page ? styles.active : ""
                    }`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className={styles.pageBtn}
                onClick={() =>
                  handlePageClick(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          </div>

          {/* 사이드바 */}
          <aside className={styles.sidebar}>
            {/* 가족이 되어주세요 뉴스 */}
            <div className={styles.popularNews}>
              <h3 className={styles.sidebarTitle}>
                <span>👍</span>
                가족이 되어주세요
              </h3>
              <div className={styles.popularList}>
                {famliyInfoData && famliyInfoData.length > 0 ? (
                  famliyInfoData.map((news) => (
                    <div
                      key={news.id}
                      className={styles.popularItem}
                      onClick={() => handleNewsClick(news.pcUrl)}
                    >
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className={styles.newsImage}
                      />
                      <div className={styles.popularContent}>
                        <h4 className={styles.popularTitle}>{news.title}</h4>
                        <p className={styles.popularDescription}>
                          {news.summary}
                        </p>
                        <div className={styles.newsMeta}>
                          <span className={styles.metaItem}>
                            📰 {news.cpName || ""}
                          </span>
                          <span className={styles.metaItem}>
                            📅 {news.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                    }}
                  >
                    해당 뉴스가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsListPage;
