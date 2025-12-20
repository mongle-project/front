import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import styles from "./MyPetsPage.module.css";

const MyPetsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedPet, setSelectedPet] = useState(null);

  // 임시 반려동물 데이터
  const [pets, setPets] = useState([
    {
      id: 1,
      type: "dog",
      typeLabel: "🐕 강아지",
      name: "몽이",
      breed: "말티즈 (Maltese)",
      age: "3살",
      gender: "남아",
      weight: "2.8kg",
      neutered: "완료",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop",
      memo: "닭고기 알레르기 있음. 매일 저녁 7시 산책 좋아함. 낯선 사람에게 경계심 많음.",
    },
    {
      id: 2,
      type: "cat",
      typeLabel: "🐈 고양이",
      name: "나비",
      breed: "코리안 숏헤어 (Korean Shorthair)",
      age: "2살",
      gender: "여아",
      weight: "3.5kg",
      neutered: "완료",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop",
      memo: "조용한 성격. 높은 곳을 좋아함. 사료는 생선 맛만 먹음. 물 많이 마시는 편.",
    },
    {
      id: 3,
      type: "other",
      typeLabel: "🐰 토끼",
      name: "토순이",
      breed: "네덜란드 드워프 (Netherland Dwarf)",
      age: "1살",
      gender: "여아",
      weight: "1.2kg",
      neutered: "미정",
      image:
        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop",
      memo: "활발한 성격. 당근을 특히 좋아함. 아침에 케이지 청소 필수. 털갈이 시즌 주의.",
    },
  ]);

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  const openModal = (mode = "add", pet = null) => {
    if (mode === "add") {
      navigate(ROUTES.PETS_ADD);
      return;
    }
    setModalMode(mode);
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setPets(pets.filter((pet) => pet.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 등록/수정 로직 구현
    closeModal();
  };

  return (
    <div className={styles.page}>
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />

      <div className={styles.container}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>🏠 내 반려동물</h1>
            <p className={styles.pageSubtitle}>
              소중한 우리 아이들을 관리하고 기록하세요
            </p>
          </div>
          <button className={styles.addPetBtn} onClick={() => openModal("add")}>
            <span>➕</span>새 반려동물 등록
          </button>
        </div>

        {/* 통계 섹션 */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🐾</div>
              <div className={styles.statValue}>{pets.length}</div>
              <div className={styles.statLabel}>등록된 반려동물</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statValue}>2</div>
              <div className={styles.statLabel}>다가오는 일정</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💉</div>
              <div className={styles.statValue}>1</div>
              <div className={styles.statLabel}>예방접종 예정</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎂</div>
              <div className={styles.statValue}>30</div>
              <div className={styles.statLabel}>함께한 날들</div>
            </div>
          </div>
        </div>

        {/* 반려동물 카드 그리드 */}
        {pets.length > 0 ? (
          <div className={styles.petsGrid}>
            {pets.map((pet) => (
              <div key={pet.id} className={styles.petCard}>
                <div className={styles.petImageWrapper}>
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className={styles.petImage}
                  />
                  <span className={styles.petBadge}>{pet.typeLabel}</span>
                </div>
                <div className={styles.petInfo}>
                  <h3 className={styles.petName}>{pet.name}</h3>
                  <p className={styles.petBreed}>{pet.breed}</p>

                  <div className={styles.petDetails}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>나이</div>
                      <div className={styles.detailValue}>{pet.age}</div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>성별</div>
                      <div className={styles.detailValue}>{pet.gender}</div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>체중</div>
                      <div className={styles.detailValue}>{pet.weight}</div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>중성화</div>
                      <div className={styles.detailValue}>{pet.neutered}</div>
                    </div>
                  </div>

                  <div className={styles.petMemo}>
                    <div className={styles.memoLabel}>📝 특이사항</div>
                    <div className={styles.memoContent}>{pet.memo}</div>
                  </div>

                  <div className={styles.petActions}>
                    <button className={`${styles.actionBtn} ${styles.btnView}`}>
                      <span>📋</span>
                      상세보기
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.btnEdit}`}
                      onClick={() => openModal("edit", pet)}
                    >
                      <span>✏️</span>
                      수정
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.btnDelete}`}
                      onClick={() => handleDelete(pet.id)}
                    >
                      <span>🗑️</span>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🐾</div>
            <h2 className={styles.emptyTitle}>아직 등록된 반려동물이 없어요</h2>
            <p className={styles.emptyText}>
              새로운 가족을 등록하고 소중한 추억을 기록해보세요!
            </p>
            <button
              className={styles.addPetBtn}
              onClick={() => openModal("add")}
            >
              <span>➕</span>첫 반려동물 등록하기
            </button>
          </div>
        )}
      </div>

      {/* 등록/수정 모달 */}
      <div className={`${styles.modal} ${isModalOpen ? styles.active : ""}`}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              {modalMode === "add" ? "새 반려동물 등록" : "반려동물 정보 수정"}
            </h2>
            <button className={styles.modalClose} onClick={closeModal}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                동물 종류<span className={styles.required}>*</span>
              </label>
              <div className={styles.radioGroup}>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="modal-dog"
                    name="animalType"
                    className={styles.radioInput}
                    defaultChecked
                  />
                  <label htmlFor="modal-dog" className={styles.radioLabel}>
                    🐕 강아지
                  </label>
                </div>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="modal-cat"
                    name="animalType"
                    className={styles.radioInput}
                  />
                  <label htmlFor="modal-cat" className={styles.radioLabel}>
                    🐈 고양이
                  </label>
                </div>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="modal-other"
                    name="animalType"
                    className={styles.radioInput}
                  />
                  <label htmlFor="modal-other" className={styles.radioLabel}>
                    🐰 기타
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="petName">
                이름<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="petName"
                className={styles.formInput}
                placeholder="예: 몽이"
                defaultValue={selectedPet?.name}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="petBreed">
                품종<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="petBreed"
                className={styles.formInput}
                placeholder="예: 말티즈"
                defaultValue={selectedPet?.breed}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="petAge">
                나이<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="petAge"
                className={styles.formInput}
                placeholder="예: 3살"
                defaultValue={selectedPet?.age}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                성별<span className={styles.required}>*</span>
              </label>
              <div className={styles.radioGroup}>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    className={styles.radioInput}
                    defaultChecked
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
                  />
                  <label htmlFor="female" className={styles.radioLabel}>
                    여아
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="petWeight">
                체중
              </label>
              <input
                type="text"
                id="petWeight"
                className={styles.formInput}
                placeholder="예: 3.5kg"
                defaultValue={selectedPet?.weight}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="neutered">
                중성화 여부
              </label>
              <select
                id="neutered"
                className={styles.formSelect}
                defaultValue={selectedPet?.neutered}
              >
                <option value="완료">완료</option>
                <option value="미완료">미완료</option>
                <option value="모름">모름</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="petPhoto">
                사진 URL
              </label>
              <input
                type="url"
                id="petPhoto"
                className={styles.formInput}
                placeholder="https://example.com/photo.jpg"
                defaultValue={selectedPet?.image}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="petMemo">
                특이사항/메모
              </label>
              <textarea
                id="petMemo"
                className={styles.formTextarea}
                placeholder="알레르기, 특별한 습관, 주의사항 등을 자유롭게 작성하세요"
                defaultValue={selectedPet?.memo}
              ></textarea>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
                onClick={closeModal}
              >
                취소
              </button>
              <button
                type="submit"
                className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
              >
                {modalMode === "add" ? "등록하기" : "수정하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyPetsPage;
