/**
 * 백엔드 API 응답을 프론트엔드 형식으로 변환하는 어댑터
 */

/**
 * 거리를 미터에서 사용자 친화적 형식으로 변환
 * @param {number} distanceInMeters - 미터 단위 거리
 * @returns {string} - 포맷된 거리 문자열 (예: "1.5km", "850m")
 */
export const formatDistance = (distanceInMeters) => {
  if (!distanceInMeters && distanceInMeters !== 0) {
    return "거리 정보 없음";
  }

  if (distanceInMeters >= 1000) {
    const km = (distanceInMeters / 1000).toFixed(1);
    return `${km}km`;
  }

  return `${Math.round(distanceInMeters)}m`;
};

/**
 * 병원 API 응답을 컴포넌트 친화적 형식으로 변환
 * @param {Object} hospitalData - 백엔드 API 응답 데이터
 * @returns {Object} - 변환된 데이터
 */
export const adaptHospitalData = (hospitalData) => {
  return {
    id: hospitalData.id,
    name: hospitalData.hospital_name,
    address: hospitalData.road_address || "주소 정보 없음",
    phone: hospitalData.phone_number || "전화번호 정보 없음",
    distance: formatDistance(hospitalData.distance),
    distanceInMeters: hospitalData.distance, // 정렬용
    position: {
      lat: parseFloat(hospitalData.latitude),
      lng: parseFloat(hospitalData.longitude),
    },
    type: "hospital",
    label: "동물병원",
  };
};

/**
 * 보호소 API 응답을 컴포넌트 친화적 형식으로 변환
 * @param {Object} shelterData - 백엔드 API 응답 데이터
 * @returns {Object} - 변환된 데이터
 */
export const adaptShelterData = (shelterData) => {
  return {
    id: shelterData.id,
    name: shelterData.shelter_name,
    address: shelterData.road_address || "주소 정보 없음",
    phone: shelterData.phone_number || "전화번호 정보 없음",
    distance: formatDistance(shelterData.distance),
    distanceInMeters: shelterData.distance, // 정렬용
    position: {
      lat: parseFloat(shelterData.latitude),
      lng: parseFloat(shelterData.longitude),
    },
    type: "shelter",
    label: "유기견 보호소",
  };
};

/**
 * 타입에 따라 적절한 어댑터 선택
 * @param {Object} data - 원본 데이터
 * @param {string} type - 'hospital' 또는 'shelter'
 * @returns {Object} - 변환된 데이터
 */
export const adaptLocationData = (data, type) => {
  if (type === "hospital") {
    return adaptHospitalData(data);
  } else if (type === "shelter") {
    return adaptShelterData(data);
  }
  throw new Error(`Unknown location type: ${type}`);
};
