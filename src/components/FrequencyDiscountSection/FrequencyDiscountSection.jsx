import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./FrequencyDiscountSection.module.css";

/* ===== Хук «мобильный / не-мобильный» ==================================== */
function useIsMobile(maxWidth = 768) {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(`(max-width:${maxWidth}px)`).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${maxWidth}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [maxWidth]);

  return isMobile;
}

/* ===== Тексты и цены ===================================================== */
const translations = {
  pl: {
    title: "Ile kosztuje sprzątanie mieszkania?",
    subtitle:
      "Wybierz częstotliwość sprzątania, aby zobaczyć cenę z uwzględnieniem zniżki",
    frequencyOptions: [
      {
        label: "Raz w tygodniu",
        frequencyKey: "Raz w tygodniu",
        discount: 20,
        prices: { regular: 155.92, office: 196.8, "private-house": 212 }
      },
      {
        label: "Raz na dwa tygodnie",
        frequencyKey: "Raz na dwa tygodnie",
        discount: 15,
        prices: { regular: 165.67, office: 209.1, "private-house": 225.25 }
      },
      {
        label: "Raz w miesiącu",
        frequencyKey: "Raz w miesiącu",
        discount: 10,
        prices: { regular: 175.41, office: 221.4, "private-house": 238.5 }
      },
      {
        label: "Jednorazowe sprzątanie",
        frequencyKey: "Jednorazowe sprzątanie",
        discount: 0,
        prices: { regular: 194.9, office: 246, "private-house": 265 }
      }
    ],
    orderButton: "Zamów teraz",
    popularTag: "Popularne"
  },
  uk: {
    title: "Скільки коштує прибирання квартири?",
    subtitle: "Виберіть частоту прибирання, щоб побачити ціну зі знижкою",
    frequencyOptions: [
      {
        label: "Щотижня",
        frequencyKey: "Raz w tygodniu",
        discount: 20,
        prices: { regular: 155.92, office: 196.8, "private-house": 212 }
      },
      {
        label: "Кожні 2 тижні",
        frequencyKey: "Raz na dwa tygодnie",
        discount: 15,
        prices: { regular: 165.67, office: 209.1, "private-house": 225.25 }
      },
      {
        label: "Раз на місяць",
        frequencyKey: "Raz w miesiącu",
        discount: 10,
        prices: { regular: 175.41, office: 221.4, "private-house": 238.5 }
      },
      {
        label: "Одноразове прибирання",
        frequencyKey: "Jednorazowe sprzątanie",
        discount: 0,
        prices: { regular: 194.9, office: 246, "private-house": 265 }
      }
    ],
    orderButton: "Замовити зараз",
    popularTag: "Популярне"
  },
  ru: {
    title: "Сколько стоит уборка квартиры?",
    subtitle: "Выберите частоту уборки, чтобы увидеть цену со скидкой",
    frequencyOptions: [
      {
        label: "Еженедельно",
        frequencyKey: "Raz w tygodniu",
        discount: 20,
        prices: { regular: 155.92, office: 196.8, "private-house": 212 }
      },
      {
        label: "Каждые 2 недели",
        frequencyKey: "Raz na dwa tygodniе",
        discount: 15,
        prices: { regular: 165.67, office: 209.1, "private-house": 225.25 }
      },
      {
        label: "Раз в месяц",
        frequencyKey: "Raz w miesiącu",
        discount: 10,
        prices: { regular: 175.41, office: 221.4, "private-house": 238.5 }
      },
      {
        label: "Одноразовая уборка",
        frequencyKey: "Jednorazowe sprzątanie",
        discount: 0,
        prices: { regular: 194.9, office: 246, "private-house": 265 }
      }
    ],
    orderButton: "Заказать сейчас",
    popularTag: "Популярное"
  },
  en: {
    title: "How much does apartment cleaning cost?",
    subtitle: "Choose the cleaning frequency to see the discounted price",
    frequencyOptions: [
      {
        label: "Weekly",
        frequencyKey: "Raz w tygodniu",
        discount: 20,
        prices: { regular: 155.92, office: 196.8, "private-house": 212 }
      },
      {
        label: "Every 2 weeks",
        frequencyKey: "Raz na dwa tygодnie",
        discount: 15,
        prices: { regular: 165.67, office: 209.1, "private-house": 225.25 }
      },
      {
        label: "Monthly",
        frequencyKey: "Raz w miesiącu",
        discount: 10,
        prices: { regular: 175.41, office: 221.4, "private-house": 238.5 }
      },
      {
        label: "One-time cleaning",
        frequencyKey: "Jednorazowe sprzątanie",
        discount: 0,
        prices: { regular: 194.9, office: 246, "private-house": 265 }
      }
    ],
    orderButton: "Order Now",
    popularTag: "Popular"
  }
};

/* ===== Типы услуг ======================================================== */
const serviceTypes = [
  {
    name: {
      pl: "Sprzątanie mieszkań",
      uk: "Прибирання квартир",
      ru: "Уборка квартир",
      en: "Apartment Cleaning"
    },
    description: {
      pl: "Kompleksowe sprzątanie mieszkań z rabatem w zależności od częstotliwości.",
      uk: "Комплексне прибирання квартир зі знижкою залежно від частоти.",
      ru: "Комплексная уборка квартир со скидкой в зависимости от частоты.",
      en: "Comprehensive apartment cleaning with a discount based on frequency."
    },
    icon: "/icon/cleaning-home.png",
    type: "regular",
    route: "/calculator"
  },
  {
    name: {
      pl: "Dom prywatny",
      uk: "Приватний будинок",
      ru: "Частный дом",
      en: "Private House"
    },
    description: {
      pl: "Kompleksowe sprzątanie domów prywatnych z rabatem w zależności od częstotliwości.",
      uk: "Комплексне прибирання приватних будинків зі знижкою залежно від частоти.",
      ru: "Комплексная уборка частных домов со скидкой в зависимости от частоты.",
      en: "Comprehensive private house cleaning with a discount based on frequency."
    },
    icon: "/icon/house.png",
    type: "private-house",
    route: "/private-house"
  },
  {
    name: {
      pl: "Sprzątanie biur",
      uk: "Прибирання офісів",
      ru: "Уборка офисов",
      en: "Office Cleaning"
    },
    description: {
      pl: "Profesjonalne sprzątanie biur z rabatem w zależności od częstotliwości.",
      uk: "Професійне прибирання офісів зі знижкою залежно від частоти.",
      ru: "Профессиональная уборка офисов со скидкой в зависимости от частоты.",
      en: "Professional office cleaning with a discount based on frequency."
    },
    icon: "/icon/office.png",
    type: "office",
    route: "/office-cleaning"
  }
];

/* ===== Компонент ========================================================= */
export default function FrequencyDiscountSection({ lang = "pl" }) {
  const { title, subtitle, frequencyOptions, orderButton, popularTag } =
    translations[lang] || translations.pl;

  const [activeIndex, setActiveIndex] = useState(3);   // по-умолчанию «одноразово»
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const GAP = 10;                                     // единый зазор для JS + CSS

  /* ----- Смещение «бегунка» --------------------------------------------- */
  const getSliderTransform = (i) => {
    if (!isMobile) {
      // десктоп: 4 колонки
      return `translateX(calc(${i * 100}% + ${i * 15}px))`;
    }
    // мобильный grid 2 × 2
    const col = i % 2;
    const row = Math.floor(i / 2);
    return `
      translate(
        calc(${col * 100}% + ${col * GAP}px),
        calc(${row * 100}% + ${row * GAP}px)
      )`;
  };

  /* ----- Хэндлеры ------------------------------------------------------- */
  const handleFrequencyClick = (i) => setActiveIndex(i);

  const handleServiceClick = (type, route) => {
    const selectedFrequency = frequencyOptions[activeIndex];
    navigate(route, {
      state: { frequency: selectedFrequency.frequencyKey, type }
    });
  };

  /* ----- Вспомогательные форматтеры ------------------------------------ */
  const splitServiceName = (nameObj) => {
    const words = nameObj[lang].split(" ");
    return words.length === 1
      ? [words[0], ""]
      : [words[0], words.slice(1).join(" ")];
  };

  const splitTitle = (str) => {
    const words = str.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };

  const [titleFirst, titleLast] = splitTitle(title);

  /* ----- JSX ------------------------------------------------------------ */
  return (
    <section className={css.frequencySection}>
      <div className={css.container}>
        <h2 className={css.title}>
          {titleFirst} <span className={css.highlightedTitle}>{titleLast}</span>
        </h2>

        <p className={css.subtitle}>{subtitle}</p>

        {/* ----------- Кнопки-частоты -------------- */}
        <div className={css.frequencyTabs}>
          <div
            className={css.slidingBackground}
            style={{ transform: getSliderTransform(activeIndex) }}
          />
          {frequencyOptions.map((opt, i) => (
            <div
              key={i}
              className={`${css.tab} ${activeIndex === i ? css.active : ""}`}
              onClick={() => handleFrequencyClick(i)}
            >
              <div className={css.tabContent}>
                <span className={css.tabDiscount}>{opt.discount}%</span>
                <span className={css.tabLabel}>{opt.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ----------- Карточки услуг -------------- */}
        <div className={css.serviceCards}>
          {serviceTypes.map((srv, i) => {
            const [first, second] = splitServiceName(srv.name);
            const price = frequencyOptions[activeIndex].prices[srv.type];
            return (
              <div key={i} className={css.serviceCard}>
                <div className={css.serviceCardInner}>
                  <div className={css.serviceHeader}>
                    <div className={css.serviceInfo}>
                      <div className={css.serviceName}>
                        <span className={css.namePart}>{first}</span>
                        <span className={css.namePart}>{second}</span>
                      </div>
                      <p className={css.servicePrice}>
                        {price.toFixed(2)} zł
                        {frequencyOptions[activeIndex].discount > 0 && (
                          <span className={css.serviceDiscount}>
                            -
                            {frequencyOptions[activeIndex].discount}
                            %
                          </span>
                        )}
                      </p>
                    </div>

                    <img
                      src={srv.icon}
                      alt={srv.name[lang]}
                      className={css.serviceIcon}
                    />
                    <span className={css.serviceTag}>{popularTag}</span>
                  </div>

                  <div className={css.serviceBody}>
                    <p className={css.serviceDescription}>
                      {srv.description[lang]}
                    </p>
                    <button
                      className={css.serviceButton}
                      onClick={() =>
                        handleServiceClick(srv.type, srv.route)
                      }
                    >
                      {orderButton}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
