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
    subheading: "Sprzątanie łatwe, szybkie i wysokiej якості!",
    advantages: [
      {
        title: "Jakość",
        description: "Profesjonalne sprzątanie z gwarancją czystości.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
      },
      {
        title: "Szybkość",
        description: "Realizujemy zamówienia w najkrótszym czasie.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
      },
      {
        title: "Ekologia",
        description: "Używamy bezpiecznych środków do sprzątania.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
      },
      {
        title: "Dostępność",
        description: "Ceny, które pasują każdemu.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
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
        description: "Професійне прибирання з гарантією чистоти.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
      },
      {
        title: "Швидкість",
        description: "Виконуємо замовлення у найкоротші терміни.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
      },
      {
        title: "Екологічність",
        description: "Використовуємо безпечні засоби для прибирання.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
      },
      {
        title: "Доступність",
        description: "Ціни, які підходять кожному.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
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
        description: "Профессиональная уборка с гарантией чистоты.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
      },
      {
        title: "Скорость",
        description: "Выполняем заказы в кратчайшие сроки.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
      },
      {
        title: "Экологичность",
        description: "Используем безопасные средства для уборки.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
      },
      {
        title: "Доступность",
        description: "Цены, которые подходят каждому.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
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
        description: "Professional cleaning with a guarantee of cleanliness.",
        icon: <img src={QualityIcon} alt="Quality Icon" className={css.iconImage} />,
        iconColor: "#a78bfa",
      },
      {
        title: "Speed",
        description: "We complete orders in the shortest time.",
        icon: <img src={SpeedIcon} alt="Speed Icon" className={css.iconImage} />,
        iconColor: "#7c3aed",
      },
      {
        title: "Eco-Friendly",
        description: "We use safe cleaning products.",
        icon: <img src={EcoIcon} alt="Eco Icon" className={css.iconImage} />,
        iconColor: "#c084fc",
      },
      {
        title: "Affordability",
        description: "Prices that suit everyone.",
        icon: <img src={AffordabilityIcon} alt="Affordability Icon" className={css.iconImage} />,
        iconColor: "#e879f9",
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
              className={`${css.advantageCard} ${css[`cardStyle${index}`]} ${isVisible ? css.fadeIn : ""}`}
              style={{
                transitionDelay: `${index * 0.2}s`,
              }}
            >
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