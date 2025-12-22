import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import DashboardHeader from "../../components/header/Header";
import { ROUTES } from "../../utils/constants";
import { useAuthContext } from "../../contexts/AuthContext";

const PostDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuthContext();
  const displayName = user?.name || "집사님";
  const isAuthor = true; // TODO: 실제 작성자 여부로 대체

  const [likeCount, setLikeCount] = useState(45);
  const [liked, setLiked] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  const handleEdit = () => {
    // TODO: 실제 수정 페이지로 라우팅
    navigate(`/community/write?edit=${id}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // TODO: 삭제 API 연동 후 목록 이동
      alert("게시글이 삭제되었습니다.");
      navigate(ROUTES.COMMUNITY);
    }
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

        <article className={styles.postCard}>
          <header className={styles.postHeader}>
            <span className={styles.category}>🐕 강아지</span>
            <h1 className={styles.title}>
              강아지 산책 시 꼭 알아야 할 안전 수칙 5가지
            </h1>
            <div className={styles.metaRow}>
            <div className={styles.authorBox}>
              <div className={styles.avatar}>댕</div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>댕댕이사랑</div>
                <div className={styles.date}>2024년 12월 8일 오후 3:24</div>
              </div>
            </div>
            <div className={styles.stats}>
              <span>❤️ {likeCount}</span>
            </div>
          </div>
        </header>

          <section className={styles.content}>
            <p>안녕하세요! 3년차 강아지 집사입니다 🐕</p>
            <p>
              오늘 산책하다가 정말 아찔한 순간이 있었어요. 다행히 큰 사고는
              없었지만, 다른 분들도 꼭 조심하셨으면 해서 제 경험을 바탕으로 안전
              수칙을 정리해봤습니다.
            </p>

            <h3>1. 목줄은 반드시 단단히! 🎯</h3>
            <p>
              목줄이 헐거우면 순간적으로 빠져나갈 수 있어요. 저는 하네스를
              사용하는데, 일반 목줄보다 훨씬 안전합니다. 특히 겁이 많거나 활발한
              강아지라면 하네스 추천드려요!
            </p>

            <h3>2. 다른 강아지 만날 때 주의 ⚠️</h3>
            <p>
              모든 강아지가 친화적인 건 아니에요. 다른 강아지를 만났을 때는 먼저
              주인분께 "우리 강아지가 다가가도 될까요?"라고 물어보는 게 좋습니다.
              갑작스러운 만남은 두 강아지 모두에게 스트레스가 될 수 있어요.
            </p>

            <h3>3. 여름철 아스팔트 온도 체크 🌡️</h3>
            <p>
              여름에는 아스팔트가 정말 뜨거워요! 손등으로 5초 이상 댔을 때
              뜨겁다면 강아지 발바닥에도 화상을 입을 수 있습니다. 이런 날은 이른
              아침이나 늦은 저녁에 산책하는 걸 추천드려요.
            </p>

            <h3>4. 주워 먹기 방지 훈련 🍖</h3>
            <p>
              길거리에는 강아지가 먹으면 안 되는 음식이 많아요. 초콜릿, 포도,
              양파 등은 강아지에게 치명적일 수 있습니다. "이리와" 명령을 잘 들을
              수 있게 평소에 훈련해두시면 좋아요!
            </p>

            <h3>5. 인식표는 필수! 🏷️</h3>
            <p>
              만약의 사태에 대비해서 인식표는 꼭 달아주세요. 이름, 보호자 연락처,
              특이사항(지병이 있다면) 등을 적어두면 혹시 모를 상황에 큰 도움이
              됩니다.
            </p>

            <div className={styles.tipBox}>
              <strong>💚 마무리하며</strong>
              <p>
                안전한 산책은 우리 강아지와 오래오래 행복하게 지내는 첫걸음이에요.
                처음에는 번거로울 수 있지만, 습관이 되면 자연스러워집니다. 모두
                안전한 산책 되세요! 🐾
              </p>
            </div>

            <div className={styles.imageBox}>
              <img
                src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1000&q=80"
                alt="강아지"
              />
            </div>
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
      </div>
    </div>
  );
};

export default PostDetailPage;
