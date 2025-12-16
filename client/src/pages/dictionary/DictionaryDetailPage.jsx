import React from 'react';
import { useParams } from 'react-router-dom';

const DictionaryDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="dictionary-detail-page">
      <h1>동물 상세 정보</h1>
      <p>ID: {id}</p>
    </div>
  );
};

export default DictionaryDetailPage;
