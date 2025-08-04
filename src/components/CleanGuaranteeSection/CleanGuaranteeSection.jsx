"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import css from "./CleanGuaranteeSection.module.css";

const CleanGuaranteeSection = ({ id }) => {
  const { t } = useTranslation();

  const splitTitle = (str) => {
    const words = str.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };

  const [titleFirst, titleLast] = splitTitle(t("cleanGuarantee.title"));

  const contentRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(css.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) observer.observe(contentRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => {
      if (contentRef.current) observer.unobserve(contentRef.current);
      if (cardsRef.current) observer.unobserve(cardsRef.current);
    };
  }, []);

  return (
    <section className={css.cleanGuaranteeSection} id={id}>
      <div className={css.container}>
        <div className={css.contentWrapper}>
          <div className={css.content} ref={contentRef}>
            <h2 className={css.title}>
              {titleFirst} <span className={css.highlightedTitle}>{titleLast}</span>
            </h2>
            <h3 className={css.subtitle}>{t("cleanGuarantee.subtitle")}</h3>
            <p className={css.description}>{t("cleanGuarantee.description")}</p>
            <button className={css.button}>{t("cleanGuarantee.button")}</button>
          </div>
          <div className={`${css.cards} ${css.cardsGrid}`} ref={cardsRef}>
            {t("cleanGuarantee.points", { returnObjects: true }).map((point, index) => (
              <div key={index} className={css.card} style={{ "--delay": `${index * 0.3}s` }}>
                <div className={css.cardIcon}>
                  <img src={point.icon} alt={`${point.number} icon`} className={css.icon} />
                </div>
                <h3 className={css.cardNumber}>{point.number}</h3>
                <p className={css.cardText}>{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CleanGuaranteeSection;