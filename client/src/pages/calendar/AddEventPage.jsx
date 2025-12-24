import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "../../components/header/Header";
import Modal from "../../components/common/Modal";
import { useAuthContext } from "../../contexts/AuthContext";
import calendarService from "../../services/calendarService";
import petService from "../../services/petService";
import { ROUTES } from "../../utils/constants";
import styles from "./AddEventPage.module.css";

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
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit"); // 수정 모드인 경우 eventId
  const isEditMode = !!editId;

  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";

  const [petOptions, setPetOptions] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const timeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    petId: "",
    category: "vaccination",
    title: "",
    date: "",
    startTime: "",
    completed: false,
  });

  // 반려동물 목록 조회
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await petService.getMyPets();
        const pets = (response.data || []).map((pet) => ({
          value: pet.id,
          label: `${pet.name} · ${pet.species}`,
        }));
        setPetOptions(pets);
      } catch (error) {
        console.error("반려동물 목록 조회 실패:", error);
        toast.error("반려동물 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPets();
  }, []);

  // 수정 모드: 기존 일정 데이터 조회
  useEffect(() => {
    if (!isEditMode) return;

    const fetchEvent = async () => {
      try {
        setLoadingEvent(true);
        const response = await calendarService.getEventById(editId);
        const event = response.data;

        if (event) {
          setFormData({
            petId: event.petProfileId || "",
            category: event.category || "vaccination",
            title: event.title || "",
            date: event.eventDate ? event.eventDate.split("T")[0] : "",
            startTime: event.eventTime || "",
            completed: event.isComplete || false,
          });
        }
      } catch (error) {
        console.error("일정 조회 실패:", error);
        toast.error("일정 정보를 불러오는데 실패했습니다.");
        navigate(ROUTES.CALENDAR);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [editId, isEditMode, navigate]);

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 시간 입력 시 분 선택 후 blur 처리
  const handleTimeChange = (e) => {
    handleChange("startTime", e.target.value);
    // 시간이 완전히 입력되면 (HH:MM 형식) blur 처리
    if (e.target.value && e.target.value.length === 5) {
      setTimeout(() => {
        if (timeInputRef.current) {
          timeInputRef.current.blur();
        }
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      setSubmitting(true);

      const payload = {
        petId: formData.petId ? Number(formData.petId) : null,
        title: formData.title.trim(),
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime || null,
        completed: formData.completed,
      };

      if (isEditMode) {
        await calendarService.updateEvent(editId, payload);
        toast.success("일정이 수정되었어요!", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        await calendarService.createEvent(payload);
        toast.success("일정이 등록되었어요!", {
          duration: 2000,
          position: "top-center",
        });
      }

      setTimeout(() => {
        navigate(ROUTES.CALENDAR);
      }, 1200);
    } catch (error) {
      console.error(isEditMode ? "일정 수정 실패:" : "일정 등록 실패:", error);
      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "일정 수정에 실패했습니다."
            : "일정 등록에 실패했습니다."),
        {
          duration: 2500,
          position: "top-center",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate(ROUTES.CALENDAR);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  if (loadingEvent) {
    return (
      <div className={styles.page}>
        <Toaster />
        <DashboardHeader displayName={displayName} onLogout={handleLogout} />
        <div className={styles.container}>
          <p style={{ textAlign: "center", padding: "2rem" }}>
            일정 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className={styles.pageTitle}>
            {isEditMode ? "일정 수정" : "일정 추가"}
          </h1>
          <p className={styles.pageSubtitle}>
            {isEditMode
              ? "일정 내용을 수정해주세요"
              : "우리 아이의 중요한 일정을 기록해주세요"}
          </p>
        </div>

        <form className={styles.eventForm} onSubmit={handleSubmit}>
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
                disabled={loadingPets}
              >
                <option value="">
                  {loadingPets
                    ? "불러오는 중..."
                    : "반려동물을 선택해주세요 (선택)"}
                </option>
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
                  ref={timeInputRef}
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleTimeChange}
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
          </section>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting
                ? isEditMode
                  ? "수정 중..."
                  : "등록 중..."
                : isEditMode
                ? "일정 수정"
                : "일정 등록"}
            </button>
          </div>
        </form>
      </div>

      {/* 취소 확인 모달 */}
      <Modal isOpen={showCancelModal} onClose={closeCancelModal}>
        <div className={styles.cancelModal}>
          <h3 className={styles.cancelModalTitle}>
            {isEditMode ? "일정 수정 취소" : "일정 등록 취소"}
          </h3>
          <p className={styles.cancelModalMessage}>
            {isEditMode
              ? "일정 수정을 취소하시겠습니까?\n변경한 내용이 사라집니다."
              : "일정 등록을 취소하시겠습니까?\n입력한 내용이 사라집니다."}
          </p>
          <div className={styles.cancelModalButtons}>
            <button
              type="button"
              className={styles.cancelModalNo}
              onClick={closeCancelModal}
            >
              아니오
            </button>
            <button
              type="button"
              className={styles.cancelModalYes}
              onClick={confirmCancel}
            >
              예, 취소합니다
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddEventPage;
