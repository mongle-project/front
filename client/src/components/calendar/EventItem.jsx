import React from 'react';

const EventItem = ({ event }) => {
  return (
    <div className="event-item">
      <h4>{event.title}</h4>
      <p>{event.date}</p>
    </div>
  );
};

export default EventItem;
