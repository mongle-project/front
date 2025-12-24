import React from "react";
import DashboardHeader from "../../components/header/Header";
import styles from "./map.module.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const hospitalList = [
  {
    label: "24시 응급 동물병원",
    name: "24시 우리 동물병원",
    address: "경기도 남양주시 화도읍 먹골로 123",
    phone: "031-1234-5678",
    hours: "24시간 운영",
    distance: "현재 위치에서 850m",
    status: "영업중",
    statusType: "success",
  },
  {
    label: "사랑 동물의료센터",
    name: "사랑 동물의료센터",
    address: "경기도 남양주시 화도읍 마석로 456",
    phone: "031-2345-6789",
    hours: "09:00 - 21:00 (연중무휴)",
    distance: "현재 위치에서 1.2km",
    status: "영업중",
    statusType: "success",
  },
  {
    label: "행복 동물병원",
    name: "행복 동물병원",
    address: "경기도 남양주시 화도읍 창현로 789",
    phone: "031-3456-7890",
    hours: "09:00 - 19:00 (일요일 휴무)",
    distance: "현재 위치에서 1.8km",
    status: "영업종료",
    statusType: "offline",
  },
  {
    label: "입양 상담 동물병원",
    name: "펫케어 동물병원",
    address: "경기도 남양주시 진접읍 진접로 321",
    phone: "031-4567-8901",
    hours: "10:00 - 20:00",
    distance: "현재 위치에서 2.5km",
    status: "영업중",
    statusType: "success",
  },
  {
    label: "입양 상담 동물병원",
    name: "남양주 반려동물병원",
    address: "경기도 남양주시 와부읍 덕소로 654",
    phone: "031-5678-9012",
    hours: "09:30 - 18:30 (목요일 휴무)",
    distance: "현재 위치에서 3.2km",
    status: "영업중",
    statusType: "success",
  },
];

const ClinicCard = ({
  label,
  name,
  address,
  phone,
  hours,
  distance,
  status,
  statusType,
}) => (
  <article className={styles.clinicCard}>
    <div className={styles.clinicTop}>
      <div className={styles.clinicLeft}>
        <p className={styles.clinicLabel}>{label}</p>
        <h3 className={styles.clinicName}>{name}</h3>
        <p className={styles.clinicMeta}>📍 {address}</p>
        <p className={styles.clinicMeta}>📞 {phone}</p>
        <p className={styles.clinicMeta}>🕒 {hours}</p>
        <p className={`${styles.clinicMeta} ${styles.distance}`}>
          🚗 {distance}
        </p>
      </div>
      <span className={`${styles.tag} ${styles[statusType]}`}>{status}</span>
    </div>
    <div className={styles.clinicActions}>
      <button className={styles.ghostBtn}>전화하기</button>
      <button className={styles.ghostBtn}>길찾기</button>
      <button className={styles.ghostBtn}>상세보기</button>
    </div>
  </article>
);

export default function MapPage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const displayName = user?.id || user?.name || "집사님";

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.shell}>
      <DashboardHeader displayName={displayName} onLogout={handleLogout} />

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <section className={`${styles.card} ${styles.filterCard}`}>
            <div className={styles.filterHeading}>
              <div className={styles.filterIcon}>🔍</div>
              <div>
                <p className={styles.filterTitle}>검색 필터</p>
              </div>
            </div>

            <div className={styles.filterTabs}>
              <button className={`${styles.tab} ${styles.tabActive}`}>
                🏥 동물병원
              </button>
              <button className={styles.tab}>🏠 유기견 보호소</button>
            </div>

            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                id="searchName"
                type="text"
                placeholder="병원명 또는 지역 검색"
              />
            </div>

            <div className={styles.locationBar}>
              <span className={styles.pinIcon}>📍</span>
              <span className={styles.locationText}>
                경기도 남양주시 화도읍
              </span>
            </div>
          </section>

          <section className={`${styles.card} ${styles.listCard}`}>
            <div className={styles.listHeader}>
              <div className={styles.listTitle}>
                <span className={styles.dot}></span>총 <strong>24개</strong>의
                동물병원
              </div>
              <button className={styles.toggle}>가까운 순</button>
            </div>

            <div className={styles.clinicList}>
              {hospitalList.map((item) => (
                <ClinicCard key={item.name} {...item} />
              ))}
            </div>
          </section>
        </aside>

        <section className={styles.mapPanel}>
          <div className={styles.mapSurface}>
            <div className={styles.mapControls}>
              <button className={styles.circleBtn}>+</button>
              <button className={styles.circleBtn}>−</button>
              <button className={`${styles.circleBtn} ${styles.pin}`}>
                📍
              </button>
            </div>
            <div className={styles.mapViewport}>
              <div className={styles.mapPlaceholder}></div>
              <div className={styles.legend}>
                <p className={styles.legendTitle}>지도 범례</p>
                <div className={styles.legendList}>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendIcon} ${styles.hospital}`}>
                      🏥
                    </span>
                    <span className={styles.legendText}>동물병원</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendIcon} ${styles.shelter}`}>
                      🏠
                    </span>
                    <span className={styles.legendText}>유기견 보호소</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
