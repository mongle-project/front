import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DashboardHeader from "../../components/header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import styles from "./AiResultPage.module.css";

const AiResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const displayName = user?.name ?? "집사님";
  const contentRef = useRef();

  // 상담 데이터 및 AI 응답 가져오기
  const consultationData = location.state || null;
  const aiResponse = consultationData?.aiResponse || null;

  // 상담 데이터가 없으면 상담 페이지로 리디렉션
  React.useEffect(() => {
    if (!consultationData) {
      toast.error("상담 데이터를 찾을 수 없습니다. 다시 시도해주세요.", {
        duration: 2000,
        position: "top-center",
      });
      navigate(ROUTES.HEALTH_CONSULT);
    }
  }, [consultationData, navigate]);

  const handleBackToConsult = () => {
    navigate(ROUTES.HEALTH_CONSULT);
  };

  const handleFindHospital = () => {
    navigate(ROUTES.MAP);
  };

  const handleSavePDF = async () => {
    if (!contentRef.current) return;

    try {
      toast.loading("PDF를 생성하고 있습니다...", { id: "pdf-loading" });

      // HTML을 Canvas로 변환
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `AI상담결과_${consultationData.breed}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);

      toast.success("PDF가 저장되었습니다!", { id: "pdf-loading" });
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      toast.error("PDF 생성 중 오류가 발생했습니다.", { id: "pdf-loading" });
    }
  };

  // 상담 데이터가 없으면 렌더링하지 않음 (리디렉션 처리됨)
  if (!consultationData) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Toaster />
      <DashboardHeader displayName={displayName} onLogout={logout} />
      <div className={styles.container} ref={contentRef}>
        <button className={styles.backBtn} onClick={handleBackToConsult}>
          ← 다시 상담하기
        </button>

        <div className={styles.pageHeader}>
          <div className={styles.pageIcon}>🤖✨</div>
          <h1 className={styles.pageTitle}>AI 상담 결과</h1>
          <p className={styles.pageSubtitle}>
            전문 AI가 분석한 맞춤형 건강/영양 조언입니다
          </p>
        </div>

        {/* 상담 정보 */}
        <div className={styles.consultationInfo}>
          <h2 className={styles.infoTitle}>📋 상담 정보</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>반려동물</div>
              <div className={styles.infoValue}>
                {consultationData.animalTypeLabel}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>품종</div>
              <div className={styles.infoValue}>{consultationData.breed}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>나이</div>
              <div className={styles.infoValue}>{consultationData.age}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>체중</div>
              <div className={styles.infoValue}>
                {consultationData.weight || "-"}
              </div>
            </div>
          </div>

          <div className={styles.questionBox}>
            <div className={styles.questionLabel}>💬 상담 내용</div>
            <div className={styles.questionText}>
              {consultationData.consultation}
            </div>
          </div>
        </div>

        {/* AI 응답 */}
        <div className={styles.aiResponse}>
          <div className={styles.responseHeader}>
            <div className={styles.aiAvatar}>🤖</div>
            <div>
              <h2 className={styles.responseTitle}>AI 건강/영양 상담 결과</h2>
            </div>
          </div>

          <div className={styles.responseContent}>
            {aiResponse ? (
              <>
                {/* API에서 받은 AI 응답 표시 */}
                <div className={styles.responseSection}>
                  <h3>🔍 {aiResponse.subtitle1}</h3>
                  <p>{aiResponse.text1}</p>
                </div>

                <div className={styles.responseSection}>
                  <h3>💡 {aiResponse.subtitle2}</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{aiResponse.text2}</p>
                </div>

                <div className={styles.responseSection}>
                  <h3>⚕️ {aiResponse.subtitle3}</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{aiResponse.text3}</p>
                </div>

                <div className={styles.responseSection}>
                  <h3>🏥 {aiResponse.subtitle4}</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{aiResponse.text4}</p>
                </div>

                <p className={styles.disclaimer}>
                  ※ 이 상담 내용은 AI가 제공하는 일반적인 정보이며, 수의사의
                  전문적인 진단을 대체할 수 없습니다. 심각한 증상이 있다면 반드시
                  동물병원을 방문하세요.
                </p>
              </>
            ) : (
              <>
                {/* AI 응답을 받아오지 못한 경우 */}
                <div className={styles.warningBox}>
                  <div className={styles.warningTitle}>⚠️ 상담 결과를 불러올 수 없습니다</div>
                  <div className={styles.warningContent}>
                    AI 건강/영양 상담 결과를 받아오는 중 문제가 발생했습니다.
                    <br />
                    <br />
                    다음과 같은 이유일 수 있습니다:
                    <br />
                    • 건강/영양 상담과 관련되지 않은 질문
                    <br />
                    • 서버와의 연결 문제
                    <br />
                    • 일시적인 오류
                    <br />
                    <br />
                    반려동물의 건강이나 영양과 관련된 질문으로 다시 시도해주세요.
                  </div>
                </div>

                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                  <button
                    className={styles.actionBtn}
                    onClick={handleBackToConsult}
                    style={{ display: "inline-block" }}
                  >
                    🔄 다시 상담하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className={styles.actionButtons}>
          <button className={styles.actionBtn} onClick={handleFindHospital}>
            🏥 가까운 동물병원 찾기
          </button>
          <button className={styles.actionBtn} onClick={handleSavePDF}>
            📄 PDF로 저장하기
          </button>
          <button className={styles.actionBtn} onClick={handleBackToConsult}>
            🔄 새로운 상담하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiResultPage;
