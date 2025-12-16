import { useState, useEffect } from 'react';

const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pets
    setLoading(false);
  }, []);

  const addPet = (petData) => {
    // Add pet logic
  };

  const updatePet = (id, petData) => {
    // Update pet logic
  };

  const deletePet = (id) => {
    // Delete pet logic
  };

  return { pets, loading, addPet, updatePet, deletePet };
};

export default usePets;
