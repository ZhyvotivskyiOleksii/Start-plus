"use client";

import React, { useEffect } from "react";
import HeroSection from "./HeroSection/HeroSection";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";
import Reviews from "./Reviews/Reviews";
import css from "./HomePage.module.css";
import ShieldIcon from "/icon/ShieldIcon.svg";

export default function HomePage({ lang = "pl" }) {
  const translations = {
    pl: { insuranceText: "Ubezpieczenie OC na 1 mln zł" },
    uk: { insuranceText: "Страховка на 1 млн зл" },
    ru: { insuranceText: "Страховка на 1 млн зл" },
    en: { insuranceText: "Insurance for 1 million PLN" },
  };

  const { insuranceText } = translations[lang] || translations.pl;

  useEffect(() => {
    const updateStripPosition = () => {
      const hero = document.querySelector(`.${css.hero}`);
      const strip = document.querySelector(`.${css.insuranceStrip}`);
      if (hero && strip) {
        const heroHeight = hero.offsetHeight;
        const stripHeight = strip.offsetHeight;
        strip.style.top = `${heroHeight - stripHeight / 2}px`;
      }
    };

    updateStripPosition();
    window.addEventListener("resize", updateStripPosition);

    return () => window.removeEventListener("resize", updateStripPosition);
  }, []);

  return (
    <>
      <HeroSection lang={lang} />
      <WhyChooseUs lang={lang} />
      <Reviews lang={lang} />
      {/* <div className={css.insuranceStrip}>
        <div className={css.insuranceContent}>
          <img src={ShieldIcon} alt="Shield Icon" className={css.shieldIcon} />
          <span>{insuranceText}</span>
        </div>
      </div>  */}
    </>
  );
}