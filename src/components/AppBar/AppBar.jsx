import { useState } from "react";
import { FaBars, FaTimes, FaGlobe, FaTelegram, FaViber, FaFacebookMessenger } from "react-icons/fa";
import css from "./AppBar.module.css";
import Logo from "../Logo/Logo";
import BarMenu from "../BarMenu/BarMenu";
import plFlag from "../../assets/flags/pl.png";
import uaFlag from "../../assets/flags/ua.png";
import ruFlag from "../../assets/flags/ru.png";
import gbFlag from "../../assets/flags/gb.png";

const languages = { pl: "PL", uk: "UA", ru: "RU", en: "EN" };
const flags = { pl: plFlag, uk: uaFlag, ru: ruFlag, en: gbFlag };

export default function AppBar({ lang, setLang }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getFlagPath = (langKey) => {
    return flags[langKey];
  };

  return (
    <>
      <header className={css.header}>
        <Logo />
        <div className={css.desktopMenu}>
          <BarMenu lang={lang} />
        </div>
        <div className={css.desktopLang}>
          <div className={css.langBox} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaGlobe className={css.icon} />
            <img src={getFlagPath(lang)} alt={`${lang} flag`} className={css.flagIcon} />
            <span>{languages[lang]}</span>
          </div>
          {dropdownOpen && (
            <ul className={css.dropdown}>
              {Object.keys(languages).map((key) => (
                <li key={key} onClick={() => { setLang(key); setDropdownOpen(false); }}>
                  <img src={getFlagPath(key)} alt={`${key} flag`} className={css.flagIcon} />
                  {languages[key]}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className={css.burger} onClick={() => setMobileOpen(true)}>
          <FaBars />
        </button>
      </header>
      <div className={`${css.mobileMenu} ${mobileOpen ? css.show : ""}`}>
        <button className={css.close} onClick={() => setMobileOpen(false)}>
          <FaTimes />
        </button>
        <div className={css.mobileMenuContent}>
          <BarMenu lang={lang} />
        </div>
        <div className={css.socials}>
          <a href="#" target="_blank"><FaTelegram /></a>
          <a href="#" target="_blank"><FaViber /></a>
          <a href="#" target="_blank"><FaFacebookMessenger /></a>
        </div>
        <div className={css.mobileLang}>
          <div className={css.langHeader}>
            <FaGlobe className={css.icon} />
            <span>Language</span>
          </div>
          <div className={css.langRow}>
            {Object.keys(languages).map((key) => (
              <span
                key={key}
                onClick={() => setLang(key)}
                className={lang === key ? css.active : ""}
              >
                <img src={getFlagPath(key)} alt={`${key} flag`} className={css.flagIcon} />
                {languages[key]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}