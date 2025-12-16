const theme = {
  // 색상 팔레트
  colors: {
    // 메인 그린 컬러
    green: {
      lighter: "#E8F5E9",
      light: "#C8E6C9",
      main: "#66BB6A",
      dark: "#43A047",
      darker: "#2E7D32",
      darkest: "#1B5E20",
    },

    // 보조 컬러
    secondary: {
      light: "#A5D6A7",
      main: "#81C784",
      dark: "#388E3C",
    },

    // 카테고리 컬러
    category: {
      dog: {
        bg: "#FFE0B2",
        text: "#F57C00",
      },
      cat: {
        bg: "#F3E5F5",
        text: "#8E24AA",
      },
      small: {
        bg: "#E1F5FE",
        text: "#0288D1",
      },
      bird: {
        bg: "#FFF9C4",
        text: "#F9A825",
      },
      reptile: {
        bg: "#E0F2F1",
        text: "#00897B",
      },
      fish: {
        bg: "#E3F2FD",
        text: "#1976D2",
      },
      etc: {
        bg: "#F1F8E9",
        text: "#66BB6A",
      },
    },

    // 일정 카테고리 컬러
    schedule: {
      vaccine: "#FF5252",
      hospital: "#42A5F5",
      grooming: "#AB47BC",
      medicine: "#66BB6A",
    },

    // 텍스트 컬러
    text: {
      primary: "#2E7D32",
      secondary: "#66BB6A",
      tertiary: "#81C784",
      disabled: "#9E9E9E",
      placeholder: "#BDBDBD",
      white: "#FFFFFF",
    },

    // 배경 컬러
    background: {
      default: "linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)",
      paper: "#FFFFFF",
      light: "#FAFAFA",
      lighter: "#F1F8E9",
    },

    // 상태 컬러
    status: {
      success: "#66BB6A",
      error: "#E53935",
      warning: "#FFA726",
      info: "#42A5F5",
    },

    // 보더 컬러
    border: {
      light: "#E0E0E0",
      main: "#A5D6A7",
      dark: "#66BB6A",
    },

    // 그림자
    shadow: {
      light: "0 2px 10px rgba(76, 175, 80, 0.1)",
      main: "0 4px 20px rgba(76, 175, 80, 0.1)",
      heavy: "0 8px 30px rgba(76, 175, 80, 0.15)",
      hover: "0 8px 40px rgba(76, 175, 80, 0.2)",
    },
  },

  // 폰트 크기
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  // 폰트 굵기
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // 간격
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // 둥근 모서리
  borderRadius: {
    sm: "10px",
    md: "15px",
    lg: "20px",
    xl: "25px",
    "2xl": "30px",
    round: "50px",
    circle: "50%",
  },

  // 반응형 브레이크포인트
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1200px",
    wide: "1400px",
  },

  // 컨테이너 최대 너비
  maxWidth: {
    sm: "640px",
    md: "900px",
    lg: "1000px",
    xl: "1200px",
    "2xl": "1400px",
  },

  // 트랜지션
  transition: {
    fast: "0.15s ease",
    base: "0.3s ease",
    slow: "0.5s ease",
  },

  // z-index 레이어
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

export default theme;
