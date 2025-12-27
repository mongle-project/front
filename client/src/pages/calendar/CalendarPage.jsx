import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CalendarGrid from "../../components/calendar/CalendarGrid";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import calendarService from "../../services/calendarService";
import { ROUTES } from "../../utils/constants";
import styles from "./CalendarPage.module.css";

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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // 월별 일정 조회
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const response = await calendarService.getEventsByMonth(year, month);

      // API 응답 데이터를 컴포넌트 형식으로 변환
      const formattedEvents = (response.data || []).map((evt) => ({
        id: evt.id,
        date: evt.eventDate ? evt.eventDate.split("T")[0] : "",
        title: evt.title,
        type: evt.category,
        time: evt.eventTime || "",
        pet: evt.pet?.name || "",
        petId: evt.petProfileId,
        isComplete: evt.isComplete,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("일정 조회 실패:", error);
      toast.error("일정을 불러오는데 실패했습니다.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsThisMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    return events.filter((evt) => evt.date.startsWith(monthKey));
  }, [currentMonth, events]);

  const filteredEventsThisMonth = useMemo(() => {
    if (activeFilter === "all") return eventsThisMonth;
    return eventsThisMonth.filter((evt) => evt.type === activeFilter);
  }, [activeFilter, eventsThisMonth]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return events.filter((evt) => evt.date === todayKey);
  }, [events]);

  // 다가오는 일정 (오늘 이후, 최대 5개)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((evt) => {
        const evtDate = new Date(evt.date);
        evtDate.setHours(0, 0, 0, 0);
        return evtDate >= today && !evt.isComplete;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [events]);

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

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}:${minutes}`;
  };

  const handleEdit = (event) => {
    navigate(`${ROUTES.CALENDAR_ADD}?edit=${event.id}`);
  };

  const handleComplete = async (event) => {
    try {
      const payload = {
        petId: event.petId ? Number(event.petId) : null,
        title: event.title,
        category: event.type,
        date: event.date,
        startTime: event.time || null,
        completed: !event.isComplete,
      };

      await calendarService.updateEvent(event.id, payload);
      toast.success(
        event.isComplete
          ? `"${event.title}" 일정을 미완료로 변경했어요.`
          : `"${event.title}" 완료 처리했어요.`
      );
      fetchEvents(); // 목록 새로고침
    } catch (error) {
      console.error("완료 처리 실패:", error);
      toast.error("완료 처리에 실패했습니다.");
    }
  };

  const openDeleteModal = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      try {
        await calendarService.deleteEvent(eventToDelete.id);
        toast.success("삭제가 완료됐어요.");
        closeDeleteModal();
        fetchEvents(); // 목록 새로고침
      } catch (error) {
        console.error("삭제 실패:", error);
        toast.error("삭제에 실패했습니다.");
      }
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
                  <span
                    className={`${styles.legendDot} ${styles.vaccination}`}
                  />
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
                  <span
                    className={`${styles.legendDot} ${styles.medication}`}
                  />
                  투약
                </div>
              </div>

              <CalendarGrid events={events} month={currentMonth} />
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

              <div className={styles.eventCardsWrapper}>
                <div className={styles.eventCards}>
                  {loading ? (
                    <p className={styles.emptyState}>일정을 불러오는 중...</p>
                  ) : filteredEventsThisMonth.length === 0 ? (
                    <p className={styles.emptyState}>
                      이번 달에 등록된 일정이 없습니다.
                    </p>
                  ) : (
                    filteredEventsThisMonth.map((event) => (
                      <div
                        key={event.id}
                        className={`${styles.eventCard} ${styles[event.type]} ${
                          event.isComplete ? styles.completed : ""
                        }`}
                      >
                        <div className={styles.eventLeft}>
                          <span className={styles.typeBadge}>
                            {typeLabels[event.type]}
                          </span>
                          <div>
                            <p className={styles.eventCardTitle}>
                              {event.isComplete && (
                                <span className={styles.completeMark}>✓ </span>
                              )}
                              {event.title}
                            </p>
                            <p className={styles.eventCardMeta}>
                              {formatDateLabel(event.date)}
                              {event.time && ` · ${formatTime(event.time)}`}
                            </p>
                          </div>
                        </div>
                        <div className={styles.eventRight}>
                          {event.pet && (
                            <span className={styles.petBadge}>{event.pet}</span>
                          )}
                          <div className={styles.cardActions}>
                            <button
                              type="button"
                              aria-label="수정"
                              onClick={() => handleEdit(event)}
                              title="수정"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              aria-label={
                                event.isComplete ? "미완료로 변경" : "완료"
                              }
                              onClick={() => handleComplete(event)}
                              title={
                                event.isComplete ? "미완료로 변경" : "완료 처리"
                              }
                            >
                              {event.isComplete ? "↩️" : "✅"}
                            </button>
                            <button
                              type="button"
                              aria-label="삭제"
                              onClick={() => openDeleteModal(event)}
                              title="삭제"
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
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <h3>다가오는 일정</h3>
              </div>
              {upcomingEvents.length === 0 ? (
                <p className={styles.todayEmpty}>다가오는 일정이 없습니다</p>
              ) : (
                <ul className={styles.sideList}>
                  {upcomingEvents.map((event) => (
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
                          {formatDateLabel(event.date)}
                          {event.time && ` · ${formatTime(event.time)}`}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
                        <p className={styles.sideTitle}>
                          {event.isComplete && (
                            <span className={styles.completeMark}>✓ </span>
                          )}
                          {event.title}
                        </p>
                        <p className={styles.sideMeta}>
                          {event.time && formatTime(event.time)}
                          {event.time && event.pet && " · "}
                          {event.pet}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 삭제 확인 모달 */}
      <div
        className={`${styles.modal} ${isDeleteModalOpen ? styles.active : ""}`}
      >
        <div className={styles.deleteModalContent}>
          <div className={styles.deleteModalHeader}>
            <div className={styles.deleteIcon}>⚠️</div>
            <h2 className={styles.deleteModalTitle}>일정 삭제</h2>
          </div>

          <div className={styles.deleteModalBody}>
            <p className={styles.deleteMessage}>
              정말로 <strong>{eventToDelete?.title}</strong> 일정을
              삭제하시겠습니까?
            </p>
            <p className={styles.deleteWarning}>
              삭제 시 되돌릴 수 없어요.
            </p>
          </div>

          <div className={styles.deleteModalActions}>
            <button
              type="button"
              className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
              onClick={closeDeleteModal}
            >
              취소
            </button>
            <button
              type="button"
              className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
