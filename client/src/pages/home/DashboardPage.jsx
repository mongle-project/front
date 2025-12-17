import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import DashboardHeader from "../../components/header/Header";

const quickActions = [
  {
    icon: "🤖",
    title: "AI 건강 상담",
    desc: "전문 AI에게 건강 조언 받기",
    path: "/health/consult",
  },
  {
    icon: "🏥",
    title: "동물병원 찾기",
    desc: "가까운 병원 검색하기",
    path: ROUTES.MAP,
  },
  {
    icon: "📅",
    title: "일정 추가",
    desc: "예방접종·병원 일정 등록",
    path: "/calendar/add",
  },
  {
    icon: "💬",
    title: "커뮤니티",
    desc: "다른 집사들과 소통하기",
    path: ROUTES.COMMUNITY,
  },
];

const pets = [
  {
    name: "몽이",
    breed: "말티즈 • 3살",
    emoji: "🐕",
    gradient: "linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)",
    path: ROUTES.PETS,
  },
  {
    name: "나비",
    breed: "코리안숏헤어 • 2살",
    emoji: "🐈",
    gradient: "linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)",
    path: ROUTES.PETS,
  },
  {
    name: "토순이",
    breed: "네덜란드드워프 • 1살",
    emoji: "🐰",
    gradient: "linear-gradient(135deg, #ec407a 0%, #d81b60 100%)",
    path: ROUTES.PETS,
  },
];

const schedules = [
  {
    id: 1,
    dDay: "D-5",
    dateLabel: "2024.12.15 (일) 오전 10:00",
    title: "💉 종합백신 접종",
    pet: "🐕 몽이",
    urgent: true,
    path: ROUTES.CALENDAR,
  },
  {
    id: 2,
    dDay: "D-10",
    dateLabel: "2024.12.20 (금) 오후 3:00",
    title: "🏥 정기 검진",
    pet: "🐈 나비",
    urgent: false,
    path: ROUTES.CALENDAR,
  },
  {
    id: 3,
    dDay: "D-17",
    dateLabel: "2024.12.27 (금) 오후 2:30",
    title: "✂️ 전체 미용",
    pet: "🐰 토순이",
    urgent: false,
    path: ROUTES.CALENDAR,
  },
];

const activities = [
  {
    id: 1,
    icon: "📝",
    text: "몽이 건강 기록을 업데이트했어요",
    time: "2시간 전",
  },
  {
    id: 2,
    icon: "💬",
    text: '"강아지 사료 추천" 게시글에 댓글을 남겼어요',
    time: "5시간 전",
  },
  {
    id: 3,
    icon: "📅",
    text: "나비 예방접종 일정을 추가했어요",
    time: "1일 전",
  },
  { id: 4, icon: "🤖", text: "AI 건강 상담을 받았어요", time: "2일 전" },
];

const posts = [
  {
    id: 1,
    title: "겨울철 강아지 발바닥 관리 꿀팁",
    stats: "👁️ 1,234  ·  💬 45",
  },
  {
    id: 2,
    title: "고양이가 물을 잘 안 마시는데 어떻게 하죠?",
    stats: "👁️ 892  ·  💬 32",
  },
  {
    id: 3,
    title: "토끼 케이지 꾸미기 아이디어 공유해요",
    stats: "👁️ 654  ·  💬 18",
  },
  {
    id: 4,
    title: "반려동물 보험 가입 후기 (솔직 리뷰)",
    stats: "👁️ 523  ·  💬 27",
  },
];

const news = [
  {
    id: 1,
    title: "겨울철 강아지 관리법, 체온 유지가 핵심",
    summary:
      "기온이 영하로 떨어지는 겨울철, 반려견의 건강을 지키기 위한 체온 관리법과 주의사항을 전문 수의사가 설명합니다.",
  },
  {
    id: 2,
    title: "고양이 사료 리콜 사태, 주요 브랜드 3종 포함",
    summary:
      "식약처가 이번 주 고양이 사료에서 기준치를 초과한 중금속이 검출되어 해당 제품의 회수 및 조치를 발표했습니다.",
  },
  {
    id: 3,
    title: "반려견 사회화 교육, 언제부터 시작해야 할까?",
    summary:
      "전문가는 반려견이 사회화 훈련을 시작하기 좋은 시기를 생후 3~14주 사이로 이야기하며, 이 시기를 놓치면 불안 행동이 나타날 수 있다고 조언합니다.",
  },
];

const ddayAlert = {
  pet: "몽이",
  label: "예방접종",
  days: 5,
};

const DashboardPage = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const displayName = user?.name ?? "집사님";

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />

      <div className={styles.container}>
        <section className={styles.welcomeBanner}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              안녕하세요, {displayName}! 👋
            </h1>
            <p className={styles.welcomeSubtitle}>
              오늘도 우리 아이들과 행복한 하루 보내세요
            </p>
            <div className={styles.ddayAlert}>
              ⏰ <strong>{ddayAlert.pet}</strong> {ddayAlert.label}이{" "}
              <strong>{ddayAlert.days}일</strong> 남았어요!
            </div>
            <div className={styles.heroActions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => handleNavigate("/calendar/add")}
              >
                새 일정 만들기
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => handleNavigate("/pets/add")}
              >
                반려동물 등록
              </button>
            </div>
          </div>
        </section>

        <section className={styles.quickActions}>
          {quickActions.map((action) => (
            <button
              key={action.title}
              className={styles.quickActionCard}
              type="button"
              onClick={() => handleNavigate(action.path)}
            >
              <div className={styles.quickActionIcon}>{action.icon}</div>
              <div className={styles.quickActionTitle}>{action.title}</div>
              <div className={styles.quickActionDesc}>{action.desc}</div>
            </button>
          ))}
        </section>

        <div className={styles.mainLayout}>
          <div>
            <section className={styles.myPetsSection} id="mypet">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>🏠</span>내 반려동물
                </h2>
                <button
                  type="button"
                  className={styles.viewAllBtn}
                  onClick={() => handleNavigate(ROUTES.PETS)}
                >
                  전체보기 →
                </button>
              </div>
              <div className={styles.petsCarousel}>
                {pets.map((pet) => (
                  <div
                    key={pet.name}
                    className={styles.petCardMini}
                    onClick={() => handleNavigate(pet.path)}
                  >
                    <div
                      className={styles.petAvatar}
                      style={{ background: pet.gradient }}
                    >
                      {pet.emoji}
                    </div>
                    <div className={styles.petName}>{pet.name}</div>
                    <div className={styles.petBreedMini}>{pet.breed}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.scheduleSection} id="calendar">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>📅</span>다가오는 일정
                </h2>
                <button
                  type="button"
                  className={styles.viewAllBtn}
                  onClick={() => handleNavigate(ROUTES.CALENDAR)}
                >
                  전체보기 →
                </button>
              </div>
              <div className={styles.scheduleList}>
                {schedules.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.scheduleItem} ${
                      item.urgent ? styles.urgent : ""
                    }`}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div className={styles.scheduleDate}>
                      {item.dDay} • {item.dateLabel}
                    </div>
                    <div className={styles.scheduleTitle}>{item.title}</div>
                    <div className={styles.schedulePet}>{item.pet}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.activitySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>🔔</span>최근 활동
                </h2>
              </div>
              <div className={styles.activityList}>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={styles.activityItem}
                    onClick={() => handleNavigate(ROUTES.DASHBOARD)}
                  >
                    <div className={styles.activityIcon}>{activity.icon}</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityText}>{activity.text}</div>
                      <div className={styles.activityTime}>{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <section className={styles.newsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>💡</span>뉴스
                </h2>
              </div>
              <div className={styles.newsList}>
                {news.map((item) => (
                  <article
                    key={item.id}
                    className={styles.newsItem}
                    onClick={() => handleNavigate(ROUTES.NEWS)}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.popularPosts} id="community">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>🔥</span>인기 게시글
                </h2>
              </div>
              <div className={styles.activityList}>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={styles.postItem}
                    onClick={() => handleNavigate(ROUTES.COMMUNITY)}
                  >
                    <div className={styles.postTitleMini}>{post.title}</div>
                    <div className={styles.postMetaMini}>{post.stats}</div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
