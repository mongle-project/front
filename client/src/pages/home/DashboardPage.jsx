import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { fetchDashboardOverview } from "../../services/dashboardService";
import { ROUTES } from "../../utils/constants";

const navLinks = [
  { label: "동물 사전", path: ROUTES.DICTIONARY },
  { label: "정보 공유", path: ROUTES.COMMUNITY },
  { label: "내 반려동물", path: ROUTES.PETS },
  { label: "캘린더", path: ROUTES.CALENDAR },
];

const initialState = {
  quickActions: [],
  pets: [],
  schedules: [],
  activities: [],
  posts: [],
  weather: null,
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [dashboardData, setDashboardData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const data = await fetchDashboardOverview();
        if (isMounted) {
          setDashboardData(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage("대시보드 정보를 불러오는 중 문제가 발생했습니다.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const { quickActions, pets, schedules, activities, posts, weather } = dashboardData;
  const displayName = user?.name ?? "집사님";
  const avatarInitial = displayName.slice(0, 1);

  const upcoming = useMemo(() => {
    if (!schedules.length) return null;
    return schedules[0];
  }, [schedules]);

  const remainingDays = upcoming?.dDay?.replace("D-", "");
  const alertKeyword = upcoming?.alertKeyword ?? "일정";

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleQuickAction = (action) => {
    if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo} onClick={() => handleNavigate(ROUTES.DASHBOARD)}>
            Petzip
          </div>
          <div className={styles.navRight}>
            <ul className={styles.navLinks}>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <div className={styles.userMenu} onClick={() => handleNavigate(ROUTES.PETS)}>
              <div className={styles.userAvatar}>{avatarInitial}</div>
              <span className={styles.userName}>{displayName}</span>
            </div>
          </div>
        </nav>
      </header>

      <div className={styles.container}>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

        {loading ? (
          <div className={styles.loadingMessage}>대시보드 정보를 불러오는 중...</div>
        ) : (
          <>
            <section className={styles.welcomeBanner}>
              <div className={styles.welcomeContent}>
                <h1 className={styles.welcomeTitle}>안녕하세요, {displayName}! 👋</h1>
                <p className={styles.welcomeSubtitle}>오늘도 우리 아이들과 행복한 하루 보내세요</p>
                {upcoming && (
                  <div className={styles.ddayAlert}>
                    ⏰ <strong>{upcoming.pet.name}</strong> {alertKeyword}이{" "}
                    <strong>{remainingDays}일</strong> 남았어요!
                  </div>
                )}
                <div className={styles.heroActions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => handleNavigate(ROUTES.CALENDAR_ADD)}
                  >
                    새 일정 만들기
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => handleNavigate(ROUTES.PETS_ADD)}
                  >
                    반려동물 등록
                  </button>
                </div>
              </div>
            </section>

            <section className={styles.quickActions}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className={styles.quickActionCard}
                  onClick={() => handleQuickAction(action)}
                  type="button"
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
                        key={pet.id}
                        className={styles.petCardMini}
                        onClick={() => handleNavigate(pet.path)}
                      >
                        <div className={styles.petAvatar} style={{ background: pet.gradient }}>
                          {pet.emoji}
                        </div>
                        <div className={styles.petName}>{pet.name}</div>
                        <div className={styles.petBreedMini}>{pet.breed}</div>
                        {pet.mission && <div className={styles.petMission}>{pet.mission}</div>}
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
                        className={`${styles.scheduleItem} ${item.urgent ? styles.urgent : ""}`}
                        onClick={() => handleNavigate(item.path)}
                      >
                        <div className={styles.scheduleDate}>
                          {item.dDay} • {item.dateLabel}
                        </div>
                        <div className={styles.scheduleTitle}>{item.title}</div>
                        <div className={styles.schedulePet}>
                          {item.pet.emoji} {item.pet.name}
                        </div>
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
                        onClick={() => handleNavigate(activity.path)}
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
                {weather && (
                  <section className={styles.weatherWidget}>
                    <div className={styles.weatherIcon}>{weather.icon}</div>
                    <div className={styles.weatherTemp}>{weather.temp}</div>
                    <div className={styles.weatherDesc}>{weather.desc}</div>
                    <div className={styles.weatherTip}>
                      {weather.tip.split("\n").map((line, index, arr) => (
                        <React.Fragment key={`${line}-${index}`}>
                          {line}
                          {index !== arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </section>
                )}

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
                        onClick={() => handleNavigate(post.path)}
                      >
                        <div className={styles.postTitleMini}>{post.title}</div>
                        <div className={styles.postMetaMini}>
                          <span>👁️ {post.views}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
