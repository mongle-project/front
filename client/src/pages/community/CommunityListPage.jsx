import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import styles from "./CommunityListPage.module.css";

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

const posts = [
  {
    id: 1,
    category: "강아지",
    categoryKey: "dog",
    title: "강아지 산책 시 꼭 알아야 할 안전 수칙 5가지",
    summary:
      "리드 줄 길이 조절부터 발바닥 보호, 날씨별 준비물까지 산책 필수 체크리스트를 정리했어요. 특히 빙판길이나 장시간 산책 시 주의할 점을 꼭 확인해 주세요!",
    author: "댕댕이누나",
    date: "2024.12.07",
    comments: 28,
    likes: 45,
    views: 342,
    tag: "정보",
    isNew: true,
  },
  {
    id: 2,
    category: "고양이",
    categoryKey: "cat",
    title: "고양이 사료 바꾸는 법 - 실패 없는 골라 먹기",
    summary:
      "사료 전환 비율표와 소화 트러블을 줄이는 7일 적응 루틴을 정리했습니다. 츄르로 적응 도와주는 팁도 있어요.",
    author: "야옹선생",
    date: "2024.12.07",
    comments: 52,
    likes: 89,
    views: 589,
    tag: "건강관리",
  },
  {
    id: 3,
    category: "강아지",
    categoryKey: "dog",
    title: "우리 강아지가 갑자기 밥을 안 먹어요 ㅠㅠ 도와주세요",
    summary:
      "평소와 다른 반응이 보일 때 체크해야 할 건강 신호와 식욕을 돋우는 루틴을 정리했습니다. 비슷한 경험 있으신 분들의 의견도 궁금해요!",
    author: "몽글이엄마",
    date: "2024.12.06",
    comments: 63,
    likes: 34,
    views: 421,
    tag: "행동교정",
  },
  {
    id: 4,
    category: "소형동물",
    categoryKey: "rabbit",
    title: "토끼 케이지 꾸미기 - 토순이의 행복한 공간 만들기",
    summary:
      "폭신한 매트와 숨숨집 배치 팁, 더스트 없는 배딩 추천 리스트를 공유합니다. 최소 예산으로 토순이 행복 지수 올리기!",
    author: "토순이맘",
    date: "2024.12.06",
    comments: 19,
    likes: 56,
    views: 267,
    tag: "초보집사",
  },
  {
    id: 5,
    category: "고양이",
    categoryKey: "cat",
    title: "길고양이 밥 주는 방법과 주의사항 정리해봐요",
    summary:
      "급식소 위치 선정부터 청결 관리, 주민 갈등을 줄이는 소통 방법까지 한 번에 정리했습니다. 경험담 환영!",
    author: "길냥이지킴이",
    date: "2024.12.06",
    comments: 97,
    likes: 156,
    views: 724,
    tag: "정보",
    highlight: true,
  },
  {
    id: 6,
    category: "강아지",
    categoryKey: "dog",
    title: "강아지 유치원 보내야 할까요? 찬반 의견 들려주세요",
    summary:
      "4개월 된 말티즈를 키우는데 사회성 교육 때문에 유치원을 고민중이에요. 경험 있으신 분들의 솔직한 후기가 궁금합니다!",
    author: "말티즈러버",
    date: "2024.12.05",
    comments: 78,
    likes: 42,
    views: 512,
    tag: "꿀팁",
  },
  {
    id: 7,
    category: "조류",
    categoryKey: "bird",
    title: "앵무새 키우기 전에 꼭 알아야 할 것들",
    summary:
      "처음 시작하실 분들께 도움이 될까 싶어 글 남깁니다. 생각보다 손이 많이 가지만 정말 사랑스러운 친구예요.",
    author: "앵무새집사",
    date: "2024.12.05",
    comments: 31,
    likes: 67,
    views: 298,
    tag: "정보",
  },
  {
    id: 8,
    category: "고양이",
    categoryKey: "cat",
    title: "고양이 화장실 위치 어디가 좋을까요?",
    summary:
      "이사 후 화장실 위치를 고민 중입니다. 고양이에게 스트레스 없는 최적의 위치 추천 부탁드려요!",
    author: "집사초보",
    date: "2024.12.04",
    comments: 54,
    likes: 38,
    views: 445,
    tag: "정보",
  },
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
  const [visibleCount, setVisibleCount] = useState(5);
  const sentinelRef = useRef(null);
  console.log("CommunityListPage v3");

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      if (activeFilter !== "all" && post.categoryKey !== activeFilter) {
        return false;
      }
      if (keyword.trim()) {
        const lowered = keyword.trim().toLowerCase();
        return (
          post.title.toLowerCase().includes(lowered) ||
          post.summary.toLowerCase().includes(lowered) ||
          post.author.toLowerCase().includes(lowered)
        );
      }
      return true;
    });

    if (sort === "popular") {
      return [...filtered].sort((a, b) => b.likes - a.likes);
    }
    if (sort === "comment") {
      return [...filtered].sort((a, b) => b.comments - a.comments);
    }
    return filtered;
  }, [activeFilter, keyword, sort]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount]
  );

  const hasMore = visibleCount < filteredPosts.length;

  useEffect(() => {
    // reset when filter/search/sort changes
    setVisibleCount(5);
  }, [activeFilter, keyword, sort]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          setVisibleCount((prev) =>
            Math.min(prev + 5, filteredPosts.length)
          );
        }
      },
      { rootMargin: "200px 0px" }
    );

    const current = sentinelRef.current;
    if (current) observer.observe(current);
    return () => observer.disconnect();
  }, [filteredPosts.length, hasMore]);

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
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                className={styles.postCard}
                onClick={() => handleCardClick(post.id)}
              >
                <span
                  className={`${styles.postCategory} ${
                    styles[`category_${post.categoryKey}`]
                  }`}
                >
                  {post.category}
                </span>
                <h3 className={styles.postTitle}>
                  {post.title}
                  {post.isNew && <span className={styles.newBadge}>NEW</span>}
                </h3>
                <p className={styles.postSummary}>{post.summary}</p>
                <div className={styles.postMeta}>
                  <div className={styles.postAuthor}>
                    <div className={styles.authorAvatar}>
                      {getAvatar(post.author)}
                    </div>
                    {post.author}
                  </div>
                  <span>{post.date}</span>
                  <div className={styles.postStats}>
                    <span className={styles.statItem}>👁️ {post.views}</span>
                    <span className={styles.statItem}>💬 {post.comments}</span>
                    <span className={styles.statItem}>❤️ {post.likes}</span>
                  </div>
                </div>
              </article>
            ))}

            {filteredPosts.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🪴</div>
                <p className={styles.emptyText}>
                  조건에 맞는 게시글이 없어요. 다른 키워드로 검색해 볼까요?
                </p>
              </div>
            )}
            <div ref={sentinelRef} className={styles.infiniteSentinel}>
              {hasMore ? "불러오는 중..." : "모든 게시글을 확인했어요."}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CommunityListPage;
