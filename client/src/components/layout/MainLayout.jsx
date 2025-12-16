import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
