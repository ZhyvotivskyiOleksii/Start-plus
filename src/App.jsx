import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AppBar from "./components/AppBar/AppBar";
import HomePage from "./components/HomePage"; // Додаємо новий компонент
import Calculator from "./components/Calculator/Calculator";
import RenovationCalculator from "./components/RenovationCalculator/RenovationCalculator";
import WindowCleaningCalculator from "./components/WindowCleaningCalculator/WindowCleaningCalculator";
import PrivateHouseCleaning from "./components/PrivateHouseCleaning/PrivateHouseCleaning";
import OfficeCleaning from "./components/OfficeCleaning/OfficeCleaning";
import AdminPanel from "./components/Admin/AdminPanel";
import Login from "./components/Login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import Footer from "./components/Footer/Footer";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage/PrivacyPolicyPage";
import TermsPage from "./components/TermsPage/TermsPage";
import QuickOrder from "./components/QuickOrder/QuickOrder";


function AppContent() {
  /* --------------------------------------------
     GLOBAL LANGUAGE STATE
  ---------------------------------------------*/
  const [lang, setLang] = useState(localStorage.getItem("lang") || "pl");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  /* --------------------------------------------
     AUTH STATE
  ---------------------------------------------*/
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const isUserAuth = !!userToken;

  const navigate = useNavigate();
  const location = useLocation();
  const hideAppBar = location.pathname.startsWith("/admin");

  /* --------------------------------------------
     HANDLERS
  ---------------------------------------------*/
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

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
  };

  /* --------------------------------------------
     RENDER
  ---------------------------------------------*/
  return (
    <>
      {/* Top navigation bar */}
      {!hideAppBar && (
        <AppBar
          lang={lang}
          setLang={handleLanguageChange}
          isAuthenticated={isUserAuth}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      )}

      {/* App routes */}
      <Routes>
        {/* public pages */}
        <Route path="/" element={<HomePage lang={lang} />} /> {/* Оновлено: використовуємо HomePage */}
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
        <Route path="/privacy-policy" element={<PrivacyPolicyPage lang={lang} />} />
        <Route path="/terms-of-service" element={<TermsPage lang={lang} />} />
        
        {/* Маршрут для швидкого замовлення */}
        <Route path="/quick-order" element={<QuickOrder lang={lang} />} />

        {/* admin panel */}
        <Route path="/admin/*" element={<AdminPanel lang={lang} />} />

        {/* SMS auth */}
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

      {/* Cookie consent banner present on all pages */}
      <CookieBanner
        lang={lang}
        onAcceptAll={() => localStorage.setItem("cookiesAccepted", "true")}
        onAcceptSelection={(selection) => {
          localStorage.setItem("cookiesAccepted", "true");
          localStorage.setItem("cookieSelection", JSON.stringify(selection));
        }}
        onDecline={() => localStorage.setItem("cookiesAccepted", "false")}
      />

      {/* Footer present on all pages */}
      {!hideAppBar && <Footer lang={lang} />}
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