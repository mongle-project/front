import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Pages
import LandingPage from "../pages/home/LandingPage";
import DashboardPage from "../pages/home/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import FindPasswordPage from "../pages/auth/FindPasswordPage";
import DictionaryListPage from "../pages/dictionary/DictionaryListPage";
import DictionaryDetailPage from "../pages/dictionary/DictionaryDetailPage";
import CommunityListPage from "../pages/community/CommunityListPage";
import PostDetailPage from "../pages/community/PostDetailPage";
import PostWritePage from "../pages/community/PostWritePage";
import MyPetsPage from "../pages/pet/MyPetsPage";
import AddPetPage from "../pages/pet/AddPetPage";
import EditPetPage from "../pages/pet/EditPetPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import AddEventPage from "../pages/calendar/AddEventPage";
import AiConsultPage from "../pages/health/AiConsultPage";
import AiResultPage from "../pages/health/AiResultPage";
import NewsListPage from "../pages/news/NewsListPage";
import MapPage from "../pages/map/MapPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/find-password"
        element={
          <PublicRoute>
            <FindPasswordPage />
          </PublicRoute>
        }
      />

      {/* Dictionary - Public Access */}
      <Route path="/dictionary" element={<DictionaryListPage />} />
      <Route path="/dictionary/:id" element={<DictionaryDetailPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Community */}
      <Route
        path="/community"
        element={
          <PrivateRoute>
            <CommunityListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/community/:id"
        element={
          <PrivateRoute>
            <PostDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/community/write"
        element={
          <PrivateRoute>
            <PostWritePage />
          </PrivateRoute>
        }
      />

      {/* Pets */}
      <Route
        path="/pets"
        element={
          <PrivateRoute>
            <MyPetsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pets/add"
        element={
          <PrivateRoute>
            <AddPetPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pets/edit/:id"
        element={
          <PrivateRoute>
            <EditPetPage />
          </PrivateRoute>
        }
      />

      {/* Calendar */}
      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <CalendarPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar/add"
        element={
          <PrivateRoute>
            <AddEventPage />
          </PrivateRoute>
        }
      />

      {/* Health */}
      <Route
        path="/health/consult"
        element={
          <PrivateRoute>
            <AiConsultPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/health/result"
        element={
          <PrivateRoute>
            <AiResultPage />
          </PrivateRoute>
        }
      />

      {/* News & Map */}
      <Route path="/news" element={<NewsListPage />} />
      <Route path="/map" element={<MapPage />} />
    </Routes>
  );
};

export default AppRoutes;
