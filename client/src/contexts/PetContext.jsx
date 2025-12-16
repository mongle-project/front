import React, { createContext, useContext, useState } from 'react';

const PetContext = createContext();

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePetContext must be used within a PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);

  const addPet = (pet) => {
    setPets([...pets, pet]);
  };

  const updatePet = (id, updatedPet) => {
    setPets(pets.map(pet => pet.id === id ? updatedPet : pet));
  };

  const deletePet = (id) => {
    setPets(pets.filter(pet => pet.id !== id));
  };

  const value = {
    pets,
    addPet,
    updatePet,
    deletePet,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};
