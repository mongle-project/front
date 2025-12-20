import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DictionaryDetailPage.module.css";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import { getAnimalById } from "../../utils/animalData";

const DictionaryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";

  const animal = getAnimalById(id);

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate(ROUTES.LOGIN);
  };

  const handleBack = () => {
    navigate("/dictionary");
  };

  if (!animal) {
    return (
      <>
        <div className={styles.dashboardPage}>
          <DashboardHeader displayName={displayName} onLogout={handleLogout} />
          <div className={styles.container}>
            <div className={styles.notFound}>
              <h1>🔍 동물을 찾을 수 없습니다</h1>
              <p>요청하신 동물 정보를 찾을 수 없습니다.</p>
              <button className={styles.backButton} onClick={handleBack}>
                ← 목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const profile = animal.fullProfile;

  return (
    <>
      <div className={styles.dashboardPage}>
        <DashboardHeader displayName={displayName} onLogout={handleLogout} />

        <div className={styles.container}>
          <button className={styles.backButton} onClick={handleBack}>
            ← 목록으로 돌아가기
          </button>

          <div className={styles.detailCard}>
            {/* 히어로 섹션 */}
            <div className={styles.heroSection}>
              <img
                src={animal.image}
                alt={animal.name}
                className={styles.animalImage}
              />
              <div className={styles.heroInfo}>
                <span className={styles.category}>
                  {animal.category === "강아지"
                    ? "🐕"
                    : animal.category === "고양이"
                    ? "🐈"
                    : animal.category === "토끼"
                    ? "🐰"
                    : animal.category === "햄스터"
                    ? "🐹"
                    : animal.category === "기니피그"
                    ? "🐹"
                    : animal.category === "새"
                    ? "🐦"
                    : animal.category === "거북이"
                    ? "🐢"
                    : animal.category === "파충류"
                    ? "🦎"
                    : animal.category === "어류"
                    ? "🐠"
                    : "🐾"}{" "}
                  {animal.category}
                </span>
                <h1 className={styles.animalName}>{animal.name}</h1>
                <p className={styles.animalBreed}>{animal.breed}</p>
                <div className={styles.tags}>
                  {animal.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.quickStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>크기</div>
                    <div className={styles.statValue}>{animal.size}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>털 관리</div>
                    <div className={styles.statValue}>{animal.grooming}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>운동량</div>
                    <div className={styles.statValue}>{animal.exercise}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>성격</div>
                    <div className={styles.statValue}>
                      {profile.temperamentTags?.[0] || "온순함"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 콘텐츠 섹션 */}
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>📖 품종 개요</h2>
              <p className={styles.description}>{animal.description}</p>

              <div className={styles.infoGrid}>
                {profile.characteristics && (
                  <div className={styles.infoCard}>
                    <h3>🎯 주요 특징</h3>
                    <p>{profile.characteristics}</p>
                  </div>
                )}

                {profile.temperamentOverview && (
                  <div className={styles.infoCard}>
                    <h3>💚 성격</h3>
                    <p>{profile.temperamentOverview}</p>
                  </div>
                )}

                {profile.physicalCharacteristics && (
                  <div className={styles.infoCard}>
                    <h3>📏 신체 특징</h3>
                    <p>{profile.physicalCharacteristics}</p>
                  </div>
                )}

                {profile.healthConsiderations && (
                  <div className={styles.infoCard}>
                    <h3>🏥 건강 관리</h3>
                    <p>{profile.healthConsiderations}</p>
                  </div>
                )}

                {profile.dailyCare?.feeding && (
                  <div className={styles.infoCard}>
                    <h3>🍖 식사 관리</h3>
                    <ul>
                      {profile.dailyCare.feeding.map((item, index) => (
                        <li key={index}>
                          <strong>{item.title}:</strong> {item.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.dailyCare?.exerciseAndWalk && (
                  <div className={styles.infoCard}>
                    <h3>🏃 운동 및 산책</h3>
                    <ul>
                      {profile.dailyCare.exerciseAndWalk.map((item, index) => (
                        <li key={index}>
                          <strong>{item.title}:</strong> {item.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.lifespan && (
                  <div className={styles.infoCard}>
                    <h3>⏰ 수명</h3>
                    <p>{profile.lifespan}</p>
                  </div>
                )}

                {profile.averageWeight && (
                  <div className={styles.infoCard}>
                    <h3>⚖️ 평균 체중</h3>
                    <p>{profile.averageWeight}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DictionaryDetailPage;
