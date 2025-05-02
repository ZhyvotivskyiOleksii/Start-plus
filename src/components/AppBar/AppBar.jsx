import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaGlobe, FaTelegram, FaViber, FaFacebookMessenger } from "react-icons/fa";
import css from "./AppBar.module.css";
import Logo from "../Logo/Logo";
import BarMenu from "../BarMenu/BarMenu";
import plFlag from "../../assets/flags/pl.png";
import uaFlag from "../../assets/flags/ua.png";
import ruFlag from "../../assets/flags/ru.png";
import gbFlag from "../../assets/flags/gb.png";

const languages = { pl: "PL", uk: "UA", ru: "RU", en: "EN" };
const flags = { pl: plFlag, uk: uaFlag, ru: ruFlag, en: gbFlag };

export default function AppBar({ lang, setLang, isAuthenticated, handleLogin, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userPhone, setUserPhone] = useState("");
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

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    if (isAuthenticated && storedPhone) {
      setUserPhone(storedPhone);
    } else {
      setUserPhone("");
    }
  }, [isAuthenticated]);

  const getFlagPath = (langKey) => flags[langKey];

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageChange = (key) => {
    setLang(key);
    setDropdownOpen(false);
  };

  const handleMobileLanguageChange = (key) => {
    setLang(key);
    toggleMobileMenu();
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      if (location.pathname === "/dashboard") {
        document.querySelector(`.${css.dashboard}`)?.classList.add(css["dashboard-exit"]);
        setTimeout(() => {
          navigate("/");
        }, 300);
      } else {
        navigate("/dashboard");
      }
    }
  };

  const welcomeText = {
    en: "Welcome",
    pl: "Witaj",
    uk: "Вітаємо",
    ru: "Добро пожаловать",
  };

  const welcome = welcomeText[lang] || welcomeText.pl;

  const loginButtonText = {
    en: "Login",
    pl: "Zaloguj się",
    uk: "Увійти",
    ru: "Войти",
  };

  const loginText = loginButtonText[lang] || loginButtonText.pl;

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
          {/* Добавляем кнопку логина или профиль на десктопе */}
          {!isMobile && (
            <div className={css["user-action"]} onClick={handleUserClick}>
              {isAuthenticated ? (
                <div className={css["user-info"]}>
                  <img src="/icon/account.svg" alt="User" className={css["login-icon"]} />
                  <div className={css["user-info-text"]}>
                    <span className={css["welcome-text"]}>{welcome}</span>
                    <span className={css["user-phone"]}>{userPhone}</span>
                  </div>
                </div>
              ) : (
                <button className={css["login-button"]}>
                  <img src="/icon/login.svg" alt="Login" className={css["login-icon"]} />
                  {loginText}
                </button>
              )}
            </div>
          )}
        </div>
        {/* На мобильных показываем бургер-меню вместо user-info */}
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
          {/* Добавляем кнопку логина или профиль в мобильном меню */}
          <div className={css["user-action-mobile"]} onClick={handleUserClick}>
            {isAuthenticated ? (
              <div className={css["user-info"]}>
                <img src="/icon/account.svg" alt="User" className={css["login-icon"]} />
                <div className={css["user-info-text"]}>
                  <span className={css["welcome-text"]}>{welcome}</span>
                  <span className={css["user-phone"]}>{userPhone}</span>
                </div>
              </div>
            ) : (
              <button className={css["login-button"]}>
                <img src="/icon/login.svg" alt="Login" className={css["login-icon"]} />
                {loginText}
              </button>
            )}
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