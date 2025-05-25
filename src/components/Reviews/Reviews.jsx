"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "./Reviews.module.css";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const translations = {
  pl: {
    headingPart1: "Opinie Naszych",
    headingPart2: "Klientów",
    subheading: "Dowiedz się, co mówią o nas nasi klienci",
    allReviews: "Wszystkie opinie",
    positivesLabel: "Pozytywne:",
    reviews: [
      {
        name: "Małgorzata Pełka",
        text: "Świetny kontakt, punktualność i wysoka jakość wykonania zlecenia.",
        fullText: "Świetny kontakt, punktualność i bardzo wysoka jakość wykonania zlecenia. Duży plus za sprawną komunikację!",
        rating: 5,
        date: "25 kwietnia 2023 r.",
        positives: ["Gotowość do interakcji", "Punktualność", "Jakość", "Profesjonalizm"],
        image: "/logo.webp",
      },
      {
        name: "",
        text: "",
        fullText: "",
        rating: 0,
        date: "",
        positives: [],
        isImageCard: true,
      },
      {
        name: "Roman",
        text: "Super polecamy! Biuro czyste i zadbane, pracownicy bardzo mili.",
        fullText: "Super polecamy! Dzięki firmie Arians teraz nasze biuro jest bardzo czyste i zadbane. Bardzo mili pracownicy 👭 którzy wykonują swoją pracę na 💯 procent 💥 Polecam jak najbardziej 💪💪🔥",
        rating: 5,
        date: "3 listopada 2022 r.",
        positives: ["Profesjonalizm", "Ceny"],
        image: "/logo.webp",
      },
      {
        name: "Paulina Kilen",
        text: "Jestem zadowolona. Czysto i dokładnie umyte kuchnia i łazienki.",
        fullText: "Jestem zadowolona. Czysto i dokładnie zostały umyte kuchnia i dwie łazienki tak jak chciałam. Polecam",
        rating: 5,
        date: "2 listopada 2022 r.",
        positives: [],
        image: "/logo.webp",
      },
      {
        name: "Barb",
        text: "Polecam usługi Arians. Korzystałam wielokrotnie i będę kontynuować.",
        fullText: "Bardzo polecam usługi firmy Arians. Korzystałam wielokrotnie i na pewno nadal będę :)",
        rating: 5,
        date: "27 września 2022 r.",
        positives: ["Punktualność", "Jakość", "Profesjonalizm", "Ceny"],
        image: "/logo.webp",
      },
      {
        name: "Kamil Nowak",
        text: "Świetna firma! Wszystko błyszczy po sprzątaniu.",
        fullText: "Świetna firma! Po sprzątaniu wszystko błyszczy, а zespół był bardzo профессиональны и uprzejmy. Polecam!",
        rating: 5,
        date: "15 lutego 2023 р.",
        positives: ["Професіоналізм", "Якість"],
        image: "/logo.webp",
      },
      {
        name: "Ewa Kowalczyk",
        text: "Zadowolona z usług. Bardzo punktualni!",
        fullText: "Jestem bardzo zadowolona z usług tej firmy. Przyjechali punktualnie i dokładnie posprzątali całe mieszkanie. Polecam!",
        rating: 5,
        date: "10 stycznia 2023 р.",
        positives: ["Пунктуальність", "Якість"],
        image: "/logo.webp",
      },
    ],
  },
  uk: {
    headingPart1: "Відгуки Наших",
    headingPart2: "Клієнтів",
    subheading: "Дізнайтесь, що кажуть про нас наші клієнти",
    allReviews: "Усі відгуки",
    positivesLabel: "Позитивні моменти:",
    reviews: [
      {
        name: "Малгожата Пелка",
        text: "Чудовий контакт, пунктуальність і висока якість виконання замовлення.",
        fullText: "Чудовий контакт, пунктуальність і дуже висока якість виконання замовлення. Великий плюс за ефективну комунікацію!",
        rating: 5,
        date: "25 квітня 2023 р.",
        positives: ["Готовність до взаємодії", "Пунктуальність", "Якість", "Професіоналізм"],
        image: "/logo.webp",
      },
      {
        name: "",
        text: "",
        fullText: "",
        rating: 0,
        date: "",
        positives: [],
        isImageCard: true,
      },
      {
        name: "Роман",
        text: "Супер рекомендуємо! Офіс чистий і доглянутий, працівники приємні.",
        fullText: "Супер рекомендуємо! Завдяки компанії Arians тепер наш офіс дуже чистий і доглянутий. Дуже приємні працівники 👭, які виконують свою роботу на 💯 відсотків 💥 Рекомендую якнайкраще 💪💪🔥",
        rating: 5,
        date: "3 листопада 2022 р.",
        positives: ["Професіоналізм", "Ціни"],
        image: "/logo.webp",
      },
      {
        name: "Поліна Кілен",
        text: "Я задоволена. Чисто і ретельно.",
        fullText: "Я задоволена. Чисто та ретельно помили кухню та дві ванні кімнати, как я хотіла. Рекомендую.",
        rating: 5,
        date: "2 листопада 2022 р.",
        positives: [],
        image: "/logo.webp",
      },
      {
        name: "Барбара",
        text: "Рекомендую послуги Arians. Продовжуватиму.",
        fullText: "Дуже рекомендую послуги компанії Arians. Користувалася багато разів і точно продовжуватиму :)",
        rating: 5,
        date: "27 вересня 2022 р.",
        positives: ["Пунктуальність", "Якість", "Професіоналізм", "Ціни"],
        image: "/logo.webp",
      },
      {
        name: "Каміль Новак",
        text: "Чудова компанія! Все блищить після прибирання.",
        fullText: "Чудова компанія! Після прибирання все блищить, а команда була дуже професійною і ввічливою. Рекомендую!",
        rating: 5,
        date: "15 лютого 2023 р.",
        positives: ["Професіоналізм", "Якість"],
        image: "/logo.webp",
      },
      {
        name: "Єва Ковальчик",
        text: "Задоволена послугами. Дуже пунктуальні!",
        fullText: "Я дуже задоволена послугами цієї компанії. Приїхали вчасно і ретельно прибрали всю квартиру. Рекомендую!",
        rating: 5,
        date: "10 січня 2023 р.",
        positives: ["Пунктуальність", "Якість"],
        image: "/logo.webp",
      },
    ],
  },
  ru: {
    headingPart1: "Отзывы Наших",
    headingPart2: "Клиентов",
    subheading: "Узнайте, что говорят о нас наши клиенты",
    allReviews: "Все отзывы",
    positivesLabel: "Положительные моменты:",
    reviews: [
      {
        name: "Малгожата Пелка",
        text: "Отличный контакт, пунктуальность и высокое качество выполнения заказа.",
        fullText: "Отличный контакт, пунктуальность и очень высокое качество выполнения заказа. Большой плюс за эффективную коммуникацию!",
        rating: 5,
        date: "25 апреля 2023 г.",
        positives: ["Готовность к взаимодействию", "Пунктуальность", "Качество", "Профессионализм"],
        image: "/logo.webp",
      },
      {
        name: "",
        text: "",
        fullText: "",
        rating: 0,
        date: "",
        positives: [],
        isImageCard: true,
      },
      {
        name: "Роман",
        text: "Супер рекомендуем! Офис чистый и ухоженный, сотрудники приятные.",
        fullText: "Супер рекомендуем! Благодаря компании Arians наш офис теперь очень чистый и ухоженный. Очень приятные сотрудники 👭, которые выполняют свою работу на 💯 процентов 💥 Рекомендую как можно скорее 💪💪🔥",
        rating: 5,
        date: "3 ноября 2022 г.",
        positives: ["Профессионализм", "Цены"],
        image: "/logo.webp",
      },
      {
        name: "Полина Килен",
        text: "Я довольна. Кухню и ванные комнаты помыли чисто и тщательно.",
        fullText: "Я довольна. Кухню и две ванные комнаты помыли чисто и тщательно, как я хотела. Рекомендую.",
        rating: 5,
        date: "2 ноября 2022 г.",
        positives: [],
        image: "/logo.webp",
      },
      {
        name: "Барбара",
        text: "Рекомендую услуги Arians. Пользовалась много раз, буду продолжать.",
        fullText: "Очень рекомендую услуги компании Arians. Пользовалась много раз и точно буду продолжать :)",
        rating: 5,
        date: "27 сентября 2022 г.",
        positives: ["Пунктуальность", "Качество", "Профессионализм", "Цены"],
        image: "/logo.webp",
      },
      {
        name: "Камиль Новак",
        text: "Отличная компания! Все блестит после уборки.",
        fullText: "Отличная компания! После уборки все блестит, а команда была очень профессиональной и вежливой. Рекомендую!",
        rating: 5,
        date: "15 февраля 2023 г.",
        positives: ["Профессионализм", "Качество"],
        image: "/logo.webp",
      },
      {
        name: "Ева Ковальчик",
        text: "Довольна услугами. Очень пунктуальны!",
        fullText: "Я очень довольна услугами этой компании. Приехали вовремя и тщательно убрали всю квартиру. Рекомендую!",
        rating: 5,
        date: "10 января 2023 г.",
        positives: ["Пунктуальность", "Качество"],
        image: "/logo.webp",
      },
    ],
  },
  en: {
    headingPart1: "Our Clients’",
    headingPart2: "Reviews",
    subheading: "See what our clients say about us",
    allReviews: "All Reviews",
    positivesLabel: "Positive aspects:",
    reviews: [
      {
        name: "Małgorzata Pełka",
        text: "Great communication, punctuality, and high-quality service.",
        fullText: "Great communication, punctuality, and very high quality of service. A big plus for efficient communication!",
        rating: 5,
        date: "April 25, 2023",
        positives: ["Responsiveness", "Punctuality", "Quality", "Professionalism"],
        image: "/logo.webp",
      },
      {
        name: "",
        text: "",
        fullText: "",
        rating: 0,
        date: "",
        positives: [],
        isImageCard: true,
      },
      {
        name: "Roman",
        text: "Highly recommend! The office is clean and tidy, staff is very friendly.",
        fullText: "Highly recommend! Thanks to Arians, our office is now very clean and well-maintained. Very friendly staff 👭 who do their job at 💯 percent 💥 I recommend them as much as possible 💪💪🔥",
        rating: 5,
        date: "November 3, 2022",
        positives: ["Professionalism", "Pricing"],
        image: "/logo.webp",
      },
      {
        name: "Paulina Kilen",
        text: "I’m satisfied. The kitchen and bathrooms were cleaned thoroughly.",
        fullText: "I’m satisfied. The kitchen and two bathrooms were cleaned thoroughly and exactly as I wanted. I recommend them.",
        rating: 5,
        date: "November 2, 2022",
        positives: [],
        image: "/logo.webp",
      },
      {
        name: "Barb",
        text: "I recommend Arians’ services. I’ve used them multiple times and will continue.",
        fullText: "I highly recommend Arians’ services. I’ve used them multiple times and will definitely continue to do so :)",
        rating: 5,
        date: "September 27, 2022",
        positives: ["Punctuality", "Quality", "Professionalism", "Pricing"],
        image: "/logo.webp",
      },
      {
        name: "Kamil Nowak",
        text: "Great company! Everything shines after cleaning.",
        fullText: "Great company! Everything shines after cleaning, and the team was very professional and polite. I recommend them!",
        rating: 5,
        date: "February 15, 2023",
        positives: ["Professionalism", "Quality"],
        image: "/logo.webp",
      },
      {
        name: "Ewa Kowalczyk",
        text: "Satisfied with the services. Very punctual!",
        fullText: "I am very satisfied with this company's services. They arrived on time and thoroughly cleaned the entire apartment. I recommend them!",
        rating: 5,
        date: "January 10, 2023",
        positives: ["Punctuality", "Quality"],
        image: "/logo.webp",
      },
    ],
  },
};

export default function Reviews({ lang = "pl" }) {
  const { headingPart1, headingPart2, subheading, reviews, allReviews } = translations[lang] || translations.pl;
  const [isVisible, setIsVisible] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    setIsVisible(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrevClick = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const handleCardClick = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>
        <div className={styles.borderedContent}>
          <h2 className={`${styles.heading} ${isVisible ? styles.fadeIn : ""}`}>
            {headingPart1}{' '}
            <span className={styles.highlightedWrapper}>{headingPart2}</span>
          </h2>
          <p className={`${styles.subheading} ${isVisible ? styles.fadeIn : ""}`}>
            {subheading}
          </p>
          <div className={styles.reviewsContainerWrapper}>
            {isMobile ? (
              <>
                <div className={styles.imageCardWrapper}>
                  <div className={`${styles.imageCard}`}>
                    <div className={styles.imageCardContent}></div>
                  </div>
                </div>
                <div className={styles.reviewsSwiperWrapper}>
                  <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true, el: `.${styles.indicators}` }}
                    navigation={{
                      prevEl: `.${styles.leftArrow}`,
                      nextEl: `.${styles.rightArrow}`,
                    }}
                    speed={800}
                    effect="slide"
                    onSwiper={(swiper) => setSwiperInstance(swiper)}
                    className={styles.reviewsSwiper}
                  >
                    {reviews.filter(review => !review.isImageCard).map((review, index) => (
                      <SwiperSlide key={index}>
                        <div
                          className={`${styles.reviewCard} ${
                            index % 2 === 0 ? styles.lightPurple : styles.black
                          } ${flippedCards[index] ? styles.flipped : ""}`}
                          onClick={() => handleCardClick(index)}
                        >
                          <div className={styles.cardInner}>
                            <div className={styles.cardFront}>
                              <div className={styles.reviewContent}>
                                <img
                                  src="/icon/Vector.png"
                                  alt="Quote Icon"
                                  className={styles.quoteIcon}
                                />
                                <p className={styles.reviewText}>{review.text}</p>
                                <p className={styles.reviewDate}>{review.date}</p>
                                <div className={styles.rating}>
                                  {[...Array(review.rating)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className={styles.starIcon} />
                                  ))}
                                </div>
                              </div>
                              <div className={styles.reviewAuthor}>
                                <img
                                  src={review.image}
                                  alt={review.name}
                                  className={styles.authorImg}
                                />
                                <span>{review.name}</span>
                              </div>
                            </div>
                            <div className={styles.cardBack}>
                              <div className={styles.reviewContent}>
                                <p className={styles.fullReviewText}>{review.fullText}</p>
                                <div className={styles.rating}>
                                  {[...Array(review.rating)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className={styles.starIcon} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </>
            ) : (
              <div className={styles.reviewsContainer}>
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={10}
                  slidesPerView={1}
                  pagination={{ clickable: true, el: `.${styles.indicators}` }}
                  navigation={{
                    prevEl: `.${styles.leftArrow}`,
                    nextEl: `.${styles.rightArrow}`,
                  }}
                  speed={800}
                  effect="slide"
                  breakpoints={{
                    769: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    1025: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                  }}
                  onSwiper={(swiper) => setSwiperInstance(swiper)}
                  className={styles.reviewsSwiper}
                >
                  {reviews.map((review, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className={`${styles.reviewCard} ${
                          review.isImageCard
                            ? styles.imageCard
                            : index % 2 === 0
                            ? styles.lightPurple
                            : styles.black
                        } ${flippedCards[index] ? styles.flipped : ""}`}
                      >
                        {review.isImageCard ? (
                          <div className={styles.imageCardContent}></div>
                        ) : (
                          <div className={styles.cardInner}>
                            <div className={styles.cardFront}>
                              <div className={styles.reviewContent}>
                                <img
                                  src="/icon/Vector.png"
                                  alt="Quote Icon"
                                  className={styles.quoteIcon}
                                />
                                <p className={styles.reviewText}>{review.text}</p>
                                <p className={styles.reviewDate}>{review.date}</p>
                                <div className={styles.rating}>
                                  {[...Array(review.rating)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className={styles.starIcon} />
                                  ))}
                                </div>
                              </div>
                              <div className={styles.reviewAuthor}>
                                <img
                                  src={review.image}
                                  alt={review.name}
                                  className={styles.authorImg}
                                />
                                <span>{review.name}</span>
                              </div>
                              <div className={styles.fingerIcon}></div>
                            </div>
                            <div className={styles.cardBack}>
                              <div className={styles.reviewContent}>
                                <p className={styles.fullReviewText}>{review.fullText}</p>
                                <div className={styles.rating}>
                                  {[...Array(review.rating)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className={styles.starIcon} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
          <div className={styles.navigationArrows}>
            <button className={`${styles.arrow} ${styles.leftArrow}`} onClick={handlePrevClick}>←</button>
            <button className={`${styles.arrow} ${styles.rightArrow}`} onClick={handleNextClick}>→</button>
          </div>
          <div className={styles.indicators}></div>
          <div className={styles.buttons}>
            <button className={styles.allReviewsButton}>
              {allReviews}
              <FontAwesomeIcon icon={faArrowRight} className={styles.arrowRight} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}