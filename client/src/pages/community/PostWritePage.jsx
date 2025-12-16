import React, { useState } from 'react';

const PostWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit post logic
  };

  return (
    <div className="post-write-page">
      <h1>게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
};

export default PostWritePage;
