import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import styles from "./CommunityListPage.module.css";
import {
  getArticles,
  getMyArticles,
  getBookmarkedArticles,
} from "../../api/articles";

const categoryFilters = [
  { label: "전체", value: "all", icon: "✨" },
  { label: "강아지", value: "dog", icon: "🐶" },
  { label: "고양이", value: "cat", icon: "🐱" },
  { label: "토끼", value: "rabbit", icon: "🐰" },
  { label: "기니피그", value: "guinea pig", icon: "🐭" },
  { label: "어류", value: "fish", icon: "🐠" },
  { label: "햄스터", value: "hamster", icon: "🐹" },
  { label: "파충류", value: "reptile", icon: "🦎" },
  { label: "새", value: "bird", icon: "🐦" },
  { label: "거북이", value: "turtle", icon: "🐢" },
];

const categoryLabelMap = categoryFilters.reduce((acc, cur) => {
  if (cur.value !== "all") acc[cur.value] = cur.label;
  return acc;
}, {});

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "인기순", value: "popular" },
];

const CommunityListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuthContext();
  const displayName = user?.id || user?.name || "집사님";
  const [activeFilter, setActiveFilter] = useState("all");
  // URL 파라미터에서 초기값 설정
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(() => {
    return searchParams.get("filter") === "myPosts";
  });
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(() => {
    return searchParams.get("filter") === "bookmarked";
  });
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);
  const isFirstRender = useRef(true);

  // URL 파라미터 변경 감지 (첫 렌더링 제외)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const filterParam = searchParams.get("filter");
    if (filterParam === "myPosts") {
      setShowMyPostsOnly(true);
      setShowBookmarkedOnly(false);
    } else if (filterParam === "bookmarked") {
      setShowMyPostsOnly(false);
      setShowBookmarkedOnly(true);
    } else {
      setShowMyPostsOnly(false);
      setShowBookmarkedOnly(false);
    }
  }, [searchParams]);

  const fetchArticles = useCallback(
    async ({ pageToLoad = 1, append = false } = {}) => {
      setLoading(true);
      setError("");
      try {
        let data = [];
        let meta = {};

        if (showMyPostsOnly) {
          // 내가 작성한 글만 가져오기
          const response = await getMyArticles(1000, 0);
          const myArticlesData = response.data || response;
          data = Array.isArray(myArticlesData)
            ? myArticlesData
            : myArticlesData.articles || [];
          meta = { totalPage: 1 };
        } else if (showBookmarkedOnly) {
          // 북마크한 글만 가져오기
          const response = await getBookmarkedArticles(1000, 0);
          const bookmarkedData = response.data || response;
          data = Array.isArray(bookmarkedData)
            ? bookmarkedData
            : bookmarkedData.articles || [];
          meta = { totalPage: 1 };
        } else {
          // 전체 게시글 가져오기
          const response = await getArticles({
            page: pageToLoad,
            category: activeFilter !== "all" ? activeFilter : undefined,
            sort,
          });
          data = response.data || [];
          meta = response.meta || {};
        }

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
    [activeFilter, sort, showMyPostsOnly, showBookmarkedOnly]
  );

  useEffect(() => {
    setPage(1);
    fetchArticles({ pageToLoad: 1, append: false });
  }, [activeFilter, sort, showMyPostsOnly, showBookmarkedOnly, fetchArticles]);

  useEffect(() => {
    if (page === 1) return;
    fetchArticles({ pageToLoad: page, append: true });
  }, [page, fetchArticles]);

  const normalizedActiveFilter = activeFilter.replace(/\s+/g, "").toLowerCase();
  const filteredPosts = useMemo(() => {
    const loweredKeyword = keyword.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryRaw =
        post.category ||
        post.categoryKey ||
        post.category_id ||
        post.categoryName ||
        "";
      const normalizedCategory = categoryRaw.replace(/\s+/g, "").toLowerCase();

      const matchCategory =
        normalizedActiveFilter === "all" ||
        normalizedCategory === normalizedActiveFilter;

      if (!matchCategory) return false;

      if (!loweredKeyword) return true;

      const title = post.title?.toLowerCase() || "";
      const content = post.content?.toLowerCase() || "";
      const writer =
        post.writer?.nickname?.toLowerCase() ||
        post.writer?.id?.toLowerCase() ||
        post.author?.toLowerCase() ||
        "";

      return (
        title.includes(loweredKeyword) ||
        content.includes(loweredKeyword) ||
        writer.includes(loweredKeyword)
      );
    });
  }, [keyword, posts, normalizedActiveFilter]);

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
          <div className={styles.filterRow}>
            <div className={styles.categoryFilters}>
              {categoryFilters.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={`${styles.filterButton} ${
                    activeFilter === tab.value &&
                    !showMyPostsOnly &&
                    !showBookmarkedOnly
                      ? styles.filterActive
                      : ""
                  }`}
                  onClick={() => {
                    setActiveFilter(tab.value);
                    setShowMyPostsOnly(false);
                    setShowBookmarkedOnly(false);
                    setSearchParams({});
                  }}
                  disabled={showMyPostsOnly || showBookmarkedOnly}
                >
                  <span className={styles.filterIcon}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.writeButton}
              onClick={() => navigate("/community/write")}
            >
              <span>✏️ 글쓰기</span>
            </button>
          </div>
        </section>

        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="제목, 내용으로 검색해보세요..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="button" className={styles.searchButton}>
              🔍 검색
            </button>
            <button
              type="button"
              className={`${styles.searchButton} ${
                showMyPostsOnly ? styles.filterActive : ""
              }`}
              onClick={() => {
                if (showMyPostsOnly) {
                  setShowMyPostsOnly(false);
                  setSearchParams({});
                } else {
                  setShowMyPostsOnly(true);
                  setShowBookmarkedOnly(false);
                  setSearchParams({ filter: "myPosts" });
                }
              }}
            >
              <span>
                {showMyPostsOnly ? "📋 전체 게시글 보기" : "📝 내가 작성한 글"}
              </span>
            </button>
            <button
              type="button"
              className={`${styles.searchButton} ${
                showBookmarkedOnly ? styles.filterActive : ""
              }`}
              onClick={() => {
                if (showBookmarkedOnly) {
                  setShowBookmarkedOnly(false);
                  setSearchParams({});
                } else {
                  setShowBookmarkedOnly(true);
                  setShowMyPostsOnly(false);
                  setSearchParams({ filter: "bookmarked" });
                }
              }}
            >
              <span>🔖 북마크한 글</span>
            </button>
          </div>
        </div>

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
              const rawCategory = post.category || "";
              const categoryKey = (post.categoryKey || rawCategory || "etc")
                .toString()
                .replace(/\s+/g, "_");
              const categoryLabel =
                categoryLabelMap[rawCategory] || rawCategory || "전체";
              const authorName =
                post.writer?.nickname ||
                post.writer?.id ||
                post.author ||
                post.user?.id ||
                post.userId ||
                post.user_id ||
                "익명";
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
                      styles[`category_${categoryKey}`] || ""
                    }`}
                  >
                    {categoryLabel}
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
                      <span className={styles.statItem}>
                        ❤️{" "}
                        {post.likesCount ?? post.likeCount ?? post.likes ?? 0}
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
