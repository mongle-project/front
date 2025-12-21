import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { ROUTES } from "../../utils/constants";
import NavBar from "../../components/header/NavBar";

const highlights = [
  { icon: "📅", title: "일정 관리", desc: "접종·병원·미용 일정 한눈에" },
  { icon: "💬", title: "커뮤니티", desc: "집사들과 정보 공유·질문" },
  { icon: "🤖", title: "AI 상담", desc: "간단한 증상 체크와 조언" },
  { icon: "📚", title: "동물 사전", desc: "품종·질병 정보 빠르게 찾기" },
];

const quickLinks = [
  { label: "로그인", path: ROUTES.LOGIN, style: "primary" },
  { label: "회원가입", path: ROUTES.SIGNUP, style: "ghost" },
  { label: "커뮤니티 둘러보기", path: ROUTES.COMMUNITY, style: "secondary" },
  { label: "동물 사전", path: ROUTES.DICTIONARY, style: "secondary" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo} onClick={() => navigate(ROUTES.HOME)}>
            몽글몽글
          </div>
          <div className={styles.navArea}>
            <NavBar showLogout={false} />
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => navigate(ROUTES.SIGNUP)}
            >
              회원가입
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              로그인
            </button>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <p className={styles.badge}>반려동물 올인원 플랫폼</p>
            <h1 className={styles.title}>
              반려동물과 함께하는
              <br />
              행복한 일상
            </h1>
            <p className={styles.subtitle}>
              동물 사전, 반려동물 기록, 그리고 커뮤니티까지.
              <br />
              Petzip에서 모든 정보를 한눈에!
            </p>
            <div className={styles.ctaRow}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                시작하기
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => navigate(ROUTES.COMMUNITY)}
              >
                더 알아보기
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={`${styles.heroCardSmall} ${styles.cardOne}`}>
              <span className={styles.cardEmoji}>🦙</span>
              <div className={styles.cardTitleSm}>동물 사전</div>
              <div className={styles.cardDescSm}>궁금한 상식 정보</div>
            </div>
            <div className={`${styles.heroCardSmall} ${styles.cardTwo}`}>
              <span className={styles.cardEmoji}>📒</span>
              <div className={styles.cardTitleSm}>일정 기록</div>
              <div className={styles.cardDescSm}>우리 아이 기록하기</div>
            </div>
            <div className={`${styles.heroCardSmall} ${styles.cardThree}`}>
              <span className={styles.cardEmoji}>💬</span>
              <div className={styles.cardTitleSm}>정보 공유</div>
              <div className={styles.cardDescSm}>양방향 정보 공유</div>
            </div>
          </div>
        </section>

        <section className={styles.highlightGrid}>
          {highlights.map((item) => (
            <div key={item.title} className={styles.highlightCard}>
              <div className={styles.highlightIcon}>{item.icon}</div>
              <div className={styles.highlightTitle}>{item.title}</div>
              <div className={styles.highlightDesc}>{item.desc}</div>
            </div>
          ))}
        </section>

        <section className={styles.linksSection}>
          <div className={styles.linksTitle}>바로가기</div>
          <div className={styles.linkChips}>
            {quickLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                className={`${styles.linkChip} ${
                  link.style === "primary"
                    ? styles.primaryChip
                    : link.style === "secondary"
                    ? styles.secondaryChip
                    : styles.ghostChip
                }`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
