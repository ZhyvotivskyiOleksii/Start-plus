import React, { useState } from 'react';
import css from './DiscountSection.module.css';

const translations = {
  pl: {
    title: "Zniżka 15% na Pierwsze Zamówienie",
    description: "Otrzymaj 15% zniżki na pierwsze sprzątanie! Użyj kodu promocyjnego przy składaniu zamówienia. Oferta ważna tylko dla nowych klientów.",
    promoCode: "FIRSTCLEAN15",
  },
  uk: {
    title: "Знижка 15% на Перше Замовлення",
    description: "Отримай 15% знижки на перше прибирання! Використовуй промокод під час оформлення замовлення. Акція діє тільки для нових клієнтів.",
    promoCode: "FIRSTCLEAN15",
  },
  ru: {
    title: "Скидка 15% на Первый Заказ",
    description: "Получи скидку 15% на первую уборку! Используй промокод при оформлении заказа. Акция действует только для новых клиентов.",
    promoCode: "FIRSTCLEAN15",
  },
  en: {
    title: "15% Discount on Your First Order",
    description: "Get a 15% discount on your first cleaning! Use the promo code at checkout. Offer valid for new customers only.",
    promoCode: "FIRSTCLEAN15",
  },
};

const DiscountSection = ({ lang = "pl", id }) => {
  const { title, description, promoCode } = translations[lang] || translations.pl;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <section className={css.discountSection} id={id}>
      <div className={css.container}>
        <div className={css.contentWrapper}>
          <div className={css.textWrapper}>
            <h2 className={css.title}>{title}</h2>
            <p className={css.description}>{description}</p>
            <div className={css.promoCodeWrapper}>
              <span className={css.promoCode}>{promoCode}</span>
              <button onClick={handleCopy} className={css.copyButton}>
                <img
                  src={isCopied ? "/icon/mark.svg" : "/icon/copy.svg"}
                  alt={isCopied ? "Copied" : "Copy icon"}
                  className={isCopied ? css.checkIcon : css.copyIcon}
                />
              </button>
            </div>
          </div>
          <div className={css.imageWrapper}>
            <img
              src="/icon/discount-icon.webp"
              alt="Discount icon"
              className={css.sideImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;