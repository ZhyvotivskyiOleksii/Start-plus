import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AppBar from "./components/AppBar/AppBar";
import HeroSection from "./components/HeroSection/HeroSection";
import Calculator from "./components/Calculator/Calculator";
import RenovationCalculator from "./components/RenovationCalculator/RenovationCalculator";
import WindowCleaningCalculator from "./components/WindowCleaningCalculator/WindowCleaningCalculator";
import PrivateHouseCleaning from "./components/PrivateHouseCleaning/PrivateHouseCleaning";
import OfficeCleaning from "./components/OfficeCleaning/OfficeCleaning";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login/Login";
import Dashboard from "./components/dashboard/Dashboard";

function AppContent() {
  /* ---------- локалізація ---------- */
  const [lang, setLang] = useState(localStorage.getItem("lang") || "pl");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  /* ---------- токен звичайного користувача ---------- */
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const isUserAuth = !!userToken;

  const navigate = useNavigate();

  /* ---------- login / logout ---------- */
  const handleLogin = (token, phone) => {
    localStorage.setItem("token", token);
    if (phone) localStorage.setItem("phone", phone);
    setUserToken(token);
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    setUserToken(null);
    navigate("/", { replace: true });
  };

  return (
    <>
      <AppBar
        lang={lang}
        setLang={setLang}
        isAuthenticated={isUserAuth}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />

      <Routes>
        {/* публічні сторінки */}
        <Route path="/" element={<HeroSection lang={lang} />} />
        <Route path="/calculator" element={<Calculator lang={lang} />} />
        <Route path="/renovation" element={<RenovationCalculator lang={lang} />} />
        <Route path="/window-cleaning" element={<WindowCleaningCalculator lang={lang} />} />
        <Route path="/private-house" element={<PrivateHouseCleaning lang={lang} />} />
        <Route path="/office-cleaning" element={<OfficeCleaning lang={lang} />} />

        {/* адмін‑панель відкривається завжди, далі власний логін */}
        <Route path="/admin" element={<AdminPanel lang={lang} />} />

        {/* SMS‑авторизація клієнта */}
        <Route
          path="/login"
          element={
            !isUserAuth ? (
              <Login lang={lang} handleLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isUserAuth ? (
              <Dashboard lang={lang} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* catch‑all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
