import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import { getPets, deletePet } from "../../api/pets";
import styles from "./MyPetsPage.module.css";

const MyPetsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 반려동물 목록 조회
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getPets();
      // API 응답이 { data: [...] } 형태인 경우 처리
      const data = response.data || response;
      setPets(data);
    } catch (error) {
      console.error("반려동물 목록 조회 실패:", error);
      toast.error("반려동물 목록을 불러오는데 실패했습니다.", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷팅 함수 (ISO 날짜를 YYYY-MM-DD 형태로 변환)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

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
    if (mode === "edit" && pet) {
      navigate(`/pets/edit/${pet.id}`);
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

  const openDeleteModal = (pet) => {
    setPetToDelete(pet);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPetToDelete(null);
  };

  const confirmDelete = async () => {
    if (petToDelete) {
      try {
        await deletePet(petToDelete.id);
        toast.success(`${petToDelete.name}의 정보가 삭제되었습니다.`, {
          duration: 3000,
          position: "top-center",
        });
        closeDeleteModal();
        fetchPets(); // 목록 새로고침
      } catch (error) {
        console.error("반려동물 삭제 실패:", error);
        toast.error("삭제에 실패했습니다. 다시 시도해주세요.", {
          duration: 3000,
          position: "top-center",
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 등록/수정 로직 구현
    closeModal();
  };

  return (
    <div className={styles.page}>
      <Toaster />
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
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>다가오는 일정</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💉</div>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>예방접종 예정</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎂</div>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>함께한 날들</div>
            </div>
          </div>
        </div>

        {/* 반려동물 카드 그리드 */}
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⏳</div>
            <h2 className={styles.emptyTitle}>불러오는 중...</h2>
          </div>
        ) : pets.length > 0 ? (
          <div className={styles.petsGrid}>
            {pets.map((pet) => (
              <div key={pet.id} className={styles.petCard}>
                <div className={styles.petImageWrapper}>
                  <img
                    src={
                      pet.img_url ||
                      "https://via.placeholder.com/800x600?text=No+Image"
                    }
                    alt={pet.name}
                    className={styles.petImage}
                  />
                  <span className={styles.petBadge}>
                    {pet.species === "dog"
                      ? "🐕 강아지"
                      : pet.species === "cat"
                      ? "🐈 고양이"
                      : pet.species === "rabbit"
                      ? "🐰 토끼"
                      : pet.species === "hamster"
                      ? "🐭 햄스터"
                      : pet.species === "guineaPig"
                      ? "🐹 기니피그"
                      : pet.species === "bird"
                      ? "🐦 조류"
                      : pet.species === "fish"
                      ? "🐟 어류"
                      : pet.species === "reptile"
                      ? "🦎 파충류"
                      : pet.species === "turtle"
                      ? "🐢 거북이"
                      : "🐾 반려동물"}
                  </span>
                </div>
                <div className={styles.petInfo}>
                  <h3 className={styles.petName}>{pet.name}</h3>
                  <p className={styles.petBreed}>{pet.species}</p>

                  <div className={styles.petDetails}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>생일</div>
                      <div className={styles.detailValue}>
                        {formatDate(pet.birth_day)}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>성별</div>
                      <div className={styles.detailValue}>
                        {pet.gender === "male"
                          ? "남아"
                          : pet.gender === "female"
                          ? "여아"
                          : "중성화 완료"}
                      </div>
                    </div>
                  </div>

                  {pet.feature && (
                    <div className={styles.petMemo}>
                      <div className={styles.memoLabel}>📝 특이사항</div>
                      <div className={styles.memoContent}>{pet.feature}</div>
                    </div>
                  )}

                  <div className={styles.petActions}>
                    <button
                      className={`${styles.actionBtn} ${styles.btnEdit}`}
                      onClick={() => openModal("edit", pet)}
                    >
                      <span>✏️</span>
                      수정
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.btnDelete}`}
                      onClick={() => openDeleteModal(pet)}
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

      {/* 삭제 확인 모달 */}
      <div
        className={`${styles.modal} ${isDeleteModalOpen ? styles.active : ""}`}
      >
        <div className={styles.deleteModalContent}>
          <div className={styles.deleteModalHeader}>
            <div className={styles.deleteIcon}>⚠️</div>
            <h2 className={styles.deleteModalTitle}>반려동물 삭제</h2>
          </div>

          <div className={styles.deleteModalBody}>
            <p className={styles.deleteMessage}>
              정말로 <strong>{petToDelete?.name}</strong>의 정보를
              삭제하시겠습니까?
            </p>
            <p className={styles.deleteWarning}>
              삭제된 정보는 복구할 수 없습니다.
            </p>
          </div>

          <div className={styles.deleteModalActions}>
            <button
              type="button"
              className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
              onClick={closeDeleteModal}
            >
              취소
            </button>
            <button
              type="button"
              className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
              onClick={confirmDelete}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPetsPage;
