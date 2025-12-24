import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import DashboardHeader from "../../components/header/Header";
import { ROUTES } from "../../utils/constants";
import { useAuthContext } from "../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  deleteArticle,
  getArticleById,
  reportArticle,
  toggleBookmark,
  toggleLike,
} from "../../api/articles";

const categoryLabels = {
  dog: "강아지",
  cat: "고양이",
  rabbit: "토끼",
  hamster: "햄스터",
  guineapig: "기니피그",
  bird: "조류",
  fish: "어류",
  reptile: "파충류",
  turtle: "거북이",
};

const mapArticleResponse = (response) => {
  const data = response?.data ?? response; // 백엔드에서 { message, data } 형태를 반환하므로 언래핑
  return {
    id: data?.id,
    userId: data?.user_id,
    title: data?.title ?? "",
    content: data?.content ?? "",
    category: data?.category ?? "",
    images: data?.img_url ? [data.img_url] : [],
    createdAt: data?.created_at,
    updatedAt: data?.updated_at,
    likeCount: data?.likesCount ?? 0,
    commentsCount: data?.commentsCount ?? 0,
    bookmarksCount: data?.bookmarksCount ?? 0,
    liked: Boolean(data?.liked),
    bookmarked: Boolean(data?.bookmarked),
  };
};

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
    () => user?.id && article?.userId && user.id === article.userId,
    [article?.userId, user?.id]
  );

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getArticleById(id);
        const mapped = mapArticleResponse(data);
        setArticle(mapped);
        setLikeCount(mapped.likeCount);
        setLiked(mapped.liked);
        setBookmarked(mapped.bookmarked);
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
        setLiked(data.action === "added");
        setLikeCount(data.likesCount ?? likeCount);
        toast.success(data.message || "좋아요가 처리되었습니다.", {
          position: "top-center",
        });
      })
      .catch((err) => {
        console.error("좋아요 실패:", err);
        toast.error(
          err.response?.data?.message ||
            "좋아요 처리에 실패했습니다. 잠시 후 다시 시도해주세요.",
          { position: "top-center" }
        );
      });
  };

  const handleBookmark = () => {
    if (!article) return;
    toggleBookmark(id)
      .then((data) => {
        setBookmarked(data.action === "added");
        toast.success(data.message || "북마크가 처리되었습니다.", {
          position: "top-center",
        });
      })
      .catch((err) => {
        console.error("북마크 실패:", err);
        toast.error(
          err.response?.data?.message ||
            "게시글을 저장하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
          { position: "top-center" }
        );
      });
  };

  const handleEdit = () => {
    // TODO: 실제 수정 페이지로 라우팅
    navigate(`/community/write?edit=${id}`);
  };

  const handleDelete = () => {
    const deleting = deleteArticle(id);
    toast.promise(
      deleting,
      {
        loading: "게시글 삭제 중...",
        success: "게시글이 삭제되었습니다.",
        error: (err) =>
          err?.response?.data?.message ||
          "게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
      },
      { position: "top-center" }
    );

    deleting
      .then(() => {
        navigate(ROUTES.COMMUNITY);
      })
      .catch((err) => {
        console.error("삭제 실패:", err);
      });
  };

  const handleReport = () => {
    if (!article) return;
    toast.custom(
      (t) => (
        <div
          className={`${styles.confirmToast} ${
            t.visible ? styles.toastIn : styles.toastOut
          }`}
        >
          <div className={styles.confirmTitle}>게시글을 신고하시겠어요?</div>
          <div className={styles.confirmMessage}>
            신고 시 운영자 검토 후 조치됩니다.
          </div>
          <div className={styles.confirmActions}>
            <button
              type="button"
              className={styles.confirmCancel}
              onClick={() => toast.dismiss(t.id)}
            >
              취소
            </button>
            <button
              type="button"
              className={styles.confirmOk}
              onClick={() => {
                toast.dismiss(t.id);
                const reporting = reportArticle(id);
                toast.promise(
                  reporting,
                  {
                    loading: "신고 접수 중...",
                    success: (data) =>
                      data?.message || "신고가 접수되었습니다.",
                    error: (err) =>
                      err?.response?.data?.message ||
                      "신고를 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                  },
                  { position: "top-center" }
                );
              }}
            >
              신고하기
            </button>
          </div>
        </div>
      ),
      { position: "top-center", duration: 5000 }
    );
  };

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-center" />
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
                {categoryLabels[article.category] ||
                  article.category ||
                  "게시글"}
              </span>
              <h1 className={styles.title}>{article.title}</h1>
              <div className={styles.metaRow}>
                <div className={styles.authorBox}>
                  <div className={styles.avatar}>
                    {(article.userId || "익명").toString().slice(0, 1)}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>
                      {article.userId || "익명"}
                    </div>
                    <div className={styles.date}>{article.createdAt || ""}</div>
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
