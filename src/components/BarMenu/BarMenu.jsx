import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import css from "./BarMenu.module.css";

export default function BarMenu({ lang, isAuthenticated, handleLogin, handleLogout, closeMobileMenu, isOpen }) {
  const navigate = useNavigate();
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    if (isAuthenticated && storedPhone) {
      setUserPhone(storedPhone);
    } else {
      setUserPhone("");
    }
  }, [isAuthenticated]);

  const menuItems = {
    en: [
      { name: "Standard", icon: "/icon/cleaning.png" },
      { name: "Renovation", icon: "/icon/paint.png" },
      { name: "Window Cleaning", icon: "/icon/window.png" },
      { name: "Private House", icon: "/icon/house.png" },
      { name: "Office Cleaning", icon: "/icon/office.png" },
    ],
    pl: [
      { name: "Zwykłe", icon: "/icon/cleaning.png" },
      { name: "Remont", icon: "/icon/paint.png" },
      { name: "Mycie okien", icon: "/icon/window.png" },
      { name: "Dom prywatny", icon: "/icon/house.png" },
      { name: "Sprzątanie biur", icon: "/icon/office.png" },
    ],
    uk: [
      { name: "Звичайне", icon: "/icon/cleaning.png" },
      { name: "Ремонт", icon: "/icon/paint.png" },
      { name: "Миття вікон", icon: "/icon/window.png" },
      { name: "Приватний будинок", icon: "/icon/house.png" },
      { name: "Прибирання офісів", icon: "/icon/office.png" },
    ],
    ru: [
      { name: "Обычное", icon: "/icon/cleaning.png" },
      { name: "Ремонт", icon: "/icon/paint.png" },
      { name: "Мойка окон", icon: "/icon/window.png" },
      { name: "Частный дом", icon: "/icon/house.png" },
      { name: "Уборка офисов", icon: "/icon/office.png" },
    ],
  };

  const items = menuItems[lang] || menuItems.pl;

  const handleMenuClick = (itemName) => {
    const standardNames = { en: "Standard", pl: "Zwykłe", uk: "Звичайне", ru: "Обычное" };
    const renovationNames = { en: "Renovation", pl: "Remont", uk: "Ремонт", ru: "Ремонт" };
    if (itemName === standardNames[lang]) {
      navigate("/calculator");
      if (closeMobileMenu && !isOpen) closeMobileMenu();
    } else if (itemName === renovationNames[lang]) {
      navigate("/renovation");
      if (closeMobileMenu && !isOpen) closeMobileMenu();
    }
  };

  const handleLoginClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
    if (closeMobileMenu && !isOpen) closeMobileMenu();
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
    if (closeMobileMenu && !isOpen) closeMobileMenu();
  };

  return (
    <nav className={css.barMenu}>
      <div className={`${css["menu-container"]} ${isOpen ? css.open : css.close}`}>
        <ul>
          {items.map((item, index) => (
            <li key={index} style={{ transitionDelay: `${0.05 * index}s` }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(item.name);
                }}
              >
                <img src={item.icon} alt={item.name} className={css.menuIcon} />
                <span>{item.name}</span>
                <img src="/icon/broom.png" className={css.broom} alt="broom" />
              </a>
            </li>
          ))}
        </ul>
        {isAuthenticated ? (
          <div className={css["user-info"]}>
            <span className={css["user-phone"]}>
              {lang === "en" && "Welcome, "}
              {lang === "pl" && "Witaj, "}
              {lang === "uk" && "Вітаємо, "}
              {lang === "ru" && "Добро пожаловать, "}
              {userPhone}
            </span>
            <button onClick={handleLogoutClick} className={css["logout-button"]}>
              <img src="/icon/logout.svg" alt="Logout" className={css["logout-icon"]} />
              {lang === "en" && "Logout"}
              {lang === "pl" && "Wyloguj"}
              {lang === "uk" && "Вийти"}
              {lang === "ru" && "Выйти"}
            </button>
          </div>
        ) : (
          <button onClick={handleLoginClick} className={css["login-button"]}>
            <img src="/icon/login.svg" alt="Login" className={css["login-icon"]} />
            {lang === "en" && "Login"}
            {lang === "pl" && "Zaloguj się"}
            {lang === "uk" && "Увійти"}
            {lang === "ru" && "Войти"}
          </button>
        )}
      </div>
    </nav>
  );
}