import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styles from "../../styles/FindPasswordPage.module.css";

const FindPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: 아이디 입력, 2: 이메일 입력
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
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

  const handleStep1Submit = (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    // TODO: 아이디 확인 API 호출
    // 임시로 다음 단계로 이동
    setStep(2);
    toast.success("아이디가 확인되었습니다.");
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    if (password != passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    // TODO: 비밀번호 재설정 이메일 발송 API 호출
    toast.success("비밀번호 재설정 되었습니다.");
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

                <button type="submit" className={styles.submitBtn}>
                  비밀번호 재설정하기
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

                <button type="submit" className={styles.submitBtn}>
                  비밀번호 재설정
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
