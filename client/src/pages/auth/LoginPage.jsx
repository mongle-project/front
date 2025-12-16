import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { login, signup } from "../../api/auth";
import styles from "../../styles/LoginPage.module.css";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 상태
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 상태
  const [signupEmail, setSignupEmail] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    text: "",
  });

  // 비밀번호 강도 체크
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    console.log(strength);

    if (strength <= 1) {
      setPasswordStrength({ level: 1, text: "약함" });
    } else if (strength < 3) {
      setPasswordStrength({ level: 2, text: "보통" });
    } else {
      setPasswordStrength({ level: 3, text: "강함" });
    }
  };

  // 로그인 제출
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(loginId, loginPassword);

      // 로그인 성공 시 토큰 저장 (서버 응답에 따라 수정 필요)
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      toast.success("로그인 성공! 🎉");

      // 메인 페이지로 이동
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      // 에러 메시지 처리
      if (error.response) {
        const errorMessage = error.response.data?.message || "로그인에 실패했습니다.";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("서버와 연결할 수 없습니다.");
      } else {
        toast.error("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 제출
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupPassword !== signupPasswordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms) {
      toast.error("이용약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await signup(signupId, signupEmail, signupPassword);

      toast.success("회원가입 완료! 🎉");

      // 로그인 탭으로 이동 및 폼 초기화
      setTimeout(() => {
        setActiveTab("login");
        setSignupEmail("");
        setSignupId("");
        setSignupPassword("");
        setSignupPasswordConfirm("");
        setAgreeTerms(false);
        setPasswordStrength({ level: 0, text: "" });
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);

      // 에러 메시지 처리
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "회원가입에 실패했습니다.";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("서버와 연결할 수 없습니다.");
      } else {
        toast.error("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength.level === 1) return "weak";
    if (passwordStrength.level === 2) return "medium";
    if (passwordStrength.level === 3) return "strong";
    return "";
  };

  return (
    <div className={styles.pageContainer}>
      <Toaster position="top-center" reverseOrder={false} />
      {/* 헤더 */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div
            className={styles.logo}
            onClick={() => (window.location.href = "/")}
          >
            몽글몽글
          </div>
        </nav>
      </header>

      {/* 메인 컨테이너 */}
      <div className={styles.mainContainer}>
        <div className={styles.authContainer}>
          {/* 왼쪽 웰컴 섹션 */}
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeContent}>
              <h1 className={styles.welcomeTitle}>
                몽글몽글에
                <br />
                오신 것을
                <br />
                환영해요! 🐾
              </h1>
              <p className={styles.welcomeSubtitle}>
                반려동물과 함께하는
                <br />
                모든 순간을 기록하고 공유하세요
              </p>
              <div className={styles.welcomeFeatures}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>📚</span>
                  <span>다양한 동물 정보</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>💬</span>
                  <span>커뮤니티 소통</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>📝</span>
                  <span>반려동물 기록</span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 폼 섹션 */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>시작하기</h2>
              <p className={styles.formSubtitle}>
                계정으로 로그인하거나 새로 가입하세요
              </p>
            </div>

            {/* 탭 */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "login" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("login")}
              >
                로그인
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "signup" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("signup")}
              >
                회원가입
              </button>
            </div>

            {/* 로그인 폼 */}
            {activeTab === "login" && (
              <form className={styles.authForm} onSubmit={handleLoginSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>아이디</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>비밀번호</label>
                  <input
                    className={styles.formInput}
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  className={`${styles.submitBtn} ${
                    isLoading ? styles.loading : ""
                  }`}
                  type="submit"
                >
                  로그인
                </button>
              </form>
            )}

            {/* 회원가입 폼 */}
            {activeTab === "signup" && (
              <form className={styles.authForm} onSubmit={handleSignupSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    아이디 <p className={styles.requiredValuePoint}>*</p>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="사용하실 아이디를 입력하세요"
                    value={signupId}
                    onChange={(e) => setSignupId(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    이메일 <p className={styles.requiredValuePoint}>*</p>
                  </label>
                  <input
                    className={styles.formInput}
                    type="email"
                    placeholder="example@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    비밀번호 <p className={styles.requiredValuePoint}>*</p>
                  </label>
                  <input
                    className={styles.formInput}
                    type="password"
                    placeholder="8자 이상 입력하세요"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      checkPasswordStrength(e.target.value);
                    }}
                    required
                  />
                  <div className={styles.passwordStrength}>
                    <div
                      className={`${styles.passwordStrengthBar} ${
                        styles[getPasswordStrengthClass()]
                      }`}
                    />
                  </div>
                  <div
                    className={`${styles.passwordStrengthText} ${
                      styles[getPasswordStrengthClass()]
                    }`}
                  >
                    {passwordStrength.text}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    비밀번호 확인 <p className={styles.requiredValuePoint}>*</p>
                  </label>
                  <input
                    className={styles.formInput}
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={signupPasswordConfirm}
                    onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                    required
                  />
                  {signupPasswordConfirm &&
                    signupPassword !== signupPasswordConfirm && (
                      <span className={styles.errorMessage}>
                        비밀번호가 일치하지 않습니다
                      </span>
                    )}
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    className={styles.checkboxInput}
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />
                  <label className={styles.checkboxLabel} htmlFor="terms">
                    <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>
                    에 동의합니다
                  </label>
                </div>

                <button
                  className={`${styles.submitBtn} ${
                    isLoading ? styles.loading : ""
                  }`}
                  type="submit"
                >
                  회원가입
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
