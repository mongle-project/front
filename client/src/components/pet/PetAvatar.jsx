import React from 'react';

const PetAvatar = ({ imageUrl, alt }) => {
  return (
    <div className="pet-avatar">
      <img src={imageUrl} alt={alt} />
    </div>
  );
};

export default PetAvatar;
