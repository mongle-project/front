# Mongle Frontend 🐾

> 반려동물 관리 및 커뮤니티 플랫폼 - 프론트엔드

Mongle은 반려동물의 건강 관리, 일정 관리, 커뮤니티 소통을 하나로 통합한 웹 플랫폼입니다. React 19와 Vite로 구축된 모던 웹 애플리케이션입니다.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)](https://developer.mozilla.org/ko/docs/Web/JavaScript)

---

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [환경 변수 설정](#-환경-변수-설정)
- [페이지 구조](#-페이지-구조)
- [API 연동](#-api-연동)
- [상태 관리](#-상태-관리)
- [스타일링](#-스타일링)
- [라우팅](#-라우팅)
- [경로 별칭](#-경로-별칭)
- [알려진 이슈](#-알려진-이슈)
- [참고 자료](#-참고-자료)

---

## ✨ 주요 기능

### 🐾 반려동물 관리

- 여러 반려동물 프로필 등록/수정/삭제
- 프로필 이미지 업로드 (AWS S3)
- 나이 자동 계산 및 성별/종류 관리

### 📅 캘린더 & 일정 관리

- 예방접종, 병원 방문, 미용 일정 등록
- D-Day 알림 기능
- 월별 일정 뷰

### 💬 커뮤니티

- 게시글 작성/조회/수정/삭제
- 댓글 시스템
- 카테고리별 게시글 필터링

### 🏥 위치 기반 서비스

- Kakao Map 연동 동물병원 검색
- 보호소 위치 검색
- 거리 기반 필터링

### 🤖 AI 건강 상담

- GPT API 기반 반려동물 건강 상담
- 증상 입력 및 AI 분석 결과 제공

### 📰 뉴스 피드

- 동물 관련 뉴스 크롤링
- "가족이 되어주세요" 입양 뉴스 섹션

### 📖 동물 도감

- 9개 카테고리 (강아지, 고양이, 토끼, 햄스터, 기니피그, 조류, 물고기, 파충류, 거북이)
- 상세 특징 및 이미지 제공

---

## 🛠 기술 스택

### Core

- **React** 19.2.0 - 최신 React 기능 활용
- **Vite** 7.2.4 - 고속 빌드 도구
- **React Router** 7.10.1 - SPA 라우팅

### 상태 관리

- **Context API** - 인증, 반려동물, 테마 관리
- **Custom Hooks** - 재사용 가능한 로직 분리

### 스타일링

- **Styled-components** 6.1.19 - CSS-in-JS
- **CSS Modules** - 컴포넌트별 스타일 격리
- **커스텀 디자인 시스템** - 일관된 테마 및 색상 팔레트

### HTTP & API

- **Axios** 1.13.2 - HTTP 클라이언트
- JWT 토큰 기반 인증
- 자동 토큰 갱신 및 401 에러 처리

### UI/UX

- **React Hot Toast** 2.6.0 - 알림 시스템
- **Kakao Map API** - 지도 서비스
- **반응형 디자인** - 모바일/태블릿/데스크톱 지원

### 유틸리티

- **html2canvas** 1.4.1 - 스크린샷 캡처
- **jsPDF** 3.0.4 - PDF 생성

---

## 📁 프로젝트 구조

```
client/front/client/
├── public/                 # 정적 파일
├── src/
│   ├── api/               # API 레이어 (권장)
│   │   ├── axios.js       # Axios 인스턴스 (JWT 토큰, 인터셉터)
│   │   ├── auth.js        # 인증 API
│   │   ├── users.js       # 사용자 API
│   │   ├── pets.js        # 반려동물 API
│   │   ├── articles.js    # 커뮤니티 API
│   │   ├── calendarEvents.js  # 캘린더 API
│   │   ├── locations.js   # 병원/보호소 API
│   │   ├── health.js      # AI 상담 API
│   │   └── news.js        # 뉴스 API
│   │
│   ├── components/        # 재사용 컴포넌트
│   │   ├── common/        # 공통 컴포넌트 (Button, Input, Modal, Loading)
│   │   ├── layout/        # 레이아웃 (MainLayout, AuthLayout)
│   │   ├── header/        # 헤더 (Header, NavBar)
│   │   ├── pet/           # 반려동물 컴포넌트 (PetCard, PetForm)
│   │   ├── post/          # 게시글 컴포넌트 (PostCard, CommentForm)
│   │   ├── calendar/      # 캘린더 컴포넌트 (CalendarGrid, EventItem)
│   │   ├── dictionary/    # 도감 컴포넌트 (AnimalCard, AnimalFilter)
│   │   └── map/           # 지도 컴포넌트 (KakaoMap)
│   │
│   ├── pages/             # 페이지 컴포넌트 (18개)
│   │   ├── auth/          # 인증 페이지 (LoginPage, FindPasswordPage)
│   │   ├── home/          # 홈 페이지 (LandingPage, DashboardPage)
│   │   ├── pet/           # 반려동물 페이지 (MyPetsPage, AddPetPage, EditPetPage)
│   │   ├── calendar/      # 캘린더 페이지 (CalendarPage, AddEventPage)
│   │   ├── community/     # 커뮤니티 페이지 (CommunityListPage, PostDetailPage, PostWritePage)
│   │   ├── dictionary/    # 도감 페이지 (DictionaryListPage, DictionaryDetailPage)
│   │   ├── health/        # AI 상담 페이지 (AiConsultPage, AiResultPage)
│   │   ├── map/           # 지도 페이지 (MapPage)
│   │   └── news/          # 뉴스 페이지 (NewsListPage)
│   │
│   ├── contexts/          # Context API
│   │   ├── AuthContext.jsx    # 인증 상태 관리
│   │   ├── PetContext.jsx     # 반려동물 상태 관리
│   │   └── ThemeContext.jsx   # 테마 상태 관리
│   │
│   ├── hooks/             # 커스텀 훅
│   │   ├── useAuth.js         # 인증 훅
│   │   ├── usePets.js         # 반려동물 훅
│   │   ├── usePosts.js        # 게시글 훅
│   │   ├── useCalendar.js     # 캘린더 훅
│   │   ├── useLocalStorage.js # localStorage 훅
│   │   ├── useKakaoMap.js     # Kakao Map 훅
│   │   └── useLocationData.js # 위치 데이터 훅
│   │
│   ├── routes/            # 라우팅
│   │   ├── AppRoutes.jsx      # 라우트 정의
│   │   ├── PrivateRoute.jsx   # 인증 필요 라우트
│   │   └── PublicRoute.jsx    # 비로그인 전용 라우트
│   │
│   ├── styles/            # 스타일
│   │   ├── GlobalStyles.jsx   # 전역 스타일
│   │   ├── theme.js           # 디자인 시스템 (색상, 폰트, 간격)
│   │   └── variables.css      # CSS 변수
│   │
│   ├── utils/             # 유틸리티
│   │   ├── animalData.js      # 동물도감 데이터 통합
│   │   ├── constants.js       # 상수 정의
│   │   ├── dateUtils.js       # 날짜 포맷팅
│   │   ├── formatUtils.js     # 문자열 포맷팅
│   │   ├── validationUtils.js # 폼 검증
│   │   ├── kakaoMapLoader.js  # Kakao Map API 로더
│   │   ├── locationAdapter.js # 위치 데이터 어댑터
│   │   └── markerManager.js   # 지도 마커 관리
│   │
│   ├── data/              # 정적 데이터
│   │   └── dictionary/    # 동물도감 데이터 (9개 카테고리, 320개 품종)
│   │
│   ├── config/            # 설정 파일
│   │   └── config.js      # 환경 변수 설정
│   │
│   ├── App.jsx            # 루트 컴포넌트
│   └── main.jsx           # 엔트리 포인트
│
├── .env                   # 환경 변수 (git 제외)
├── jsconfig.json          # 경로 별칭 설정
├── vite.config.js         # Vite 설정
├── package.json           # 의존성 관리
└── README.md              # 프로젝트 문서
```

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (또는 yarn/pnpm)

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd client/front/client

# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
# 아래 "환경 변수 설정" 섹션 참조

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

---

## 🔐 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# API 서버 URL
VITE_API_URL=http://localhost:3001/api

# Kakao Map API 키 (선택사항)
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

### 백엔드 서버 연동

⚠️ **중요**: 백엔드 서버가 실행 중이어야 합니다.

- **백엔드 포트**: 3001
- **프론트엔드 포트**: 5173
- **CORS 설정**: 백엔드에서 `http://localhost:5173` 허용 필요

백엔드 서버 실행 방법:

```bash
cd ../../../server
npm install
npm run dev
```

---

## 📄 페이지 구조

### 인증 (Public)

- `/login` - 로그인/회원가입 통합 페이지
- `/signup` - 회원가입 (LoginPage 재사용)
- `/find-password` - 비밀번호 찾기

### 홈

- `/` - 랜딩 페이지 (비로그인 사용자)
- `/dashboard` - 대시보드 (로그인 사용자) 🔒 **PrivateRoute**

### 반려동물 관리 🔒 **PrivateRoute**

- `/pets` - 내 반려동물 목록
- `/pets/add` - 반려동물 추가
- `/pets/edit/:id` - 반려동물 수정

### 캘린더 🔒 **PrivateRoute**

- `/calendar` - 캘린더 뷰
- `/calendar/add` - 일정 추가

### 커뮤니티 🔒 **PrivateRoute**

- `/community` - 게시글 목록
- `/community/:id` - 게시글 상세
- `/community/write` - 게시글 작성

### AI 건강 상담 🔒 **PrivateRoute**

- `/health/consult` - AI 상담 입력
- `/health/result` - AI 상담 결과

### 공개 서비스

- `/dictionary` - 동물 도감 목록
- `/dictionary/:id` - 동물 상세 정보
- `/news` - 뉴스 피드
- `/map` - 병원/보호소 지도

---

## 🌐 API 연동

### API 클라이언트 구조

**권장 방법**: `src/api/` 디렉토리 사용

```javascript
// 예시: 반려동물 조회
import { getPets } from "@api/pets";

const fetchMyPets = async () => {
  try {
    const response = await getPets();
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

### Axios 인스턴스 특징

**자동 토큰 처리** ([src/api/axios.js](src/api/axios.js))

- 모든 요청에 `Authorization: Bearer {token}` 헤더 자동 추가
- localStorage에서 토큰 읽기
- FormData 요청 시 `Content-Type` 자동 설정

**에러 처리**

- 401 (Unauthorized): 자동 로그아웃 + 로그인 페이지 리다이렉트
- Toast 알림 통합

**환경 설정**

- Base URL: `config.js`에서 `VITE_API_URL` 환경 변수 사용
- Timeout: 10초 (기본값)

### API 모듈 목록

| 모듈     | 파일                                               | 주요 함수                                                                          |
| -------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 인증     | [api/auth.js](src/api/auth.js)                     | `login`, `signup`, `logout`                                                        |
| 사용자   | [api/users.js](src/api/users.js)                   | `getUserInfo`, `updateProfile`                                                     |
| 반려동물 | [api/pets.js](src/api/pets.js)                     | `getPets`, `createPet`, `updatePet`, `deletePet`                                   |
| 커뮤니티 | [api/articles.js](src/api/articles.js)             | `getArticles`, `getArticleById`, `createArticle`, `updateArticle`, `deleteArticle` |
| 캘린더   | [api/calendarEvents.js](src/api/calendarEvents.js) | `getCalendarEvents`, `createEvent`, `updateEvent`, `deleteEvent`                   |
| 위치     | [api/locations.js](src/api/locations.js)           | `getHospitals`, `getShelters`                                                      |
| AI 상담  | [api/health.js](src/api/health.js)                 | `aiConsult`                                                                        |
| 뉴스     | [api/news.js](src/api/news.js)                     | `getNews`                                                                          |

---

## 📦 상태 관리

### Context API 구조

**Provider 계층** ([src/App.jsx](src/App.jsx))

```jsx
<AuthProvider>
  <PetProvider>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </PetProvider>
</AuthProvider>
```

### AuthContext

**제공 기능**

- 로그인/로그아웃
- 사용자 정보 관리
- localStorage 동기화

**사용 예시**

```javascript
import { useContext } from "react";
import { AuthContext } from "@contexts/AuthContext";

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext);

  // 로그인
  const handleLogin = async (credentials) => {
    await login(credentials);
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>안녕하세요, {user.name}님!</p>
      ) : (
        <button onClick={() => handleLogin({ email, password })}>로그인</button>
      )}
    </div>
  );
};
```

### PetContext

**제공 기능**

- 반려동물 CRUD
- 펫 목록 관리

**사용 예시**

```javascript
import { useContext } from "react";
import { PetContext } from "@contexts/PetContext";

const MyPetsComponent = () => {
  const { pets, addPet, updatePet, deletePet } = useContext(PetContext);

  return (
    <div>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
};
```

---

## 🎨 스타일링

### 디자인 시스템

**색상 팔레트** ([src/styles/theme.js](src/styles/theme.js))

```javascript
// 메인 컬러
colors: {
  main: '#66BB6A',        // 그린
  mainLight: '#81C784',
  mainDark: '#4CAF50',

  // 카테고리별 색상
  dog: '#FF9800',         // 주황
  cat: '#9C27B0',         // 보라
  smallAnimal: '#2196F3', // 파랑
  bird: '#FFC107',        // 노랑
  reptile: '#00BCD4',     // 청록
  fish: '#03A9F4',        // 파랑

  // 일정 카테고리
  vaccination: '#F44336', // 빨강
  hospital: '#2196F3',    // 파랑
  grooming: '#9C27B0',    // 보라
  medication: '#4CAF50'   // 초록
}
```

**타이포그래피**

- 기본 폰트: GyeonggiMillenniumTitle + Noto Sans KR
- 폰트 크기: 0.75rem ~ 3rem (8단계)
- 폰트 굵기: 400 (normal), 700 (bold)

**간격 (Spacing)**

- xs: 8px, sm: 16px, md: 24px, lg: 32px, xl: 48px

**반응형 브레이크포인트**

- mobile: 768px
- tablet: 1024px
- desktop: 1200px

### 스타일링 방법

**Styled-components** (권장)

```javascript
import styled from "styled-components";

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.main};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
`;
```

**CSS Modules**

```css
/* Button.module.css */
.button {
  background-color: var(--color-main);
  padding: 16px;
}
```

---

## 🚦 라우팅

### PrivateRoute (인증 필요)

로그인하지 않은 사용자는 `/login`으로 리다이렉트됩니다.

```javascript
// src/routes/PrivateRoute.jsx
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

**적용 경로**

- `/dashboard`, `/pets/*`, `/calendar/*`, `/community/*`, `/health/*`

### PublicRoute (비로그인 전용)

로그인한 사용자는 `/dashboard`로 리다이렉트됩니다.

```javascript
// src/routes/PublicRoute.jsx
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};
```

**적용 경로**

- `/login`, `/signup`, `/find-password`

---

## 🔧 경로 별칭

**jsconfig.json 설정**

```json
{
  "compilerOptions": {
    "paths": {
      "@components/*": ["components/*"],
      "@pages/*": ["pages/*"],
      "@hooks/*": ["hooks/*"],
      "@contexts/*": ["contexts/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@styles/*": ["styles/*"],
      "@assets/*": ["assets/*"]
    }
  }
}
```

**사용 예시**

```javascript
// ❌ 상대 경로
import Button from "../../../components/common/Button";

// ✅ 경로 별칭
import Button from "@components/common/Button";
```

---
