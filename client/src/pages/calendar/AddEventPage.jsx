import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import styles from "./AddEventPage.module.css";

const petOptions = [
  { value: "", label: "반려동물을 선택해주세요" },
  { value: "mongle", label: "몽글이 · 말티즈 · 3살" },
  { value: "nabi", label: "나비 · 코리안숏헤어 · 2살" },
  { value: "tosoon", label: "토순이 · 네덜란드드워프 · 1살" },
];

const categoryOptions = [
  {
    value: "vaccination",
    label: "예방접종",
    icon: "💉",
    description: "정기 접종, 추가 접종",
  },
  {
    value: "hospital",
    label: "병원",
    icon: "🏥",
    description: "검진, 진료, 수술",
  },
  {
    value: "grooming",
    label: "미용",
    icon: "✂️",
    description: "샴푸, 미용, 스파",
  },
  {
    value: "medication",
    label: "투약",
    icon: "💊",
    description: "약 복용, 영양제",
  },
];

const AddEventPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";

  const [formData, setFormData] = useState({
    petId: "",
    category: "vaccination",
    title: "",
    date: "",
    startTime: "",
    completed: false,
    memo: "",
  });

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.petId) {
      toast.error("반려동물을 선택해주세요.", {
        duration: 2500,
        position: "top-center",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast.error("일정명을 입력해주세요.", {
        duration: 2500,
        position: "top-center",
      });
      return;
    }

    if (!formData.date) {
      toast.error("날짜를 선택해주세요.", {
        duration: 2500,
        position: "top-center",
      });
      return;
    }

    const payload = {
      ...formData,
      userId: user?.id ?? null,
    };

    console.log("등록할 일정 데이터:", payload);
    toast.success("일정이 등록되었어요!", {
      duration: 2000,
      position: "top-center",
    });

    setTimeout(() => {
      navigate(ROUTES.CALENDAR);
    }, 1200);
  };

  const handleCancel = () => {
    if (confirm("일정 등록을 취소하시겠습니까?\n입력한 내용이 사라집니다.")) {
      navigate(ROUTES.CALENDAR);
    }
  };

  return (
    <div className={styles.page}>
      <Toaster />
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />

      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(ROUTES.CALENDAR)}
        >
          ← 캘린더로 돌아가기
        </button>

        <div className={styles.pageHeader}>
          <div className={styles.pageIcon}>🗓️</div>
          <h1 className={styles.pageTitle}>일정 추가</h1>
          <p className={styles.pageSubtitle}>
            우리 아이의 중요한 일정을 기록해주세요
          </p>
        </div>

        <form className={styles.eventForm} onSubmit={handleSubmit}>
          <span className={styles.membershipBadge}>회원</span>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🐾</span>
              <div>
                <h2>반려동물 선택</h2>
              </div>
            </div>
            <div className={styles.selectWrapper}>
              <select
                value={formData.petId}
                onChange={(e) => handleChange("petId", e.target.value)}
              >
                {petOptions.map((pet) => (
                  <option key={pet.value} value={pet.value}>
                    {pet.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.helperText}>
              반려동물을 선택하면 종류·나이 정보를 함께 관리할 수 있어요
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🗂️</span>
              <div>
                <h2>일정 종류</h2>
                <p>등록할 일정의 카테고리를 선택해주세요</p>
              </div>
            </div>
            <div className={styles.categoryGrid}>
              {categoryOptions.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={`${styles.categoryCard} ${
                    formData.category === category.value ? styles.active : ""
                  }`}
                  onClick={() => handleChange("category", category.value)}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span className={styles.categoryLabel}>{category.label}</span>
                  <span className={styles.categoryDesc}>
                    {category.description}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📝</span>
              <div>
                <h2>일정 내용</h2>
                <p>필수 정보는 빠짐없이 입력해주세요</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title">
                일정명 <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="예: 예방접종 일정, 정기 검진, 관찰 기록 등"
                maxLength={50}
              />
            </div>

            <div className={styles.dateTimeRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="date">
                  날짜 <span className={styles.required}>*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="startTime">시간 (선택)</label>
                <input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.statusField}>
              <label htmlFor="completed">완료 여부</label>
              <div className={styles.selectWrapper}>
                <select
                  id="completed"
                  value={formData.completed ? "done" : "pending"}
                  onChange={(e) =>
                    handleChange("completed", e.target.value === "done")
                  }
                >
                  <option value="pending">예정</option>
                  <option value="done">완료</option>
                </select>
              </div>
              <div className={styles.helperText}>
                이미 완료한 일정은 '완료'로 설정해주세요
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="memo">일정 메모</label>
              <textarea
                id="memo"
                value={formData.memo}
                onChange={(e) => handleChange("memo", e.target.value)}
                placeholder="우리 아이의 일정과 관련된 내용을 기록해주세요. 예: 몽글이 예방접종 예약, 정기 검진 준비물, 투약 시 유의사항 등"
                maxLength={300}
              />
              <div className={styles.helperText}>
                메모는 언제든 수정할 수 있어요. (최대 300자)
              </div>
            </div>
          </section>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              취소
            </button>
            <button type="submit" className={styles.submitButton}>
              일정 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
