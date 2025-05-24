"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "./HeroSection.module.css";

const translations = {
  pl: {
    heading: "Odkryj perfekcyjną czystość, którą pokochasz!",
    quickOrderTitle: "Szybkie zamówienie sprzątania",
    quickOrderCategoryLabel: "Kategoria sprzątania:",
    quickOrderCategoryStandard: "Standardowe",
    quickOrderCategoryGeneral: "Generalne",
    quickOrderSubmit: "Zamów",
  },
  uk: {
    heading: "Відкрийте ідеальну чистоту, яку ви полюбите!",
    quickOrderTitle: "Швидке замовлення прибирання",
    quickOrderCategoryLabel: "Категорія прибирання:",
    quickOrderCategoryStandard: "Стандартне",
    quickOrderCategoryGeneral: "Генеральне",
    quickOrderSubmit: "Замовити",
  },
  ru: {
    heading: "Откройте идеальную чистоту, которую вы полюбите!",
    quickOrderTitle: "Быстрый заказ уборки",
    quickOrderCategoryLabel: "Категория уборки:",
    quickOrderCategoryStandard: "Стандартная",
    quickOrderCategoryGeneral: "Генеральная",
    quickOrderSubmit: "Заказать",
  },
  en: {
    heading: "Discover a Perfect Clean You'll Love!",
    quickOrderTitle: "Quick Order for Cleaning",
    quickOrderCategoryLabel: "Cleaning Category:",
    quickOrderCategoryStandard: "Standard",
    quickOrderCategoryGeneral: "General",
    quickOrderSubmit: "Order",
  },
};

export default function HeroSection({ lang = "pl" }) {
  const {
    heading,
    quickOrderTitle,
    quickOrderCategoryLabel,
    quickOrderCategoryStandard,
    quickOrderCategoryGeneral,
    quickOrderSubmit,
  } = translations[lang] || translations.pl;
  const navigate = useNavigate();

  const [category, setCategory] = useState("standard"); // Початкова категорія — стандартна
  const [showDropdown, setShowDropdown] = useState(false); // Стан для відображення випадаючого меню

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setShowDropdown(false);
  };

  const handleQuickOrderRedirect = () => {
    // Перенаправляємо на сторінку швидкого калькулятора, передаючи категорію
    navigate(`/quick-order?category=${category}`);
  };

  return (
    <section className={css.hero}>
      <div className={css.heroContent}>
        <div className={css.textBlock}>
          <h1>{heading}</h1>

          <div className={css.quickOrder}>
            <h3>{quickOrderTitle}</h3>
            <div className={css.orderField}>
              <label>{quickOrderCategoryLabel}</label>
              <div
                className={css["category-select"]}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>
                  {category === "standard"
                    ? quickOrderCategoryStandard
                    : quickOrderCategoryGeneral}
                </span>
                <span>▼</span>
                {showDropdown && (
                  <div className={css["category-dropdown"]}>
                    <div
                      className={`${css["category-option"]} ${
                        category === "standard" ? css.selected : ""
                      }`}
                      onClick={() => handleCategoryChange("standard")}
                    >
                      {quickOrderCategoryStandard}
                    </div>
                    <div
                      className={`${css["category-option"]} ${
                        category === "general" ? css.selected : ""
                      }`}
                      onClick={() => handleCategoryChange("general")}
                    >
                      {quickOrderCategoryGeneral}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              className={css.submitButton}
              onClick={handleQuickOrderRedirect}
            >
              {quickOrderSubmit}
            </button>
          </div>
        </div>
        <div className={css.imageBlock}>
          <img src="/hero/hero-bg1.png" alt="Hero" className={css.heroImage} />
        </div>
      </div>
    </section>
  );
}