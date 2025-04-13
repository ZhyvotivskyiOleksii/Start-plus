import css from "./HeroSection.module.css";

const translations = {
  pl: {
    heading: "Odkryj perfekcyjną czystość, którą pokochasz!",
    subheading: "Profesjonalne sprzątanie, remont i pielęgnacja Twojego domu lub biura.",
    button: "Zamów teraz",
  },
  uk: {
    heading: "Відкрийте досконалу чистоту, яку ви полюбите!",
    subheading: "Професійне прибирання, ремонт та догляд за вашим будинком чи офісом.",
    button: "Замовити зараз",
  },
  ru: {
    heading: "Откройте для себя идеальную чистоту, которую вы полюбите!",
    subheading: "Профессиональная уборка, ремонт и уход за вашим домом или офисом.",
    button: "Заказать сейчас",
  },
  en: {
    heading: "Discover a Perfect Clean You'll Love!",
    subheading: "Professional cleaning, renovation, and care for your home or office.",
    button: "Order Now",
  },
};
export default function HeroSection({ lang = "pl" }) {
  const { heading, subheading, button } = translations[lang] || translations.pl;

  return (
    <section className={css.hero}>
      <div className={css.heroContent}>
        <div className={css.textBlock}>
          <h1>{heading}</h1>
          <p>{subheading}</p>
          <button className={css.ctaButton}>{button}</button>
        </div>
        <div className={css.imageBlock}>
          <img src="/public/hero/hero-bg1.png" alt="Hero" className={css.heroImage} />
        </div>
      </div>
    </section>
  );
}