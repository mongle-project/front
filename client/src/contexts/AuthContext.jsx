import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState({ name: "Apple 님" }); // 임시로 로그인된 상태로 설정

  const login = async (credentials) => {
    // Login logic
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
