import css from "./HeroSection.module.css";

const translations = {
  pl: {
    heading: "Odkryj perfekcyjną czystość, którą pokochasz!",
    subheading:
      "Profesjonalne sprzątanie, sprzątanie po remoncie i pielęgnacja Twojego domu lub biura.",
    button: "Zamów teraz",
  },
  uk: {
    heading: "Відкрийте ідеальну чистоту, яку ви полюбите!",
    subheading:
      "Професійне прибирання, прибирання після ремонту та догляд за вашим будинком чи офісом.",
    button: "Замовити зараз",
  },
  ru: {
    heading: "Откройте идеальную чистоту, которую вы полюбите!",
    subheading:
      "Профессиональная уборка, уборка после ремонта и уход за вашим домом или офисом.",
    button: "Заказать сейчас",
  },
  en: {
    heading: "Discover a Perfect Clean You'll Love!",
    subheading:
      "Professional cleaning, post-renovation cleaning, and care for your home or office.",
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
          <img
            src="/hero/hero-bg1.png"
            alt="Hero"
            className={css.heroImage}
          />
        </div>
      </div>
    </section>
  );
}