import React from 'react';

const CommentItem = ({ comment }) => {
  return (
    <div className="comment-item">
      <p className="author">{comment.author}</p>
      <p className="content">{comment.content}</p>
    </div>
  );
};

export default CommentItem;
