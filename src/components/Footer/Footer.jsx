"use client";

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import css from "./Footer.module.css";

const dict = {
  pl: {
    companyName: "STARTPLUS NATALIIA ZHYVOTIVSKA",
    addressShort: "ul. Edwarda Habicha 18/45, 02-495 Warszawa",
    nip: "NIP: 5242838146",
    regon: "REGON: 368071450",
    pkd: "81.21.Z - Niespecjalistyczne sprzątanie budynków",
    startDate: "Data rozpoczęcia działalności: 2024-11-01",
    privacyPolicy: "Polityka prywatności",
    termsOfService: "Regulamin",
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
  },
};

export default function Footer({ lang = "pl" }) {
  const t = useMemo(() => dict[lang] || dict.pl, [lang]);
  const navigate = useNavigate();

  return (
    <footer className={css.footer}>
      <div className={css.footerContent}>
        <div className={css.section}>
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

        <div className={css.section}>
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
            <img src="/icon/visa.svg" alt="Visa" />
            <img src="/icon/money.svg" alt="MasterCard" />
            <img src="/icon/apple-pay.svg" alt="Apple Pay" />
            <img src="/icon/google-pay.svg" alt="Google Pay" />
            <img src="/icon/payu.png" alt="PayU" />
          </div>
        </div>
      </div>
    </footer>
  );
}