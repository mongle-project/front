import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { ROUTES } from "../../utils/constants";
import { NAV_LINKS } from "../../utils/navLinks";

const heroHighlights = [
  { icon: "🐕", title: "품종 사전", desc: "반려동물 품종별 정보" },
  { icon: "📝", title: "성장 기록", desc: "우리 아이 기록하기" },
  { icon: "💬", title: "정보 공유", desc: "경험과 팁 공유" },
];

const features = [
  {
    title: "돌봄 사전",
    desc: "강아지, 고양이, 소동물까지 돌봄 정보를 한눈에 정리했어요.",
    icon: "📚",
  },
  {
    title: "내 반려동물",
    desc: "우리 아이들의 성장 스토리와 추억을 사진과 함께 저장해요.",
    icon: "🏡",
  },
  {
    title: "정보 공유",
    desc: "다른 집사들과 유익한 팁과 경험을 나누며 함께 성장해요.",
    icon: "☁️",
  },
  {
    title: "동물병원 찾기",
    desc: "가까운 동물병원과 보호소 정보를 지도와 리뷰로 확인해요.",
    icon: "🏥",
  },
  {
    title: "건강 일정",
    desc: "예방접종, 건강검진, 산책 일정까지 스마트하게 관리해요.",
    icon: "📅",
  },
  {
    title: "유기동물 정보",
    desc: "새로운 가족을 기다리는 반려동물들의 정보를 확인해요.",
    icon: "🤝",
  },
];

const stats = [
  { label: "등록된 돌봄 정보", value: "500+" },
  { label: "커뮤니티 활동", value: "1,000+" },
  { label: "돌봄 일정", value: "5,000+" },
  { label: "상담 센터", value: "24/7" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo} onClick={() => navigate(ROUTES.HOME)}>
            <span role="img" aria-hidden="true">
              🐾
            </span>
            <span>몽글몽글</span>
          </div>
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className={styles.authButtons}>
            <button
              className={styles.ghostButton}
              onClick={() => navigate(ROUTES.LOGIN)}
              type="button"
            >
              로그인
            </button>
            <button
              className={styles.primaryButton}
              onClick={() => navigate(`${ROUTES.LOGIN}?tab=signup`)}
              type="button"
            >
              회원가입
            </button>
            <button
              type="button"
              className={`${styles.navToggle} ${styles.hide}`}
            >
              <span>☰</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>반려동물과 함께하는 행복한 일상</h1>
            <p>
              돌봄 사전, 반려동물 기록, 그리고 커뮤니티까지.
              <br />
              Petzip에서 모든 정보를 한눈에!
            </p>
            <div className={styles.heroButtons}>
              <button
                className={styles.primaryButton}
                onClick={() => navigate(`${ROUTES.LOGIN}?tab=signup`)}
                type="button"
              >
                시작하기
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => navigate(ROUTES.LOGIN)}
                type="button"
              >
                더 알아보기
              </button>
            </div>
          </div>
          <div className={styles.heroCards}>
            {heroHighlights.map((item, idx) => (
              <article
                key={item.title}
                className={`${styles.heroCard} ${styles[`card${idx + 1}`]}`}
              >
                <span>{item.icon}</span>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.featureSection}>
          <h2>몽글몽글의 핵심 기능</h2>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.statsSection}>
          {stats.map((item) => (
            <div key={item.label} className={styles.statCard}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <div className={styles.footerLogo}>
            <span role="img" aria-hidden="true">
              🐾
            </span>
            몽글몽글
          </div>
        </div>
        <small>© 2025 Monggle. 반려동물과 함께하는 행복한 일상</small>
      </footer>
    </div>
  );
};

export default LandingPage;
