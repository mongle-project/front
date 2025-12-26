import React, { useEffect, useState, useRef } from "react";
import {
  createMarker,
  createInfoWindow,
  removeAllMarkers,
  addMarkerClickEvent,
} from "../../utils/markerManager";

/**
 * 카카오맵 컴포넌트
 * @param {Object} props
 * @param {Object} props.mapInstance - 카카오맵 인스턴스
 * @param {Array} props.markers - 표시할 마커 데이터 배열
 * @param {Function} props.onMarkerClick - 마커 클릭 핸들러
 * @param {Object} props.selectedItem - 선택된 아이템
 */
const KakaoMap = ({
  mapInstance,
  markers = [],
  onMarkerClick,
  selectedItem,
}) => {
  const [markerInstances, setMarkerInstances] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  const selectedInfoWindowRef = useRef(null);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!mapInstance || !markers) return;

    // 기존 마커 제거
    removeAllMarkers(markerInstances);

    // 기존 InfoWindow 닫기
    infoWindows.forEach((iw) => iw.close());

    // 새 마커 생성
    const newMarkers = [];
    const newInfoWindows = [];

    markers.forEach((data) => {
      const marker = createMarker(mapInstance, data.position, data.type, data);

      if (!marker) return;

      const infoWindow = createInfoWindow(data.type, data);

      // 마커 클릭 이벤트
      addMarkerClickEvent(marker, mapInstance, infoWindow, () => {
        // 기존 열린 InfoWindow 닫기
        if (selectedInfoWindowRef.current) {
          selectedInfoWindowRef.current.close();
        }
        selectedInfoWindowRef.current = infoWindow;

        // 부모 컴포넌트에 클릭 이벤트 전달
        if (onMarkerClick) {
          onMarkerClick(data);
        }
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setMarkerInstances(newMarkers);
    setInfoWindows(newInfoWindows);

    // Cleanup
    return () => {
      removeAllMarkers(newMarkers);
      newInfoWindows.forEach((iw) => iw.close());
    };
  }, [mapInstance, markers]);

  // selectedItem 변경 시 해당 마커의 InfoWindow 열기
  useEffect(() => {
    if (!mapInstance || !selectedItem || !markerInstances.length) return;

    const selectedIndex = markers.findIndex((m) => m.id === selectedItem.id);
    if (selectedIndex === -1) return;

    const marker = markerInstances[selectedIndex];
    const infoWindow = infoWindows[selectedIndex];

    if (marker && infoWindow) {
      // 기존 열린 InfoWindow 닫기
      if (selectedInfoWindowRef.current) {
        selectedInfoWindowRef.current.close();
      }

      // 새 InfoWindow 열기 (CustomOverlay이므로 getPosition() 사용)
      infoWindow.open(mapInstance, marker.getPosition());
      selectedInfoWindowRef.current = infoWindow;

      // 지도 중심을 해당 마커로 이동
      mapInstance.panTo(marker.getPosition());
    }
  }, [selectedItem, mapInstance, markerInstances, infoWindows, markers]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음 (마커만 관리)
};

export default KakaoMap;
