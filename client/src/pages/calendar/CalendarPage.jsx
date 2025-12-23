import React, { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CalendarGrid from "../../components/calendar/CalendarGrid";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import styles from "./CalendarPage.module.css";

const mockEvents = [
  {
    id: 1,
    date: "2025-02-17",
    title: "종합 예방접종",
    type: "vaccination",
    time: "오전 10:00",
    pet: "몽글이",
  },
  {
    id: 2,
    date: "2025-02-05",
    title: "정기 검진",
    type: "hospital",
    time: "오후 2:30",
    pet: "나비",
  },
  {
    id: 3,
    date: "2025-02-27",
    title: "전체 미용",
    type: "grooming",
    time: "오전 11:00",
    pet: "토순이",
  },
  {
    id: 4,
    date: "2025-02-15",
    title: "영양제 투약",
    type: "medication",
    time: "오전 9:00",
    pet: "몽글이",
  },
];

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const typeLabels = {
  vaccination: "예방접종",
  hospital: "병원",
  grooming: "미용",
  medication: "투약",
};

const filterOptions = [
  { value: "all", label: "전체" },
  { value: "vaccination", label: "예방접종" },
  { value: "hospital", label: "병원" },
  { value: "grooming", label: "미용" },
  { value: "medication", label: "투약" },
];

const CalendarPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [activeFilter, setActiveFilter] = useState("all");

  const normalizedEvents = useMemo(() => {
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();
    return mockEvents.map((evt) => {
      const original = new Date(evt.date);
      const normalizedDate = new Date(year, monthIndex, original.getDate());
      const isoDate = `${normalizedDate.getFullYear()}-${String(
        normalizedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(normalizedDate.getDate()).padStart(
        2,
        "0"
      )}`;
      return {
        ...evt,
        date: isoDate,
      };
    });
  }, [currentMonth]);

  const eventsThisMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    return normalizedEvents.filter((evt) => evt.date.startsWith(monthKey));
  }, [currentMonth, normalizedEvents]);

  const filteredEventsThisMonth = useMemo(() => {
    if (activeFilter === "all") return eventsThisMonth;
    return eventsThisMonth.filter((evt) => evt.type === activeFilter);
  }, [activeFilter, eventsThisMonth]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return normalizedEvents.filter((evt) => evt.date === todayKey);
  }, [normalizedEvents]);

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  const handleAdd = () => navigate(ROUTES.CALENDAR_ADD);
  const handlePrevMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const handleToday = () => setCurrentMonth(new Date());
  const handleNextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  const monthLabel = `${currentMonth.getFullYear()}년 ${
    currentMonth.getMonth() + 1
  }월`;

  const getDaysRemaining = (dateString) => {
    const today = new Date();
    const target = new Date(dateString);
    const diff =
      (target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(diff));
  };

  const formatDateLabel = (dateString) => {
    const dateObj = new Date(dateString);
    const weekday = weekdayLabels[dateObj.getDay()];
    return `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${weekday})`;
  };

  const handleEdit = (event) => {
    toast.success(`"${event.title}" 수정 화면은 준비 중이에요.`);
  };

  const handleComplete = (event) => {
    toast.success(`"${event.title}" 완료 처리했어요.`);
  };

  const handleDelete = (event) => {
    const shouldDelete = confirm(
      `"${event.title}" 일정을 삭제할까요?\n삭제 시 되돌릴 수 없어요.`
    );
    if (shouldDelete) {
      toast.success("삭제가 완료됐어요.");
    }
  };

  return (
    <div className={styles.page}>
      <Toaster />
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />

      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <p className={styles.breadcrumb}>대시보드 · 캘린더</p>
            <h1 className={styles.title}>반려동물 캘린더</h1>
            <p className={styles.subtitle}>
              예방접종, 병원 예약, 미용 일정을 한눈에 관리하세요
            </p>
          </div>
          <div className={styles.actions}>
            <button type="button" className={`${styles.button} ${styles.outline}`}>
              일정 가져오기
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.primary}`}
              onClick={handleAdd}
            >
              일정 추가
            </button>
          </div>
        </header>

        <section className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <div>
                  <p className={styles.monthMeta}>올해의 일정</p>
                  <div className={styles.monthTitleRow}>
                    <h2>{monthLabel}</h2>
                    <span className={styles.monthBadge}>캘린더</span>
                  </div>
                </div>
                <div className={styles.monthControls}>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={handlePrevMonth}
                    aria-label="이전 달"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={handleToday}
                    aria-label="오늘"
                  >
                    오늘
                  </button>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={handleNextMonth}
                    aria-label="다음 달"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className={styles.legendRow}>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.vaccination}`} />
                  예방접종
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.hospital}`} />
                  병원
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.grooming}`} />
                  미용
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.medication}`} />
                  투약
                </div>
              </div>

              <CalendarGrid events={normalizedEvents} month={currentMonth} />
            </div>

            <div className={styles.monthListCard}>
              <div className={styles.monthListHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>이번달 일정</p>
                  <h3>일정 목록</h3>
                </div>
                <div className={styles.chips}>
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`${styles.chip} ${
                        activeFilter === option.value ? styles.activeChip : ""
                      }`}
                      onClick={() => setActiveFilter(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.eventCards}>
                {filteredEventsThisMonth.length === 0 ? (
                  <p className={styles.emptyState}>
                    이번 달에 등록된 일정이 없습니다.
                  </p>
                ) : (
                  filteredEventsThisMonth.map((event) => (
                    <div
                      key={event.id}
                      className={`${styles.eventCard} ${styles[event.type]}`}
                    >
                      <div className={styles.eventLeft}>
                        <span className={styles.typeBadge}>
                          {typeLabels[event.type]}
                        </span>
                        <div>
                          <p className={styles.eventCardTitle}>{event.title}</p>
                          <p className={styles.eventCardMeta}>
                            {formatDateLabel(event.date)} · {event.time}
                          </p>
                        </div>
                      </div>
                      <div className={styles.eventRight}>
                        <span className={styles.petBadge}>{event.pet}</span>
                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            aria-label="수정"
                            onClick={() => handleEdit(event)}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            aria-label="완료"
                            onClick={() => handleComplete(event)}
                          >
                            ✅
                          </button>
                          <button
                            type="button"
                            aria-label="삭제"
                            onClick={() => handleDelete(event)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <h3>다가오는 일정</h3>
              </div>
              <ul className={styles.sideList}>
                {normalizedEvents
                  .slice()
                  .sort((a, b) => (a.date > b.date ? 1 : -1))
                  .map((event) => (
                    <li
                      key={event.id}
                      className={`${styles.sideItemCard} ${
                        styles[`${event.type}Card`]
                      }`}
                    >
                      <span className={styles.sideDayBadge}>
                        D-{getDaysRemaining(event.date)}
                      </span>
                      <div className={styles.sideItemBody}>
                        <p className={styles.sideTitle}>{event.title}</p>
                        <p className={styles.sideMeta}>
                          {formatDateLabel(event.date)} · {event.time}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <h3>오늘 일정</h3>
                </div>
                {todayEvents.length === 0 ? (
                  <p className={styles.todayEmpty}>오늘 일정 없음</p>
                ) : (
                  <ul className={styles.sideList}>
                    {todayEvents.map((event) => (
                      <li key={event.id} className={styles.sideItem}>
                        <div>
                        <p className={styles.sideTitle}>{event.title}</p>
                        <p className={styles.sideMeta}>
                          {event.time} · {event.pet}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className={styles.secondaryButton} onClick={handleAdd}>
                일정 추가하기
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CalendarPage;
