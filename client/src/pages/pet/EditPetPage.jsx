import React from 'react';
import { useParams } from 'react-router-dom';
import PetForm from '../../components/pet/PetForm';

const EditPetPage = () => {
  const { id } = useParams();

  const handleSubmit = (petData) => {
    // Edit pet logic
    console.log('Editing pet:', id, petData);
  };

  return (
    <div className="edit-pet-page">
      <h1>반려동물 정보 수정</h1>
      <PetForm onSubmit={handleSubmit} />
    </div>
  );
};

export default EditPetPage;
