import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AppBar from "./components/AppBar/AppBar";
import HeroSection from "./components/HeroSection/HeroSection";
import Calculator from "./components/Calculator/Calculator";
import RenovationCalculator from "./components/RenovationCalculator/RenovationCalculator";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login/Login";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "pl");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token, phone) => {
    localStorage.setItem("token", token);
    if (phone) localStorage.setItem("phone", phone);
    setIsAuthenticated(true);
    console.log("Login successful, token and phone saved:", { token, phone });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    setIsAuthenticated(false);
    console.log("Logout successful");
  };

  return (
    <Router>
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
          path="/admin"
          element={isAuthenticated ? <AdminPanel lang={lang} /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login lang={lang} handleLogin={handleLogin} />
            ) : (
              <Navigate to="/" /> 
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard lang={lang} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}