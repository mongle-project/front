import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnimalCard.module.css';

const AnimalCard = ({ animal }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    switch (category) {
      case '강아지':
        return '🐕';
      case '고양이':
        return '🐈';
      case '소형동물':
        return '🐰';
      case '조류':
        return '🐦';
      case '파충류':
        return '🦎';
      case '어류':
        return '🐠';
      default:
        return '🐾';
    }
  };

  const handleCardClick = () => {
    navigate(`/dictionary/${animal.id}`);
  };

  return (
    <div className={styles.animalCard} onClick={handleCardClick}>
      <img
        src={animal.image}
        alt={animal.name}
        className={styles.animalImage}
      />
      <div className={styles.animalInfo}>
        <span className={styles.animalCategory}>
          {getCategoryIcon(animal.category)} {animal.category}
        </span>
        <h3 className={styles.animalName}>{animal.name}</h3>
        <p className={styles.animalBreed}>{animal.breed}</p>
        <p className={styles.animalDescription}>{animal.description}</p>
        <div className={styles.animalTags}>
          {animal.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
