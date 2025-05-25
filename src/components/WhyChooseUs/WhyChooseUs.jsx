"use client";

import React, { useState, useEffect } from "react";
import css from "./WhyChooseUs.module.css";

// Імпорт кастомних SVG-іконок (заміни на свої файли)
import QualityIcon from "/icon/QualityIcon.png";
import SpeedIcon from "/icon/SpeedIcon.png";
import EcoIcon from "/icon/EcoIcon.png";
import AffordabilityIcon from "/icon/AffordabilityIcon.png";

const translations = {
  pl: {
    heading: "Dlaczego wybierają nas?",
    headingPart1: "Dlaczego wybierają",
    headingPart2: "nas?",
    subheading: "Sprzątanie łatwe, szybkie i wysokiej jakości!",
    advantages: [
      {
        title: "Jakość",
        description: "Sprzątanie z gwarancją.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
        backgroundClass: "cardBackground0",
      },
      {
        title: "Szybkość",
        description: "Zlecenia realizujemy w krótkim czasie.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
        backgroundClass: "cardBackground1",
      },
      {
        title: "Ekologia",
        description: "Środki bezpieczne dla domu i natury.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
        backgroundClass: "cardBackground2",
      },
      {
        title: "Dostępność",
        description: "Ceny odpowiednie dla każdego klienta.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
        backgroundClass: "cardBackground3",
      },
    ],
  },
  uk: {
    heading: "Чому обирають нас?",
    headingPart1: "Чому обирають",
    headingPart2: "нас?",
    subheading: "Прибирання просте, швидке та якісне!",
    advantages: [
      {
        title: "Якість",
        description: "Прибирання з гарантією якості завжди.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
        backgroundClass: "cardBackground0",
      },
      {
        title: "Швидкість",
        description: "Виконуємо замовлення швидко та чітко.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
        backgroundClass: "cardBackground1",
      },
      {
        title: "Екологічність",
        description: "Засоби безпечні для дому та природи.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
        backgroundClass: "cardBackground2",
      },
      {
        title: "Доступність",
        description: "Ціни, що підходять кожному замовнику.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
        backgroundClass: "cardBackground3",
      },
    ],
  },
  ru: {
    heading: "Почему выбирают нас?",
    headingPart1: "Почему выбирают",
    headingPart2: "нас?",
    subheading: "Уборка простая, быстрая и качественная!",
    advantages: [
      {
        title: "Качество",
        description: "Уборка с гарантией качества и чистоты.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
        backgroundClass: "cardBackground0",
      },
      {
        title: "Скорость",
        description: "Выполняем заказы быстро и без задержек.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
        backgroundClass: "cardBackground1",
      },
      {
        title: "Экологичность",
        description: "Средства безопасны для дома и природы.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
        backgroundClass: "cardBackground2",
      },
      {
        title: "Доступность",
        description: "Цены, подходящие каждому нашему клиенту.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
        backgroundClass: "cardBackground3",
      },
    ],
  },
  en: {
    heading: "Why Choose Us?",
    headingPart1: "Why Choose",
    headingPart2: "Us?",
    subheading: "Cleaning made simple, fast, and high-quality!",
    advantages: [
      {
        title: "Quality",
        description: "Cleaning with a guarantee of excellence.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
        backgroundClass: "cardBackground0",
      },
      {
        title: "Speed",
        description: "We finish orders fast and on schedule.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
        backgroundClass: "cardBackground1",
      },
      {
        title: "Eco-Friendly",
        description: "Safe cleaning products for your home.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
        backgroundClass: "cardBackground2",
      },
      {
        title: "Affordability",
        description: "Prices that suit every client’s budget.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
        backgroundClass: "cardBackground3",
      },
    ],
  },
};

export default function WhyChooseUs({ lang = "pl" }) {
  const {
    headingPart1,
    headingPart2,
    subheading,
    advantages,
  } = translations[lang] || translations.pl;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={css.whyChooseUs}>
      <div className={css.content}>
        <h2 className={`${css.heading} ${isVisible ? css.fadeIn : ""}`}>
          {headingPart1}{' '}
          <span className={css.highlightedWrapper}>{headingPart2}</span>
        </h2>
        <p className={`${css.subheading} ${isVisible ? css.fadeIn : ""}`}>
          {subheading}
        </p>
        <div className={css.advantages}>
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`${css.advantageCard} ${css[advantage.backgroundClass]} ${css[`cardStyle${index}`]} ${isVisible ? css.fadeIn : ""}`}
              style={{
                transitionDelay: `${index * 0.2}s`,
              }}
            >
              <div className={css.backgroundIcon}></div> {/* Додаємо елемент для фонової іконки */}
              <div
                className={`${css.icon} ${isVisible ? css.iconAnimate : ""}`}
                style={{ color: advantage.iconColor }}
              >
                {advantage.icon}
              </div>
              <h3 className={css.advantageTitle}>{advantage.title}</h3>
              <p className={css.advantageDescription}>{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}