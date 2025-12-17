import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Header.css";
import { ROUTES } from "../../utils/constants";
import { NAV_LINKS } from "../../utils/navLinks";

const navLinks = [...NAV_LINKS, { label: "로그아웃", action: "logout" }];

const NavBar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
    closeMenu();
  };

  return (
    <div className={`mg-nav-wrapper ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className={`mg-nav__toggle ${isOpen ? "is-open" : ""}`}
        aria-expanded={isOpen}
        aria-label="메뉴 열기"
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={`mg-nav ${isOpen ? "is-open" : ""}`}>
        {navLinks.map((link) => {
          if (link.action === "logout") {
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
