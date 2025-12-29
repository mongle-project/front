/**
 * 카카오 주소 검색 (Geocoding) 서비스
 */

/**
 * 주소를 좌표로 변환
 * @param {string} address - 검색할 주소
 * @returns {Promise<Object>} - { lat, lng, address }
 */
export const searchAddress = (address) => {
  return new Promise((resolve, reject) => {
    const kakao = window.kakao;

    if (!kakao || !kakao.maps || !kakao.maps.services) {
      reject(new Error("카카오맵 SDK가 로드되지 않았습니다."));
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coord = result[0];
        resolve({
          lat: parseFloat(coord.y),
          lng: parseFloat(coord.x),
          address: coord.address_name || coord.road_address_name || address,
        });
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        reject(new Error("검색 결과가 없습니다. \n다른 주소를 입력해주세요."));
      } else {
        reject(new Error("주소 검색에 실패했습니다. \n다시 시도해주세요."));
      }
    });
  });
};

/**
 * 좌표를 주소로 변환 (Reverse Geocoding)
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @returns {Promise<string>} - 주소 문자열
 */
export const coordToAddress = (lat, lng) => {
  return new Promise((resolve, reject) => {
    const kakao = window.kakao;

    if (!kakao || !kakao.maps || !kakao.maps.services) {
      reject(new Error("카카오맵 SDK가 로드되지 않았습니다."));
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    const coord = new kakao.maps.LatLng(lat, lng);

    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const address = result[0].road_address
          ? result[0].road_address.address_name
          : result[0].address.address_name;
        resolve(address);
      } else {
        reject(new Error("주소 변환에 실패했습니다."));
      }
    });
  });
};
