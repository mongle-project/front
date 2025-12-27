import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/header/Header';
import KakaoMap from '../../components/map/KakaoMap';
import useKakaoMap from '../../hooks/useKakaoMap';
import useLocationData from '../../hooks/useLocationData';
import { searchAddress } from '../../services/kakaoGeocoding';
import styles from './map.module.css';
import { useAuthContext } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const ClinicCard = ({
  label,
  name,
  address,
  phone,
  distance,
  isSelected,
  onClick,
}) => (
  <article
    className={`${styles.clinicCard} ${isSelected ? styles.selected : ''}`}
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <div className={styles.clinicTop}>
      <div className={styles.clinicLeft}>
        <p className={styles.clinicLabel}>{label}</p>
        <h3 className={styles.clinicName}>{name}</h3>
        <p className={styles.clinicMeta}>📍 {address}</p>
        <p className={styles.clinicMeta}>📞 {phone}</p>
        <p className={`${styles.clinicMeta} ${styles.distance}`}>
          🚗 {distance}
        </p>
      </div>
    </div>
    <div className={styles.clinicActions}>
      <button
        className={styles.ghostBtn}
        onClick={(e) => {
          e.stopPropagation();
          // 네이버에서 주소 + 이름으로 검색
          const searchQuery = encodeURIComponent(`${address} ${name}`);
          window.open(
            `https://search.naver.com/search.naver?query=${searchQuery}`,
            '_blank'
          );
        }}
      >
        네이버 검색
      </button>
      <button
        className={styles.ghostBtn}
        onClick={(e) => {
          e.stopPropagation();
          // 카카오맵에서 주소로 검색하여 길찾기
          const encodedAddress = encodeURIComponent(address);
          window.open(`https://map.kakao.com/?q=${encodedAddress}`, '_blank');
        }}
      >
        길찾기
      </button>
    </div>
  </article>
);

export default function MapPage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const displayName = user?.id || user?.name || '집사님';

  // 상태 관리
  const [activeTab, setActiveTab] = useState('hospital');
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [searchInput, setSearchInput] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('서울특별시 중구');

  // 커스텀 훅
  const {
    mapRef,
    mapInstance,
    isLoaded,
    error: mapError,
    panTo,
    setLevel,
  } = useKakaoMap(mapCenter);
  const {
    allData,
    listData,
    loading,
    error: dataError,
    count,
  } = useLocationData(
    activeTab,
    mapCenter,
    currentAddress // 현재 주소 전달 (서울 지역 판별용)
  );

  const handleLogout = () => {
    if (typeof logout === 'function') logout();
    navigate(ROUTES.LOGIN);
  };

  // 탭 전환
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
  };

  // 주소 검색
  const handleSearchAddress = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error('주소를 입력해주세요.');
      return;
    }

    try {
      const result = await searchAddress(searchInput);
      setMapCenter({ lat: result.lat, lng: result.lng });
      setCurrentAddress(result.address);
      panTo(result.lat, result.lng);
      toast.success('주소 검색 완료!');
    } catch (err) {
      toast.error(err.message || '주소 검색에 실패했습니다.');
    }
  };

  // 사이드바 카드 클릭
  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  // 마커 클릭
  const handleMarkerClick = (item) => {
    setSelectedItem(item);
    const cardElement = document.getElementById(`clinic-card-${item.id}`);
    const listContainer = document.querySelector(`.${styles.clinicList}`);
    if (cardElement && listContainer) {
      // 리스트 컨테이너 내에서만 스크롤 (전체 페이지 스크롤 방지)
      const containerRect = listContainer.getBoundingClientRect();
      const cardRect = cardElement.getBoundingClientRect();
      const scrollTop =
        listContainer.scrollTop +
        (cardRect.top - containerRect.top) -
        containerRect.height / 2 +
        cardRect.height / 2;
      listContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  // 줌 컨트롤
  const handleZoomIn = () => {
    if (!mapInstance) return;
    const level = mapInstance.getLevel();
    setLevel(level - 1);
  };

  const handleZoomOut = () => {
    if (!mapInstance) return;
    const level = mapInstance.getLevel();
    setLevel(level + 1);
  };

  // 리스트 스크롤 맨 위로 이동 및 첫 번째 아이템 선택
  const handleScrollToTop = () => {
    const listElement = document.querySelector(`.${styles.clinicList}`);
    if (listElement) {
      listElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 첫 번째 아이템 선택
    if (listData.length > 0) {
      setSelectedItem(listData[0]);
    }
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
              <button
                className={`${styles.tab} ${
                  activeTab === 'hospital' ? styles.tabActive : ''
                }`}
                onClick={() => handleTabChange('hospital')}
              >
                🏥 동물병원
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === 'shelter' ? styles.tabActive : ''
                }`}
                onClick={() => handleTabChange('shelter')}
              >
                🏠 유기견 보호소
              </button>
            </div>

            <form onSubmit={handleSearchAddress}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  id="searchName"
                  type="text"
                  placeholder="주소 검색 (예: 서울시 강남구)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className={styles.searchBtn}>
                  검색
                </button>
              </div>
            </form>

            <div className={styles.locationBar}>
              <span className={styles.pinIcon}>📍</span>
              <span className={styles.locationText}>{currentAddress}</span>
            </div>
          </section>

          <section className={`${styles.card} ${styles.listCard}`}>
            <div className={styles.listHeader}>
              <div className={styles.listTitle}>
                <span className={styles.dot}></span>총{' '}
                <strong>{count || 0}개</strong>의{' '}
                {activeTab === 'hospital' ? '동물병원' : '유기견 보호소'}
              </div>
              <button className={styles.toggle} onClick={handleScrollToTop}>
                가까운 순
              </button>
            </div>

            <div className={styles.clinicList}>
              {loading && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  데이터를 불러오는 중...
                </div>
              )}

              {!loading && dataError && (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#d32f2f',
                  }}
                >
                  {dataError}
                </div>
              )}

              {!loading && !dataError && listData.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  검색 반경 내에{' '}
                  {activeTab === 'hospital' ? '병원이' : '보호소가'} 없습니다.
                </div>
              )}

              {!loading &&
                !dataError &&
                listData.map((item) => (
                  <div key={item.id} id={`clinic-card-${item.id}`}>
                    <ClinicCard
                      label={item.label}
                      name={item.name}
                      address={item.address}
                      phone={item.phone}
                      distance={item.distance}
                      isSelected={selectedItem?.id === item.id}
                      onClick={() => handleCardClick(item)}
                    />
                  </div>
                ))}
            </div>
          </section>
        </aside>

        <section className={styles.mapPanel}>
          <div className={styles.mapSurface}>
            <div className={styles.mapControls}>
              <button className={styles.circleBtn} onClick={handleZoomIn}>
                +
              </button>
              <button className={styles.circleBtn} onClick={handleZoomOut}>
                −
              </button>
            </div>

            <div className={styles.mapViewport} ref={mapRef}>
              {!isLoaded && !mapError && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  지도를 로딩 중...
                </div>
              )}

              {mapError && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#d32f2f',
                    textAlign: 'center',
                  }}
                >
                  <p>지도를 로드할 수 없습니다.</p>
                  <p style={{ fontSize: '12px', marginTop: '10px' }}>
                    {mapError}
                  </p>
                </div>
              )}

              {isLoaded && mapInstance && (
                <KakaoMap
                  mapInstance={mapInstance}
                  markers={allData}
                  onMarkerClick={handleMarkerClick}
                  selectedItem={selectedItem}
                />
              )}
            </div>

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
        </section>
      </main>
    </div>
  );
}
