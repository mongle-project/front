import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.green.light};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.green.main};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.green.dark};
  }

  /* 링크 기본 스타일 제거 */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* 버튼 기본 스타일 제거 */
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
  }

  /* 이미지 기본 스타일 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 입력 필드 기본 스타일 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* 리스트 기본 스타일 제거 */
  ul, ol {
    list-style: none;
  }

  /* 포커스 아웃라인 제거 (접근성을 위해 키보드 사용 시에만 표시) */
  *:focus {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.green.main};
    outline-offset: 2px;
  }

  /* 선택 텍스트 스타일 */
  ::selection {
    background: ${({ theme }) => theme.colors.green.light};
    color: ${({ theme }) => theme.colors.green.dark};
  }

  /* 플레이스홀더 스타일 */
  ::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
    opacity: 1;
  }

  /* 애니메이션 */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* 유틸리티 클래스 */
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.5s ease-out;
  }

  .float {
    animation: float 3s ease-in-out infinite;
  }

  /* 반응형 헬퍼 */
  .mobile-only {
    display: none;
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: block;
    }
  }

  .desktop-only {
    display: block;
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none;
    }
  }

  /* 접근성 헬퍼 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* 인쇄 스타일 */
  @media print {
    body {
      background: white;
    }
    
    header, footer, .no-print {
      display: none !important;
    }
  }
`;

export default GlobalStyles;
