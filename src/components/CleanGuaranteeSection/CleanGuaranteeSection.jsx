import React, { useEffect, useRef } from 'react';
import css from './CleanGuaranteeSection.module.css';

const translations = {
  pl: {
    title: "Przynosimy Czystość, Gwarantując Niezawodny Klinig w Warszawie",
    points: [
      { icon: "/icon/icon1.png", number: "Zadowolony Klient", text: "Zadowolony Klient – Nasz Priorytet. Dlatego pracujemy tylko z najlepszymi: sprzętem, środkami, specjalistami i klientami :)" },
      { number: "Zawsze na Czas", icon: "/icon/SpeedIcon.png", text: "Zawsze na Czas – Aby nie ryzykować zakłócenia Twoich planów, podczas oceny obiektu nie przeceniamy naszej szybkości i podajemy tylko realne terminy." },
      { number: "Sprawiedliwe Rozwiązanie", icon: "/icon/icon3.png", text: "Sprawiedliwe Rozwiązanie – Jeśli podczas sprzątania nasi pracownicy przypadkowo coś uszkodzą, w pełni zrekompensujemy wszelkie szkody materialne." },
      { number: "Żadnych Przestojów", icon: "/icon/icon4.png", text: "Żadnych Przestojów – Mamy wystarczającą liczbę specjalistów, aby uniknąć opóźnień. Jeśli jeden z nich nie może pracować, zastąpimy go." },
      { number: "Niezawodni Ludzie", icon: "/icon/icon5.png", text: "Niezawodni Ludzie – Na każdego członka naszego zespołu można śmiało polegać, ponieważ zebraliśmy najbardziej kompetentnych i odpowiedzialnych specjalistów z doświadczeniem." },
      { number: "Zawsze w Kontakcie", icon: "/icon/icon6.png", text: "Zawsze w Kontakcie – Pracujemy 24/7, więc dzwoń o każdej porze, a nasi menedżerowie zawsze odpowiedzą." },
    ],
  },
  uk: {
    title: "Ми Несемо Чистоту, Гарантуючи Надійний Клінінг у Варшаві",
    points: [
      { number: "Задоволений Клієнт", icon: "/icon/icon1.png", text: "Задоволений Клієнт – Наш Пріоритет. Тому ми працюємо тільки з найкращими: обладнанням, засобами, спеціалістами та клієнтами :)" },
      { number: "Завжди Вчасно", icon: "/icon/SpeedIcon.png", text: "Завжди Вчасно – Щоб не ризикувати зірвати ваші плани, під час оцінки об’єкта ми не переоцінюємо нашу швидкість і називаємо лише реальні терміни." },
      { number: "Справедливе Рішення", icon: "/icon/icon3.png", text: "Справедливе Рішення – Якщо під час прибирання наші співробітники випадково щось пошкодять, ми повністю відшкодуємо будь-які матеріальні збитки." },
      { number: "Жодних Простоїв", icon: "/icon/icon4.png", text: "Жодних Простоїв – У нас достатньо спеціалістів, щоб уникнути зривів термінів. Якщо один із них не може працювати, ми його замінимо." },
      { number: "Надійні Люди", icon: "/icon/icon5.png", text: "Надійні Люди – На кожного члена нашої команди можна сміливо покластися, адже ми зібрали найкомпетентніших і відповідальних спеціалістів із досвідом." },
      { number: "Завжди на Зв’язку", icon: "/icon/icon6.png", text: "Завжди на Зв’язку – Ми працюємо 24/7, тож телефонуйте в будь-який час, і наші менеджери завжди вам дадуть відповідь." },
    ],
  },
  ru: {
    title: "Мы Несём Чистоту, Гарантируя Надёжный Клининг в Варшаве",
    points: [
      { number: "Довольный Клиент", icon: "/icon/icon1.png", text: "Довольный Клиент – Наш Приоритет. Поэтому мы работаем только с лучшими: экипировкой, средствами, специалистами, клиентами :)" },
      { number: "Всегда Вовремя", icon: "/icon/SpeedIcon.png", text: "Всегда Вовремя – Чтобы не рисковать сорвать ваши планы, при оценке объекта мы не преувеличиваем свою скорость работы и называем только реальные сроки." },
      { number: "Справедливое Решение", icon: "/icon/icon3.png", text: "Справедливое Решение – Если во время уборки наши сотрудники что-то случайно заденут или испортят, мы полностью возместим любой материальный ущерб." },
      { number: "Никаких Простоев", icon: "/icon/icon4.png", text: "Никаких Простоев – У нас достаточно специалистов, чтобы не допускать срывы сроков. Если один из специалистов не выходит на работу – его заменят." },
      { number: "Надёжные Люди", icon: "/icon/icon5.png", text: "Надёжные Люди – На каждого сотрудника в нашей команде смело можно положиться, потому что мы собрали самых толковых и ответственных специалистов с опытом." },
      { number: "Всегда на Связи", icon: "/icon/icon6.png", text: "Всегда на Связи – Мы работаем круглосуточно, поэтому звоните в любое время, и наши менеджеры обязательно вам ответят." },
    ],
  },
  en: {
    title: "We Bring Cleanliness, Guaranteeing Reliable Cleaning in Warsaw",
    points: [
      { number: "Satisfied Client", icon: "/icon/icon1.png", text: "Satisfied Client – Our Priority. That’s why we work only with the best: equipment, products, specialists, and clients :)" },
      { number: "Always on Time", icon: "/icon/SpeedIcon.png", text: "Always on Time – To avoid disrupting your plans, we don’t overestimate our speed during assessment and provide only realistic timelines." },
      { number: "Fair Solution", icon: "/icon/icon3.png", text: "Fair Solution – If our staff accidentally damage something during cleaning, we will fully compensate for any material damage." },
      { number: "No Downtime", icon: "/icon/icon4.png", text: "No Downtime – We have enough specialists to avoid delays. If one of them can’t work, they will be replaced." },
      { number: "Reliable People", icon: "/icon/icon5.png", text: "Reliable People – You can confidently rely on every member of our team because we’ve gathered the most skilled and responsible specialists with experience." },
      { number: "Always Available", icon: "/icon/icon6.png", text: "Always Available – We work 24/7, so call us anytime, and our managers will always respond." },
    ],
  },
};

const CleanGuaranteeSection = ({ lang = "pl", id }) => {
  const { title, points } = translations[lang] || translations.pl;

  const splitTitle = (str) => {
    const words = str.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };

  const [titleFirst, titleLast] = splitTitle(title);

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

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

    if (row1Ref.current) observer.observe(row1Ref.current);
    if (row2Ref.current) observer.observe(row2Ref.current);

    return () => {
      if (row1Ref.current) observer.unobserve(row1Ref.current);
      if (row2Ref.current) observer.unobserve(row2Ref.current);
    };
  }, []);

  const firstRow = points.slice(0, 3);
  const secondRow = points.slice(3, 6);

  return (
    <section className={css.cleanGuaranteeSection} id={id}>
      <div className={css.container}>
        <h2 className={css.title}>
          {titleFirst} <span className={css.highlightedTitle}>{titleLast}</span>
        </h2>
        <div className={css.points}>
          <div className={css.row} ref={row1Ref}>
            {firstRow.map((point, index) => (
              <div key={index} className={css.point}>
                <div className={css.pointIcon}>
                  <img src={point.icon} alt={`${point.number} icon`} className={css.icon} />
                </div>
                <h3 className={css.pointNumber}>{point.number}</h3>
                <p className={css.pointText}>{point.text}</p>
              </div>
            ))}
          </div>
          <div className={css.row} ref={row2Ref}>
            {secondRow.map((point, index) => (
              <div key={index + 3} className={css.point}>
                <div className={css.pointIcon}>
                  <img src={point.icon} alt={`${point.number} icon`} className={css.icon} />
                </div>
                <h3 className={css.pointNumber}>{point.number}</h3>
                <p className={css.pointText}>{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CleanGuaranteeSection;