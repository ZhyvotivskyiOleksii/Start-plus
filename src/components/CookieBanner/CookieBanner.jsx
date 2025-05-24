"use client";

import React, { useState, useEffect, useMemo } from "react";
import css from "./CookieBanner.module.css";

const dict = {
  pl: {
    title: "Najlepsza strona korzysta z plików cookie",
    description: `Wykorzystujemy pliki cookie do spersonalizowania treści i reklam, aby oferować funkcje społecznościowe i analizować ruch w naszej witrynie. Informacje o tym, jak korzystasz z naszej witryny, udostępniamy partnerom społecznościowym, reklamowym i analitycznym. Partnerzy mogą połączyć te informacje z innymi danymi otrzymanymi od Ciebie lub uzyskanymi podczas korzystania z ich usług.`,
    acceptAll: "Zezwól na wszystkie",
    acceptSel: "Zezwól na wybór",
    decline: "Odmowa",
    showDetails: "Pokaż szczegóły",
    tabs: { consent: "Zgoda", details: "Szczegóły", about: "O plikach cookies" },
    categories: {
      necessary: {
        label: "Niezbędne",
        desc: "Te pliki cookie są wymagane do prawidłowego działania serwisu i nie można ich wyłączyć. Są one niezbędne do zapewnienia podstawowych funkcji strony, takich jak nawigacja, bezpieczeństwo i ładowanie treści. Bez tych plików cookie strona może nie działać poprawnie, co wpłynie na komfort użytkowania. Używamy ich również do zapisywania Twoich preferencji dotyczących zgody na cookies, aby zapewnić Ci lepsze doświadczenie podczas kolejnych wizyt.",
        cookies: [
          {
            provider: "CookieConsent",
            name: "CookieConsent",
            purpose: "Przechowuje stan zgody użytkownika dla bieżącej domeny.",
            expiry: "1 rok",
            type: "HTTP",
          },
        ],
        expiryLabel: "Maks. okres / Expiry:",
        typeLabel: "Rodzaj / Type:",
      },
      preferences: {
        label: "Preferencje",
        desc: "Zapamiętują wybory użytkownika, takie jak wybrany język lub region. Dzięki tym plikom cookie możemy dostosować wygląd i funkcjonalność strony do Twoich indywidualnych preferencji, co sprawia, że korzystanie z witryny jest bardziej wygodne i spersonalizowane. Na przykład, możemy zapamiętać Twój preferowany język interfejsu, ustawienia wyświetlania lub inne opcje, które wybierasz podczas przeglądania strony. Wyłączenie tych plików cookie może sprawić, że niektóre funkcje strony będą mniej dostosowane do Twoich potrzeb.",
        cookies: [
          {
            provider: "LangPref",
            name: "site_lang",
            purpose: "Przechowuje preferowany język interfejsu.",
            expiry: "30 dni",
            type: "HTTP",
          },
        ],
        expiryLabel: "Maks. okres / Expiry:",
        typeLabel: "Rodzaj / Type:",
      },
      statistics: {
        label: "Statystyka",
        desc: "Pomagają nam zrozumieć, jak odwiedzający korzystają z witryny (anonimowo). Te pliki cookie zbierają dane statystyczne, które pozwalają nam analizować ruch na stronie, takie jak liczba odwiedzin, czas spędzony na stronie czy popularność poszczególnych sekcji. Dzięki temu możemy lepiej zrozumieć, co jest dla użytkowników najważniejsze, i ulepszać naszą witrynę, aby była bardziej funkcjonalna i przyjazna. Dane te są anonimowe i nie pozwalają na identyfikację konkretnych użytkowników, ale pomagają nam w optymalizacji strony.",
        cookies: [
          {
            provider: "Google Analytics",
            name: "_ga",
            purpose: "Generuje losowy identyfikator do zbierania danych statystycznych.",
            expiry: "2 lata",
            type: "HTTP",
          },
          {
            provider: "Google Analytics",
            name: "_ga_#",
            purpose: "Zachowuje stan sesji odwiedzającego.",
            expiry: "1 dzień",
            type: "HTTP",
          },
        ],
        expiryLabel: "Maks. okres / Expiry:",
        typeLabel: "Rodzaj / Type:",
      },
      marketing: {
        label: "Marketing",
        desc: "Służą do wyświetlania reklam dopasowanych do zainteresowań użytkownika. Te pliki cookie pozwalają nam i naszym partnerom reklamowym śledzić Twoje zachowanie na stronie i poza nią, aby dostarczać reklamy, które są bardziej relevantne dla Twoich zainteresowań. Mogą one również służyć do mierzenia skuteczności kampanii reklamowych. Wyłączenie tych plików cookie sprawi, że reklamy, które widzisz, będą mniej dopasowane do Ciebie, ale nie wpłynie to na ogólną funkcjonalność strony.",
        cookies: [
          {
            provider: "Meta Pixel",
            name: "_fbp",
            purpose: "Śledzi odwiedzających w celu wyświetlania trafnych reklam.",
            expiry: "3 miesiące",
            type: "HTTP",
          },
        ],
        expiryLabel: "Maks. okres / Expiry:",
        typeLabel: "Rodzaj / Type:",
      },
    },
    consentInfo: `Niniejsza strona korzysta z plików cookie
Wykorzystujemy pliki cookie do spersonalizowania treści i reklam, aby oferować funkcje społecznościowe i analizować ruch w naszej witrynie. Informacje o tym, jak korzystasz z naszej witryny, udostępniamy partnerom społecznościowym, reklamowym i analitycznym. Partnerzy mogą połączyć te informacje z innymi danymi otrzymanymi od Ciebie lub uzyskanymi podczas korzystania z ich usług.`,
    aboutInfo: `Pliki cookie (ciasteczka) to małe pliki tekstowe, które mogą być stosowane przez strony internetowe, aby użytkownicy mogli korzystać ze stron w bardziej sprawny sposób.

Prawo stanowi, że możemy przechowywać pliki cookie na urządzeniu użytkownika, jeśli jest to niezbędne do funkcjonowania niniejszej strony. Do wszystkich innych rodzajów plików cookie potrzebujemy zezwolenia użytkownika.

Niniejsza strona korzysta z różnych rodzajów plików cookie. Niektóre pliki cookie umieszczane są przez usługi stron trzecich, które pojawiają się na naszych stronach.

W dowolnej chwili możesz wycofać swoją zgodę w Deklaracji dot. plików cookie na naszej witrynie.

Dowiedz się więcej na temat tego, kim jesteśmy, jak można się z nami skontaktować i w jaki sposób przetwarzamy dane osobowe w ramach Polityki prywatności.

Prosimy o podanie identyfikatora Pana(Pani) zgody i daty kontaktu z nami w sprawie Pana(Pani) zgody.`,
  },
  uk: {
    title: "Цей сайт використовує файли cookie",
    description: `Ми використовуємо файли cookie для персоналізації контенту та реклами, щоб пропонувати соціальні функції та аналізувати трафік на нашому сайті. Інформацію про те, як ви використовуєте наш сайт, ми передаємо партнерам із соціальних мереж, реклами та аналітики. Партнери можуть поєднувати цю інформацію з іншими даними, отриманими від вас або зібраними під час використання їхніх послуг.`,
    acceptAll: "Дозволити всі",
    acceptSel: "Дозволити вибір",
    decline: "Відхилити",
    showDetails: "Показати деталі",
    tabs: { consent: "Згода", details: "Деталі", about: "Про файли cookies" },
    categories: {
      necessary: {
        label: "Необхідні",
        desc: "Ці файли cookie необхідні для правильної роботи сайту і не можуть бути відключені. Вони забезпечують базові функції, такі як навігація, безпека та завантаження вмісту. Без цих файлів cookie сайт може працювати неправильно, що вплине на ваш досвід. Ми також використовуємо їх для збереження ваших налаштувань згоди на використання cookies, щоб покращити ваш досвід при наступних відвідуваннях.",
        cookies: [
          {
            provider: "CookieConsent",
            name: "CookieConsent",
            purpose: "Зберігає стан згоди користувача для поточної домени.",
            expiry: "1 рік",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. період / Expiry:",
        typeLabel: "Тип / Type:",
      },
      preferences: {
        label: "Налаштування",
        desc: "Запам’ятовують вибір користувача, наприклад, мову або регіон. Ці файли cookie дозволяють нам адаптувати вигляд і функціональність сайту до ваших індивідуальних уподобань, що робить користування сайтом зручнішим і персоналізованішим. Наприклад, ми можемо зберегти вашу улюблену мову інтерфейсу, налаштування відображення або інші опції, які ви обираєте під час перегляду сайту. Вимкнення цих файлів cookie може зробити деякі функції сайту менш адаптованими до ваших потреб.",
        cookies: [
          {
            provider: "LangPref",
            name: "site_lang",
            purpose: "Зберігає обрану мову інтерфейсу.",
            expiry: "30 днів",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. період / Expiry:",
        typeLabel: "Тип / Type:",
      },
      statistics: {
        label: "Статистика",
        desc: "Допомагають нам зрозуміти, як відвідувачі взаємодіють із сайтом (анонімно). Ці файли cookie збирають статистичні дані, які дозволяють нам аналізувати трафік на сайті, наприклад, кількість відвідувань, час, проведений на сайті, або популярність окремих розділів. Завдяки цьому ми можемо краще зрозуміти, що є важливим для користувачів, і вдосконалювати наш сайт, щоб він був більш функціональним і зручним. Ці дані є анонімними і не дозволяють ідентифікувати конкретних користувачів, але допомагають нам у покращенні сайту.",
        cookies: [
          {
            provider: "Google Analytics",
            name: "_ga",
            purpose: "Генерує випадковий ідентифікатор для збору статистичних даних.",
            expiry: "2 роки",
            type: "HTTP",
          },
          {
            provider: "Google Analytics",
            name: "_ga_#",
            purpose: "Зберігає стан сесії відвідувача.",
            expiry: "1 день",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. період / Expiry:",
        typeLabel: "Тип / Type:",
      },
      marketing: {
        label: "Маркетинг",
        desc: "Використовуються для показу реклами, яка відповідає інтересам користувача. Ці файли cookie дозволяють нам і нашим рекламним партнерам відстежувати вашу поведінку на сайті та поза ним, щоб надавати рекламу, яка більше відповідає вашим інтересам. Вони також можуть використовуватися для вимірювання ефективності рекламних кампаній. Вимкнення цих файлів cookie призведе до того, що реклама, яку ви бачите, буде менш релевантною для вас, але це не вплине на загальну функціональність сайту.",
        cookies: [
          {
            provider: "Meta Pixel",
            name: "_fbp",
            purpose: "Відстежує відвідувачів для показу релевантної реклами.",
            expiry: "3 місяці",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. період / Expiry:",
        typeLabel: "Тип / Type:",
      },
    },
    consentInfo: "Тут ви можете розмістити короткий огляд правил і посилання на політику конфіденційності.",
    aboutInfo: "Повну політику cookie та FAQ можна знайти на окремій сторінці.",
  },
  ru: {
    title: "Этот сайт использует файлы cookie",
    description: `Мы используем файлы cookie для персонализации контента и рекламы, чтобы предлагать социальные функции и анализировать трафик на нашем сайте. Информацию о том, как вы используете наш сайт, мы передаем партнерам по социальным сетям, рекламе и аналитике. Партнеры могут комбинировать эту информацию с другими данными, полученными от вас или собранными при использовании их услуг.`,
    acceptAll: "Разрешить все",
    acceptSel: "Разрешить выбор",
    decline: "Отклонить",
    showDetails: "Показать детали",
    tabs: { consent: "Согласие", details: "Детали", about: "О файлах cookies" },
    categories: {
      necessary: {
        label: "Необходимые",
        desc: "Эти файлы cookie необходимы для правильной работы сайта и не могут быть отключены. Они обеспечивают базовые функции, такие как навигация, безопасность и загрузка контента. Без этих файлов cookie сайт может работать некорректно, что повлияет на ваш опыт. Мы также используем их для сохранения ваших настроек согласия на использование cookies, чтобы улучшить ваш опыт при следующих посещениях.",
        cookies: [
          {
            provider: "CookieConsent",
            name: "CookieConsent",
            purpose: "Сохраняет состояние согласия пользователя для текущего домена.",
            expiry: "1 год",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. период / Expiry:",
        typeLabel: "Тип / Type:",
      },
      preferences: {
        label: "Предпочтения",
        desc: "Запоминают выбор пользователя, например, язык или регион. Эти файлы cookie позволяют нам адаптировать внешний вид и функциональность сайта к вашим индивидуальным предпочтениям, что делает использование сайта более удобным и персонализированным. Например, мы можем сохранить ваш предпочитаемый язык интерфейса, настройки отображения или другие опции, которые вы выбираете при просмотре сайта. Отключение этих файлов cookie может сделать некоторые функции сайта менее адаптированными к вашим потребностям.",
        cookies: [
          {
            provider: "LangPref",
            name: "site_lang",
            purpose: "Сохраняет выбранный язык интерфейса.",
            expiry: "30 дней",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. период / Expiry:",
        typeLabel: "Тип / Type:",
      },
      statistics: {
        label: "Статистика",
        desc: "Помогают нам понять, как посетители взаимодействуют с сайтом (анонимно). Эти файлы cookie собирают статистические данные, которые позволяют нам анализировать трафик на сайте, например, количество посещений, время, проведенное на сайте, или популярность отдельных разделов. Благодаря этому мы можем лучше понять, что важно для пользователей, и улучшать наш сайт, чтобы он был более функциональным и удобным. Эти данные анонимны и не позволяют идентифицировать конкретных пользователей, но помогают нам в оптимизации сайта.",
        cookies: [
          {
            provider: "Google Analytics",
            name: "_ga",
            purpose: "Генерирует случайный идентификатор для сбора статистических данных.",
            expiry: "2 года",
            type: "HTTP",
          },
          {
            provider: "Google Analytics",
            name: "_ga_#",
            purpose: "Сохраняет состояние сессии посетителя.",
            expiry: "1 день",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. период / Expiry:",
        typeLabel: "Тип / Type:",
      },
      marketing: {
        label: "Маркетинг",
        desc: "Используются для показа рекламы, соответствующей интересам пользователя. Эти файлы cookie позволяют нам и нашим рекламным партнерам отслеживать ваше поведение на сайте и за его пределами, чтобы предоставлять рекламу, которая больше соответствует вашим интересам. Они также могут использоваться для измерения эффективности рекламных кампаний. Отключение этих файлов cookie приведет к тому, что реклама, которую вы видите, будет менее релевантной для вас, но это не повлияет на общую функциональность сайта.",
        cookies: [
          {
            provider: "Meta Pixel",
            name: "_fbp",
            purpose: "Отслеживает посетителей для показа релевантной рекламы.",
            expiry: "3 месяца",
            type: "HTTP",
          },
        ],
        expiryLabel: "Макс. период / Expiry:",
        typeLabel: "Тип / Type:",
      },
    },
    consentInfo: "Здесь вы можете разместить краткий обзор правил и ссылку на политику конфиденциальности.",
    aboutInfo: "Полную политику cookie и FAQ можно найти на отдельной странице.",
  },
  en: {
    title: "This site uses cookies",
    description: `We use cookies to personalize content and ads, to provide social features, and to analyze traffic on our site. Information about how you use our site is shared with our social, advertising, and analytics partners. Partners may combine this information with other data received from you or collected during your use of their services.`,
    acceptAll: "Allow all",
    acceptSel: "Allow selection",
    decline: "Decline",
    showDetails: "Show details",
    tabs: { consent: "Consent", details: "Details", about: "About Cookies" },
    categories: {
      necessary: {
        label: "Necessary",
        desc: "Essential for basic site functionality and cannot be disabled. These cookies ensure core features like navigation, security, and content loading work properly. Without them, the site may not function correctly, affecting your user experience. We also use them to save your cookie consent preferences for a better experience on future visits.",
        cookies: [
          {
            provider: "CookieConsent",
            name: "CookieConsent",
            purpose: "Stores the user's cookie consent state for the current domain.",
            expiry: "1 year",
            type: "HTTP",
          },
        ],
        expiryLabel: "Max. period / Expiry:",
        typeLabel: "Type / Type:",
      },
      preferences: {
        label: "Preferences",
        desc: "Remember user choices such as language or region. These cookies allow us to tailor the site's appearance and functionality to your individual preferences, making your experience more convenient and personalized. For example, we can save your preferred interface language, display settings, or other options you choose while browsing. Disabling these cookies may make some site features less tailored to your needs.",
        cookies: [
          {
            provider: "LangPref",
            name: "site_lang",
            purpose: "Saves the preferred UI language.",
            expiry: "30 days",
            type: "HTTP",
          },
        ],
        expiryLabel: "Max. period / Expiry:",
        typeLabel: "Type / Type:",
      },
      statistics: {
        label: "Statistics",
        desc: "Help us understand how visitors interact with the site (anonymously). These cookies collect statistical data, allowing us to analyze site traffic, such as the number of visits, time spent on the site, or the popularity of specific sections. This helps us understand what’s most important to users and improve our site to be more functional and user-friendly. The data is anonymous and doesn’t identify specific users but aids in site optimization.",
        cookies: [
          {
            provider: "Google Analytics",
            name: "_ga",
            purpose: "Generates a random ID to collect statistics.",
            expiry: "2 years",
            type: "HTTP",
          },
          {
            provider: "Google Analytics",
            name: "_ga_#",
            purpose: "Keeps session state of the visitor.",
            expiry: "1 day",
            type: "HTTP",
          },
        ],
        expiryLabel: "Max. period / Expiry:",
        typeLabel: "Type / Type:",
      },
      marketing: {
        label: "Marketing",
        desc: "Used to display ads that are relevant for each visitor. These cookies enable us and our advertising partners to track your behavior on and off the site to deliver ads that better match your interests. They may also be used to measure the effectiveness of ad campaigns. Disabling these cookies will result in less relevant ads, but it won’t affect the site’s overall functionality.",
        cookies: [
          {
            provider: "Meta Pixel",
            name: "_fbp",
            purpose: "Tracks visitors for targeted advertising.",
            expiry: "3 months",
            type: "HTTP",
          },
        ],
        expiryLabel: "Max. period / Expiry:",
        typeLabel: "Type / Type:",
      },
    },
    consentInfo: "Provide a short overview here and link to the full privacy policy.",
    aboutInfo: "Full cookie policy and FAQ can be found on a separate page.",
  },
};

const renderMultiLineText = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));
};

export default function CookieBanner({
  lang = "pl",
  onAcceptAll = () => {},
  onAcceptSelection = () => {},
  onDecline = () => {},
}) {
  const t = useMemo(() => dict[lang] || dict.pl, [lang]);

  const [openBanner, setOpenBanner] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState("details");
  const [sel, setSel] = useState({
    preferences: false,
    statistics: false,
    marketing: false,
  });
  const [errorMessage, setErrorMessage] = useState(null); // Додаємо стан для відображення помилок

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookiesAccepted");
      if (consent === null) {
        setOpenBanner(true);
        const storedSelection = localStorage.getItem("cookieSelection");
        if (storedSelection) {
          try {
            setSel(JSON.parse(storedSelection));
          } catch (error) {
            console.error("Failed to parse stored cookie selection:", error);
            setSel({ preferences: false, statistics: false, marketing: false });
          }
        }
      } else if (consent === "true") {
        setOpenBanner(false);
        setOpenModal(false);
        const storedSelection = localStorage.getItem("cookieSelection");
        if (storedSelection) {
          try {
            setSel(JSON.parse(storedSelection));
          } catch (error) {
            console.error("Failed to parse stored cookie selection:", error);
            setSel({ preferences: true, statistics: true, marketing: true });
          }
        } else {
          setSel({ preferences: true, statistics: true, marketing: true });
        }
      } else {
        setOpenBanner(true);
        const storedSelection = localStorage.getItem("cookieSelection");
        if (storedSelection) {
          try {
            const parsedSelection = JSON.parse(storedSelection);
            setSel({
              preferences: !!parsedSelection.preferences,
              statistics: !!parsedSelection.statistics,
              marketing: !!parsedSelection.marketing,
            });
          } catch (error) {
            console.error("Failed to parse stored cookie selection on declined state:", error);
            setSel({ preferences: false, statistics: false, marketing: false });
          }
        } else {
          setSel({ preferences: false, statistics: false, marketing: false });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (openModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = '';
      }
    };
  }, [openModal]);

  const toggle = (key) => setSel((s) => ({ ...s, [key]: !s[key] }));

  const save = async (accepted, selection = null) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookiesAccepted", accepted ? "true" : "false");
      let finalSelection;
      if (selection) {
        finalSelection = selection;
      } else if (!accepted) {
        finalSelection = { preferences: false, statistics: false, marketing: false };
      } else {
        finalSelection = { preferences: true, statistics: true, marketing: true };
      }
      localStorage.setItem("cookieSelection", JSON.stringify(finalSelection));
      setSel(finalSelection);
      setOpenBanner(false);
      setOpenModal(false);

      try {
        const userId = localStorage.getItem('userId');
        console.log("Saving consent to server:", { consent: finalSelection, userId }); // Лог перед відправкою

        const response = await fetch('http://localhost:3001/api/save-consent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consent: finalSelection,
            userId: userId || null,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log('Consent saved to database:', result);
          setErrorMessage(null); // Очищаємо повідомлення про помилку
        } else {
          console.error('Error saving consent to database:', result.message);
          setErrorMessage(result.message || 'Failed to save consent to database');
        }
      } catch (error) {
        console.error('Error saving consent to database:', error);
        setErrorMessage('Failed to save consent to database: Network error');
      }
    }
  };

  const handleShowDetails = () => {
    setOpenBanner(false);
    setTimeout(() => setOpenModal(true), 300);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      if (localStorage.getItem("cookiesAccepted") !== "true") {
        setOpenBanner(true);
      }
    }, 300);
  };

  const Switch = ({ value, onChange, disabled }) => {
    const buttonClasses = [css.switchBtn];
    if (value) {
      buttonClasses.push(css.switchBtnOn);
    }
    if (disabled) {
      buttonClasses.push(css.switchBtnDis);
    }

    return (
      <button
        disabled={disabled}
        onClick={onChange}
        className={buttonClasses.join(' ')}
        aria-pressed={value}
        type="button"
      >
        <span className={css.switchCircle} />
      </button>
    );
  };

  const categoryKeys = Object.keys(t.categories);
  const selKeys = Object.keys(sel);

  const cookieToggles = (
    <>
      <div className={css.switchItem}>
        <span className={css.switchLabel}>{t.categories.necessary.label}</span>
        <Switch value={true} disabled={true} />
      </div>
      {selKeys.map((k) => (
        <div key={k} className={css.switchItem}>
          <span className={css.switchLabel}>
            {t.categories[k]?.label || k}
          </span>
          <Switch value={sel[k]} onChange={() => toggle(k)} />
        </div>
      ))}
    </>
  );

  const Banner = (
    <div className={`${css.bannerWrap} ${css.shadow} ${openBanner ? css.show : css.hide}`}>
      <div className={css.bannerContent}>
        <div className={css.textCol}>
          <h2 className={css.h2}>{t.title}</h2>
          <p className={css.desc}>{renderMultiLineText(t.description)}</p>
          {errorMessage && (
            <p className={css.error} style={{ color: 'red', marginTop: '10px' }}>
              {errorMessage}
            </p>
          )}
          <div className={css.switchRow}>
            {cookieToggles}
            <button onClick={handleShowDetails} className={css.detailsLink}>
              {t.showDetails}
            </button>
          </div>
        </div>
        <div className={css.footer}>
          <div className={css.btnCol}>
            <button
              className={css.primary}
              onClick={() => {
                const allSelected = { preferences: true, statistics: true, marketing: true };
                onAcceptAll(allSelected);
                save(true, allSelected);
              }}
            >
              {t.acceptAll}
            </button>
            <button
              className={css.primary}
              onClick={() => {
                onAcceptSelection(sel);
                save(true, sel);
              }}
            >
              {t.acceptSel}
            </button>
            <button
              className={css.primary}
              onClick={() => {
                onDecline();
                save(false);
              }}
            >
              {t.decline}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = (
    <div className={`${css.modalContainer} ${openModal ? css.show : css.hide}`}>
      <div className={css.backdrop} onClick={handleCloseModal} />
      <div className={css.modal}>
        <div className={css.modalDialog}>
          <div className={css.modalContent}>
            <div className={css.modalHeader}>
              <h2 className={css.modalTitle}>
                {t.title}
                <span className={css.titleChevron}></span>
              </h2>
              <button onClick={handleCloseModal} className={css.closeButton} aria-label="Close modal">
                <span className={css.closeIcon}></span>
              </button>
            </div>
            <div className={css.modalBody}>
              <nav className={css.tabs}>
                {Object.keys(t.tabs).map((id) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`${css.tabBtn} ${tab === id ? css.tabActive : ""}`}
                  >
                    {t.tabs[id]}
                  </button>
                ))}
              </nav>

              {tab === "details" && (
                <section className={css.panel}>
                  {categoryKeys.map((key) => {
                    const category = t.categories[key];
                    if (!category) return null;
                    const isNecessary = key === "necessary";
                    return (
                      <details key={key} className={css.catBlock} open={isNecessary || undefined}>
                        <summary className={css.catHeader}>
                          <span className={css.catTitle}>
                            {category.label}
                            <span className={css.accordionChevron}></span>
                          </span>
                          <div className={css.catHeaderActions}>
                            <Switch
                              value={isNecessary || sel[key]}
                              disabled={isNecessary}
                              onChange={() => !isNecessary && toggle(key)}
                            />
                          </div>
                        </summary>
                        <div className={css.catContent}>
                          <p className={css.catDesc}>{category.desc}</p>
                          {category.cookies && category.cookies.map((c, idx) => (
                            <details key={idx} className={css.cookieCard}>
                              <summary className={css.cookieSummary}>
                                <span>{c.provider} - <i>{c.name}</i></span>
                                <span className={css.accordionChevron}></span>
                              </summary>
                              <div className={css.cookieContent}>
                                <p className={css.cookiePurpose}>{c.purpose}</p>
                                <div className={css.cookieMeta}>
                                  <div>
                                    <strong>{category.expiryLabel}</strong> {c.expiry}
                                  </div>
                                  <div>
                                    <strong>{category.typeLabel}</strong> {c.type}
                                  </div>
                                </div>
                              </div>
                            </details>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </section>
              )}

              {tab === "consent" && (
                <section className={css.panel}>
                  <p>{renderMultiLineText(t.consentInfo)}</p>
                  <div className={`${css.switchRow} ${css.consentSwitches}`}>
                    {cookieToggles}
                  </div>
                </section>
              )}

              {tab === "about" && (
                <section className={css.panel}>
                  <p>{renderMultiLineText(t.aboutInfo)}</p>
                </section>
              )}
            </div>
            <div className={css.modalFooter}>
              <p className={css.footerText}>
                Deklarację dot. plików cookie zaktualizowano ostatnio 08.05.25
              </p>
              <div className={css.footerButtons}>
                <button
                  className={css.primary}
                  onClick={() => {
                    onDecline();
                    save(false);
                  }}
                >
                  {t.decline}
                </button>
                <button
                  className={css.primary}
                  onClick={() => {
                    onAcceptSelection(sel);
                    save(true, sel);
                  }}
                >
                  {t.acceptSel}
                </button>
                <button
                  className={css.primary}
                  onClick={() => {
                    const allSelected = { preferences: true, statistics: true, marketing: true };
                    onAcceptAll(allSelected);
                    save(true, allSelected);
                  }}
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className={css.cookieBannerScope}>
        {Banner}
        {Modal}
      </div>
    </React.Fragment>
  );
}