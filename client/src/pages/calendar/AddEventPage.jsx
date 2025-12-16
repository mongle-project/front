import React, { useState } from 'react';

const AddEventPage = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add event logic
  };

  return (
    <div className="add-event-page">
      <h1>일정 추가</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="일정 제목"
          value={eventData.title}
          onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
        />
        <input
          type="date"
          value={eventData.date}
          onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
        />
        <textarea
          placeholder="일정 설명"
          value={eventData.description}
          onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
        />
        <button type="submit">추가하기</button>
      </form>
    </div>
  );
};

export default AddEventPage;
