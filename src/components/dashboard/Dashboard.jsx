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
      pl: "Program Polecen",
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
        { name: "Standard", icon: "/serwices/1.svg" },
        { name: "Renovation", icon: "/serwices/2.svg" },
        { name: "Window Cleaning", icon: "/serwices/3.svg" },
        { name: "Private House", icon: "/serwices/4.svg" },
        { name: "Office Cleaning", icon: "/serwices/5.svg" },
      ],
      pl: [
        { name: "Zwykłe Sprzątanie", icon: "/serwices/1.svg" },
        { name: "Po Remontowe Sprzątanie", icon: "/serwices/2.svg" },
        { name: "Mycie Okien", icon: "/serwices/3.svg" },
        { name: "Budynek Prywatny", icon: "/serwices/4.svg" },
        { name: "Sprzątanie Biur", icon: "/serwices/5.svg" },
      ],
      uk: [
        { name: "Звичайне", icon: "/serwices/1.svg" },
        { name: "Ремонт", icon: "/serwices/2.svg" },
        { name: "Миття вікон", icon: "/serwices/3.svg" },
        { name: "Приватний будинок", icon: "/serwices/4.svg" },
        { name: "Прибирання офісів", icon: "/serwices/5.svg" },
      ],
      ru: [
        { name: "Обычное", icon: "/serwices/1.svg" },
        { name: "Ремонт", icon: "/serwices/2.svg" },
        { name: "Мойка окон", icon: "/serwices/3.svg" },
        { name: "Частный дом", icon: "/serwices/4.svg" },
        { name: "Уборка офисов", icon: "/serwices/5.svg" },
      ],
    },
    badge: {
      popular: {
        en: "Popular",
        pl: "Popularne",
        uk: "Популярне",
        ru: "Популярное",
      },
      new: {
        en: "New",
        pl: "Nowe",
        uk: "Нове",
        ru: "Новое",
      },
    },
  };

  const t = {
    myAccount: translations.myAccount[lang] || translations.myAccount.pl,
    myOrders: translations.myOrders[lang] || translations.myOrders.pl,
    loyaltyProgram: translations.loyaltyProgram[lang] || translations.loyaltyProgram.pl,
    editAccount: translations.editAccount[lang] || translations.editAccount.pl,
    logout: translations.logout[lang] || translations.logout.pl,
    services: translations.services[lang] || translations.services.pl,
    badge: {
      popular: translations.badge.popular[lang] || translations.badge.popular.pl,
      new: translations.badge.new[lang] || translations.badge.new.pl,
    },
  };

  const handleLogoutClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (window.innerWidth <= 768) {
        setCurrentIndex((prev) => (prev + 1) % t.services.length);
      }
    },
    onSwipedRight: () => {
      if (window.innerWidth <= 768) {
        setCurrentIndex((prev) => (prev - 1 + t.services.length) % t.services.length);
      }
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  const handleMenuClick = (itemName) => {
    const standardNames = {
      en: "Standard",
      pl: "Zwykłe Sprzątanie",
      uk: "Звичайне",
      ru: "Обычное",
    };
    const renovationNames = {
      en: "Renovation",
      pl: "Po Remontowe Sprzątanie",
      uk: "Ремонт",
      ru: "Ремонт",
    };
    if (itemName === standardNames[lang]) {
      navigate("/calculator");
    } else if (itemName === renovationNames[lang]) {
      navigate("/renovation");
    }
  };

  const getBadgeType = (serviceName) => {
    const popularServices = ["Zwykłe Sprzątanie", "Mycie Okien", "Standard", "Window Cleaning", "Звичайне", "Миття вікон", "Обычное", "Мойка окон", "Sprzątanie Biur", "Уборка офисов", "Прибирання офісів", "Office Cleaning"];
    const newServices = ["Po Remontowe Sprzątanie", "Renovation", "Ремонт"];
    if (popularServices.includes(serviceName)) return "popular";
    if (newServices.includes(serviceName)) return "new";
    return null;
  };

  return (
    <div className={`${css.dashboard} ${isExiting ? css["dashboard-exit"] : ""}`}>
      <div className={css.header}>
        <div className={css.navButtons}>
          <button onClick={() => navigate("/dashboard")} className={css.navButton} title={t.myAccount}>
            <FaUser className={css.navIcon} />
            <span>{t.myAccount}</span>
          </button>
          <button onClick={() => navigate("/orders")} className={css.navButton} title={t.myOrders}>
            <FaList className={css.navIcon} />
            <span>{t.myOrders}</span>
          </button>
          <button onClick={() => navigate("/loyalty")} className={css.navButton} title={t.loyaltyProgram}>
            <FaGift className={css.navIcon} />
            <span>{t.loyaltyProgram}</span>
          </button>
          <button onClick={() => navigate("/edit-account")} className={css.navButton} title={t.editAccount}>
            <FaEdit className={css.navIcon} />
            <span>{t.editAccount}</span>
          </button>
          <button onClick={handleLogoutClick} className={`${css.navButton} ${css.logoutButton}`} title={t.logout}>
            <FaSignOutAlt className={css.navIcon} />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
      <div className={css.servicesSection}>
        <div className={css.cardsContainer} {...swipeHandlers}>
          <div className={css.cardsWrapper} ref={cardsWrapperRef} style={{ transform: window.innerWidth <= 768 ? `translateX(-${currentIndex * 90}%)` : "none" }}>
            {t.services.map((item, index) => {
              const badgeType = getBadgeType(item.name);
              const formattedTitle = item.name.split(" ").join("\n");
              return (
                <div key={index} className={css.card}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick(item.name); }} className={css.menuItem}>
                    {badgeType && (
                      <span className={`${css.badge} ${badgeType === "new" ? css.newBadge : css.popularBadge}`}>
                        {t.badge[badgeType]}
                      </span>
                    )}
                    <span className={css.serviceTitle} data-text={formattedTitle}></span>
                    <div className={css.menuIconWrapper}>
                      <img src={item.icon} alt={item.name} className={css.menuIcon} />
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
          {window.innerWidth <= 768 && (
            <div className={css.dots}>
              {t.services.map((_, idx) => (
                <span key={idx} className={`${css.dot} ${currentIndex === idx ? css.activeDot : ""}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
