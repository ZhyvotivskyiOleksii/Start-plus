"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import css from "./HeroSection.module.css";
import { FaArrowRight } from "react-icons/fa";

export default function HeroSection() {
  const { t } = useTranslation();
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
          <h1>{t("heading")}</h1>
          <p className={css.subheading}>{t("subheading")}</p>
          <div className={`${css.quickOrder} ${isVisible ? css.fadeIn : ""}`}>
            <h3>{t("quickOrderTitle")}</h3>
            <div className={css.orderField}>
              <label>{t("quickOrderCategoryLabel")}</label>
              <div className={css.orderFieldInner}>
                <div
                  className={css["category-select"]}
                  onClick={() => setShowDropdown(!showDropdown)}
                  ref={dropdownRef}
                >
                  <span>
                    {category === "standard"
                      ? t("quickOrderCategoryStandard")
                      : t("quickOrderCategoryGeneral")}
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
                        {t("quickOrderCategoryStandard")}
                      </div>
                      <div
                        className={`${css["category-option"]} ${
                          category === "general" ? css.selected : ""
                        }`}
                        onClick={() => handleCategoryChange("general")}
                      >
                        {t("quickOrderCategoryGeneral")}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className={css.submitButton}
                  onClick={handleQuickOrderRedirect}
                >
                  {t("quickOrderSubmit")}
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
