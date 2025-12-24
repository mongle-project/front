import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import styles from "./CommunityListPage.module.css";
import { getArticles } from "../../api/articles";

const categoryFilters = [
  { label: "전체", value: "all", icon: "🌟" },
  { label: "강아지", value: "dog", icon: "🐕" },
  { label: "고양이", value: "cat", icon: "🐈" },
  { label: "소형동물", value: "rabbit", icon: "🐰" },
  { label: "조류", value: "bird", icon: "🐦" },
  { label: "파충류", value: "reptile", icon: "🦎" },
  { label: "어류", value: "fish", icon: "🐠" },
  { label: "기타", value: "etc", icon: "✨" },
];

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "인기순", value: "popular" },
  { label: "댓글순", value: "comment" },
];

const CommunityListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";
  const [activeFilter, setActiveFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  const fetchArticles = useCallback(
    async ({ pageToLoad = 1, append = false } = {}) => {
      setLoading(true);
      setError("");
      try {
        const { data = [], meta = {} } = await getArticles({
          page: pageToLoad,
          category: activeFilter !== "all" ? activeFilter : undefined,
          sort,
        });

        setPosts((prev) => (append ? [...prev, ...data] : data));
        setTotalPage(meta.totalPage || 1);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setError(
          err.response?.data?.message ||
            "게시글 목록을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [activeFilter, sort]
  );

  useEffect(() => {
    setPage(1);
    fetchArticles({ pageToLoad: 1, append: false });
  }, [activeFilter, sort, fetchArticles]);

  useEffect(() => {
    if (page === 1) return;
    fetchArticles({ pageToLoad: page, append: true });
  }, [page, fetchArticles]);

  const filteredPosts = useMemo(() => {
    const lowered = keyword.trim().toLowerCase();
    if (!lowered) return posts;

    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || "";
      const content = post.content?.toLowerCase() || "";
      const writer = post.writer?.nickname?.toLowerCase() || "";
      return (
        title.includes(lowered) || content.includes(lowered) || writer.includes(lowered)
      );
    });
  }, [keyword, posts]);

  const hasMore = page < totalPage;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px 0px" }
    );

    const current = sentinelRef.current;
    if (current) observer.observe(current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  const handleCardClick = (id) => {
    navigate(`${ROUTES.COMMUNITY}/${id}`);
  };

  const getAvatar = (author) => author?.slice(0, 1) ?? "?";

  return (
    <div className={styles.page}>
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />
      <main className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>💬 정보 공유 게시판</h1>
          <p className={styles.pageSubtitle}>
            반려동물과 함께하는 일상의 모든 이야기를 나눠보세요
          </p>
        </header>

        <section className={styles.filterSection}>
          <div className={styles.filterTop}>
            <div className={styles.categoryFilters}>
              {categoryFilters.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={`${styles.filterButton} ${
                    activeFilter === tab.value ? styles.filterActive : ""
                  }`}
                  onClick={() => setActiveFilter(tab.value)}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.writeButton}
              onClick={() => navigate("/community/write")}
            >
              <span>✏️</span>
              글쓰기
            </button>
          </div>

          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="제목, 내용, 작성자로 검색해보세요..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="button" className={styles.searchButton}>
              🔍 검색
            </button>
          </div>
        </section>

        <section className={styles.postsContainer}>
          <div className={styles.postsHeader}>
            <div className={styles.postsCount}>
              총 <strong>{filteredPosts.length}</strong>개의 게시글
            </div>
            <div className={styles.sortOptions}>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.sortButton} ${
                    sort === option.value ? styles.sortActive : ""
                  }`}
                  onClick={() => setSort(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.postList}>
            {filteredPosts.map((post) => {
              const category = post.category || "전체";
              const categoryKey = post.categoryKey || post.category || "etc";
              const authorName = post.writer?.nickname || post.author || "익명";
              const summary =
                post.summary || post.content || "내용이 없습니다.";

              return (
                <article
                  key={post.id}
                  className={styles.postCard}
                  onClick={() => handleCardClick(post.id)}
                >
                  <span
                    className={`${styles.postCategory} ${
                      styles[`category_${categoryKey}`]
                    }`}
                  >
                    {category}
                  </span>
                  <h3 className={styles.postTitle}>
                    {post.title}
                    {post.isNew && <span className={styles.newBadge}>NEW</span>}
                  </h3>
                  <p className={styles.postSummary}>{summary}</p>
                  <div className={styles.postMeta}>
                    <div className={styles.postAuthor}>
                      <div className={styles.authorAvatar}>
                        {getAvatar(authorName)}
                      </div>
                      {authorName}
                    </div>
                    <span>{post.date || ""}</span>
                    <div className={styles.postStats}>
                      <span className={styles.statItem}>👁️ {post.views || 0}</span>
                      <span className={styles.statItem}>
                        💬 {post.commentCount || post.comments || 0}
                      </span>
                      <span className={styles.statItem}>
                        ❤️ {post.likeCount || post.likes || 0}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredPosts.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🪴</div>
                <p className={styles.emptyText}>
                  조건에 맞는 게시글이 없어요. 다른 키워드로 검색해 볼까요?
                </p>
              </div>
            )}
            <div ref={sentinelRef} className={styles.infiniteSentinel}>
              {loading
                ? "불러오는 중..."
                : hasMore
                ? "스크롤하여 더 보기"
                : "모든 게시글을 확인했어요."}
              {error && <div className={styles.errorText}>{error}</div>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CommunityListPage;
