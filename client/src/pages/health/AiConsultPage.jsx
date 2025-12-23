import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import { aiHealthConsult } from "../../api/health";
import styles from "./AiConsultPage.module.css";

const AiConsultPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";

  const [formData, setFormData] = useState({
    animalType: "dog",
    breed: "",
    age: "",
    weight: "",
    gender: "male",
    diseases: [],
    medications: "",
    consultation: "",
  });

  const [charCount, setCharCount] = useState(0);

  const handleAnimalTypeChange = (type) => {
    setFormData({ ...formData, animalType: type });
  };

  const handleGenderChange = (gender) => {
    setFormData({ ...formData, gender: gender });
  };

  const handleDiseaseToggle = (disease) => {
    const diseases = formData.diseases.includes(disease)
      ? formData.diseases.filter((d) => d !== disease)
      : [...formData.diseases, disease];
    setFormData({ ...formData, diseases });
  };

  const handleConsultationChange = (e) => {
    const text = e.target.value;
    if (text.length <= 1000) {
      setFormData({ ...formData, consultation: text });
      setCharCount(text.length);
    }
  };

  const handleReset = () => {
    setFormData({
      animalType: "dog",
      breed: "",
      age: "",
      weight: "",
      gender: "male",
      diseases: [],
      medications: "",
      consultation: "",
    });
    setCharCount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.breed || !formData.age || !formData.consultation) {
      toast.error("필수 항목을 모두 입력해주세요.", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    try {
      // 동물 종류 레이블 가져오기
      const animalTypeLabel = animalTypes.find(
        (animal) => animal.id === formData.animalType
      )?.label;

      // API 요청 데이터 구성
      const consultData = {
        animalType: animalTypeLabel?.split(" ")[1] || formData.animalType,
        breed: formData.breed,
        age: formData.age,
        weight: formData.weight || "",
        gender: formData.gender === "male" ? "남아" : formData.gender === "female" ? "여아" : "중성화 완료",
        existingDiseases: formData.diseases.map(
          (diseaseId) => diseases.find((d) => d.id === diseaseId)?.label || ""
        ),
        medications: formData.medications || "",
        consultContent: formData.consultation,
      };

      toast.loading("AI 상담 중입니다...", {
        position: "top-center",
      });

      // AI 상담 API 호출
      const response = await aiHealthConsult(consultData);

      toast.dismiss();
      toast.success("상담이 완료되었습니다.", {
        duration: 2000,
        position: "top-center",
      });

      // 결과 페이지로 이동하면서 데이터 전달
      navigate(ROUTES.HEALTH_RESULT, {
        state: {
          ...formData,
          animalTypeLabel,
          aiResponse: response.data?.aiResponse,
        },
      });
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "상담 요청에 실패했습니다. 다시 시도해주세요.",
        {
          duration: 3000,
          position: "top-center",
        }
      );
      console.error("AI 상담 요청 실패:", error);
    }
  };

  const exampleQuestions = [
    {
      icon: "🍖",
      title: "식습관 개선",
      text: "3살 말티즈가 사료를 잘 안 먹어요. 입맛을 돋우는 방법이 있을까요?",
    },
    {
      icon: "💊",
      title: "영양제 추천",
      text: "노령묘에게 좋은 관절 영양제를 추천해주세요. 어떤 성분을 봐야 하나요?",
    },
    {
      icon: "⚖️",
      title: "체중 관리",
      text: "우리 고양이가 과체중인데 다이어트 사료로 바꿔야 할까요?",
    },
    {
      icon: "🤧",
      title: "알레르기 대응",
      text: "닭고기 알레르기가 있는데 어떤 단백질 사료를 선택하면 좋을까요?",
    },
    {
      icon: "🦴",
      title: "간식 관리",
      text: "하루에 간식은 얼마나 줘야 하나요? 건강한 간식 추천 부탁드려요",
    },
    {
      icon: "💧",
      title: "수분 섭취",
      text: "고양이가 물을 잘 안 마시는데 어떻게 하면 수분 섭취를 늘릴 수 있을까요?",
    },
  ];

  const animalTypes = [
    { id: "dog", label: "🐕 강아지" },
    { id: "cat", label: "🐈 고양이" },
    { id: "rabbit", label: "🐰 토끼" },
    { id: "hamster", label: "🐭 햄스터" },
    { id: "guineaPig", label: "🐹 기니피그" },
    { id: "bird", label: "🐦 조류" },
    { id: "reptile", label: "🦎 파충류" },
    { id: "fish", label: "🐠 어류" },
    { id: "turtle", label: "🐢 거북이" },
  ];

  const diseases = [
    { id: "diabetes", label: "당뇨" },
    { id: "kidney", label: "신장 질환" },
    { id: "heart", label: "심장 질환" },
    { id: "skin", label: "피부 질환" },
    { id: "dental", label: "치아 문제" },
    { id: "allergy", label: "알레르기" },
  ];

  return (
    <div className={styles.page}>
      <Toaster />
      <DashboardHeader displayName={displayName} onLogout={logout} />
      <div className={styles.container}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <div className={styles.pageIcon}>🤖💚</div>
          <h1 className={styles.pageTitle}>AI 건강/영양 상담</h1>
          <p className={styles.pageSubtitle}>
            반려동물의 건강과 영양에 대해 AI가 맞춤형 조언을 제공합니다
            <br />
            상세한 정보를 입력하면 더 정확한 답변을 받을 수 있어요
          </p>
        </div>

        {/* 상담 폼 */}
        <form className={styles.consultationForm} onSubmit={handleSubmit}>
          {/* 기본 정보 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span>🐕</span>
              반려동물 기본 정보
            </h2>
            <p className={styles.sectionDescription}>
              정확한 상담을 위해 반려동물의 기본 정보를 입력해주세요
            </p>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                동물 종류<span className={styles.required}>*</span>
              </label>
              <div className={styles.radioGroup}>
                {animalTypes.map((animal) => (
                  <div key={animal.id} className={styles.radioOption}>
                    <input
                      type="radio"
                      id={animal.id}
                      name="animalType"
                      className={styles.radioInput}
                      checked={formData.animalType === animal.id}
                      onChange={() => handleAnimalTypeChange(animal.id)}
                    />
                    <label htmlFor={animal.id} className={styles.radioLabel}>
                      {animal.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="breed">
                품종<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="breed"
                className={styles.formInput}
                placeholder="예: 말티즈, 코리안숏헤어, 골든 햄스터"
                value={formData.breed}
                onChange={(e) =>
                  setFormData({ ...formData, breed: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="age">
                나이<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="age"
                className={styles.formInput}
                placeholder="예: 14, 30"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="weight">
                체중 (선택)
              </label>
              <input
                type="text"
                id="weight"
                className={styles.formInput}
                placeholder="예: 3kg, 4.5kg"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>성별</label>
              <div className={styles.radioGroup}>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    className={styles.radioInput}
                    checked={formData.gender === "male"}
                    onChange={() => handleGenderChange("male")}
                  />
                  <label htmlFor="male" className={styles.radioLabel}>
                    남아
                  </label>
                </div>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    className={styles.radioInput}
                    checked={formData.gender === "female"}
                    onChange={() => handleGenderChange("female")}
                  />
                  <label htmlFor="female" className={styles.radioLabel}>
                    여아
                  </label>
                </div>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="neutered"
                    name="gender"
                    className={styles.radioInput}
                    checked={formData.gender === "neutered"}
                    onChange={() => handleGenderChange("neutered")}
                  />
                  <label htmlFor="neutered" className={styles.radioLabel}>
                    중성화 완료
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 건강 상태 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span>💊</span>
              건강 상태 및 특이사항
            </h2>
            <p className={styles.sectionDescription}>
              현재 건강 상태와 알고 있는 질병이나 알레르기가 있다면 알려주세요
            </p>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                기존 질병 (해당사항 있는 경우 체크)
              </label>
              <div className={styles.checkboxGroup}>
                {diseases.map((disease) => (
                  <div key={disease.id} className={styles.checkboxOption}>
                    <input
                      type="checkbox"
                      id={disease.id}
                      className={styles.checkboxInput}
                      checked={formData.diseases.includes(disease.id)}
                      onChange={() => handleDiseaseToggle(disease.id)}
                    />
                    <label
                      htmlFor={disease.id}
                      className={styles.checkboxLabel}
                    >
                      {disease.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="medications">
                복용 중인 약 또는 영양제 (선택)
              </label>
              <input
                type="text"
                id="medications"
                className={styles.formInput}
                placeholder="예: 심장약, 관절 영양제"
                value={formData.medications}
                onChange={(e) =>
                  setFormData({ ...formData, medications: e.target.value })
                }
              />
            </div>
          </div>

          {/* 상담 내용 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span>💬</span>
              상담 내용
            </h2>
            <p className={styles.sectionDescription}>
              궁금한 점이나 고민되는 부분을 자세히 작성해주세요. 증상, 식습관,
              행동 변화 등을 구체적으로 설명하면 더 정확한 답변을 받을 수
              있습니다.
            </p>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="consultation">
                질문 내용<span className={styles.required}>*</span>
              </label>
              <textarea
                id="consultation"
                className={styles.formTextarea}
                placeholder={`예시:
• 우리 강아지가 최근 식욕이 떨어졌는데 어떻게 해야 할까요?
• 고양이 사료를 바꾸려고 하는데 주의할 점이 있나요?
• 노령견에게 좋은 영양제를 추천해주세요
• 특정 음식 알레르기가 있는데 어떤 사료를 선택해야 하나요?`}
                value={formData.consultation}
                onChange={handleConsultationChange}
                required
              />
              <div
                className={`${styles.charCounter} ${
                  charCount > 900
                    ? charCount > 980
                      ? styles.danger
                      : styles.warning
                    : ""
                }`}
              >
                <span>{charCount}</span> / 1000자
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoBoxTitle}>
                💡 더 좋은 답변을 위한 팁
              </div>
              <div className={styles.infoBoxContent}>
                • 증상이 언제부터 시작되었는지 알려주세요
                <br />
                • 최근 환경이나 식습관에 변화가 있었다면 함께 설명해주세요
                <br />
                • 이미 시도해본 방법이 있다면 그 결과도 공유해주세요
                <br />• 응급 상황이라면 즉시 동물병원을 방문하세요
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className={styles.submitSection}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleReset}
            >
              <span>🔄</span>
              초기화
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              <span>🤖</span>
              AI 상담 받기
            </button>
          </div>
        </form>

        {/* 예시 질문 */}
        <div className={styles.examplesSection}>
          <h2 className={styles.examplesTitle}>💡 자주 묻는 질문 예시</h2>
          <div className={styles.examplesGrid}>
            {exampleQuestions.map((example, index) => (
              <div
                key={index}
                className={styles.exampleCard}
                onClick={() =>
                  setFormData({ ...formData, consultation: example.text })
                }
              >
                <div className={styles.exampleIcon}>{example.icon}</div>
                <div className={styles.exampleTitle}>{example.title}</div>
                <div className={styles.exampleText}>{example.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiConsultPage;
