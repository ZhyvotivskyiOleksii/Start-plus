import React, { useEffect, useRef } from "react";
import css from "./CleanGuaranteeSection.module.css";

const translations = {
  pl: {
    title: "Przynosimy Czystość, Gwarantując Niezawodny Klinig",
    subtitle: "Dlaczego warto wybrać nas?",
    description: "Oferujemy najwyższą jakość usług sprzątających dzięki doświadczonemu zespołowi i nowoczesnemu sprzętowi. Skontaktuj się z nami już dziś!",
    button: "Dowiedz się więcej",
    points: [
      { icon: "/icon/icon1.png", number: "Zadowolony Klient", text: "Zadowolony Klient – Nasz Priorytet." },
      { icon: "/icon/SpeedIcon.png", number: "Zawsze na Czas", text: "Zawsze na Czas – Realne terminy." },
      { icon: "/icon/icon3.png", number: "Sprawiedliwe Rozwiązanie", text: "Sprawiedliwe Rozwiązanie – Pełna kompensata." },
      { icon: "/icon/icon4.png", number: "Żadnych Przestojów", text: "Żadnych Przestojów – Natychmiastowa wymiana." },
      { icon: "/icon/icon5.png", number: "Niezawodni Ludzie", text: "Niezawodni Ludzie – Doświadczeni specjaliści." },
      { icon: "/icon/icon6.png", number: "Zawsze w Kontakcie", text: "Zawsze w Kontakcie – 24/7 wsparcie." },
    ],
  },
  uk: {
    title: "Ми Несемо Чистоту, Гарантуючи Надійний Клінінг",
    subtitle: "Чому варто обрати нас?",
    description: "Ми пропонуємо найвищу якість прибирання завдяки досвідченій команді та сучасному обладнанню. Зв’яжіться з нами вже сьогодні!",
    button: "Дізнатися більше",
    points: [
      { icon: "/icon/icon1.png", number: "Задоволений Клієнт", text: "Задоволений Клієнт – Наш Пріоритет." },
      { icon: "/icon/SpeedIcon.png", number: "Завжди Вчасно", text: "Завжди Вчасно – Реальні терміни." },
      { icon: "/icon/icon3.png", number: "Справедливе Рішення", text: "Справедливе Рішення – Повна компенсація." },
      { icon: "/icon/icon4.png", number: "Жодних Простоїв", text: "Жодних Простоїв – Миттєва заміна." },
      { icon: "/icon/icon5.png", number: "Надійні Люди", text: "Надійні Люди – Досвідчені спеціалісти." },
      { icon: "/icon/icon6.png", number: "Завжди на Зв’язку", text: "Завжди на Зв’язку – Підтримка 24/7." },
    ],
  },
  ru: {
    title: "Мы Несём Чистоту, Гарантируя Надёжный Клининг",
    subtitle: "Почему стоит выбрать нас?",
    description: "Мы предлагаем высочайшее качество уборки благодаря опытной команде и современному оборудованию. Свяжитесь с нами сегодня!",
    button: "Узнать больше",
    points: [
      { icon: "/icon/icon1.png", number: "Довольный Клиент", text: "Довольный Клиент – Наш Приоритет." },
      { icon: "/icon/SpeedIcon.png", number: "Всегда Вовремя", text: "Всегда Вовремя – Реальные сроки." },
      { icon: "/icon/icon3.png", number: "Справедливое Решение", text: "Справедливое Решение – Полная компенсация." },
      { icon: "/icon/icon4.png", number: "Никаких Простоев", text: "Никаких Простоев – Немедленная замена." },
      { icon: "/icon/icon5.png", number: "Надёжные Люди", text: "Надёжные Люди – Опытные специалисты." },
      { icon: "/icon/icon6.png", number: "Всегда на Связи", text: "Всегда на Связи – Поддержка 24/7." },
    ],
  },
  en: {
    title: "We Bring Cleanliness, Guaranteeing Reliable Cleaning",
    subtitle: "Why Choose Us?",
    description: "We offer the highest quality cleaning services with an experienced team and modern equipment. Contact us today!",
    button: "Learn More",
    points: [
      { icon: "/icon/icon1.png", number: "Satisfied Client", text: "Satisfied Client – Our Priority." },
      { icon: "/icon/SpeedIcon.png", number: "Always on Time", text: "Always on Time – Realistic timelines." },
      { icon: "/icon/icon3.png", number: "Fair Solution", text: "Fair Solution – Full compensation." },
      { icon: "/icon/icon4.png", number: "No Downtime", text: "No Downtime – Instant replacement." },
      { icon: "/icon/icon5.png", number: "Reliable People", text: "Reliable People – Experienced specialists." },
      { icon: "/icon/icon6.png", number: "Always Available", text: "Always Available – 24/7 support." },
    ],
  },
};

const CleanGuaranteeSection = ({ lang = "pl", id }) => {
  const { title, subtitle, description, button, points } = translations[lang] || translations.pl;

  const splitTitle = (str) => {
    const words = str.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };

  const [titleFirst, titleLast] = splitTitle(title);

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
            <h3 className={css.subtitle}>{subtitle}</h3>
            <p className={css.description}>{description}</p>
            <button className={css.button}>{button}</button>
          </div>
          <div className={`${css.cards} ${css.cardsGrid}`} ref={cardsRef}>
            {points.map((point, index) => (
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
