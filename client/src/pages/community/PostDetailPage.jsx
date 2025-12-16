import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="post-detail-page">
      <h1>게시글 상세</h1>
      <p>Post ID: {id}</p>
    </div>
  );
};

export default PostDetailPage;
