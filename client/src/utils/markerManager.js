/**
 * 카카오맵 마커 관리 유틸리티
 */

/**
 * 이모지 마커용 CustomOverlay 생성
 * @param {Object} map - 카카오맵 인스턴스
 * @param {Object} position - { lat, lng }
 * @param {string} type - 'hospital' 또는 'shelter'
 * @param {Object} data - 마커 데이터
 * @returns {Object} - 카카오맵 CustomOverlay 객체
 */
export const createMarker = (map, position, type, data) => {
  const kakao = window.kakao;
  if (!kakao || !kakao.maps) {
    console.error("Kakao Maps SDK not loaded");
    return null;
  }

  const markerPosition = new kakao.maps.LatLng(position.lat, position.lng);

  // 이모지 선택 (병원: 🏥, 보호소: 🏠)
  const emoji = type === "hospital" ? "🏥" : "🏠";
  const bgColor = type === "hospital" ? "#ff6b6b" : "#4ecdc4";

  // CustomOverlay용 HTML 컨텐츠
  const content = document.createElement("div");
  content.innerHTML = `
    <div class="emoji-marker" style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: ${bgColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: 2px solid white;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: 20px;
        line-height: 1;
      ">${emoji}</span>
    </div>
  `;

  // hover 효과 추가
  const markerDiv = content.querySelector(".emoji-marker");
  markerDiv.addEventListener("mouseenter", () => {
    markerDiv.style.transform = "rotate(-45deg) scale(1.15)";
    markerDiv.style.boxShadow = "0 5px 15px rgba(0,0,0,0.4)";
  });
  markerDiv.addEventListener("mouseleave", () => {
    markerDiv.style.transform = "rotate(-45deg) scale(1)";
    markerDiv.style.boxShadow = "0 3px 10px rgba(0,0,0,0.3)";
  });

  const customOverlay = new kakao.maps.CustomOverlay({
    position: markerPosition,
    content: content,
    yAnchor: 1.2,
    xAnchor: 0.1,
    map: map,
  });

  // 클릭 이벤트를 위해 data 저장
  customOverlay._data = data;
  customOverlay._content = content;

  return customOverlay;
};

/**
 * InfoWindow 생성 (CustomOverlay 기반)
 * @param {string} type - 'hospital' 또는 'shelter'
 * @param {Object} data - 표시할 데이터
 * @returns {Object} - 카카오맵 CustomOverlay 객체 (InfoWindow 역할)
 */
export const createInfoWindow = (type, data) => {
  const kakao = window.kakao;
  if (!kakao || !kakao.maps) {
    console.error("Kakao Maps SDK not loaded");
    return null;
  }

  // 닫기 버튼이 있는 InfoWindow 컨텐츠
  const contentWrapper = document.createElement("div");
  contentWrapper.innerHTML = `
    <div class="custom-info-window" style="
      position: relative;
      padding: 15px 15px 18px;
      min-width: 220px;
      max-width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      box-sizing: border-box;
      transform: translateY(-10px);
    ">
      <button class="info-close-btn" style="
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border: none;
        background: #f0f0f0;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
      ">✕</button>
      <div style="
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 8px;
        color: #1d2b27;
        padding-right: 20px;
      ">
        ${data.name}
      </div>
      <div style="
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 230px;
      " title="${data.address}">
        📍 ${data.address}
      </div>
      <div style="
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
      ">
        📞 ${data.phone}
      </div>
      <div style="
        font-size: 12px;
        color: #2f9e55;
        font-weight: bold;
        margin-top: 6px;
      ">
        🚗 ${data.distance}
      </div>
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid white;
      "></div>
    </div>
  `;

  const infoOverlay = new kakao.maps.CustomOverlay({
    content: contentWrapper,
    yAnchor: 1.3,
    xAnchor: 0.5,
    zIndex: 10,
  });

  // 닫기 버튼 이벤트
  const closeBtn = contentWrapper.querySelector(".info-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      infoOverlay.setMap(null);
    });
  }

  // open/close 메서드 추가 (기존 InfoWindow API와 호환)
  infoOverlay.open = (map, positionOrLatLng) => {
    if (positionOrLatLng) {
      infoOverlay.setPosition(positionOrLatLng);
    }
    infoOverlay.setMap(map);
  };

  infoOverlay.close = () => {
    infoOverlay.setMap(null);
  };

  return infoOverlay;
};

/**
 * 모든 마커 제거
 * @param {Array} markers - 마커 배열
 */
export const removeAllMarkers = (markers) => {
  if (!markers || markers.length === 0) return;

  markers.forEach((marker) => {
    marker.setMap(null);
  });
};

/**
 * 마커 클릭 이벤트 등록 (CustomOverlay용)
 * @param {Object} overlay - 카카오맵 CustomOverlay 객체
 * @param {Object} map - 카카오맵 인스턴스
 * @param {Object} infoWindow - InfoWindow 객체 (CustomOverlay 기반)
 * @param {Function} onClick - 클릭 핸들러
 */
export const addMarkerClickEvent = (overlay, map, infoWindow, onClick) => {
  const kakao = window.kakao;
  if (!kakao || !kakao.maps) return;

  // CustomOverlay는 DOM 이벤트 사용
  const content = overlay._content;
  if (!content) return;

  content.addEventListener("click", () => {
    if (infoWindow) {
      // InfoWindow(CustomOverlay)를 마커 위치에 표시
      infoWindow.open(map, overlay.getPosition());
    }
    if (onClick) {
      onClick();
    }
  });
};
