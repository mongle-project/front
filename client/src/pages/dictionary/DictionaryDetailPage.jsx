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
              <img
                src={animal.image}
                alt={animal.name}
                className={styles.animalImage}
              />
              <div className={styles.heroInfo}>
                <h1 className={styles.animalName}>{animal.name}</h1>
                <p className={styles.animalBreed}>{animal.breed}</p>
                <div className={styles.quickStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>평균 크기</div>
                    <div className={styles.statValue}>
                      {profile.averageSize}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>평균 수명</div>
                    <div className={styles.statValue}>{profile.lifeSpan}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>성격</div>
                    <div className={styles.statValue}>
                      {profile.temperamentTags?.join(", ") || "온순함"}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>털 관리</div>
                    <div className={styles.statValue}>
                      {profile.groomingLevel}
                    </div>
                  </div>
                </div>
                <div className={styles.tags}>
                  {animal.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 콘텐츠 섹션 */}
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>📖 품종 개요</h2>
              <hr />
              <p className={styles.description}>{profile.breedOverview}</p>

              {/* 성격과 특징 */}
              {profile.personality && profile.personality.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>💫 성격과 특징</h2>
                  <hr />
                  <div className={styles.listCard}>
                    {profile.personality.map((item, index) => (
                      <div key={index} className={styles.listItem}>
                        <div className={styles.checkmark}>✓</div>
                        <div>
                          <strong>{item.title}:</strong> {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 일상 관리 방법 */}
              {profile.dailyCare && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>🛁 일상 관리 방법</h2>
                  <div className={styles.careGrid}>
                    {profile.dailyCare.grooming &&
                      profile.dailyCare.grooming.length > 0 && (
                        <div className={styles.careCard}>
                          <h3>털 관리</h3>
                          {profile.dailyCare.grooming.map((item, index) => (
                            <div key={index} className={styles.listItem}>
                              <div className={styles.checkmark}>✓</div>
                              <div>
                                <strong>{item.title}:</strong>{" "}
                                {item.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {profile.dailyCare.exerciseAndWalk &&
                      profile.dailyCare.exerciseAndWalk.length > 0 && (
                        <div className={styles.careCard}>
                          <h3>운동과 산책</h3>
                          {profile.dailyCare.exerciseAndWalk.map(
                            (item, index) => (
                              <div key={index} className={styles.listItem}>
                                <div className={styles.checkmark}>✓</div>
                                <div>
                                  <strong>{item.title}:</strong>{" "}
                                  {item.description}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {profile.dailyCare.feeding &&
                      profile.dailyCare.feeding.length > 0 && (
                        <div className={styles.careCard}>
                          <h3>식사 관리</h3>
                          {profile.dailyCare.feeding.map((item, index) => (
                            <div key={index} className={styles.listItem}>
                              <div className={styles.checkmark}>✓</div>
                              <div>
                                <strong>{item.title}:</strong>{" "}
                                {item.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* 건강 관리 */}
              {profile.healthCare && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>🏥 건강 관리</h2>
                  <hr />
                  {profile.healthCare.commonDiseases &&
                    profile.healthCare.commonDiseases.length > 0 && (
                      <div className={styles.healthSection}>
                        <h3 className={styles.subTitle}>주의해야 할 질병</h3>
                        <div className={styles.listCard}>
                          {profile.healthCare.commonDiseases.map(
                            (disease, index) => (
                              <div key={index} className={styles.listItem}>
                                <div className={styles.checkmark}>✓</div>
                                <div>
                                  <strong>{disease.name}:</strong>{" "}
                                  {disease.description}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {profile.healthCare.vaccinationSchedule &&
                    profile.healthCare.vaccinationSchedule.length > 0 && (
                      <div className={styles.healthSection}>
                        <h3 className={styles.subTitle}>예방 접종 스케줄</h3>
                        <div className={styles.listCard}>
                          {profile.healthCare.vaccinationSchedule.map(
                            (vaccine, index) => (
                              <div key={index} className={styles.listItem}>
                                <div className={styles.checkmark}>✓</div>
                                <div>
                                  <strong>{vaccine.age}:</strong>{" "}
                                  {vaccine.details}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {profile.healthCare.notes && (
                    <div className={styles.warningBox}>
                      <div className={styles.warningIcon}>⚠️</div>
                      <div className={styles.warningText}>
                        <strong>주의사항</strong>
                        <p>{profile.healthCare.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DictionaryDetailPage;
