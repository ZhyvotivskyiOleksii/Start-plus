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
      { name: "Standard", mobileName: "Standard Clean", icon: "/icon/cleaning.png", image: "/images/bear1.png", tag: "Popularne" },
      { name: "Renovation", mobileName: "Post-Reno Clean", icon: "/icon/paint.png", image: "/images/bear2.png", tag: "Popularne" },
      { name: "Window Cleaning", mobileName: "Window Wash", icon: "/icon/window.png", image: "/images/bear3.png", tag: "Popularne" },
      { name: "Private House", mobileName: "House Clean", icon: "/icon/house.png", image: "/images/bear4.png", tag: "Nowe" },
      { name: "Office Cleaning", mobileName: "Office Clean", icon: "/icon/office.png", image: "/images/bear5.png", tag: "Popularne" },
    ],
    pl: [
      { name: "Zwykłe", mobileName: "Zwykłe Sprzątanie", icon: "/icon/cleaning.png", image: "/images/bear1.png", tag: "Popularne" },
      { name: "Remont", mobileName: "Po Remoncie", icon: "/icon/paint.png", image: "/images/bear2.png", tag: "Popularne" },
      { name: "Mycie okien", mobileName: "Mycie Okien", icon: "/icon/window.png", image: "/images/bear3.png", tag: "Popularne" },
      { name: "Dom prywatny", mobileName: "Dom Prywatny", icon: "/icon/house.png", image: "/images/bear4.png", tag: "Nowe" },
      { name: "Sprzątanie biur", mobileName: "Sprzątanie Biur", icon: "/icon/office.png", image: "/images/bear5.png", tag: "Popularne" },
    ],
    uk: [
      { name: "Звичайне", mobileName: "Звичайне Прибирання", icon: "/icon/cleaning.png", image: "/images/bear1.png", tag: "Popularne" },
      { name: "Ремонт", mobileName: "Після Ремонту", icon: "/icon/paint.png", image: "/images/bear2.png", tag: "Popularne" },
      { name: "Миття вікон", mobileName: "Миття Вікон", icon: "/icon/window.png", image: "/images/bear3.png", tag: "Popularne" },
      { name: "Приватний будинок", mobileName: "Приватний Будинок", icon: "/icon/house.png", image: "/images/bear4.png", tag: "Nowe" },
      { name: "Прибирання офісів", mobileName: "Прибирання Офісів", icon: "/icon/office.png", image: "/images/bear5.png", tag: "Popularne" },
    ],
    ru: [
      { name: "Обычное", mobileName: "Обычная Уборка", icon: "/icon/cleaning.png", image: "/images/bear1.png", tag: "Popularne" },
      { name: "Ремонт", mobileName: "После Ремонта", icon: "/icon/paint.png", image: "/images/bear2.png", tag: "Popularne" },
      { name: "Мойка окон", mobileName: "Мойка Окон", icon: "/icon/window.png", image: "/images/bear3.png", tag: "Popularne" },
      { name: "Частный дом", mobileName: "Частный Дом", icon: "/icon/house.png", image: "/images/bear4.png", tag: "Nowe" },
      { name: "Уборка офисов", mobileName: "Уборка Офисов", icon: "/icon/office.png", image: "/images/bear5.png", tag: "Popularne" },
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
      en: ["Standard", "Standard Clean"],
      pl: ["Zwykłe", "Zwykłe Sprzątanie"],
      uk: ["Звичайне", "Звичайне Прибирання"],
      ru: ["Обычное", "Обычная Уборка"],
    };
    const renovationNames = {
      en: ["Renovation", "Post-Reno Clean"],
      pl: ["Remont", "Po Remoncie"],
      uk: ["Ремонт", "Після Ремонту"],
      ru: ["Ремонт", "После Ремонта"],
    };
    const windowCleaningNames = {
      en: ["Window Cleaning", "Window Wash"],
      pl: ["Mycie okien", "Mycie Okien"],
      uk: ["Миття вікон", "Миття Вікон"],
      ru: ["Мойка окон", "Мойка Окон"],
    };
    const privateHouseNames = {
      en: ["Private House", "House Clean"],
      pl: ["Dom prywatny", "Dom Prywatny"],
      uk: ["Приватний будинок", "Приватний Будинок"],
      ru: ["Частный дом", "Частный Дом"],
    };
    const officeCleaningNames = {
      en: ["Office Cleaning", "Office Clean"],
      pl: ["Sprzątanie biur", "Sprzątanie Biur"],
      uk: ["Прибирання офісів", "Прибирання Офісів"],
      ru: ["Уборка офисов", "Уборка Офисов"],
    };

    const nameToCheck = isMobile ? items.find(item => item.mobileName === itemName)?.mobileName : itemName;

    if (nameToCheck === (isMobile ? standardNames[lang][1] : standardNames[lang][0])) {
      navigate("/calculator");
    } else if (nameToCheck === (isMobile ? renovationNames[lang][1] : renovationNames[lang][0])) {
      navigate("/renovation");
    } else if (nameToCheck === (isMobile ? windowCleaningNames[lang][1] : windowCleaningNames[lang][0])) {
      navigate("/window-cleaning");
    } else if (nameToCheck === (isMobile ? privateHouseNames[lang][1] : privateHouseNames[lang][0])) {
      navigate("/private-house");
    } else if (nameToCheck === (isMobile ? officeCleaningNames[lang][1] : officeCleaningNames[lang][0])) {
      navigate("/office-cleaning");
    }
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
        {isMobile ? (
          <div className={css.cardGrid}>
            {items.map((item, index) => (
              <div
                key={index}
                className={css.card}
                onClick={() => handleMenuClick(item.mobileName)}
                style={{ transitionDelay: `${0.05 * index}s` }}
              >
                <span className={`${css.tag} ${item.tag === "Nowe" ? css.tagNew : css.tagPopular}`}>
                  {item.tag}
                </span>
                <div className={css.cardContent}>
                  <h3 className={css.cardTitle}>{item.mobileName}</h3>
                  <div className={css.imageWrapper}>
                    <img src={item.image} alt={item.mobileName} className={css.cardImage} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
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