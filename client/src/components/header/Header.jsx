import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Header.css";
import NavBar from "./NavBar";
import { ROUTES } from "../../utils/constants";

const DashboardHeader = ({ displayName = "집사님", onLogout }) => {
  const navigate = useNavigate();
  const avatarInitial = displayName.slice(0, 1);

  return (
    <header className="mg-header">
      <div className="mg-header__inner">
        <div className="mg-logo" onClick={() => navigate(ROUTES.DASHBOARD)}>
          몽글몽글
        </div>
        <NavBar onLogout={onLogout} />
        <div className="mg-header__actions">
          <div className="mg-user-menu" onClick={() => navigate(ROUTES.PETS)}>
            <span className="mg-user-avatar">{avatarInitial}</span>
            <span className="mg-user-name">{displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
