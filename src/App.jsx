import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AppBar from "./components/AppBar/AppBar";
import HeroSection from "./components/HeroSection/HeroSection";
import Calculator from "./components/Calculator/Calculator";
import RenovationCalculator from "./components/RenovationCalculator/RenovationCalculator";
import WindowCleaningCalculator from "./components/WindowCleaningCalculator/WindowCleaningCalculator";
import PrivateHouseCleaning from "./components/PrivateHouseCleaning/PrivateHouseCleaning";
import OfficeCleaning from "./components/OfficeCleaning/OfficeCleaning";
import AdminPanel from "./components/Admin/AdminPanel";
import Login from "./components/Login/Login";
import Dashboard from "./components/dashboard/Dashboard";

function AppContent() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "pl");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const isUserAuth = !!userToken;

  const navigate = useNavigate();
  const location = useLocation();
  const hideAppBar = location.pathname.startsWith("/admin");

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
      {!hideAppBar && (
        <AppBar
          lang={lang}
          setLang={setLang}
          isAuthenticated={isUserAuth}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      )}

      <Routes>
        {/* публічні сторінки */}
        <Route path="/" element={<HeroSection lang={lang} />} />
        <Route
          path="/calculator"
          element={<Calculator lang={lang} type="regular" title="Zwykłe sprzątanie" />}
        />
        <Route
          path="/renovation"
          element={<RenovationCalculator lang={lang} type="post-renovation" title="Mieszkanie po remoncie" />}
        />
        <Route
          path="/window-cleaning"
          element={<WindowCleaningCalculator lang={lang} type="window-cleaning" title="Mycie okien" />}
        />
        <Route
          path="/private-house"
          element={<PrivateHouseCleaning lang={lang} type="private-house" title="Sprzątanie domu prywatnego" />}
        />
        <Route
          path="/office-cleaning"
          element={<OfficeCleaning lang={lang} type="office-cleaning" title="Sprzątanie biura" />}
        />

        {/* адмін‑панель */}
        <Route path="/admin/*" element={<AdminPanel lang={lang} />} />

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