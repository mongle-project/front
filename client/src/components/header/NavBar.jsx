import React, { useEffect, useId, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Header.css";
import { ROUTES } from "../../utils/constants";

const DEFAULT_NAV_LINKS = [
  { label: "동물 사전", path: ROUTES.DICTIONARY },
  { label: "정보 공유", path: ROUTES.COMMUNITY },
  { label: "내 반려동물", path: ROUTES.PETS },
  { label: "캘린더", path: ROUTES.CALENDAR },
  { label: "건강/영양", path: ROUTES.HEALTH_CONSULT },
  { label: "병원/보호소", path: ROUTES.MAP },
  { label: "뉴스", path: ROUTES.NEWS },
  { label: "로그아웃", action: "logout" },
];

const NavBar = ({
  onLogout,
  links = DEFAULT_NAV_LINKS,
  forceDesktop = false,
  desktopBreakpoint = 1024,
  showLogout = true,
}) => {
  const isBrowser =
    typeof window !== "undefined" && typeof document !== "undefined";
  const [isOpen, setIsOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    isBrowser ? window.innerWidth : desktopBreakpoint
  );
  const menuId = useId();
  const shouldForceDesktop = forceDesktop && viewportWidth >= desktopBreakpoint;

  const toggleMenu = () => {
    if (shouldForceDesktop) return;
    setIsOpen((prev) => !prev);
  };
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
    closeMenu();
  };

  useEffect(() => {
    if (!isBrowser) return undefined;

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isBrowser]);

  useEffect(() => {
    if (shouldForceDesktop && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, shouldForceDesktop]);

  useEffect(() => {
    if (!isBrowser || shouldForceDesktop) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBrowser, isOpen, shouldForceDesktop]);

  const isMenuOpen = shouldForceDesktop || isOpen;
  const wrapperClass = [
    "mg-nav-wrapper",
    isMenuOpen ? "is-open" : "",
    shouldForceDesktop ? "force-desktop" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {!shouldForceDesktop && (
        <button
          type="button"
          className={`mg-nav__toggle ${isOpen ? "is-open" : ""}`}
          aria-expanded={isOpen}
          aria-label="메뉴 열기"
          aria-controls={menuId}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      )}
      {!shouldForceDesktop && isOpen && (
        <button
          type="button"
          className="mg-nav__backdrop"
          aria-label="메뉴 닫기"
          onClick={closeMenu}
        />
      )}
      <ul id={menuId} className={`mg-nav ${isMenuOpen ? "is-open" : ""}`}>
        {links.map((link) => {
          if (link.action === "logout") {
            if (!showLogout) return null;
            return (
              <li key={link.label}>
                <button
                  type="button"
                  className="mg-nav__link mg-nav__button"
                  onClick={handleLogout}
                >
                  {link.label}
                </button>
              </li>
            );
          }

          return (
            <li key={link.label}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `mg-nav__link${isActive ? " is-active" : ""}`
                }
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavBar;
