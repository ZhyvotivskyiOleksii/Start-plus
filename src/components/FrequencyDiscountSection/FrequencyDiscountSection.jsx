import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "./FrequencyDiscountSection.module.css";

const translations = {
    pl: {
        title: "Ile kosztuje sprzątanie mieszkania?",
        subtitle: "Wybierz częstotliwość sprzątania, aby zobaczyć cenę z uwzględnieniem zniżki",
        frequencyOptions: [
            { label: "Raz w tygodniu", frequencyKey: "Raz w tygodniu", discount: 20, price: 155.92, type: "office" },
            { label: "Raz na dwa tygodnie", frequencyKey: "Raz na dwa tygodnie", discount: 15, price: 165.67, type: "private-house" },
            { label: "Raz w miesiącu", frequencyKey: "Raz w miesiącu", discount: 10, price: 175.41, type: "post-renovation" },
            { label: "Jednorazowe sprzątanie", frequencyKey: "Jednorazowe sprzątanie", discount: 0, price: 194.90, type: "regular" },
        ],
        orderButton: "Zamów teraz",
        popularTag: "Popularne",
    },
    uk: {
        title: "Скільки коштує прибирання квартири?",
        subtitle: "Виберіть частоту прибирання, щоб побачити ціну зі знижкою",
        frequencyOptions: [
            { label: "Щотижня", frequencyKey: "Raz w tygodniu", discount: 20, price: 155.92, type: "office" },
            { label: "Кожні 2 тижні", frequencyKey: "Raz na dwa тижні", discount: 15, price: 165.67, type: "private-house" },
            { label: "Раз на місяць", frequencyKey: "Raz w miesiącu", discount: 10, price: 175.41, type: "post-renovation" },
            { label: "Одноразове прибирання", frequencyKey: "Jednorazowe sprzątanie", discount: 0, price: 194.90, type: "regular" },
        ],
        orderButton: "Замовити зараз",
        popularTag: "Популярне",
    },
    ru: {
        title: "Сколько стоит уборка квартиры?",
        subtitle: "Выберите частоту уборки, чтобы увидеть цену со скидкой",
        frequencyOptions: [
            { label: "Еженедельно", frequencyKey: "Raz w tygodniu", discount: 20, price: 155.92, type: "office" },
            { label: "Каждые 2 недели", frequencyKey: "Raz na dwa tygodnie", discount: 15, price: 165.67, type: "private-house" },
            { label: "Раз в месяц", frequencyKey: "Raz w miesiącu", discount: 10, price: 175.41, type: "post-renovation" },
            { label: "Одноразовая уборка", frequencyKey: "Jednorazowe sprzątanie", discount: 0, price: 194.90, type: "regular" },
        ],
        orderButton: "Заказать сейчас",
        popularTag: "Популярное",
    },
    en: {
        title: "How much does apartment cleaning cost?",
        subtitle: "Choose the cleaning frequency to see the discounted price",
        frequencyOptions: [
            { label: "Weekly", frequencyKey: "Raz w tygodniu", discount: 20, price: 155.92, type: "office" },
            { label: "Every 2 weeks", frequencyKey: "Raz na dwa tygodnie", discount: 15, price: 165.67, type: "private-house" },
            { label: "Monthly", frequencyKey: "Raz w miesiącu", discount: 10, price: 175.41, type: "post-renovation" },
            { label: "One-time cleaning", frequencyKey: "Jednorazowe sprzątanie", discount: 0, price: 194.90, type: "regular" },
        ],
        orderButton: "Order Now",
        popularTag: "Popular",
    },
};

const serviceTypes = [
    {
        name: {
            pl: "Sprzątanie mieszkań",
            uk: "Прибирання квартир",
            ru: "Уборка квартир",
            en: "Apartment Cleaning",
        },
        mobileName: {
            pl: "Sprzątanie mieszkań",
            uk: "Прибирання квартир",
            ru: "Уборка квартир",
            en: "Apartment Cleaning",
        },
        description: {
            pl: "Kompleksowe sprzątanie mieszkań z rabatem w zależności od częstotliwości.",
            uk: "Комплексне прибирання квартир зі знижкою залежно від частоти.",
            ru: "Комплексная уборка квартир со скидкой в зависимости от частоты.",
            en: "Comprehensive apartment cleaning with a discount based on frequency.",
        },
        icon: "/icon/cleaning-home.png",
        image: "/images/bear1.png",
        type: "regular",
    },
    {
        name: {
            pl: "Po remoncie",
            uk: "Після ремонту",
            ru: "После ремонта",
            en: "Post-Renovation",
        },
        mobileName: {
            pl: "Po remoncie",
            uk: "Після ремонту",
            ru: "После ремонта",
            en: "Post-Renovation",
        },
        description: {
            pl: "Dokładne sprzątanie po remoncie z rabatem w zależności od częstotliwości.",
            uk: "Ретельне прибирання після ремонту зі знижкою залежно від частоти.",
            ru: "Тщательная уборка после ремонта со скидкой в зависимости от частоты.",
            en: "Thorough post-renovation cleaning with a discount based on frequency.",
        },
        icon: "/icon/remont-home.png",
        image: "/images/bear1.png",
        type: "post-renovation",
    },
    {
        name: {
            pl: "Dom prywatny",
            uk: "Приватний будинок",
            ru: "Частный дом",
            en: "Private House",
        },
        mobileName: {
            pl: "Dom prywatny",
            uk: "Приватний будинок",
            ru: "Частный дом",
            en: "Private House",
        },
        description: {
            pl: "Kompleksowe sprzątanie domów prywatnych z rabatem w zależności od częstotliwości.",
            uk: "Комплексне прибирання приватних будинків зі знижкою залежно від частоти.",
            ru: "Комплексная уборка частных домов со скидкой в зависимости от частоты.",
            en: "Comprehensive private house cleaning with a discount based on frequency.",
        },
        icon: "/icon/house.png",
        image: "/images/bear1.png",
        type: "private-house",
    },
    {
        name: {
            pl: "Sprzątanie biur",
            uk: "Прибирання офісів",
            ru: "Уборка офисов",
            en: "Office Cleaning",
        },
        mobileName: {
            pl: "Sprzątanie biur",
            uk: "Прибирання офісів",
            ru: "Уборка офисов",
            en: "Office Cleaning",
        },
        description: {
            pl: "Profesjonalne sprzątanie biur z rabatem w zależności od częstotliwości.",
            uk: "Професійне прибирання офісів зі знижкою залежно від частоти.",
            ru: "Профессиональная уборка офисов со скидкой в зависимости от частоты.",
            en: "Professional office cleaning with a discount based on frequency.",
        },
        icon: "/icon/office.png",
        image: "/images/bear1.png",
        type: "office",
    },
];

export default function FrequencyDiscountSection({ lang = "pl" }) {
    const { title, subtitle, frequencyOptions, orderButton, popularTag } = translations[lang] || translations.pl;
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const handleFrequencyClick = (index) => {
        setActiveIndex(index);
    };

    const handleServiceClick = (type) => {
        const selectedFrequency = frequencyOptions[activeIndex];
        navigate("/calculator", { state: { frequency: selectedFrequency.frequencyKey, type } });
    };

    // Функція для розділення назви на 2 частини
    const splitServiceName = (name) => {
        const words = name[lang].split(" ");
        if (words.length === 1) {
            return [words[0], ""]; // Якщо одне слово, друге залишаємо пустим
        }
        const firstPart = words[0];
        const secondPart = words.slice(1).join(" ");
        return [firstPart, secondPart];
    };

    // Функція для розділення заголовка
    const splitTitle = (title) => {
        const words = title.split(" ");
        const lastWord = words[words.length - 1];
        const firstPart = words.slice(0, -1).join(" ");
        return [firstPart, lastWord];
    };

    const [titleFirstPart, titleLastWord] = splitTitle(title);

    return (
        <section className={css.frequencySection}>
            <div className={css.container}>
                <h2 className={css.title}>
                    {titleFirstPart} <span className={css.highlightedTitle}>{titleLastWord}</span>
                </h2>
                <p className={css.subtitle}>{subtitle}</p>
                <div className={css.frequencyTabs}>
                    <div
                        className={css.slidingBackground}
                        style={{
                            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 15}px))`,
                        }}
                    />
                    {frequencyOptions.map((option, index) => (
                        <div
                            key={index}
                            className={`${css.tab} ${activeIndex === index ? css.active : ""}`}
                            onClick={() => handleFrequencyClick(index)}
                        >
                            <div className={css.tabContent}>
                                <span className={css.tabDiscount}>
                                    {option.discount}% {/* Завжди показуємо знижку */}
                                </span>
                                <span className={css.tabLabel}>{option.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={css.serviceCards}>
                    {serviceTypes.map((service, index) => {
                        const [firstPart, secondPart] = splitServiceName(service.name);
                        return (
                            <div key={index} className={css.serviceCard}>
                                <div className={css.serviceCardInner}>
                                    <div className={css.serviceHeader}>
                                        <div className={css.serviceInfo}>
                                            <div className={css.serviceName}>
                                                <span className={css.namePart}>{firstPart}</span>
                                                <span className={css.namePart}>{secondPart}</span>
                                            </div>
                                            <p className={css.servicePrice}>
                                                {frequencyOptions[activeIndex].price.toFixed(2)} {lang === "pl" || lang === "uk" || lang === "ru" ? "зл" : "PLN"}
                                                {frequencyOptions[activeIndex].discount > 0 && (
                                                    <span className={css.serviceDiscount}>
                                                        -{frequencyOptions[activeIndex].discount}%
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <img src={service.icon} alt={service.name[lang]} className={css.serviceIcon} />
                                        <span className={css.serviceTag}>{popularTag}</span>
                                    </div>
                                    <div className={css.serviceBody}>
                                        <p className={css.serviceDescription}>{service.description[lang]}</p>
                                        <button
                                            className={css.serviceButton}
                                            onClick={() => handleServiceClick(service.type)}
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