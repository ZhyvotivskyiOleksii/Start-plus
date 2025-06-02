"use client";

import React, { useState, useRef } from "react";
import css from "./AboutUsSection.module.css";

const translations = {
  pl: {
    title: "O nas",
    readMore: "Czytać więcej",
    collapse: "Zwinąć",
    blocks: [
      {
        title: "O naszych propozycjach",
        text: (
          <>
            <p>
              Oferujemy kompleksowe usługi sprzątania, które obejmują zarówno mieszkania, domy prywatne, jak i biura. W naszym kalkulatorze znajdziesz szeroki wybór opcji – od sprzątania standardowego, przez sprzątanie po remontach, aż po profesjonalne mycie okien. Każda usługa jest dostosowana do indywidualnych potrzeb klienta, co pozwala nam zapewnić najwyższą jakość i pełne zadowolenie.
            </p>
            <p>
              Nasze usługi są elastyczne – możesz wybrać dogodny termin i częstotliwość sprzątania, a my zajmiemy się resztą. Dodatkowo oferujemy sprzątanie przestrzeni zewnętrznych, takich jak balkony czy tarasy, oraz sprzątanie po imprezach, aby Twój dom zawsze wyglądał nieskazitelnie. Dbamy o każdy szczegół, abyś mógł cieszyć się czystością bez zbędnego wysiłku.
            </p>
          </>
        ),
      },
      {
        title: "Jak pracujemy?",
        text: (
          <>
            <p>
              Nasz proces pracy jest prosty i przejrzysty. Po złożeniu zamówienia przez nasz kalkulator online, kontaktujemy się z Tobą, aby potwierdzić szczegóły i ustalić dogodny termin. Nasz zespół przyjeżdża na miejsce w wyznaczonym czasie, wyposażony w profesjonalne środki czystości i sprzęt, aby zapewnić najlepsze rezultaty.
            </p>
            <p>
              Podczas sprzątania zwracamy uwagę na każdy detal – od dokładnego czyszczenia podłóg, przez mycie okien, aż po sprzątanie trudno dostępnych miejsc. Po zakończeniu pracy zawsze upewniamy się, że jesteś w pełni zadowolony z efektów. Jeśli masz jakiekolwiek uwagi, chętnie je uwzględnimy, aby sprostać Twoim oczekiwaniom.
            </p>
            <p>
              Stawiamy na ekologiczne podejście – używamy środków przyjaznych dla środowiska, które są bezpieczne dla ludzi i zwierząt. Dzięki temu możesz mieć pewność, że Twoje mieszkanie nie tylko będzie czyste, ale również wolne od szkodliwych substancji chemicznych.
            </p>
          </>
        ),
      },
      {
        title: "Kim jesteśmy?",
        text: (
          <>
            <p>
              Jesteśmy doświadczoną firmą sprzątającą, która działa na rynku od wielu lat. Nasza misja to dostarczanie usług najwyższej jakości, które sprawiają, że życie naszych klientów staje się łatwiejsze i bardziej komfortowe. Zatrudniamy wykwalifikowanych pracowników, którzy przechodzą dokładną weryfikację, aby zapewnić bezpieczeństwo i profesjonalizm.
            </p>
            <p>
              Nasz zespół składa się z osób, które kochają to, co robią – sprzątanie to dla nas nie tylko praca, ale i pasja. Jesteśmy ubezpieczeni na 1 mln zł, co daje dodatkową gwarancję ochrony Twojego mienia. Współpracujemy zarówno z klientami indywidualnymi, jak i firmami, oferując usługi na najwyższym poziomie.
            </p>
            <p>
              Budujemy długotrwałe relacje z naszymi klientami, opierając się na zaufaniu i profesjonalizmie. Wielu z nich wraca do nas regularnie, doceniając naszą dbałość o szczegóły i elastyczne podejście do ich potrzeb.
            </p>
          </>
        ),
      },
      {
        title: "Dlaczego warto wybrać nas?",
        text: (
          <>
            <p>
              Wybierając naszą firmę, zyskujesz pewność, że Twoje potrzeby zostaną w pełni zaspokojone. Oferujemy konkurencyjne ceny, elastyczne terminy oraz zniżki za regularne sprzątanie, co sprawia, że nasze usługi są dostępne dla każdego. Nasi pracownicy są dokładnie weryfikowani, a wszystkie usługi są ubezpieczone na 1 mln zł, co gwarantuje bezpieczeństwo.
            </p>
            <p>
              Stawiamy na indywidualne podejście – słuchamy Twoich potrzeb i dostosowujemy nasze usługi, aby spełnić Twoje oczekiwania. Niezależnie od tego, czy potrzebujesz jednorazowego sprzątania, czy regularnych wizyt, zawsze zapewniamy ten sam wysoki standard. Nasz zespół jest zawsze punktualny i gotowy do pracy.
            </p>
            <p>
              Dodatkowo oferujemy ekologiczne środki czystości, które są bezpieczne dla Ciebie, Twojej rodziny i środowiska. Dzięki naszemu doświadczeniu i profesjonalizmowi możesz cieszyć się czystością bez stresu – my zajmiemy się wszystkim!
            </p>
          </>
        ),
      },
    ],
  },
  uk: {
    title: "Про нас",
    readMore: "Читати більше",
    collapse: "Згорнути",
    blocks: [
      {
        title: "Про наші пропозиції",
        text: (
          <>
            <p>
              Ми пропонуємо широкий спектр послуг прибирання, які охоплюють квартири, приватні будинки та офіси. У нашому калькуляторі ви можете обрати стандартне прибирання, прибирання після ремонту, миття вікон, а також прибирання великих будинків і офісів. Кожна послуга адаптується до ваших потреб, щоб забезпечити найвищу якість і повне задоволення.
            </p>
            <p>
              Наші послуги гнучкі – ви можете обрати зручний для вас час і частоту прибирання, а ми подбаємо про все інше. Ми також пропонуємо прибирання зовнішніх просторів, таких як балкони чи тераси, а також прибирання після вечірок, щоб ваш дім завжди виглядав ідеально. Ми дбаємо про кожну дрібницю, щоб ви могли насолоджуватися чистотою без зайвих зусиль.
            </p>
          </>
        ),
      },
      {
        title: "Як ми працюємо?",
        text: (
          <>
            <p>
              Наш процес роботи простий і прозорий. Після оформлення замовлення через калькулятор онлайн ми зв’яжемося з вами, щоб підтвердити деталі та узгодити зручний час. Наша команда прибуде на місце в зазначений час, оснащена професійними засобами для чищення та обладнанням, щоб забезпечити найкращі результати.
            </p>
            <p>
              Під час прибирання ми звертаємо увагу на кожну деталь – від ретельного чищення підлоги до миття вікон і прибирання важкодоступних місць. Після завершення роботи ми переконуємося, що ви повністю задоволені результатом. Якщо у вас є зауваження, ми з радістю їх врахуємо, щоб відповідати вашим очікуванням.
            </p>
            <p>
              Ми використовуємо екологічний підхід – застосовуємо засоби, безпечні для людей і тварин, які не шкодять довкіллю. Завдяки цьому ви можете бути впевнені, що ваша оселя буде не лише чистою, а й безпечною для всіх її мешканців.
            </p>
          </>
        ),
      },
      {
        title: "Хто ми?",
        text: (
          <>
            <p>
              Ми – професійна клінінгова компанія з багаторічним досвідом роботи на ринку. Наша мета – надавати послуги найвищої якості, які полегшують життя наших клієнтів і додають комфорту в їхній побут. Ми наймаємо лише кваліфікованих працівників, які проходять ретельну перевірку, щоб гарантувати безпеку та професіоналізм.
            </p>
            <p>
              Наша команда складається з людей, які люблять свою роботу – прибирання для нас не просто обов’язок, а справжнє покликання. Ми застраховані на 1 млн злотих, що забезпечує додатковий захист вашого майна. Ми співпрацюємо як із приватними клієнтами, так і з бізнесом, завжди надаючи послуги на найвищому рівні.
            </p>
            <p>
              Ми будуємо довготривалі відносини з нашими клієнтами, спираючись на довіру та професіоналізм. Багато хто з них повертається до нас знову і знову, цінуючи нашу увагу до деталей і гнучкий підхід до їхніх потреб.
            </p>
          </>
        ),
      },
      {
        title: "Чому варто обрати нас?",
        text: (
          <>
            <p>
              Обираючи нашу компанію, ви отримуєте впевненість, що ваші потреби будуть повністю задоволені. Ми пропонуємо конкурентні ціни, гнучкі терміни та знижки за регулярне прибирання, що робить наші послуги доступними для всіх. Наші працівники ретельно перевірені, а всі послуги застраховані на 1 млн злотих, що гарантує безпеку.
            </p>
            <p>
              Ми робимо акцент на індивідуальному підході – слухаємо ваші побажання та адаптуємо наші послуги, щоб відповідати вашим очікуванням. Незалежно від того, чи потрібне вам одноразове прибирання, чи регулярні візити, ми завжди забезпечуємо однаково високий стандарт. Наша команда завжди пунктуальна та готова до роботи.
            </p>
            <p>
              Ми також використовуємо екологічні засоби для чищення, які безпечні для вас, вашої родини та довкілля. Завдяки нашому досвіду та професіоналізму ви можете насолоджуватися чистотою без стресу – ми подбаємо про все!
            </p>
          </>
        ),
      },
    ],
  },
  ru: {
    title: "О нас",
    readMore: "Читать больше",
    collapse: "Свернуть",
    blocks: [
      {
        title: "О наших предложениях",
        text: (
          <>
            <p>
              Мы предлагаем широкий спектр услуг уборки, которые охватывают квартиры, частные дома и офисы. В нашем калькуляторе вы можете выбрать стандартную уборку, уборку после ремонта, мойку окон, а также уборку больших домов и офисов. Каждая услуга адаптируется под ваши потребности, чтобы обеспечить высочайшее качество и полное удовлетворение.
            </p>
            <p>
              Наши услуги гибкие – вы можете выбрать удобное для вас время и частоту уборки, а мы позаботимся обо всем остальном. Мы также предлагаем уборку внешних пространств, таких как балконы или террасы, а также уборку после вечеринок, чтобы ваш дом всегда выглядел идеально. Мы заботимся о каждой мелочи, чтобы вы могли наслаждаться чистотой без лишних усилий.
            </p>
          </>
        ),
      },
      {
        title: "Как мы работаем?",
        text: (
          <>
            <p>
              Наш процесс работы прост и прозрачен. После оформления заказа через калькулятор онлайн мы свяжемся с вами, чтобы подтвердить детали и согласовать удобное время. Наша команда прибудет на место в назначенное время, оснащенная профессиональными средствами для уборки и оборудованием, чтобы обеспечить наилучшие результаты.
            </p>
            <p>
              Во время уборки мы обращаем внимание на каждую деталь – от тщательной чистки пола до мойки окон и уборки труднодоступных мест. После завершения работы мы убеждаемся, что вы полностью довольны результатом. Если у вас есть замечания, мы с радостью их учтем, чтобы соответствовать вашим ожиданиям.
            </p>
            <p>
              Мы используем экологический подход – применяем средства, безопасные для людей и животных, которые не вредят окружающей среде. Благодаря этому вы можете быть уверены, что ваше помещение будет не только чистым, но и безопасным для всех его обитателей.
            </p>
          </>
        ),
      },
      {
        title: "Кто мы?",
        text: (
          <>
            <p>
              Мы – профессиональная клининговая компания с многолетним опытом работы на рынке. Наша цель – предоставлять услуги высочайшего качества, которые облегчают жизнь наших клиентов и добавляют комфорта в их быт. Мы нанимаем только квалифицированных сотрудников, которые проходят тщательную проверку, чтобы гарантировать безопасность и профессионализм.
            </p>
            <p>
              Наша команда состоит из людей, которые любят свою работу – уборка для нас не просто обязанность, а настоящее призвание. Мы застрахованы на 1 млн злотых, что обеспечивает дополнительную защиту вашего имущества. Мы сотрудничаем как с частными клиентами, так и с бизнесом, всегда предоставляя услуги на высшем уровне.
            </p>
            <p>
              Мы строим долгосрочные отношения с нашими клиентами, опираясь на доверие и профессионализм. Многие из них возвращаются к нам снова и снова, ценя нашу внимательность к деталям и гибкий подход к их потребностям.
            </p>
          </>
        ),
      },
      {
        title: "Почему стоит выбрать нас?",
        text: (
          <>
            <p>
              Выбирая нашу компанию, вы получаете уверенность, что ваши потребности будут полностью удовлетворены. Мы предлагаем конкурентные цены, гибкие сроки и скидки за регулярную уборку, что делает наши услуги доступными для всех. Наши сотрудники тщательно проверены, а все услуги застрахованы на 1 млн злотых, что гарантирует безопасность.
            </p>
            <p>
              Мы делаем акцент на индивидуальном подходе – слушаем ваши пожелания и адаптируем наши услуги, чтобы соответствовать вашим ожиданиям. Независимо от того, нужна ли вам разовая уборка или регулярные визиты, мы всегда обеспечиваем одинаково высокий стандарт. Наша команда всегда пунктуальна и готова к работе.
            </p>
            <p>
              Мы также используем экологические средства для уборки, которые безопасны для вас, вашей семьи и окружающей среды. Благодаря нашему опыту и профессионализму вы можете наслаждаться чистотой без стресса – мы позаботимся обо всем!
            </p>
          </>
        ),
      },
    ],
  },
  en: {
    title: "About Us",
    readMore: "Read More",
    collapse: "Collapse",
    blocks: [
      {
        title: "About Our Services",
        text: (
          <>
            <p>
              We offer a comprehensive range of cleaning services, covering apartments, private homes, and offices. Through our calculator, you can book standard cleaning, post-renovation cleaning, window cleaning, as well as cleaning for large homes and offices. Each service is tailored to your needs to ensure the highest quality and complete satisfaction.
            </p>
            <p>
              Our services are flexible – you can choose a convenient time and frequency for cleaning, and we’ll take care of the rest. We also offer cleaning of outdoor spaces like balconies or terraces, as well as post-party cleaning, so your home always looks impeccable. We focus on every detail, so you can enjoy cleanliness without any extra effort.
            </p>
          </>
        ),
      },
      {
        title: "How We Work?",
        text: (
          <>
            <p>
              Our work process is simple and transparent. After placing an order through our online calculator, we contact you to confirm the details and schedule a convenient time. Our team arrives at the designated time, equipped with professional cleaning products and equipment to deliver the best results.
            </p>
            <p>
              During cleaning, we pay attention to every detail – from thorough floor cleaning to window washing and tackling hard-to-reach areas. After finishing the job, we ensure you’re fully satisfied with the results. If you have any feedback, we’re happy to address it to meet your expectations.
            </p>
            <p>
              We adopt an eco-friendly approach – using cleaning products that are safe for people, pets, and the environment. This ensures that your space is not only clean but also free from harmful chemicals.
            </p>
          </>
        ),
      },
      {
        title: "Who We Are?",
        text: (
          <>
            <p>
              We are a professional cleaning company with many years of experience in the industry. Our mission is to provide top-quality services that make our clients’ lives easier and more comfortable. We hire only qualified employees who undergo thorough background checks to ensure safety and professionalism.
            </p>
            <p>
              Our team consists of individuals who love what they do – cleaning is not just a job for us, but a passion. We are insured for 1 million PLN, providing additional protection for your property. We work with both individual clients and businesses, always delivering services at the highest level.
            </p>
            <p>
              We build long-term relationships with our clients, based on trust and professionalism. Many of them return to us regularly, appreciating our attention to detail and flexible approach to their needs.
            </p>
          </>
        ),
      },
      {
        title: "Why Choose Us?",
        text: (
          <>
            <p>
              By choosing our company, you can be confident that your needs will be fully met. We offer competitive prices, flexible scheduling, and discounts for regular cleaning, making our services accessible to everyone. Our employees are thoroughly vetted, and all services are insured for 1 million PLN, ensuring safety.
            </p>
            <p>
              We emphasize a personalized approach – we listen to your requests and tailor our services to meet your expectations. Whether you need a one-time cleaning or regular visits, we always maintain the same high standard. Our team is always punctual and ready to work.
            </p>
            <p>
              We also use eco-friendly cleaning products that are safe for you, your family, and the environment. With our experience and professionalism, you can enjoy a clean space without stress – we’ll take care of everything!
            </p>
          </>
        ),
      },
    ],
  },
};

const AboutUsSection = ({ lang = "pl", id }) => {
  const { title, readMore, collapse, blocks } = translations[lang] || translations.pl;
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);

  const splitTitle = (str) => {
    const words = str.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };

  const [titleFirst, titleLast] = splitTitle(title);

  const handleToggle = () => {
    if (isExpanded) {
      // Скролимо до початку секції при згортанні
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <section className={css.aboutUsSection} id={id} ref={sectionRef}>
      <div className={css.container}>
        <h2 className={css.title}>
          {titleFirst} <span className={css.highlightedTitle}>{titleLast}</span>
        </h2>
        <div className={`${css.blocksWrapper} ${isExpanded ? css.expanded : css.collapsed}`}>
          <div className={css.blocks}>
            {blocks.map((block, index) => (
              <div key={index} className={css.block}>
                <h3 className={css.blockTitle}>{block.title}</h3>
                <div className={css.blockText}>{block.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={css.buttonWrapper}>
          <button className={css.toggleButton} onClick={handleToggle}>
            {isExpanded ? collapse : readMore}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;