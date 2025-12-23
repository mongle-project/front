import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import { createPet } from "../../api/pets";
import styles from "./AddPetPage.module.css";

const AddPetPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";

  const [formData, setFormData] = useState({
    name: "",
    species: "dog",
    birthday: "",
    age: "",
    gender: "male",
    feature: "",
    imageFile: null,
    imagePreview: null,
  });

  const [activeSpecies, setActiveSpecies] = useState("dog");
  const [activeGender, setActiveGender] = useState("male");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const speciesOptions = [
    { value: "dog", icon: "🐕", label: "강아지" },
    { value: "cat", icon: "🐈", label: "고양이" },
    { value: "rabbit", icon: "🐰", label: "토끼" },
    { value: "hamster", icon: "🐭", label: "햄스터" },
    { value: "guineaPig", icon: "🐹", label: "기니피그" },
    { value: "bird", icon: "🐦", label: "조류" },
    { value: "fish", icon: "🐟", label: "어류" },
    { value: "reptile", icon: "🦎", label: "파충류" },
    { value: "turtle", icon: "🐢", label: "거북이" },
  ];

  const genderOptions = [
    { value: "male", label: "남아 ♂" },
    { value: "female", label: "여아 ♀" },
    { value: "neutered", label: "중성화 완료" },
  ];

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  const calculateAge = (birthday) => {
    if (!birthday) return "";

    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // 생일이 아직 안 지났으면 나이에서 1을 뺌
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // 1살 미만인 경우
    if (age === 0) {
      const months = monthDiff + (today.getDate() < birthDate.getDate() ? 0 : 1);
      if (months === 0) {
        const days = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        return `${days}일`;
      }
      return `${months}개월`;
    }

    return `${age}살`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 생일이 변경되면 자동으로 나이 계산
    if (name === "birthday") {
      // 미래 날짜 검증
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 시간 부분 제거하여 날짜만 비교

      if (selectedDate > today) {
        toast.error("생일은 오늘 이전 날짜여야 합니다.", {
          duration: 3000,
          position: "top-center",
        });
        return;
      }

      const calculatedAge = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        birthday: value,
        age: calculatedAge,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSpeciesClick = (value) => {
    setActiveSpecies(value);
    setFormData((prev) => ({
      ...prev,
      species: value,
    }));
  };

  const handleGenderClick = (value) => {
    setActiveGender(value);
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("파일 크기는 5MB 이하여야 합니다.", {
          duration: 3000,
          position: "top-center",
        });
        e.target.value = ""; // 파일 입력 초기화
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: event.target.result,
        }));
        toast.success("이미지가 업로드되었습니다.", {
          duration: 2000,
          position: "top-center",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("이름을 입력해주세요.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (!formData.birthday) {
      toast.error("생일을 선택해주세요.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (!formData.age) {
      toast.error("나이를 입력해주세요.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("species", formData.species);
      formDataToSend.append("birthday", formData.birthday);
      formDataToSend.append("gender", formData.gender);

      if (formData.feature) {
        formDataToSend.append("feature", formData.feature);
      }

      if (formData.imageFile) {
        formDataToSend.append("imageFile", formData.imageFile);
      }

      await createPet(formDataToSend);

      toast.success(`${formData.name} 등록 완료! 🎉`, {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        navigate(ROUTES.PETS);
      }, 1000);
    } catch (error) {
      console.error("반려동물 등록 실패:", error);
      toast.error("등록에 실패했습니다. 다시 시도해주세요.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleCancel = () => {
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    navigate(ROUTES.PETS);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <Toaster />
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />

      <div className={styles.container}>
        {/* 뒤로가기 */}
        <button className={styles.backBtn} onClick={() => navigate(ROUTES.PETS)}>
          ← 내 반려동물 목록으로
        </button>

        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <div className={styles.pageIcon}>🐾</div>
          <h1 className={styles.pageTitle}>새 가족 등록</h1>
          <p className={styles.pageSubtitle}>
            소중한 우리 아이의 정보를 등록해주세요
          </p>
        </div>

        {/* 반려동물 추가 폼 */}
        <form className={styles.addPetForm} onSubmit={handleSubmit}>
          {/* 기본 정보 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span>📝</span>
              기본 정보
            </h2>

            {/* 이름 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="name">
                이름<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.formInput}
                placeholder="예: 몽이, 나비, 토순이"
                maxLength="20"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className={styles.helpText}>
                우리 아이를 부르는 이름을 입력해주세요
              </div>
            </div>

            {/* 종 선택 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                종<span className={styles.required}>*</span>
              </label>
              <div className={styles.speciesChips}>
                {speciesOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`${styles.speciesChip} ${
                      activeSpecies === option.value ? styles.active : ""
                    }`}
                    onClick={() => handleSpeciesClick(option.value)}
                  >
                    <input
                      type="radio"
                      name="species"
                      value={option.value}
                      className={styles.speciesChipInput}
                      checked={activeSpecies === option.value}
                      onChange={() => {}}
                    />
                    <div className={styles.speciesIcon}>{option.icon}</div>
                    <div className={styles.speciesName}>{option.label}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* 생일 / 나이 */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.formLabel} htmlFor="birthday">
                  생일 <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  className={styles.formInput}
                  value={formData.birthday}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.formLabel} htmlFor="age">
                  나이 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  className={styles.formInput}
                  placeholder="생일을 선택하면 자동으로 계산됩니다"
                  value={formData.age}
                  readOnly
                  required
                />
              </div>
            </div>

            {/* 성별 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                성별<span className={styles.required}>*</span>
              </label>
              <div className={styles.genderOptions}>
                {genderOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`${styles.genderOption} ${
                      activeGender === option.value ? styles.active : ""
                    }`}
                    onClick={() => handleGenderClick(option.value)}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      className={styles.genderOptionInput}
                      checked={activeGender === option.value}
                      onChange={() => {}}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span>ℹ️</span>
              추가 정보
            </h2>

            {/* 특징/메모 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="feature">
                특징 및 메모
              </label>
              <textarea
                id="feature"
                name="feature"
                className={styles.formTextarea}
                placeholder="우리 아이의 특징, 성격, 주의사항 등을 자유롭게 작성해주세요&#10;예: 활발한 성격, 낯선 사람 경계, 닭고기 알레르기 있음"
                value={formData.feature}
                onChange={handleInputChange}
              ></textarea>
              <div className={styles.helpText}>
                알레르기, 특별한 습관, 건강 상태 등을 기록해두면 유용해요
              </div>
            </div>
          </div>

          {/* 사진 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span>📸</span>
              사진
            </h2>

            {!formData.imagePreview ? (
              <div
                className={styles.imageUploadArea}
                onClick={() => document.getElementById("imageInput").click()}
              >
                <div className={styles.uploadIcon}>🐾</div>
                <div className={styles.uploadText}>우리 아이 사진 업로드</div>
                <div className={styles.uploadHint}>
                  JPG, PNG 파일 (최대 5MB)
                </div>
              </div>
            ) : null}

            <input
              type="file"
              id="imageInput"
              className={styles.imageInput}
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
            />

            {formData.imagePreview && (
              <div className={`${styles.imagePreview} ${styles.show}`}>
                <img
                  src={formData.imagePreview}
                  alt="미리보기"
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeImage}
                  onClick={handleRemoveImage}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleCancel}
            >
              <span>🔙</span>
              취소
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              <span>✅</span>
              등록하기
            </button>
          </div>
        </form>
      </div>

      {/* 취소 확인 모달 */}
      <div
        className={`${styles.modal} ${isCancelModalOpen ? styles.active : ""}`}
      >
        <div className={styles.deleteModalContent}>
          <div className={styles.deleteModalHeader}>
            <div className={styles.deleteIcon}>⚠️</div>
            <h2 className={styles.deleteModalTitle}>등록 취소</h2>
          </div>

          <div className={styles.deleteModalBody}>
            <p className={styles.deleteMessage}>
              등록을 취소하시겠습니까?
            </p>
            <p className={styles.deleteWarning}>
              입력한 내용이 사라집니다.
            </p>
          </div>

          <div className={styles.deleteModalActions}>
            <button
              type="button"
              className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
              onClick={closeCancelModal}
            >
              돌아가기
            </button>
            <button
              type="button"
              className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
              onClick={confirmCancel}
            >
              취소하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPetPage;
