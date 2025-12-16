import React, { useState } from 'react';

const FindPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Find password logic
  };

  return (
    <div className="find-password-page">
      <h1>비밀번호 찾기</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="가입하신 이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">비밀번호 재설정 링크 보내기</button>
      </form>
    </div>
  );
};

export default FindPasswordPage;
