import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import DashboardHeader from "../../components/header/Header";
import { getPets } from "../../api/pets";
import { getMonthlyCalendarEvents } from "../../api/calendarEvents";
import { getMyArticles } from "../../api/articles";
import { getNewsList } from "../../api/news";

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

const DashboardPage = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const displayName = user?.name ?? "집사님";

  const [pets, setPets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ddayAlert, setDdayAlert] = useState(null);

  // 펫 이모지 매핑
  const getPetEmoji = (species) => {
    const emojiMap = {
      dog: "🐕",
      cat: "🐈",
      rabbit: "🐰",
      hamster: "🐹",
      bird: "🦜",
      fish: "🐠",
    };
    return emojiMap[species?.toLowerCase()] || "🐾";
  };

  // 나이 계산 함수
  const calculateAge = (birthDay) => {
    if (!birthDay) return "?";
    const birth = new Date(birthDay);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : "?";
  };

  // 종 이름 한글 변환
  const getSpeciesName = (species) => {
    const speciesMap = {
      dog: "강아지",
      cat: "고양이",
      rabbit: "토끼",
      hamster: "햄스터",
      bird: "새",
      fish: "물고기",
    };
    return speciesMap[species?.toLowerCase()] || species || "반려동물";
  };

  // 펫 그라디언트 색상 매핑
  const getPetGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)",
      "linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)",
      "linear-gradient(135deg, #ec407a 0%, #d81b60 100%)",
      "linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)",
      "linear-gradient(135deg, #66bb6a 0%, #43a047 100%)",
    ];
    return gradients[index % gradients.length];
  };

  // D-day 계산
  const calculateDday = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(eventDate);
    targetDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "D-Day";
    if (diff < 0) return `D+${Math.abs(diff)}`;
    return `D-${diff}`;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    const displayHours = hours % 12 || 12;

    return `${year}.${month}.${day} (${weekday}) ${ampm} ${displayHours}:${minutes}`;
  };

  // 카테고리 이모지 매핑
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      vaccination: "💉",
      checkup: "🏥",
      grooming: "✂️",
      medication: "💊",
      etc: "📝",
    };
    return emojiMap[category] || "📅";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 현재 년월 계산 및 향후 6개월 데이터 수집
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // 향후 6개월의 일정 데이터 가져오기
        const eventPromises = [];
        for (let i = 0; i < 6; i++) {
          const targetDate = new Date(year, month - 1 + i, 1);
          const targetYear = targetDate.getFullYear();
          const targetMonth = targetDate.getMonth() + 1;
          eventPromises.push(
            getMonthlyCalendarEvents({ year: targetYear, month: targetMonth }).catch((err) => {
              console.error(`${targetYear}-${targetMonth} 일정 로딩 실패:`, err);
              return { data: [] };
            })
          );
        }

        // 병렬로 데이터 패치
        const [petsData, ...eventsDataArray] = await Promise.all([
          getPets().catch((err) => {
            console.error("펫 데이터 로딩 실패:", err);
            return { data: [] };
          }),
          ...eventPromises,
        ]);

        const [articlesData, newsData] = await Promise.all([
          getMyArticles(100, 0).catch((err) => {
            console.error("게시글 데이터 로딩 실패:", err);
            return { data: [] };
          }),
          getNewsList().catch((err) => {
            console.error("뉴스 데이터 로딩 실패:", err);
            return { news: [] };
          }),
        ]);

        // 모든 일정 데이터 병합
        const allEvents = eventsDataArray.reduce((acc, monthData) => {
          const events = monthData.data || monthData.events || [];
          return [...acc, ...events];
        }, []);

        // 펫 데이터 변환
        const transformedPets = (petsData.data || []).map((pet, index) => ({
          id: pet.id,
          name: pet.name,
          breed: `${getSpeciesName(pet.species)} • ${calculateAge(
            pet.birth_day
          )}살`,
          emoji: getPetEmoji(pet.species),
          gradient: getPetGradient(index),
          path: ROUTES.PETS,
          imgUrl: pet.img_url,
        }));
        setPets(transformedPets);

        // 일정 데이터 변환 및 정렬 (다가오는 순서대로)
        const eventsArray = allEvents;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 2주 후 날짜 계산
        const twoWeeksLater = new Date(today);
        twoWeeksLater.setDate(today.getDate() + 14);

        const transformedEvents = eventsArray
          .map((event) => {
            const eventDate = event.eventDate || event.event_date;
            const eventContent = event.content || event.title || "일정";
            const petInfo = transformedPets.find(
              (p) => p.id === event.petProfileId || p.id === event.pet_profile_id
            );
            return {
              id: event.id,
              dDay: calculateDday(eventDate),
              dateLabel: formatDate(eventDate),
              title: `${getCategoryEmoji(event.category)} ${eventContent}`,
              pet: petInfo
                ? `${petInfo.emoji} ${petInfo.name}`
                : "🐾 알 수 없음",
              urgent:
                calculateDday(eventDate).includes("D-") &&
                parseInt(calculateDday(eventDate).split("-")[1]) <= 7,
              path: ROUTES.CALENDAR,
              eventDate: eventDate,
              category: event.category || 'medication', // 카테고리 정보 추가
            };
          })
          .filter((event) => {
            const evtDate = new Date(event.eventDate);
            return evtDate >= today && evtDate <= twoWeeksLater; // 오늘부터 2주 이내 일정만
          })
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)); // 가까운 순
        setSchedules(transformedEvents);

        // D-day 알림 설정 (가장 임박한 일정)
        if (transformedEvents.length > 0 && transformedEvents[0].urgent) {
          const firstEvent = transformedEvents[0];
          const days = parseInt(firstEvent.dDay.split("-")[1]) || 0;
          const petName = firstEvent.pet.split(" ")[1] || "반려동물";
          setDdayAlert({
            pet: petName,
            label: firstEvent.title.split(" ").slice(1).join(" "),
            days: days,
          });
        }

        // 게시글 데이터 변환
        const transformedPosts = (articlesData.data || []).map((article) => {
          // 날짜 포맷팅 (YYYY-MM-DD)
          const createdDate = article.created_at
            ? new Date(article.created_at).toISOString().split('T')[0]
            : '';

          return {
            id: article.id,
            title: article.title,
            createdAt: createdDate,
            likesCount: article.likesCount || 0,
          };
        });
        setPosts(transformedPosts);

        // 뉴스 데이터 변환 (첫 번째 항목의 summary는 제외)
        const transformedNews = (newsData.news || [])
          .slice(0, 3)
          .map((item, index) => ({
            id: item.id,
            title: item.title,
            summary: index === 0 ? "" : item.summary || item.description || "",
          }));
        setNews(transformedNews);
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className={styles.dashboardPage}>
        <DashboardHeader displayName={displayName} onLogout={handleLogout} />
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>
        </div>
      </div>
    );
  }

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
            {ddayAlert && (
              <div className={styles.ddayAlert}>
                ⏰ <strong>{ddayAlert.pet}</strong> {ddayAlert.label}이{" "}
                <strong>{ddayAlert.days}일</strong> 남았어요!
              </div>
            )}
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
                {pets.length > 0 ? (
                  pets.map((pet) => (
                    <div
                      key={pet.id}
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
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "#999" }}>
                    등록된 반려동물이 없습니다
                  </div>
                )}
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
                {schedules.length > 0 ? (
                  schedules.map((item) => {
                    const eventDate = new Date(item.eventDate);
                    const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];
                    const weekday = weekdayLabels[eventDate.getDay()];
                    const dateLabel = `${eventDate.getMonth() + 1}월 ${eventDate.getDate()}일 (${weekday})`;

                    // 카테고리에 따른 클래스명 (vaccination, hospital, grooming, medication)
                    const categoryClass = item.category || 'medication';

                    return (
                      <div
                        key={item.id}
                        className={`${styles.scheduleItem} ${styles[`${categoryClass}Card`]}`}
                        onClick={() => handleNavigate(item.path)}
                      >
                        <div className={styles.scheduleBadge}>{item.dDay}</div>
                        <div className={styles.scheduleContent}>
                          <div className={styles.scheduleTitle}>{item.title}</div>
                          <div className={styles.scheduleDateTime}>{dateLabel}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "20px", color: "#999" }}>
                    등록된 일정이 없습니다
                  </div>
                )}
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
                {news.length > 0 ? (
                  news.map((item) => (
                    <article
                      key={item.id}
                      className={styles.newsItem}
                      onClick={() => handleNavigate(ROUTES.NEWS)}
                    >
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </article>
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "#999" }}>
                    뉴스가 없습니다
                  </div>
                )}
              </div>
            </section>

            <section className={styles.popularPosts} id="community">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>📃</span>내가 작성한 게시글
                </h2>
              </div>
              <div className={styles.activityList}>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className={styles.postItem}
                      onClick={() =>
                        handleNavigate(`${ROUTES.COMMUNITY}/${post.id}`)
                      }
                    >
                      <div className={styles.postTitleMini}>{post.title}</div>
                      <div className={styles.postMetaMini}>
                        <span>{post.createdAt}</span>
                        <span>❤️ {post.likesCount}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "#999" }}>
                    게시글이 없습니다
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
