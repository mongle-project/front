import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Header.css";
import NavBar from "./NavBar";
import { ROUTES } from "../../utils/constants";
import { useAuthContext } from "../../contexts/AuthContext";

const DashboardHeader = ({ displayName = "집사님", onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const avatarInitial = displayName.slice(0, 1);

  const handleLogoClick = () => {
    // 로그인 상태면 대시보드, 비로그인 상태면 랜딩 페이지로 이동
    navigate(user ? ROUTES.DASHBOARD : "/");
  };

  return (
    <header className="mg-header">
      <div className="mg-header__inner">
        <div className="mg-logo" onClick={handleLogoClick}>
          몽글몽글
        </div>
        <NavBar onLogout={onLogout} />
        <div className="mg-header__actions">
          <div className="mg-user-menu" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <span className="mg-user-avatar">{avatarInitial}</span>
            <span className="mg-user-name">{displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
