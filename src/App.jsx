import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AppBar from "./components/AppBar/AppBar";
import HeroSection from "./components/HeroSection/HeroSection";
import Calculator from "./components/Calculator/Calculator";
import RenovationCalculator from "./components/RenovationCalculator/RenovationCalculator";
import WindowCleaningCalculator from "./components/WindowCleaningCalculator/WindowCleaningCalculator";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login/Login";
import Dashboard from "./components/dashboard/Dashboard";

function AppContent() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "pl");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Тест: Перевірка токена при завантаженні:", token);
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token, phone) => {
    localStorage.setItem("token", token);
    if (phone) localStorage.setItem("phone", phone);
    setIsAuthenticated(true);
    console.log("Тест: Успішний вхід, token і phone збережені:", { token, phone });
    console.log("Тест: Перенаправлення на /dashboard після входу");
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    setIsAuthenticated(false);
    console.log("Тест: Успішний вихід");
    navigate("/", { replace: true });
  };

  return (
    <div>
      <AppBar
        lang={lang}
        setLang={setLang}
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<HeroSection lang={lang} />} />
        <Route path="/calculator" element={<Calculator lang={lang} />} />
        <Route path="/renovation" element={<RenovationCalculator lang={lang} />} />
        <Route
          path="/window-cleaning"
          element={<WindowCleaningCalculator lang={lang} />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPanel lang={lang} /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login lang={lang} handleLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard lang={lang} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}