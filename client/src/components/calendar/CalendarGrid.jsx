import React, { useMemo } from "react";
import styles from "./CalendarGrid.module.css";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarGrid = ({ year, month, events = [], highlightDate }) => {
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const startWeekday = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const cells = [];

    // Previous month trailing days
    for (let i = startWeekday - 1; i >= 0; i -= 1) {
      cells.push({
        date: new Date(year, month - 2, prevMonthDays - i),
        isOtherMonth: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        date: new Date(year, month - 1, day),
        isOtherMonth: false,
      });
    }

    // Next month leading days
    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - (startWeekday + daysInMonth) + 1;
      cells.push({
        date: new Date(year, month, nextDay),
        isOtherMonth: true,
      });
    }

    if (cells.length < 35) {
      const base = cells.length;
      for (let i = 0; i < 35 - base; i += 1) {
        const nextDay = cells.length - (startWeekday + daysInMonth) + 1;
        cells.push({
          date: new Date(year, month, nextDay),
          isOtherMonth: true,
        });
      }
    }

    return cells;
  }, [year, month]);

  const eventMap = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      const key = event.date;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(event);
    });
    return map;
  }, [events]);

  const highlightedKey = highlightDate;
  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className={styles.grid}>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={`${styles.weekday} ${
              day === "일"
                ? styles.sunday
                : day === "토"
                ? styles.saturday
                : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className={styles.days}>
        {calendarCells.map(({ date, isOtherMonth }) => {
          const key = date.toISOString().slice(0, 10);
          const dayNumber = date.getDate();
          const dayEvents = eventMap[key] || [];
          const isToday = key === (highlightedKey || todayKey);

          return (
            <div
              key={key}
              className={`${styles.day} ${
                isOtherMonth ? styles.otherMonth : ""
              } ${isToday ? styles.today : ""}`}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayNumber}>{dayNumber}</span>
                {dayEvents.length > 0 && (
                  <span className={styles.eventCount}>• {dayEvents.length}</span>
                )}
              </div>

              <div className={styles.eventList}>
                {dayEvents.map((event) => (
                  <div
                    key={`${key}-${event.title}`}
                    className={`${styles.eventTag} ${styles[event.type] || ""}`}
                  >
                    <span>{event.title}</span>
                    {event.time && <small>{event.time}</small>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
