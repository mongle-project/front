import React from 'react';
import PetForm from '../../components/pet/PetForm';

const AddPetPage = () => {
  const handleSubmit = (petData) => {
    // Add pet logic
    console.log('Adding pet:', petData);
  };

  return (
    <div className="add-pet-page">
      <h1>반려동물 추가</h1>
      <PetForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddPetPage;
