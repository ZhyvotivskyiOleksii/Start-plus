import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import css from "./AboutUsSection.module.css";

const AboutUsSection = ({ id }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);

  const splitTitle = (str) => {
    const words = str.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };

  const [titleFirst, titleLast] = splitTitle(t("aboutUs.title"));

  const handleToggle = () => {
    if (isExpanded) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsExpanded(!isExpanded);
  };

  const blocks = [
    {
      title: t("aboutUs.block1Title"),
      text: t("aboutUs.block1Text"),
    },
    {
      title: t("aboutUs.block2Title"),
      text: t("aboutUs.block2Text"),
    },
    {
      title: t("aboutUs.block3Title"),
      text: t("aboutUs.block3Text"),
    },
    {
      title: t("aboutUs.block4Title"),
      text: t("aboutUs.block4Text"),
    },
  ];

  return (
    <section className={css.aboutUsSection} id={id} ref={sectionRef}>
      <div className={css.container}>
        <h2 className={css.title}>
          {titleFirst} <span className={css.highlightedTitle}>{titleLast}</span>
        </h2>
        <div className={`${css.blocksWrapper} ${isExpanded ? css.expanded : css.collapsed}`}>
          <div className={css.blocks}>
            {blocks.map((block, index) => (
              <div key={index} className={css.block}>
                <h3 className={css.blockTitle}>{block.title}</h3>
                <div className={css.blockText}>
                  <p>{block.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={css.buttonWrapper}>
          <button className={css.toggleButton} onClick={handleToggle}>
            {isExpanded ? t("aboutUs.collapse") : t("aboutUs.readMore")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
