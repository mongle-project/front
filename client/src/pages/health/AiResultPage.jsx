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

  // 상담 데이터 (실제로는 location.state나 API에서 받아옴)
  const consultationData = location.state || {
    animalType: "dog",
    animalTypeLabel: "🐕 강아지",
    breed: "말티즈",
    age: "3살 (성인)",
    weight: "3kg",
    gender: "남아",
    consultation:
      "우리 강아지가 최근 식욕이 떨어졌는데 어떻게 해야 할까요? 평소에는 사료를 잘 먹었는데 어제부터 밥그릇만 보면 관심이 없어요.",
  };

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
            <p>안녕하세요! 말티즈의 식욕 저하 문제에 대해 상담드리겠습니다.</p>

            <h3>🔍 1. 식욕 저하의 주요 원인</h3>
            <ul>
              <li>
                <strong>환경 변화:</strong> 최근 집안 환경이나 일상 루틴에
                변화가 있었나요?
              </li>
              <li>
                <strong>건강 문제:</strong> 치아 문제, 소화기 질환의 초기
                증상일 수 있습니다.
              </li>
              <li>
                <strong>사료 문제:</strong> 사료가 상했거나 맛이 변했을
                가능성이 있습니다.
              </li>
              <li>
                <strong>과도한 간식:</strong> 간식을 너무 많이 주면 정규 식사에
                흥미를 잃습니다.
              </li>
            </ul>

            <div className={styles.warningBox}>
              <div className={styles.warningTitle}>
                ⚠️ 즉시 병원을 방문해야 하는 경우
              </div>
              <div className={styles.warningContent}>
                • 24시간 이상 아무것도 먹지 않는 경우
                <br />
                • 구토나 설사를 동반하는 경우
                <br />
                • 기력이 현저히 떨어진 경우
                <br />
                <br />위 증상이 있다면 즉시 동물병원을 방문하세요!
              </div>
            </div>

            <h3>💡 2. 집에서 시도해볼 수 있는 방법</h3>
            <ul>
              <li>
                <strong>사료에 토핑 추가:</strong> 소고기 육수를 소량
                섞어주세요.
              </li>
              <li>
                <strong>사료를 살짝 데워주기:</strong> 10-15초 정도 데우면 향이
                강해집니다.
              </li>
              <li>
                <strong>급여 환경 개선:</strong> 조용하고 편안한 장소에서
                식사하게 해주세요.
              </li>
              <li>
                <strong>운동량 증가:</strong> 식사 전 20-30분 산책으로 에너지를
                소비시키세요.
              </li>
            </ul>

            <div className={styles.highlightBox}>
              <div className={styles.highlightTitle}>💡 사료 교체 시 주의사항</div>
              <div className={styles.highlightContent}>
                사료를 바꿀 때는 7-10일에 걸쳐 점진적으로 새 사료의 비율을
                늘려가세요:
                <br />
                • 1-3일: 기존 75% + 새 사료 25%
                <br />
                • 4-6일: 기존 50% + 새 사료 50%
                <br />• 7-9일: 기존 25% + 새 사료 75%
              </div>
            </div>

            <h3>🏥 3. 동물병원 방문이 필요한 시점</h3>
            <ul>
              <li>3일 이상 식욕이 회복되지 않는 경우</li>
              <li>체중이 5% 이상 감소한 경우</li>
              <li>다른 증상(구토, 설사)이 동반되는 경우</li>
            </ul>

            <p className={styles.disclaimer}>
              ※ 이 상담 내용은 AI가 제공하는 일반적인 정보이며, 수의사의
              전문적인 진단을 대체할 수 없습니다.
            </p>
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
