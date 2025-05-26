"use client";

import React from "react";
import HeroSection from "./HeroSection/HeroSection";
import FrequencyDiscountSection from "./FrequencyDiscountSection/FrequencyDiscountSection";
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

    return (
        <>
            <HeroSection lang={lang} />
            <div className={css.insuranceStrip}>
                <div className={css.insuranceContent}>
                    <img src={ShieldIcon} alt="Shield Icon" className={css.shieldIcon} />
                    <span>{insuranceText}</span>
                </div>
            </div>
            <WhyChooseUs lang={lang} />
            <Reviews lang={lang} />
            <FrequencyDiscountSection lang={lang} />

        </>
    );
}