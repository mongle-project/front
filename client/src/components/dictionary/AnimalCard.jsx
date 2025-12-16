import React from 'react';

const AnimalCard = ({ animal }) => {
  return (
    <div className="animal-card">
      <h3>{animal.name}</h3>
      <p>{animal.description}</p>
    </div>
  );
};

export default AnimalCard;
