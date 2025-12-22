import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { findUser, resetPassword } from "../../api/users";
import styles from "./FindPasswordPage.module.css";

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 아이디/이메일 입력, 2: 비밀번호 재설정
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    text: "",
  });

  const getPasswordStrengthClass = () => {
    if (passwordStrength.level === 1) return "weak";
    if (passwordStrength.level === 2) return "medium";
    if (passwordStrength.level === 3) return "strong";
    return "";
  };

  // 비밀번호 강도 체크
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    if (strength <= 1) {
      setPasswordStrength({ level: 1, text: "약함" });
    } else if (strength < 3) {
      setPasswordStrength({ level: 2, text: "보통" });
    } else {
      setPasswordStrength({ level: 3, text: "강함" });
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 아이디와 이메일이 일치하는지 확인
      await findUser(userId, email);

      // 확인 성공 시 다음 단계로 이동
      setStep(2);
      toast.success("사용자 확인이 완료되었습니다.");
    } catch (error) {
      console.error("find user error:", error);

      // 에러 메시지 처리
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "일치하는 사용자 정보가 없습니다.";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("서버와 연결할 수 없습니다.");
      } else {
        toast.error("사용자 확인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("새 비밀번호를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 비밀번호 재설정 API 호출
      await resetPassword(userId, email, password);

      toast.success("비밀번호가 재설정되었습니다. 로그인 페이지로 이동합니다.");

      // 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);

      // 에러 메시지 처리
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "비밀번호 재설정에 실패했습니다.";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("서버와 연결할 수 없습니다.");
      } else {
        toast.error("비밀번호 재설정 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
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
        <div className={styles.formCard}>
          <h1 className={styles.title}>비밀번호 재설정</h1>

          {step === 1 ? (
            <>
              <p className={styles.subtitle}>
                가입 시 입력하신 아이디를 입력해주세요
              </p>

              <form onSubmit={handleStep1Submit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>아이디</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="아이디를 입력하세요"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>이메일</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`${styles.submitBtn} ${
                    isLoading ? styles.loading : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "확인 중..." : "비밀번호 재설정하기"}
                </button>

                <Link to="/login" className={styles.backLink}>
                  로그인 페이지로 돌아가기
                </Link>
              </form>
            </>
          ) : (
            <>
              <p className={styles.subtitle}>
                재설정 할 비밀번호를 입력해주세요
              </p>

              <form onSubmit={handleStep2Submit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>비밀번호</label>
                  <input
                    type="password"
                    className={styles.formInput}
                    placeholder="8자 이상 입력하세요"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
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
                  <label className={styles.formLabel}>비밀번호 확인</label>
                  <input
                    className={styles.formInput}
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                  />
                  {passwordConfirm && password !== passwordConfirm && (
                    <span className={styles.errorMessage}>
                      비밀번호가 일치하지 않습니다
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={`${styles.submitBtn} ${
                    isLoading ? styles.loading : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "재설정 중..." : "비밀번호 재설정"}
                </button>

                <Link to="/login" className={styles.backLink}>
                  로그인 페이지로 돌아가기
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;
