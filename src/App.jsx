import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import AppBar from "./components/AppBar/AppBar";
import HomePage from "./components/HomePage";
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
  const [lang, setLang] = useState(localStorage.getItem("lang") || "pl");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const isUserAuth = !!userToken;

  const location = useLocation();
  const hideAppBarAndFooter = location.pathname === "/dashboard";

  const handleLogin = (token, phone) => {
    localStorage.setItem("token", token);
    if (phone) localStorage.setItem("phone", phone);
    setUserToken(token);
  };

  const handleLogout = () => {
    console.log("App: Logging out..."); // Дебаг
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    setUserToken(null);
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
  };

  return (
    <>
      {!hideAppBarAndFooter && (
        <AppBar
          lang={lang}
          setLang={handleLanguageChange}
          isAuthenticated={isUserAuth}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage lang={lang} />} />
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
        <Route path="/quick-order" element={<QuickOrder lang={lang} />} />
        <Route path="/admin/*" element={<AdminPanel lang={lang} />} />
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
              <Dashboard lang={lang} handleLogout={handleLogout} /> // Передаємо handleLogout
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideAppBarAndFooter && (
        <CookieBanner
          lang={lang}
          onAcceptAll={() => localStorage.setItem("cookiesAccepted", "true")}
          onAcceptSelection={(selection) => {
            localStorage.setItem("cookiesAccepted", "true");
            localStorage.setItem("cookieSelection", JSON.stringify(selection));
          }}
          onDecline={() => localStorage.setItem("cookiesAccepted", "false")}
        />
      )}

      {!hideAppBarAndFooter && <Footer lang={lang} />}
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