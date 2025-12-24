import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import DashboardHeader from "../../components/header/Header";
import { ROUTES } from "../../utils/constants";
import { useAuthContext } from "../../contexts/AuthContext";
import {
  deleteArticle,
  getArticleById,
  reportArticle,
  toggleBookmark,
  toggleLike,
} from "../../api/articles";

const PostDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuthContext();
  const displayName = user?.name || "집사님";

  const [article, setArticle] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAuthor = useMemo(
    () => user?.id && article?.writer?.id && user.id === article.writer.id,
    [article?.writer?.id, user?.id]
  );

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getArticleById(id);
        setArticle(data);
        setLikeCount(data.likeCount || 0);
        setLiked(Boolean(data.isLiked));
        setBookmarked(Boolean(data.isSaved));
      } catch (err) {
        console.error("게시글 상세 불러오기 실패:", err);
        setError(
          err.response?.data?.message ||
            "게시글을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleLike = () => {
    if (!article) return;
    toggleLike(id)
      .then((data) => {
        setLiked(Boolean(data.liked));
        setLikeCount(data.totalLikes ?? likeCount);
      })
      .catch((err) => {
        console.error("좋아요 실패:", err);
        alert(
          err.response?.data?.message ||
            "좋아요 처리에 실패했습니다. 잠시 후 다시 시도해주세요."
        );
      });
  };

  const handleBookmark = () => {
    if (!article) return;
    toggleBookmark(id)
      .then((data) => {
        setBookmarked(Boolean(data.saved));
        if (data.message) alert(data.message);
      })
      .catch((err) => {
        console.error("북마크 실패:", err);
        alert(
          err.response?.data?.message ||
            "게시글을 저장하는 데 실패했습니다. 잠시 후 다시 시도해주세요."
        );
      });
  };

  const handleEdit = () => {
    // TODO: 실제 수정 페이지로 라우팅
    navigate(`/community/write?edit=${id}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteArticle(id)
        .then(() => {
          alert("게시글이 삭제되었습니다.");
          navigate(ROUTES.COMMUNITY);
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
          alert(
            err.response?.data?.message ||
              "게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요."
          );
        });
    }
  };

  const handleReport = () => {
    if (!article) return;
    const reason =
      window.prompt("신고 사유를 입력해주세요.", "광고/욕설/부적절한 내용") ||
      "";
    if (!reason.trim()) return;

    reportArticle(id, reason.trim())
      .then((data) => {
        alert(data?.message || "신고가 접수되었습니다.");
      })
      .catch((err) => {
        console.error("신고 실패:", err);
        alert(
          err.response?.data?.message ||
            "신고를 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      });
  };

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.page}>
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />

      <div className={styles.container}>
        <div className={styles.backRow}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(ROUTES.COMMUNITY)}
          >
            ← 목록으로 돌아가기
          </button>
        </div>

        {loading && <div className={styles.loading}>불러오는 중...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && article && (
          <article className={styles.postCard}>
            <header className={styles.postHeader}>
              <span className={styles.category}>
                {article.category || "게시글"}
              </span>
              <h1 className={styles.title}>{article.title}</h1>
              <div className={styles.metaRow}>
                <div className={styles.authorBox}>
                  <div className={styles.avatar}>
                    {article.writer?.nickname?.slice(0, 1) || "?"}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>
                      {article.writer?.nickname || "익명"}
                    </div>
                    <div className={styles.date}>{article.date || ""}</div>
                  </div>
                </div>
                <div className={styles.stats}>
                  <span>❤️ {likeCount}</span>
                </div>
              </div>
            </header>

            <section className={styles.content}>
              {article.content
                ?.split("\n")
                .filter((line) => line.trim())
                .map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}

              {article.images?.length > 0 && (
                <div className={styles.imageBox}>
                  {article.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`게시글 이미지 ${idx + 1}`} />
                  ))}
                </div>
              )}
            </section>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.actionBtn} ${liked ? styles.liked : ""}`}
                onClick={handleLike}
              >
                ❤️ 좋아요 {likeCount}
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${
                  bookmarked ? styles.bookmarked : ""
                }`}
                onClick={handleBookmark}
              >
                📑 북마크
              </button>
              <button type="button" className={styles.actionBtn}>
                📤 공유하기
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleReport}
              >
                🚨 신고하기
              </button>
            </div>

            <div className={styles.footerActions}>
              {isAuthor && (
                <>
                  <button
                    type="button"
                    className={styles.grayBtn}
                    onClick={handleEdit}
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    className={styles.grayBtn}
                    onClick={handleDelete}
                  >
                    삭제하기
                  </button>
                </>
              )}
              <button
                type="button"
                className={styles.greenBtn}
                onClick={() => navigate(ROUTES.COMMUNITY)}
              >
                목록으로
              </button>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
