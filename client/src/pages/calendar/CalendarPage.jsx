import React from 'react';
import CalendarGrid from '../../components/calendar/CalendarGrid';

const CalendarPage = () => {
  return (
    <div className="calendar-page">
      <h1>캘린더</h1>
      <CalendarGrid events={[]} />
    </div>
  );
};

export default CalendarPage;
