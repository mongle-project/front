import React from 'react';

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <h3>{pet.name}</h3>
      <p>{pet.species}</p>
    </div>
  );
};

export default PetCard;
