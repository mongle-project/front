import React from "react";
import { useNavigate } from "react-router-dom";
import CalendarGrid from "../../components/calendar/CalendarGrid";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import styles from "./CalendarPage.module.css";

const calendarEvents = [
  { date: "2024-11-29", title: "예방접종", type: "vaccine" },
  { date: "2024-12-03", title: "종합백신", type: "vaccine", time: "10:00" },
  { date: "2024-12-05", title: "정기검진", type: "hospital", time: "14:00" },
  { date: "2024-12-07", title: "미용", type: "grooming", time: "11:00" },
  { date: "2024-12-10", title: "건강검진", type: "checkup", time: "09:30" },
  { date: "2024-12-12", title: "미용", type: "grooming", time: "13:00" },
  { date: "2024-12-16", title: "예방접종 5차", type: "vaccine" },
  { date: "2024-12-22", title: "병원 방문", type: "hospital", time: "16:00" },
  { date: "2024-12-26", title: "예방접종", type: "vaccine" },
  { date: "2024-12-28", title: "미용", type: "grooming", time: "15:00" },
  { date: "2024-12-30", title: "정기검진", type: "hospital" },
  { date: "2025-01-02", title: "예방접종", type: "vaccine" },
];

const upcomingSchedules = [
  {
    id: 1,
    title: "병원 정기검진",
    pet: "🐱 나비",
    dday: 3,
    dateLabel: "12.18 (수) 오후 3:00",
    type: "hospital",
  },
  {
    id: 2,
    title: "미용",
    pet: "🐶 몽이",
    dday: 5,
    dateLabel: "12.20 (금) 오전 11:00",
    type: "grooming",
  },
  {
    id: 3,
    title: "예방접종 5차",
    pet: "🐶 몽이",
    dday: 9,
    dateLabel: "12.24 (화) 오전 10:00",
    type: "vaccine",
  },
];

const monthlyEvents = [
  {
    id: 1,
    title: "정기검진",
    pet: "몽이",
    type: "hospital",
    date: "12월 5일 (목)",
    time: "14:00",
    location: "마포동물병원",
  },
  {
    id: 2,
    title: "미용",
    pet: "몽이",
    type: "grooming",
    date: "12월 7일 (토)",
    time: "11:00",
    location: "몽글미용실",
  },
  {
    id: 3,
    title: "예방접종",
    pet: "나비",
    type: "vaccine",
    date: "12월 10일 (화)",
    time: "09:30",
    location: "행복동물병원",
  },
  {
    id: 4,
    title: "건강검진",
    pet: "토순이",
    type: "checkup",
    date: "12월 16일 (월)",
    time: "10:00",
    location: "하늘동물병원",
  },
];

const typeClassMap = {
  hospital: styles.badgeHospital,
  grooming: styles.badgeGrooming,
  vaccine: styles.badgeVaccine,
  checkup: styles.badgeCheckup,
};

const CalendarPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const displayName = user?.name ?? "집사님";

  const handleAddSchedule = () => navigate("/calendar/add");

  return (
    <div className={styles.page}>
      <DashboardHeader displayName={displayName} />

      <main className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.titleGroup}>
            <div className={styles.eyebrow}>몽글몽글 캘린더</div>
            <h1 className={styles.title}>반려동물 캘린더</h1>
            <p className={styles.subtitle}>
              우리 아이 일정과 D-day를 한눈에 확인해요
            </p>
          </div>
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddSchedule}
          >
            + 일정 추가
          </button>
        </div>

        <section className={styles.layout}>
          <div>
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <div className={styles.monthControl}>
                  <div className={styles.navGroup}>
                    <button type="button" className={styles.navButton}>
                      ‹
                    </button>
                    <button type="button" className={styles.navButton}>
                      ›
                    </button>
                  </div>
                  <div className={styles.monthTitle}>
                    <span className={styles.monthYear}>2024년</span>
                    <span className={styles.monthValue}>12월</span>
                  </div>
                  <div className={styles.navGroup}>
                    <button type="button" className={styles.todayButton}>
                      오늘
                    </button>
                  </div>
                </div>

                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ background: "#e53935" }}
                    />
                    예방접종
                  </div>
                  <div className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ background: "#1a73e8" }}
                    />
                    병원
                  </div>
                  <div className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ background: "#8e24aa" }}
                    />
                    미용
                  </div>
                  <div className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ background: "#2e7d32" }}
                    />
                    건강검진
                  </div>
                </div>
              </div>

              <CalendarGrid
                year={2024}
                month={12}
                events={calendarEvents}
                highlightDate="2024-12-10"
              />
            </div>

            <section className={styles.monthSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.cardTitle}>이번 달 일정</h3>
                <div className={styles.filterChips}>
                  <button type="button" className={`${styles.chip} ${styles.active}`}>
                    전체
                  </button>
                  <button type="button" className={styles.chip}>
                    병원
                  </button>
                  <button type="button" className={styles.chip}>
                    미용
                  </button>
                  <button type="button" className={styles.chip}>
                    예방접종
                  </button>
                  <button type="button" className={styles.chip}>
                    건강검진
                  </button>
                </div>
              </div>

              <div className={styles.eventsList}>
                {monthlyEvents.map((event) => (
                  <div key={event.id} className={styles.eventCard}>
                    <div className={styles.eventInfo}>
                      <div className={styles.eventMeta}>
                        <span
                          className={`${styles.eventBadge} ${
                            typeClassMap[event.type] || ""
                          }`}
                        >
                          {event.title}
                        </span>
                        <span className={styles.eventTime}>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div className={styles.eventTitle}>
                        {event.pet} | {event.location}
                      </div>
                    </div>
                    <div className={styles.eventAction}>
                      <button type="button" className={styles.eventButton}>
                        수정
                      </button>
                      <button type="button" className={styles.eventButton}>
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>다가오는 일정</h3>
                <span className={styles.badge}>D-day</span>
              </div>
              <div className={styles.ddayList}>
                {upcomingSchedules.map((item) => (
                  <div key={item.id} className={styles.ddayItem}>
                    <div
                      className={`${styles.ddayBadge} ${
                        item.dday <= 3 ? styles.danger : ""
                      }`}
                    >
                      <span>D-{item.dday}</span>
                    </div>
                    <div className={styles.ddayMeta}>
                      <div className={styles.ddayTitle}>{item.title}</div>
                      <div className={styles.ddayDesc}>{item.pet}</div>
                      <div className={styles.ddayDate}>{item.dateLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>이번 주 할 일</h3>
                <span className={styles.badge}>체크리스트</span>
              </div>
              <div className={styles.tasks}>
                <div className={styles.taskRow}>✔ 예방접종 스케줄 확인</div>
                <div className={styles.taskRow}>✔ 병원 예약 시간 재확인</div>
                <div className={`${styles.taskRow} ${styles.empty}`}>
                  🗓️ 새로운 일정을 추가해보세요
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default CalendarPage;
