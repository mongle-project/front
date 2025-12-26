import { useState, useEffect, useCallback } from "react";
import { getHospitals, getShelters } from "../api/locations";
import { adaptLocationData } from "../utils/locationAdapter";

/**
 * 주소에서 시/도 정보 추출
 * @param {string} address - 주소 문자열
 * @returns {Object} - { city, district, isSeoul }
 */
const parseAddress = (address) => {
  if (!address) return { city: null, district: null, isSeoul: false };

  // 서울특별시, 서울시, 서울 등 다양한 형태 처리
  const seoulPatterns = ["서울특별시", "서울시", "서울"];
  const isSeoul = seoulPatterns.some((pattern) => address.includes(pattern));

  // 시/도 추출 (예: "서울특별시", "경기도", "부산광역시" 등)
  const cityMatch = address.match(
    /^(서울특별시|서울시|서울|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도|제주도)/
  );
  const city = cityMatch ? cityMatch[1] : null;

  // 구/군 추출 (예: "강남구", "수원시" 등)
  const districtMatch = address.match(/([가-힣]+[시구군])\s/);
  const district = districtMatch ? districtMatch[1] : null;

  return { city, district, isSeoul };
};

/**
 * 병원/보호소 데이터 조회 및 관리 훅
 * @param {string} activeTab - 'hospital' 또는 'shelter'
 * @param {Object} center - { lat, lng } 중심 좌표
 * @param {string} currentAddress - 현재 검색된 주소
 * @returns {Object} - { allData, listData, loading, error, refetch, count }
 */
const useLocationData = (activeTab, center, currentAddress = "") => {
  const [allData, setAllData] = useState([]); // 지도에 표시할 데이터
  const [listData, setListData] = useState([]); // 거리순 정렬 데이터 (리스트용)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  // 지도 마커용 데이터 조회 (서울: 5km 반경, 그 외: 시/도 전체)
  const fetchAllData = useCallback(async () => {
    if (!center || !center.lat || !center.lng) {
      console.warn("유효한 중심 좌표가 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { city, isSeoul } = parseAddress(currentAddress);
      let params = {};

      if (activeTab === "hospital") {
        // 병원: 서울이면 5km 반경, 그 외 지역은 시/도 전체
        if (isSeoul) {
          params = {
            lat: center.lat,
            lng: center.lng,
            radius: 5000, // 서울은 5km 반경
          };
        } else if (city) {
          // 서울 외 지역은 시/도 기준 조회
          params = { city: city };
        } else {
          // 주소 정보가 없으면 위치 기반 10km
          params = {
            lat: center.lat,
            lng: center.lng,
            radius: 10000,
          };
        }
      } else {
        // 보호소: 전체 데이터 표시 (300여개로 적음)
        params = {};
      }

      let response;
      if (activeTab === "hospital") {
        response = await getHospitals(params);
      } else if (activeTab === "shelter") {
        response = await getShelters(params);
      } else {
        throw new Error(`Unknown tab: ${activeTab}`);
      }

      const rawData = response.data || [];
      const transformedData = rawData.map((item) =>
        adaptLocationData(item, activeTab)
      );

      setAllData(transformedData);
      setCount(transformedData.length);
    } catch (err) {
      console.error("데이터 조회 실패:", err);
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
      setAllData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, center, currentAddress]);

  // 거리순 정렬 데이터 조회 (사이드바 리스트용)
  const fetchListData = useCallback(async () => {
    if (!center || !center.lat || !center.lng) {
      console.warn("유효한 중심 좌표가 없습니다.");
      return;
    }

    try {
      const { isSeoul } = parseAddress(currentAddress);

      // 서울은 5km, 그 외 지역은 50km 반경
      const radius = activeTab === "hospital" && isSeoul ? 5000 : 50000;

      const params = {
        lat: center.lat,
        lng: center.lng,
        radius: radius,
      };

      let response;
      if (activeTab === "hospital") {
        response = await getHospitals(params);
      } else if (activeTab === "shelter") {
        response = await getShelters(params);
      } else {
        throw new Error(`Unknown tab: ${activeTab}`);
      }

      const rawData = response.data || [];
      const transformedData = rawData.map((item) =>
        adaptLocationData(item, activeTab)
      );

      setListData(transformedData);
    } catch (err) {
      console.error("리스트 데이터 조회 실패:", err);
      setListData([]);
    }
  }, [activeTab, center, currentAddress]);

  // 탭 변경 또는 위치/주소 변경 시 데이터 조회
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 검색 위치 변경 시 리스트 데이터 조회
  useEffect(() => {
    fetchListData();
  }, [fetchListData]);

  return {
    allData, // 지도 마커용 데이터 (서울: 5km 반경, 그 외: 시/도 전체, 보호소: 전국)
    listData, // 거리순 정렬 데이터 (사이드바 리스트용)
    loading,
    error,
    refetch: fetchAllData,
    count,
  };
};

export default useLocationData;
