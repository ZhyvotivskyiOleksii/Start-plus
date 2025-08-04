"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import css from "./BarMenu.module.css";

export default function BarMenu({
  isAuthenticated,
  handleLogin,
  handleLogout,
  closeMobileMenu,
  isOpen,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      name: t("barMenu.standardName"),
      mobileName: t("barMenu.standardMobileName"),
      icon: "/icon/cleaning-home.png",
      image: "/images/bear1.png",
      tag: "Popularne",
    },
    {
      name: t("barMenu.renovationName"),
      mobileName: t("barMenu.renovationMobileName"),
      icon: "/icon/paint.png",
      image: "/images/bear2.png",
      tag: "Popularne",
    },
    {
      name: t("barMenu.windowCleaningName"),
      mobileName: t("barMenu.windowCleaningMobileName"),
      icon: "/icon/window.png",
      image: "/images/bear3.png",
      tag: "Popularne",
    },
    {
      name: t("barMenu.privateHouseName"),
      mobileName: t("barMenu.privateHouseMobileName"),
      icon: "/icon/house.png",
      image: "/images/bear4.png",
      tag: "Nowe",
    },
    {
      name: t("barMenu.officeCleaningName"),
      mobileName: t("barMenu.officeCleaningMobileName"),
      icon: "/icon/office.png",
      image: "/images/bear5.png",
      tag: "Popularne",
    },
  ];

  const handleMenuClick = (itemName) => {
    const standardNames = [
      t("barMenu.standardName"),
      t("barMenu.standardMobileName"),
    ];
    const renovationNames = [
      t("barMenu.renovationName"),
      t("barMenu.renovationMobileName"),
    ];
    const windowCleaningNames = [
      t("barMenu.windowCleaningName"),
      t("barMenu.windowCleaningMobileName"),
    ];
    const privateHouseNames = [
      t("barMenu.privateHouseName"),
      t("barMenu.privateHouseMobileName"),
    ];
    const officeCleaningNames = [
      t("barMenu.officeCleaningName"),
      t("barMenu.officeCleaningMobileName"),
    ];

    const nameToCheck = isMobile
      ? menuItems.find((item) => item.mobileName === itemName)?.mobileName
      : itemName;

    if (nameToCheck === (isMobile ? standardNames[1] : standardNames[0])) {
      navigate("/calculator");
    } else if (nameToCheck === (isMobile ? renovationNames[1] : renovationNames[0])) {
      navigate("/renovation");
    } else if (nameToCheck === (isMobile ? windowCleaningNames[1] : windowCleaningNames[0])) {
      navigate("/window-cleaning");
    } else if (nameToCheck === (isMobile ? privateHouseNames[1] : privateHouseNames[0])) {
      navigate("/private-house");
    } else if (nameToCheck === (isMobile ? officeCleaningNames[1] : officeCleaningNames[0])) {
      navigate("/office-cleaning");
    }
    if (closeMobileMenu && isMobile) closeMobileMenu();
  };

  return (
    <nav className={css.barMenu}>
      <div className={`${css["menu-container"]} ${isOpen ? css.open : css.close}`}>
        {isMobile ? (
          <div className={css.cardGrid}>
            {menuItems.map((item, index) => (
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
            {menuItems.map((item, index) => (
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
      </div>
    </nav>
  );
}