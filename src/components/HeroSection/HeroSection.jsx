"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import css from "./HeroSection.module.css";
import { FaArrowRight } from "react-icons/fa";

const translations = {
  pl: {
    heading: "Odkryj perfekcyjną czystość, którą pokochasz!",
    subheading: "Zamów sprzątanie w kilka kliknięć!",
    quickOrderTitle: "Szybkie zamówienie sprzątania",
    quickOrderCategoryLabel: "Kategoria sprzątania:",
    quickOrderCategoryStandard: "Standardowe",
    quickOrderCategoryGeneral: "Generalne",
    quickOrderSubmit: "Zamów teraz",
  },
  uk: {
    heading: "Відкрийте ідеальну чистоту, яку ви полюбите!",
    subheading: "Замовте прибирання у кілька кліків!",
    quickOrderTitle: "Швидке замовлення прибирання",
    quickOrderCategoryLabel: "Категорія прибирання:",
    quickOrderCategoryStandard: "Стандартне",
    quickOrderCategoryGeneral: "Генеральне",
    quickOrderSubmit: "Замовити зараз",
  },
  ru: {
    heading: "Откройте идеальную чистоту, которую вы полюбите!",
    subheading: "Закажите уборку в несколько кликов!",
    quickOrderTitle: "Быстрый заказ уборки",
    quickOrderCategoryLabel: "Категория уборки:",
    quickOrderCategoryStandard: "Стандартная",
    quickOrderCategoryGeneral: "Генеральная",
    quickOrderSubmit: "Заказать сейчас",
  },
  en: {
    heading: "Discover a Perfect Clean You'll Love!",
    subheading: "Order cleaning in a few clicks!",
    quickOrderTitle: "Quick Order for Cleaning",
    quickOrderCategoryLabel: "Cleaning Category:",
    quickOrderCategoryStandard: "Standard",
    quickOrderCategoryGeneral: "General",
    quickOrderSubmit: "Order Now",
  },
};

export default function HeroSection({ lang = "pl" }) {
  const {
    heading,
    subheading,
    quickOrderTitle,
    quickOrderCategoryLabel,
    quickOrderCategoryStandard,
    quickOrderCategoryGeneral,
    quickOrderSubmit,
  } = translations[lang] || translations.pl;

  const navigate = useNavigate();
  const [category, setCategory] = useState("standard");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setShowDropdown(false);
  };

  const handleQuickOrderRedirect = () => {
    navigate(`/quick-order?category=${category}`);
  };

  return (
    <section className={css.hero}>
      <div className={css.heroContent}>
        <div className={`${css.textBlock} ${isVisible ? css.fadeIn : ""}`}>
          <h1>{heading}</h1>
          <p className={css.subheading}>{subheading}</p>
          <div className={`${css.quickOrder} ${isVisible ? css.fadeIn : ""}`}>
            <h3>{quickOrderTitle}</h3>
            <div className={css.orderField}>
              <label>{quickOrderCategoryLabel}</label>
              <div className={css.orderFieldInner}>
                <div
                  className={css["category-select"]}
                  onClick={() => setShowDropdown(!showDropdown)}
                  ref={dropdownRef}
                >
                  <span>
                    {category === "standard"
                      ? quickOrderCategoryStandard
                      : quickOrderCategoryGeneral}
                  </span>
                  <span>▼</span>
                  {showDropdown && (
                    <div
                      className={`${css["category-dropdown"]} ${
                        showDropdown ? css.dropdownOpen : css.dropdownClosed
                      }`}
                    >
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
                <button
                  className={css.submitButton}
                  onClick={handleQuickOrderRedirect}
                >
                  {quickOrderSubmit}
                  <FaArrowRight className={css.submitIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${css.imageBlock} ${isVisible ? css.fadeInRight : ""}`}>
          <img src="/hero/hero-bg1.png" alt="Hero" className={css.heroImage} />
        </div>
      </div>
    </section>
  );
}
