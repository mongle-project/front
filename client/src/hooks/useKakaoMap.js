import { useState, useEffect, useRef } from "react";
import { waitForKakaoMap } from "../utils/kakaoMapLoader";

/**
 * 카카오맵 초기화 및 관리 훅
 * @param {Object} initialCenter - { lat, lng } 초기 중심 좌표
 * @param {number} initialLevel - 초기 줌 레벨 (기본값: 6)
 * @returns {Object} - { mapRef, mapInstance, isLoaded, error, setCenter, setLevel }
 */
const useKakaoMap = (initialCenter = { lat: 37.5665, lng: 126.978 }, initialLevel = 6) => {
  const mapRef = useRef(null); // 지도 컨테이너 ref
  const [mapInstance, setMapInstance] = useState(null); // 지도 인스턴스
  const [isLoaded, setIsLoaded] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 지도 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        // 카카오맵 SDK 로드 대기
        await waitForKakaoMap();

        if (!mapRef.current) return;

        const kakao = window.kakao;
        const container = mapRef.current;
        const options = {
          center: new kakao.maps.LatLng(initialCenter.lat, initialCenter.lng),
          level: initialLevel,
        };

        const map = new kakao.maps.Map(container, options);
        setMapInstance(map);
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("카카오맵 초기화 실패:", err);
        setError(err.message);
        setIsLoaded(false);
      }
    };

    initMap();
  }, []); // 최초 1회만 실행

  // 지도 중심 변경
  const setCenter = (lat, lng) => {
    if (!mapInstance) return;

    const kakao = window.kakao;
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    mapInstance.setCenter(moveLatLon);
  };

  // 지도 줌 레벨 변경
  const setLevel = (level) => {
    if (!mapInstance) return;
    mapInstance.setLevel(level);
  };

  // 지도 중심 부드럽게 이동
  const panTo = (lat, lng) => {
    if (!mapInstance) return;

    const kakao = window.kakao;
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    mapInstance.panTo(moveLatLon);
  };

  return {
    mapRef,
    mapInstance,
    isLoaded,
    error,
    setCenter,
    setLevel,
    panTo,
  };
};

export default useKakaoMap;
