import React from 'react';

const DdayAlert = ({ daysRemaining }) => {
  return (
    <div className="dday-alert">
      <p>D-{daysRemaining}</p>
    </div>
  );
};

export default DdayAlert;
