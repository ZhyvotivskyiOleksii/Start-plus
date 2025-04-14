import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import css from "./Dashboard.module.css";
import { FaSignOutAlt, FaUser, FaList, FaGift, FaEdit } from "react-icons/fa";

export default function Dashboard({ lang, handleLogout }) {
  const [isExiting, setIsExiting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const cardsWrapperRef = useRef(null);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  const translations = {
    myAccount: {
      en: "My Account",
      pl: "Moje konto",
      uk: "Мій кабінет",
      ru: "Мой кабинет",
    },
    myOrders: {
      en: "My Orders",
      pl: "Moje zamówienia",
      uk: "Мої замовлення",
      ru: "Мои заказы",
    },
    loyaltyProgram: {
      en: "Loyalty Program",
      pl: "Program lojalnościowy",
      uk: "Програма лояльності",
      ru: "Программа лояльности",
    },
    editAccount: {
      en: "Edit Account",
      pl: "Edytuj konto",
      uk: "Редагувати кабінет",
      ru: "Редактировать кабинет",
    },
    logout: {
      en: "Logout",
      pl: "Wyloguj się",
      uk: "Вийти",
      ru: "Выйти",
    },
    services: {
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
    },
  };

  const t = {
    myAccount: translations.myAccount[lang] || translations.myAccount.pl,
    myOrders: translations.myOrders[lang] || translations.myOrders.pl,
    loyaltyProgram: translations.loyaltyProgram[lang] || translations.loyaltyProgram.pl,
    editAccount: translations.editAccount[lang] || translations.editAccount.pl,
    logout: translations.logout[lang] || translations.logout.pl,
    services: translations.services[lang] || translations.services.pl,
  };

  const handleLogoutClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentIndex((prev) => (prev + 1) % t.services.length);
    },
    onSwipedRight: () => {
      setCurrentIndex((prev) => (prev - 1 + t.services.length) % t.services.length);
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

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
    if (itemName === standardNames[lang]) {
      navigate("/calculator");
    } else if (itemName === renovationNames[lang]) {
      navigate("/renovation");
    }
  };

  return (
    <div className={`${css.dashboard} ${isExiting ? css["dashboard-exit"] : ""}`}>
      <div className={css.header}>
        <div className={css.navButtons}>
          <button
            onClick={() => navigate("/dashboard")}
            className={css.navButton}
            title={t.myAccount}
          >
            <FaUser className={css.navIcon} />
            <span>{t.myAccount}</span>
          </button>
          <button
            onClick={() => navigate("/orders")}
            className={css.navButton}
            title={t.myOrders}
          >
            <FaList className={css.navIcon} />
            <span>{t.myOrders}</span>
          </button>
          <button
            onClick={() => navigate("/loyalty")}
            className={css.navButton}
            title={t.loyaltyProgram}
          >
            <FaGift className={css.navIcon} />
            <span>{t.loyaltyProgram}</span>
          </button>
          <button
            onClick={() => navigate("/edit-account")}
            className={css.navButton}
            title={t.editAccount}
          >
            <FaEdit className={css.navIcon} />
            <span>{t.editAccount}</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className={css.navButton}
            title={t.logout}
          >
            <FaSignOutAlt className={css.navIcon} />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
      <div className={css.servicesSection}>
        <div className={css.cardsContainer} {...swipeHandlers}>
          <div
            className={css.cardsWrapper}
            ref={cardsWrapperRef}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {t.services.map((item, index) => (
              <div key={index} className={css.card}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.name);
                  }}
                  className={css.menuItem}
                >
                  <span className={css.serviceTitle}>{item.name}</span>
                  <img src={item.icon} alt={item.name} className={css.menuIcon} />
                  <img src="/icon/broom.png" className={css.broom} alt="broom" />
                </a>
              </div>
            ))}
          </div>
          <div className={css.dots}>
            {t.services.map((_, idx) => (
              <span
                key={idx}
                className={`${css.dot} ${currentIndex === idx ? css.activeDot : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}