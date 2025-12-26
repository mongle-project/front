/**
 * 카카오맵 SDK 동적 로딩 유틸리티
 * 이미 index.html에서 로드하므로 현재는 체크 용도로만 사용
 */

/**
 * 카카오맵 SDK가 로드되었는지 확인
 * @returns {boolean} - SDK 로드 여부
 */
export const isKakaoMapLoaded = () => {
  return !!(window.kakao && window.kakao.maps);
};

/**
 * 카카오맵 SDK 로드 대기
 * @param {number} timeout - 타임아웃 (밀리초)
 * @returns {Promise<boolean>} - SDK 로드 성공 여부
 */
export const waitForKakaoMap = (timeout = 10000) => {
  return new Promise((resolve, reject) => {
    if (isKakaoMapLoaded()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isKakaoMapLoaded()) {
        clearInterval(checkInterval);
        console.log("✅ 카카오맵 SDK 로드 완료");
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        console.error("❌ 카카오맵 SDK 로드 실패 - window.kakao:", window.kakao);
        reject(new Error("카카오맵 SDK 로드 타임아웃"));
      }
    }, 100);
  });
};
