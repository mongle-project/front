import React, { useMemo } from "react";
import styles from "./CalendarGrid.module.css";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const typeIcons = {
  vaccination: "💉",
  hospital: "🏥",
  grooming: "✂️",
  medication: "💊",
};

const CalendarGrid = ({ events = [], month = new Date() }) => {
  const monthData = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0);
    const prevEnd = new Date(year, monthIndex, 0);

    const startOffset = start.getDay(); // 0 (Sun) - 6 (Sat)
    const totalDays = end.getDate();
    const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

    const cells = [];
    const today = new Date();
    for (let i = startOffset - 1; i >= 0; i -= 1) {
      const day = prevEnd.getDate() - i;
      cells.push({
        day,
        isoDate: new Date(year, monthIndex - 1, day).toISOString(),
        events: [],
        isToday: false,
        isOtherMonth: true,
      });
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, monthIndex, day);
      const isoDate = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((evt) => evt.date === isoDate);
      const isToday = date.toDateString() === today.toDateString();
      cells.push({ day, isoDate, events: dayEvents, isToday, isOtherMonth: false });
    }

    while (cells.length < totalCells) {
      const day = cells.length - (startOffset + totalDays) + 1;
      cells.push({
        day,
        isoDate: new Date(year, monthIndex + 1, day).toISOString(),
        events: [],
        isToday: false,
        isOtherMonth: true,
      });
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return {
      weeks,
    };
  }, [events, month]);

  const getTypeClass = (type) => {
    if (type === "vaccination") return styles.vaccination;
    if (type === "hospital") return styles.hospital;
    if (type === "grooming") return styles.grooming;
    if (type === "medication") return styles.medication;
    return "";
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.weekdays}>
        {weekdays.map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {monthData.weeks.map((week, idx) => (
          <div key={idx} className={styles.weekRow}>
            {week.map((cell, cellIdx) => (
              <div
                key={cell.isoDate ?? `empty-${cellIdx}`}
                className={`${styles.cell} ${cell.isToday ? styles.today : ""} ${
                  cell.events.length
                    ? `${styles.hasEvents} ${getTypeClass(cell.events[0]?.type)}`
                    : ""
                } ${cell.isOtherMonth ? styles.otherMonth : ""}`}
              >
                <div className={styles.dateHeader}>
                  <span className={styles.dayNumber}>{cell.day}</span>
                  {cell.isToday && (
                    <span className={styles.todayBadge}>Today</span>
                  )}
                </div>
                <div className={styles.events}>
                  {cell.events.map((event) => (
                    <span
                      key={event.id}
                      className={`${styles.eventLine} ${
                        styles[`${event.type}Line`]
                      }`}
                      aria-label={`${event.title} (${typeIcons[event.type] || ""})`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
