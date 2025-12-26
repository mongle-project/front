import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import { getPets, deletePet } from "../../api/pets";
import { getMonthlyCalendarEvents } from "../../api/calendarEvents";
import { getMyArticles } from "../../api/articles";
import styles from "./MyPetsPage.module.css";

const MyPetsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [upcomingVaccinationsCount, setUpcomingVaccinationsCount] = useState(0);
  const [myArticlesCount, setMyArticlesCount] = useState(0);

  // 반려동물 목록 조회 및 통계 데이터 로드
  useEffect(() => {
    fetchPets();
    fetchUpcomingEvents();
    fetchMyArticles();
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

  // 다가오는 일정 및 예방접종 예정 개수 조회
  const fetchUpcomingEvents = async () => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      // 현재 달과 다음 달의 일정을 가져옴
      const currentMonthEvents = await getMonthlyCalendarEvents({
        year: currentYear,
        month: currentMonth,
      });

      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const nextMonthEvents = await getMonthlyCalendarEvents({
        year: nextYear,
        month: nextMonth,
      });

      // 두 달의 일정을 합침
      const allEvents = [
        ...(currentMonthEvents.data || currentMonthEvents || []),
        ...(nextMonthEvents.data || nextMonthEvents || []),
      ];

      // 미래의 일정만 필터링
      const futureEvents = allEvents.filter((event) => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= now && !event.isComplete;
      });

      // 전체 미래 일정 개수
      setUpcomingEventsCount(futureEvents.length);

      // 예방접종 관련 일정만 필터링 (category가 'vaccination'인 경우)
      const vaccinationEvents = futureEvents.filter(
        (event) => event.category === "vaccination"
      );
      setUpcomingVaccinationsCount(vaccinationEvents.length);
    } catch (error) {
      console.error("일정 조회 실패:", error);
      // 에러가 발생해도 카운트는 0으로 유지
    }
  };

  // 내가 작성한 게시글 수 조회
  const fetchMyArticles = async () => {
    try {
      const response = await getMyArticles(1000, 0); // 충분히 큰 limit으로 전체 개수 파악
      const data = response.data || response;
      // 배열인 경우 length, 객체에 totalCount 등이 있는 경우 처리
      if (Array.isArray(data)) {
        setMyArticlesCount(data.length);
      } else if (data.totalCount !== undefined) {
        setMyArticlesCount(data.totalCount);
      } else if (data.articles && Array.isArray(data.articles)) {
        setMyArticlesCount(data.articles.length);
      }
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      // 에러가 발생해도 카운트는 0으로 유지
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

  // 통계 카드 클릭 핸들러
  const handleNavigateToCalendar = () => {
    navigate(ROUTES.CALENDAR);
  };

  const handleNavigateToMyArticles = () => {
    navigate(`${ROUTES.COMMUNITY}?filter=myPosts`);
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
            <div
              className={`${styles.statCard} ${styles.clickable}`}
              onClick={handleNavigateToCalendar}
              role="button"
              tabIndex={0}
            >
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statValue}>{upcomingEventsCount}</div>
              <div className={styles.statLabel}>다가오는 일정</div>
            </div>
            <div
              className={`${styles.statCard} ${styles.clickable}`}
              onClick={handleNavigateToCalendar}
              role="button"
              tabIndex={0}
            >
              <div className={styles.statIcon}>💉</div>
              <div className={styles.statValue}>
                {upcomingVaccinationsCount}
              </div>
              <div className={styles.statLabel}>예방접종 예정</div>
            </div>
            <div
              className={`${styles.statCard} ${styles.clickable}`}
              onClick={handleNavigateToMyArticles}
              role="button"
              tabIndex={0}
            >
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statValue}>{myArticlesCount}</div>
              <div className={styles.statLabel}>내가 작성한 게시글 수</div>
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
                  {pet.img_url ? (
                    <img
                      src={pet.img_url}
                      alt={pet.name}
                      className={styles.petImage}
                    />
                  ) : (
                    <div
                      className={styles.petImage}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e3f2fd",
                        fontSize: "120px",
                      }}
                    >
                      {pet.species === "dog"
                        ? "🐕"
                        : pet.species === "cat"
                        ? "🐈"
                        : pet.species === "rabbit"
                        ? "🐰"
                        : pet.species === "hamster"
                        ? "🐭"
                        : pet.species === "guineaPig"
                        ? "🐹"
                        : pet.species === "bird"
                        ? "🐦"
                        : pet.species === "fish"
                        ? "🐟"
                        : pet.species === "reptile"
                        ? "🦎"
                        : pet.species === "turtle"
                        ? "🐢"
                        : "🐾"}
                    </div>
                  )}
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
