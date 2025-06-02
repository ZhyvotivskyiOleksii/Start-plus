"use client";

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa"; // Іконки з react-icons
import css from "./Footer.module.css";

const dict = {
  pl: {
    companyName: "STARTPLUS",
    addressShort: "ul. Edwarda Habicha 18/45, 02-495 Warszawa",
    nip: "NIP: 5242838146",
    regon: "REGON: 368071450",
    pkd: "81.21.Z - Niespecjalistyczne sprzątanie budynków",
    startDate: "Data rozpoczęcia działalności: 2024-11-01",
    privacyPolicy: "Polityka prywatności",
    termsOfService: "Regulamin",
    developedBy: "Rozwinięto przez WebImpuls",
    phone: "+48 796 644 039",
    orderAcceptance: "Przyjmowanie zamówień: od 9:00 do 18:00",
    orderFulfillment: "Realizacja zamówień: od 7:00 до 18:00",
    calculatorInfo: "przez kalkulator 24/7",
    calculatorButton: "Na kalkulator",
  },
  uk: {
    companyName: "STARTPLUS NATALIIA ZHYVOTIVSKA",
    addressShort: "вул. Едварда Хабіха 18/45, 02-495 Варшава",
    nip: "NIP: 5242838146",
    regon: "REGON: 368071450",
    pkd: "81.21.Z - Неспеціалізоване прибирання будівель",
    startDate: "Дата початку діяльності: 2024-11-01",
    privacyPolicy: "Політика конфіденційності",
    termsOfService: "Правила користування",
    developedBy: "Розроблено студією WebImpuls",
    phone: "+48 796 644 039",
    orderAcceptance: "Приймання замовлень: з 9:00 до 18:00",
    orderFulfillment: "Виконання замовлень: з 7:00 до 18:00",
    calculatorInfo: "через калькулятор 24/7",
    calculatorButton: "На калькулятор",
  },
  ru: {
    companyName: "STARTPLUS NATALIIA ZHYVOTIVSKA",
    addressShort: "ул. Эдварда Хабиха 18/45, 02-495 Варшава",
    nip: "NIP: 5242838146",
    regon: "REGON: 368071450",
    pkd: "81.21.Z - Неспециализированная уборка зданий",
    startDate: "Дата начала деятельности: 2024-11-01",
    privacyPolicy: "Политика конфиденциальности",
    termsOfService: "Правила использования",
    developedBy: "Разработано студией WebImpuls",
    phone: "+48 796 644 039",
    orderAcceptance: "Прием заказов: с 9:00 до 18:00",
    orderFulfillment: "Выполнение заказов: с 7:00 до 18:00",
    calculatorInfo: "через калькулятор 24/7",
    calculatorButton: "На калькулятор",
  },
  en: {
    companyName: "STARTPLUS NATALIIA ZHYVOTIVSKA",
    addressShort: "ul. Edwarda Habicha 18/45, 02-495 Warsaw",
    nip: "NIP: 5242838146",
    regon: "REGON: 368071450",
    pkd: "81.21.Z - General cleaning of buildings",
    startDate: "Start of activity: 2024-11-01",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    developedBy: "Developed by WebImpuls",
    phone: "+48 796 644 039",
    orderAcceptance: "Order Acceptance: 9:00 AM to 6:00 PM",
    orderFulfillment: "Order Fulfillment: 7:00 AM to 6:00 PM",
    calculatorInfo: "via calculator 24/7",
    calculatorButton: "To Calculator",
  },
};

export default function Footer({ lang = "pl" }) {
  const t = useMemo(() => dict[lang] || dict.pl, [lang]);
  const navigate = useNavigate();

  return (
    <footer className={css.footer}>
      <div className={css.footerContent}>
        <div className={css.section}>
          <div className={css.companyInfo}>
            <div className={css.companyName}>
              <h2>{t.companyName}</h2>
            </div>
            <div className={css.infoLine}>
              <MapPin size={16} />
              <span>{t.addressShort}</span>
            </div>
            <p className={css.companyDetails}>{t.nip}</p>
            <p className={css.companyDetails}>{t.regon}</p>
            <p className={css.companyDetails}>{t.pkd}</p>
            <p className={css.companyDetails}>{t.startDate}</p>
          </div>
        </div>

        <div className={css.section}>
          <div className={css.linksAndPayments}>
            <div className={css.actionButtons}>
              <button
                onClick={() => navigate("/terms-of-service")}
                className={css.pillButton}
              >
                {t.termsOfService}
              </button>
              <button
                onClick={() => navigate("/privacy-policy")}
                className={css.pillButton}
              >
                {t.privacyPolicy}
              </button>
            </div>
            <div className={css.payments}>
              <img src="/icon/visa.svg" alt="Visa payment" />
              <img src="/icon/money.svg" alt="MasterCard payment" />
              <img src="/icon/apple-pay.svg" alt="Apple Pay payment" />
              <img src="/icon/google-pay.svg" alt="Google Pay payment" />
              <img src="/icon/payu.png" alt="PayU payment" />
            </div>
            <div className={css.developedBySectionDesktop}>
              <div className={css.developedBy}>
                <a
                  href="https://web-impuls.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={css.developedByLink}
                >
                  <span>{t.developedBy}</span>
                  <img
                    src="/images/logo-impuls.png"
                    alt="WebImpuls logo"
                    className={css.webimpulsLogo}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={css.section}>
          <div className={css.contactInfo}>
            <a href="tel:+48796644039" className={css.phone}>
              {t.phone}
            </a>
            <p className={css.schedule}>{t.orderAcceptance}</p>
            <p className={css.calculatorInfo}>{t.calculatorInfo}</p>
            <p className={css.schedule}>{t.orderFulfillment}</p>
            <div className={css.buttonWrapper}>
              <button
                onClick={() => navigate("/calculator")}
                className={css.calculatorButton}
              >
                {t.calculatorButton}
              </button>
            </div>
            <div className={css.socialIcons}>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={css.socialLink}
              >
                <FaFacebook className={css.socialIcon} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={css.socialLink}
              >
                <FaInstagram className={css.socialIcon} />
              </a>
            </div>
          </div>
        </div>

        <div className={css.developedBySectionMobile}>
          <div className={css.developedBy}>
            <a
              href="https://web-impuls.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={css.developedByLink}
            >
              <span>{t.developedBy}</span>
              <img
                src="/images/logo-impuls.png"
                alt="WebImpuls logo"
                className={css.webimpulsLogo}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}