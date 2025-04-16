import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import css from "./BarMenu.module.css";

export default function BarMenu({
  lang,
  isAuthenticated,
  handleLogin,
  handleLogout,
  closeMobileMenu,
  isOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userPhone, setUserPhone] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const welcomeText = {
    en: "Welcome",
    pl: "Witaj",
    uk: "Вітаємо",
    ru: "Добро пожаловать",
  };

  const items = menuItems[lang] || menuItems.pl;
  const welcome = welcomeText[lang] || welcomeText.pl;

  const handleMenuClick = (itemName) => {
    const standardNames = {
      en: "Standard",
      pl: "Zwykłe",
      uk: "Звичайне",
      ru: "Обычное",
    };
    const renovationNames = {
      en: "Renovation",
      pl: "Remont",
      uk: "Ремонт",
      ru: "Ремонт",
    };
    const windowCleaningNames = {
      en: "Window Cleaning",
      pl: "Mycie okien",
      uk: "Миття вікон",
      ru: "Мойка окон",
    };

    if (itemName === standardNames[lang]) {
      navigate("/calculator");
    } else if (itemName === renovationNames[lang]) {
      navigate("/renovation");
    } else if (itemName === windowCleaningNames[lang]) {
      navigate("/window-cleaning");
    }
    // Закрываем мобильное меню, если оно открыто
    if (closeMobileMenu && isMobile) closeMobileMenu();
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
    if (closeMobileMenu && isMobile) closeMobileMenu();
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
        <div className={css["user-action"]} onClick={handleUserClick}>
          {isAuthenticated && !isMobile ? (
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
              {lang === "en" && "Login"}
              {lang === "pl" && "Zaloguj się"}
              {lang === "uk" && "Увійти"}
              {lang === "ru" && "Войти"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}