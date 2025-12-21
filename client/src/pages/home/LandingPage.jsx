import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import NavBar from "../../components/header/NavBar";
import styles from "./LandingPage.module.css";

const navLinks = [
  { label: "동물 사전", path: ROUTES.DICTIONARY },
  { label: "정보 공유", path: ROUTES.COMMUNITY },
  { label: "내 반려동물", path: ROUTES.PETS },
  { label: "캘린더", path: ROUTES.CALENDAR },
  { label: "건강/영양", path: ROUTES.HEALTH_CONSULT },
  { label: "병원/보호소", path: ROUTES.MAP },
  { label: "뉴스", path: ROUTES.NEWS },
];

const heroCards = [
  {
    icon: "🐕",
    title: "동물 사전",
    desc: "품종별 상세 정보",
    className: "card1",
  },
  {
    icon: "💬",
    title: "정보 공유",
    desc: "경험과 팁 공유",
    className: "card2",
  },
  {
    icon: "📝",
    title: "성장 기록",
    desc: "우리 아이 기록하기",
    className: "card3",
  },
];

const featureData = [
  {
    icon: "📚",
    title: "동물 사전",
    desc: "강아지, 고양이 등 다양한 품종의 특징과 관리 팁을 확인하세요",
  },
  {
    icon: "🏠",
    title: "내 반려동물",
    desc: "우리 아이의 성장과 특별한 순간을 기록하고 관리하세요",
  },
  {
    icon: "💭",
    title: "정보 공유",
    desc: "다른 집사들과 유용한 정보와 경험을 나누며 함께 성장하세요",
  },
  {
    icon: "🏥",
    title: "동물병원 찾기",
    desc: "가까운 동물병원을 찾고 영업 시간을 확인하세요",
  },
  {
    icon: "📅",
    title: "건강 캘린더",
    desc: "예방접종, 병원 예약 등 중요한 일정을 관리하세요",
  },
  {
    icon: "🤝",
    title: "유기동물 정보",
    desc: "새로운 가족을 기다리는 아이들의 정보를 확인하세요",
  },
];

const stats = [
  { value: "500+", label: "동물 품종 정보" },
  { value: "1,000+", label: "커뮤니티 회원" },
  { value: "5,000+", label: "공유된 경험담" },
  { value: "24/7", label: "언제나 함께" },
];

const footerLinks = [
  { label: "서비스 소개", target: "about" },
  { label: "이용약관", target: "terms" },
  { label: "개인정보처리방침", target: "privacy" },
  { label: "GitHub", target: "github" },
  { label: "문의하기", target: "contact" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavClick = (target, route) => {
    if (route) {
      navigate(route);
    } else {
      const element = document.getElementById(target);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.decoration} ${styles.decoOne}`}>🌿</div>
      <div className={`${styles.decoration} ${styles.decoTwo}`}>🐾</div>

      <header className="mg-header">
        <div className="mg-header__inner">
          <div
            className="mg-logo"
            onClick={() => handleNavClick(null, ROUTES.HOME)}
          >
            몽글몽글
          </div>
          <NavBar links={navLinks} />
          <div className={`mg-header__actions ${styles.authButtons}`}>
            <button
              type="button"
              onClick={() => handleNavClick(null, ROUTES.LOGIN)}
            >
              로그인
            </button>
            <button
              type="button"
              className={styles.signupButton}
              onClick={() => handleNavClick(null, `${ROUTES.LOGIN}?tab=signup`)}
            >
              회원가입
            </button>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            반려동물과 함께하는
            <br />
            행복한 일상
          </h1>
          <p>
            동물 사전, 반려동물 기록, 그리고 커뮤니티까지.
            <br />
            몽글몽글에서 모든 정보를 한눈에!
          </p>
          <div className={styles.ctaButtons}>
            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={() => handleNavClick(null, ROUTES.LOGIN)}
            >
              시작하기
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={() =>
                handleNavClick(
                  null,
                  ROUTES.SIGNUP ?? `${ROUTES.LOGIN}?tab=signup`
                )
              }
            >
              더 알아보기
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          {heroCards.map((card) => (
            <div
              key={card.title}
              className={`${styles.floatingCard} ${styles[card.className]}`}
            >
              <div className={styles.petIcon}>{card.icon}</div>
              <div className={styles.cardTitle}>{card.title}</div>
              <div className={styles.cardDesc}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.features} id="dictionary">
        <h2 className={styles.sectionTitle}>몽글몽글의 핵심 기능</h2>
        <div className={styles.featureGrid}>
          {featureData.map((feature) => (
            <div className={styles.featureCard} key={feature.title}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.stats} id="community">
        <div className={styles.statsContainer}>
          {stats.map((stat) => (
            <div className={styles.statItem} key={stat.label}>
              <div className={styles.statNumber}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.logo}>🐾 몽글몽글</div>
          <div className={styles.footerLinks}>
            {footerLinks.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => handleNavClick(link.target)}
              >
                {link.label}
              </button>
            ))}
          </div>
          <p>© 2025 몽글몽글. 반려동물과 함께하는 행복한 일상</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
