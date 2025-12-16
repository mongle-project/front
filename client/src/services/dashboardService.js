import { ROUTES } from "../utils/constants";

const mockDashboardData = {
  quickActions: [
    {
      id: "ai-consult",
      icon: "🤖",
      title: "AI 건강 상담",
      desc: "전문 AI에게 건강 조언 받기",
      path: ROUTES.HEALTH_CONSULT,
    },
    {
      id: "hospital-search",
      icon: "🏥",
      title: "동물병원 찾기",
      desc: "가까운 병원 검색하기",
      path: ROUTES.MAP,
    },
    {
      id: "add-event",
      icon: "📅",
      title: "일정 추가",
      desc: "예방접종·병원 일정 등록",
      path: ROUTES.CALENDAR_ADD,
    },
    {
      id: "community",
      icon: "💬",
      title: "커뮤니티",
      desc: "다른 집사들과 소통하기",
      path: ROUTES.COMMUNITY,
    },
  ],
  pets: [
    {
      id: 1,
      name: "몽이",
      breed: "말티즈 • 3살",
      emoji: "🐕",
      gradient: "linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)",
      mission: "심장사상충 약 복용 예정",
      path: ROUTES.PETS,
    },
    {
      id: 2,
      name: "나비",
      breed: "코리안숏헤어 • 2살",
      emoji: "🐈",
      gradient: "linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)",
      mission: "장 건강 케어 진행 중",
      path: ROUTES.PETS,
    },
    {
      id: 3,
      name: "토순이",
      breed: "네덜란드드워프 • 1살",
      emoji: "🐰",
      gradient: "linear-gradient(135deg, #ec407a 0%, #d81b60 100%)",
      mission: "털갈이 집중 관리",
      path: ROUTES.PETS,
    },
  ],
  schedules: [
    {
      id: 1,
      dDay: "D-5",
      dateLabel: "2024.12.15 (일) 오전 10:00",
      title: "💉 종합백신 접종",
      pet: { emoji: "🐕", name: "몽이" },
      urgent: true,
      alertKeyword: "예방접종",
      path: ROUTES.CALENDAR,
    },
    {
      id: 2,
      dDay: "D-10",
      dateLabel: "2024.12.20 (금) 오후 3:00",
      title: "🏥 정기 검진",
      pet: { emoji: "🐈", name: "나비" },
      path: ROUTES.CALENDAR,
    },
    {
      id: 3,
      dDay: "D-17",
      dateLabel: "2024.12.27 (금) 오후 2:30",
      title: "✂️ 전체 미용",
      pet: { emoji: "🐰", name: "토순이" },
      path: ROUTES.CALENDAR,
    },
  ],
  activities: [
    {
      id: 1,
      icon: "📝",
      text: "몽이 건강 기록을 업데이트했어요",
      time: "2시간 전",
      path: ROUTES.PETS,
    },
    {
      id: 2,
      icon: "💬",
      text: "\"강아지 사료 추천\" 게시글에 댓글을 남겼어요",
      time: "5시간 전",
      path: ROUTES.COMMUNITY,
    },
    {
      id: 3,
      icon: "📅",
      text: "나비 예방접종 일정을 추가했어요",
      time: "1일 전",
      path: ROUTES.CALENDAR,
    },
    {
      id: 4,
      icon: "🤖",
      text: "AI 건강 상담을 받았어요",
      time: "2일 전",
      path: ROUTES.HEALTH_CONSULT,
    },
  ],
  posts: [
    {
      id: 1,
      title: "겨울철 강아지 발바닥 관리 꿀팁",
      views: "1,234",
      comments: "45",
      path: `${ROUTES.COMMUNITY}/1`,
    },
    {
      id: 2,
      title: "고양이가 물을 잘 안 마시는데 어떻게 하죠?",
      views: "892",
      comments: "32",
      path: `${ROUTES.COMMUNITY}/2`,
    },
    {
      id: 3,
      title: "토끼 케이지 꾸미기 아이디어 공유해요",
      views: "654",
      comments: "18",
      path: `${ROUTES.COMMUNITY}/3`,
    },
    {
      id: 4,
      title: "반려동물 보험 가입 후기 (솔직 리뷰)",
      views: "523",
      comments: "27",
      path: `${ROUTES.COMMUNITY}/4`,
    },
  ],
  weather: {
    icon: "☀️",
    temp: "18°C",
    desc: "맑음 • 경기도 남양주시",
    tip: "🐾 산책하기 좋은 날씨예요!\n오후 2-4시 사이가 가장 따뜻해요.",
  },
};

export const fetchDashboardOverview = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardData);
    }, 300);
  });
};
