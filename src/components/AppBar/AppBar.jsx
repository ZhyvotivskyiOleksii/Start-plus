import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaGlobe,
  FaTelegram,
  FaViber,
  FaFacebookMessenger,
} from "react-icons/fa";
import css from "./AppBar.module.css";
import Logo from "../Logo/Logo";
import BarMenu from "../BarMenu/BarMenu";
import plFlag from "../../assets/flags/pl.png";
import uaFlag from "../../assets/flags/ua.png";
import ruFlag from "../../assets/flags/ru.png";
import gbFlag from "../../assets/flags/gb.png";
import i18n from "../../i18n/i18n"; 

const languages = { pl: "PL", uk: "UA", ru: "RU", en: "EN" };
const flags = { pl: plFlag, uk: uaFlag, ru: ruFlag, en: gbFlag };

export default function AppBar({ lang, setLang, isAuthenticated, handleLogin, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setMobileOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getFlagPath = (langKey) => flags[langKey];

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageChange = (key) => {
    i18n.changeLanguage(key); 
    setLang(key);
    setDropdownOpen(false);
  };

  const handleMobileLanguageChange = (key) => {
    i18n.changeLanguage(key); 
    setLang(key);
    toggleMobileMenu();
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  const loginButtonText = {
    en: "Login",
    pl: "Zaloguj się",
    uk: "Увійти",
    ru: "Войти",
  };

  const dashboardButtonText = {
    en: "Dashboard",
    pl: "Konto",
    uk: "Особистий кабінет",
    ru: "Личный кабинет",
  };

  const loginText = loginButtonText[lang] || loginButtonText.pl;
  const dashboardText = dashboardButtonText[lang] || dashboardButtonText.pl;

  return (
    <>
      <header className={css.header}>
        <Logo />
        <div className={css.desktopMenu}>
          <BarMenu
            lang={lang}
            isAuthenticated={isAuthenticated}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            closeMobileMenu={toggleMobileMenu}
            isOpen={true}
          />
        </div>
        <div className={css["header-right"]}>
          <div className={css.desktopLang}>
            <div className={css.langBox} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaGlobe className={css.icon} />
              <img src={getFlagPath(lang)} alt={`${lang} flag`} className={css.flagIcon} />
              <span>{languages[lang]}</span>
            </div>
            {dropdownOpen && (
              <ul className={css.dropdown}>
                {Object.keys(languages).map((key) => (
                  <li key={key} onClick={() => handleLanguageChange(key)}>
                    <img src={getFlagPath(key)} alt={`${key} flag`} className={css.flagIcon} />
                    {languages[key]}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!isMobile && (
            <div className={css["user-action"]} onClick={handleUserClick}>
              <button className={css["login-button"]}>
                <img
                  src={isAuthenticated ? "/icon/account.svg" : "/icon/login.svg"}
                  alt={isAuthenticated ? "Dashboard" : "Login"}
                  className={css["login-icon"]}
                />
                {isAuthenticated ? dashboardText : loginText}
              </button>
            </div>
          )}
        </div>
        {isMobile && !mobileOpen && (
          <button className={css.burger} onClick={toggleMobileMenu}>
            <FaBars />
          </button>
        )}
      </header>

      {isMobile && (
        <div className={`${css.mobileMenu} ${mobileOpen ? css.show : ""}`}>
          <button className={css.burger} onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
          <Logo />
          <div className={css.mobileMenuContent}>
            <BarMenu
              lang={lang}
              isAuthenticated={isAuthenticated}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              closeMobileMenu={toggleMobileMenu}
              isOpen={mobileOpen}
            />
          </div>
          <div className={css["user-action-mobile"]} onClick={handleUserClick}>
            <button className={css["login-button"]}>
              <img
                src={isAuthenticated ? "/icon/account.svg" : "/icon/login.svg"}
                alt={isAuthenticated ? "Dashboard" : "Login"}
                className={css["login-icon"]}
              />
              {isAuthenticated ? dashboardText : loginText}
            </button>
          </div>
          <div className={css.socials}>
            <a href="#" target="_blank" rel="noreferrer">
              <FaTelegram />
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <FaViber />
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <FaFacebookMessenger />
            </a>
          </div>
          <div className={css.mobileLang}>
            <div className={css.langHeader}>
              <FaGlobe className={css.icon} />
              <span>Language</span>
            </div>
            <div className={css.langRow}>
              {Object.keys(languages).map((key) => (
                <span
                  key={key}
                  onClick={() => handleMobileLanguageChange(key)}
                  className={lang === key ? css.active : ""}
                >
                  <img src={getFlagPath(key)} alt={`${key} flag`} className={css.flagIcon} />
                  {languages[key]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
