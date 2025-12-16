import React, { useState } from 'react';

const AiConsultPage = () => {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // AI consult logic
  };

  return (
    <div className="ai-consult-page">
      <h1>AI 건강 상담</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="반려동물의 증상을 입력하세요"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button type="submit">상담하기</button>
      </form>
    </div>
  );
};

export default AiConsultPage;
