import React, { useState } from 'react';

const PetForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="반려동물 이름"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {/* Add more form fields as needed */}
      <button type="submit">저장</button>
    </form>
  );
};

export default PetForm;
