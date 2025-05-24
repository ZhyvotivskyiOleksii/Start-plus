import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import css from "./PrivacyPolicyPage.module.css";

/* ==== СЛОВАРЬ ПЕРЕВОДОВ ==== */
const dict = {
  pl: {
    title: "Polityka prywatności",
    version: "Wersja z dnia 22.11.2024",
    intro: "Niniejsza polityka prywatności („Polityka”) stanowi zbiór zasad, którymi kierujemy się w zakresie przetwarzania danych osobowych użytkowników strony internetowej i aplikacji („Serwisy”). Celem danej Polityki jest udzielenie informacji na temat sposobu przetwarzania danych osobowych użytkowników naszych Serwisów i naszych klientów:",
    introPoints: [
      "przy świadczeniu usług,",
      "podczas odwiedzania stron internetowych zarządzanych przez nas, oraz",
      "podczas korzystania z naszej aplikacji startplus-clean."
    ],
    section1: {
      title: "I. Podstawowe pojęcia",
      points: [
        "Dane osobowe - wszelkie informacje dotyczące zidentyfikowanej lub możliwej do zidentyfikowania osoby fizycznej.",
        "Przetwarzanie danych osobowych - wszelkie czynności wykonywane na danych osobowych, w tym ich zbieranie, utrwalanie, organizowanie, porządkowanie, przechowywanie, adaptowanie lub modyfikowanie, pobieranie, przeglądanie, wykorzystywanie, ujawnianie poprzez przesłanie, rozpowszechnianie lub innego rodzaju udostępnianie, dopasowywanie lub łączenie, ograniczanie, usuwanie lub niszczenie danych osobowych.",
        "Zgoda osoby, której dane dotyczą - dowolne i jednoznaczne wyrażenie woli Użytkownika, za pośrednictwem którego udziela on/ona zgody na przetwarzanie swoich danych osobowych w określonym celu.",
        "Uzasadniony interes - jedna z podstaw przetwarzania danych osobowych. Nasz uzasadniony interes opiera się na dążeniu do świadczenia wysokiej jakości usług przy zachowaniu priorytetu interesów, praw i wolności osoby, której dane dotyczą.",
        "Ciasteczka (cookies) - to niewielkie fragmenty danych, które powstają i przechowywane są na urządzeniu użytkownika (komputer, tablet, telefon komórkowy itp.) podczas odwiedzania/przeglądania Usług. Ciasteczka są używane do przechowywania ustawień użytkownika, prowadzenia statystyk i innych podobnych celów. Możesz w dowolnym momencie usunąć zapisane ciasteczka w ustawieniach swojej przeglądarki."
      ]
    },
    section2: {
      title: "II. Kto jest kim?",
      content: "startplus-clean („My”, „Firma”, „startplus-clean”) jest Administratorem danych osobowych (Data controller), czyli samodzielnie określa cele i środki przetwarzania danych osobowych oraz ma dostęp do danych osobowych.",
      points: [
        "startplus-clean NATALIIA ZHYVOTIVSKA. Administratorem danych osobowych Klienta przekazanych w formularzu rejestracyjnym oraz podmiotem przetwarzającym te dane jest Właściciel Portalu, tj. startplus-clean NATALIIA ZHYVOTIVSKA z siedzibą w Warszawie, ul. Edwarda Habicha 18/45, 02-495 Warszawa, NIP: 5242838146, REGON: 368071450, zwana dalej również „Administratorem”. Dane do kontaktu z Administratorem to: E-mail: info@startplus-clean.com.",
        "Użytkownicy i klienci (zwani również „Ty”) - osoba fizyczna, której dane dotyczą (Data subject) powyżej 16 roku życia, korzystająca ze strony internetowej i mająca możliwość skorzystania z naszych Usług.",
        "Dla efektywnego działania strony internetowej i świadczenia wysokiej jakości usług korzystamy z usług stron trzecich, które pełnią rolę Podmiotu przetwarzającego (Data processor), czyli osoby fizycznej lub prawnej, jednostkę lub innego podmiotu, który przetwarza dane osobowe w imieniu administratora. Należą do nich usługi hostingu, poczty elektronicznej, usługi wysyłki wiadomości, usługi gromadzenia statystyk odwiedzin, usługi logowania. Szczegóły znajdują się w sekcji „Odbiorcy”."
      ]
    },
    section3: {
      title: "III. Nasze praktyki dotyczące prywatności",
      subtitle: "Zasady",
      content: "Przetwarzamy Twoje dane osobowe zgodnie z zasadami ustanowionymi w Rozporządzeniu Ogólnym o Ochronie Danych Osobowych (RODO) w UE oraz w przepisy prawa Polski:",
      points: [
        "Zgodność z prawem (Lawfulness): Przetwarzamy Twoje dane osobowe tylko w przypadkach, gdy mamy podstawy zgodne z prawem.",
        "Rzetelność (Fairness): Przetwarzamy Twoje dane osobowe w sposób uczciwy i zgodny z Twoimi prawami.",
        "Przejrzystość (Transparency): Zapewniamy przejrzystość w zakresie przetwarzania Twoich danych osobowych i zapewniamy Ci dostęp do Twoich danych osobowych.",
        "Ograniczenie celu (Purpose limitation): Przetwarzamy Twoje dane osobowe tylko w celach określonych, o których informujemy Cię, i nie używamy ich do innych celów bez Twojej zgody lub zgodnych z prawem podstaw.",
        "Minimalizacja danych (Data minimization): Zbieramy tylko niezbędne dane i nie przetwarzamy ich w większym zakresie, niż jest to wymagane do celów przetwarzania.",
        "Prawidłowość danych (Data accuracy): Zapewniamy prawidłowość Twoich danych osobowych i aktualizujemy je w razie potrzeby. Zapewniamy również możliwość sprawdzenia i poprawienia swoich danych.",
        "Bezpieczeństwo danych (Data security): Zapewniamy bezpieczeństwo Twoich danych osobowych poprzez wprowadzenie odpowiednich środków technicznych i organizacyjnych, aby zapobiec nieuprawnionemu dostępowi, utracie lub ujawnieniu Twoich osobistych informacji. Szkolimy również naszych pracowników w zakresie przestrzegania zasad ochrony danych i zapewniamy kontrolę nad przetwarzaniem Twoich danych przez strony trzecie, jeżeli przetwarzają je w naszym imieniu."
      ],
      subtitle2: "Podstawy prawne, na których opieramy przetwarzanie Twoich danych:",
      points2: [
        "Umowa: przetwarzanie jest niezbędne do wykonania umowy, którą zawarliśmy z Tobą, lub do podjęcia określonych działań przed zawarciem tej umowy.",
        "Obowiązek prawny: przetwarzanie jest niezbędne do wypełnienia obowiązku prawnego.",
        "Prawnie zasadniony interes: przetwarzanie jest niezbędne do realizacji naszych prawnie uzasadnionych interesów, o ile nasze interesy nie przeważają nad interesami lub podstawowymi prawami i wolnościami osoby, której dane dotyczą.",
        "Zgoda: udzieliłeś/aś jasnej zgody na przetwarzanie swoich danych osobowych w określonym celu."
      ]
    },
    section4: {
      title: "IV. W jaki sposób przetwarzamy Twoje dane?",
      content: "Poniżej znajdziesz informacje dotyczące danych, które zbieramy, w jakim celu, na jakiej podstawie prawnej oraz jak długo przechowujemy te dane.",
      subtitle: "W jaki sposób wykorzystujemy dane, które nam bezpośrednio przekazałeś/aś?",
      subtitle2: "Podstawa prawna - umowa",
      points: [
        "Tworzenie konta, składanie zamówień oraz udzielanie odpowiedzi na wszelkie pytania związane z ich realizacją. W tym celu prosimy o podanie Twojego imienia, nazwiska, numeru telefonu, adresu e-mail, pełnego adresu, żądanej usługi oraz ewentualnych dodatkowych uwag dotyczących zamawianej usługi oraz sposobu płatności. Dane te są przetwarzane w celu wykonania umowy i podjęcia niezbędnych działań przed jej zawarciem. Podanie danych osobowych jest dobrowolne, jednak ich niepodanie uniemożliwi świadczenie usługi.",
        "Przechowujemy Twoje dane, dopóki posiadasz aktywne konto. Po upływie jednego roku od usunięcia konta anonimizujemy Twoje dane, jeśli nie są one potrzebne do osiągnięcia innych celów, na przykład na żądanie prawa.",
        "Dostarczamy Ci możliwość dokonania płatności za nasze usługi online. W celu dokonania płatności online prosimy o podanie numeru karty debetowej/kredytowej, jej daty ważności oraz kodu CVV. Transakcje płatnicze za pomocą popularnych metod płatności (Visa/Mastercard) są realizowane wyłącznie za pośrednictwem zaszyfrowanego połączenia SSL. Można je rozpoznać po zmianie adresu w pasku przeglądarki z \"http://\" na \"https://\", a także po symbolu \"kłódki\" w pasku adresu. Nie przechowujemy tych danych po dokonaniu płatności. Ponadto, udostępniamy możliwość płatności za pośrednictwem Google Pay, Apple Pay oraz PayU.",
        "Aplikowanie na naszą ofertę pracy. W tym celu prosimy o podanie pełnego imienia, numeru kontaktowego, opisu Twojego zapytania, adresu e-mail i/lub innej formy kontaktu z Tobą. Jeśli po rozpatrzeniu Twojej aplikacji zdecydujemy się na współpracę, przechowujemy Twoje dane przez okres wymagany przez obowiązujące przepisy polskiego prawa. W przeciwnym przypadku przechowujemy Twoje dane nie dłużej niż 6 miesięcy."
      ],
      subtitle3: "Podstawa prawna – uzasadniony interes",
      points2: [
        "Ocena naszej usługi. Po świadczeniu usługi prosimy o jej ocenę. W tym celu przetwarzamy Twoje dane kontaktowe, informacje dotyczące świadczonej usługi, ocenę i opinię."
      ],
      subtitle4: "Podstawa prawna – obowiązek prawny",
      points3: [
        "Spełnienie wymogów prawa. W celu wypełnienia naszych obowiązków prawnych i podatkowych możemy przetwarzać Twoje dane osobowe. Obejmuje to przetwarzanie danych w celach księgowości i opodatkowania usług oraz w celu spełnienia wymogów prawa określonych w specjalnych ustawach, np. w celu potrzeb postępowania karnego lub w celu spełnienia obowiązku współpracy z policją."
      ],
      subtitle5: "Podstawa prawna – zgoda i/lub soft opt-in",
      points4: [
        "Wysyłka wiadomości marketingowych drogą elektroniczną. Przy rejestracji i/lub składaniu zamówienia dajemy Ci możliwość wyrażenia zgody lub odmowy na otrzymywanie wiadomości marketingowych. Jeśli wyraziłeś/aś zgodę na otrzymywanie newslettera, w każdej chwili możesz ją wycofać, klikając przycisk \"Anuluj subskrypcję\" w każdej otrzymanej wiadomości lub wysyłając do nas wiadomość e-mail na podany adres: info@startplus-clean.com."
      ],
      subtitle6: "W jaki sposób wykorzystujemy dane gromadzone za pośrednictwem przeglądarki internetowej?",
      points5: [
        "Bezpieczeństwo i ochrona naszej strony internetowej. Korzystamy z usług Cloudflare Inc. w celu zwiększenia bezpieczeństwa i ochrony naszej strony internetowej przed atakami hakerskimi. Podstawą prawną przetwarzania danych jest nasz uzasadniony interes.",
        "Ulepszenie naszej strony internetowej i analiza ruchu sieciowego. Jeśli wyraziłeś/aś zgodę, możemy korzystać z narzędzi takich jak Google Analytics do zbierania statystyk. Na podstawie tych danych rozumiemy rozmiar naszej publiczności i planujemy ulepszenia naszych usług. Dane przechowywane są zgodnie z Polityką Prywatności Google.",
        "Reklama. Jeśli wyraziłeś/aś zgodę, możemy korzystać z narzędzi takich jak Google Ads, aby uwzględniać zachowanie odwiedzających stronę internetową w przyszłych kampaniach reklamowych. Dane przechowywane są zgodnie z Polityką Prywatności Google."
      ]
    },
    section5: {
      title: "V. Dane osobowe dzieci",
      content: "Nie zbieramy żadnych informacji dotyczących wieku naszych odwiedzających. Jednakże, zasadniczo nie świadczymy usług osobom poniżej 16 roku życia. Jeśli jesteś rodzicem lub opiekunem dziecka, którego dane osobowe w jakiś sposób zostały umieszczone na naszej stronie, prosimy o natychmiastowy kontakt z nami, a my usuniemy te informacje."
    },
    section6: {
      title: "VI. Odbiorcy",
      content: "Nie udostępniamy i nie ujawniamy Twoich danych nikomu bez Twojej wiedzy. Odbiorcami Twoich danych mogą być:",
      points: [
        "Grupa startplus-clean. Nasze biura znajdują się w Polsce.",
        "Organizacje / osoby fizyczne, z którymi współpracujemy. Możemy przekazywać Twoje dane naszym specjalistom, którzy bezpośrednio świadczą Ci usługi. Podjęliśmy wszelkie niezbędne środki, aby chronić Twoje dane. Wszyscy odbiorcy, którym możemy przekazywać Twoje dane osobowe, również podejmują wszelkie niezbędne środki ochrony w odniesieniu do Twoich danych, poufnie przechowują Twoje dane i wykorzystują je tylko do wykonywania zadań w naszym imieniu."
      ],
      subtitle: "Serwisy, których używamy do świadczenia usług",
      subtitle2: "Serwisy płatności:",
      points2: [
        "PayU. Serwis jest świadczony przez firmę PayU S.A. Polityka Prywatności PayU.",
        "Google Pay. Serwis jest świadczony przez firmę Google. Polityka Prywatności Google.",
        "Apple Pay. Serwis jest świadczony przez firmę Apple Inc. Polityka Prywatności Apple."
      ],
      subtitle3: "Pocztowe, hostingowe i inne serwisy:",
      points3: [
        "Mailchimp. Jest to serwis do wysyłania biuletynów. Serwis jest świadczony przez firmę Intuit Inc. Informacje dotyczące ochrony danych MailChimp można znaleźć na stronie internetowej. Ogólna polityka prywatności Intuit znajduje się tutaj.",
        "Digital Ocean. Nasza witryna jest hostowana na platformie DigitalOcean LLC. Więcej informacji można znaleźć tutaj.",
        "Cloudflare. Serwis jest świadczony przez firmę Cloudflare Inc. Polityka Prywatności Cloudflare.",
        "Twilio. Serwis jest świadczony przez firmę Twilio Inc. Polityka Prywatności Twilio."
      ],
      subtitle4: "Serwisy analityczne i reklamowe:",
      points4: [
        "Google Analytics, Google Ads. Serwisy są świadczone przez firmę Google. Polityka Prywatności Google."
      ]
    },
    section7: {
      title: "VII. Zautomatyzowane podejmowanie decyzji w indywidualnych przypadkach",
      content: "Zautomatyzowane podejmowanie decyzji w indywidualnych przypadkach to proces podejmowania decyzji przy użyciu narzędzi automatycznych bez żadnego udziału człowieka. Nie podejmujemy żadnych wyłącznie automatycznych decyzji i nie prowadzimy profilowania."
    },
    section8: {
      title: "VIII. Aktualizacja polityki",
      content: "Możemy zmieniać Politykę w dowolnym czasie. Na początku tekstu jest podana wersja dokumentu i czas, od którego zmiany wchodzą w życie. Jeśli wprowadzamy istotne zmiany w Polityce (np. dodajemy nowe cele przetwarzania danych osobowych lub nowe kategorie gromadzonych danych osobowych), poprosimy o zgodę na zaktualizowaną Politykę. Kontynuując korzystanie z naszych Serwisów po aktualizacji Polityki, wyrażasz zgodę i akceptujesz nową Politykę. Poprzednie wersje są dostępne na żądanie w firmie pod podanymi w Polityce kontaktami."
    },
    section9: {
      title: "IX. Twoje prawa",
      content: "Zgodnie z przepisami prawa Unii Europejskiej oraz Polski masz prawo do realizacji określonych praw w dowolnym momencie, składając odpowiednie żądania pocztą (adres: ul. Edwarda Habicha 18/45, 02-495 Warszawa) lub drogą elektroniczną (info@startplus-clean.com).",
      subtitle: "Masz prawo do:",
      points: [
        "dostępu (więcej informacji).",
        "sprostowania (więcej informacji).",
        "usunięcia (więcej informacji).",
        "ograniczenia przetwarzania (więcej informacji).",
        "sprzeciwu (więcej informacji).",
        "przenoszenia danych (więcej informacji).",
        "składania skargi do organu nadzorczego (w Polsce – UODO)."
      ]
    },
    section10: {
      title: "X. Nasze kontakty",
      content: "W sprawach dotyczących polityki prywatności i danych osobowych można się z nami skontaktować drogą mailową info@startplus-clean.com. Zobowiązujemy się do udzielenia odpowiedzi bez nieuzasadnionych opóźnień, w każdym przypadku w ciągu jednego miesiąca od otrzymania zapytania. W razie potrzeby termin ten można przedłużyć o kolejne dwa miesiące z uwagi na skomplikowany charakter żądania lub liczbę żądań. Dostęp osób trzecich do korespondencji jest ograniczony i nie może być ujawniony bez Twojej pisemnej zgody."
    },
    backButton: "Powrót",
  },
  uk: {
    title: "Політика конфіденційності",
    version: "Версія від 22.11.2024",
    intro: "Ця політика конфіденційності („Політика”) є сукупністю принципів, якими ми керуємося під час обробки персональних даних користувачів вебсайту та додатку („Сервіси”). Метою цієї Політики є надання інформації про спосіб обробки персональних даних користувачів наших Сервісів та клієнтів:",
    introPoints: [
      "під час надання послуг,",
      "під час відвідування вебсайтів, якими ми керуємо, та",
      "під час використання нашого додатку startplus-clean."
    ],
    section1: {
      title: "I. Основні поняття",
      points: [
        "Персональні дані - будь-яка інформація, що стосується ідентифікованої або можливої для ідентифікації фізичної особи.",
        "Обробка персональних даних - будь-які дії, що виконуються з персональними даними, включаючи їх збирання, фіксацію, організацію, впорядкування, зберігання, адаптацію або зміну, витягування, перегляд, використання, розкриття шляхом передачі, поширення або іншого виду надання доступу, узгодження чи поєднання, обмеження, видалення або знищення персональних даних.",
        "Згода особи, чиї дані стосуються - будь-яке однозначне вираження волі Користувача, за допомогою якого він/вона дає згоду на обробку своїх персональних даних із визначеною метою.",
        "Обґрунтований інтерес - одна з підстав обробки персональних даних. Наш обґрунтований інтерес ґрунтується на прагненні надавати послуги високої якості, зберігаючи пріоритет інтересів, прав і свобод особи, чиї дані стосуються.",
        "Файли cookie - це невеликі фрагменти даних, які створюються і зберігаються на пристрої користувача (комп’ютер, планшет, мобільний телефон тощо) під час відвідування/перегляду Сервісів. Файли cookie використовуються для зберігання налаштувань користувача, ведення статистики та інших подібних цілей. Ви можете в будь-який момент видалити збережені файли cookie в налаштуваннях вашого браузера."
      ]
    },
    section2: {
      title: "II. Хто є ким?",
      content: "startplus-clean („Ми”, „Компанія”, „startplus-clean”) є Адміністратором персональних даних (Data controller), тобто самостійно визначає цілі та засоби обробки персональних даних і має доступ до персональних даних.",
      points: [
        "startplus-clean NATALIIA ZHYVOTIVSKA. Адміністратором персональних даних Клієнта, переданих у формі реєстрації, а також суб’єктом, що обробляє ці дані, є Власник Порталу, тобто startplus-clean NATALIIA ZHYVOTIVSKA з місцезнаходженням у Варшаві, вул. Едварда Хабіха 18/45, 02-495 Варшава, NIP: 5242838146, REGON: 368071450, надалі також „Адміністратор”. Дані для контакту з Адміністратором: E-mail: info@startplus-clean.com.",
        "Користувачі та клієнти (надалі також „Ти”) - фізична особа, чиї дані стосуються (Data subject), віком від 16 років, яка використовує вебсайт і має можливість скористатися нашими Послугами.",
        "Для ефективної роботи вебсайту та надання послуг високої якості ми використовуємо послуги третіх сторін, які виконують роль Обробника даних (Data processor), тобто фізичної чи юридичної особи, установи чи іншого суб’єкта, який обробляє персональні дані від імені адміністратора. До них належать послуги хостингу, електронної пошти, послуги надсилання повідомлень, послуги збору статистики відвідувань, послуги авторизації. Деталі наведені в розділі „Одержувачі”."
      ]
    },
    section3: {
      title: "III. Наші практики щодо конфіденційності",
      subtitle: "Принципи",
      content: "Ми обробляємо твої персональні дані відповідно до принципів, встановлених Загальним регламентом про захист даних (GDPR) у ЄС та положень законодавства Польщі:",
      points: [
        "Законність (Lawfulness): Ми обробляємо твої персональні дані лише у випадках, коли маємо законні підстави.",
        "Чесність (Fairness): Ми обробляємо твої персональні дані чесно та відповідно до твоїх прав.",
        "Прозорість (Transparency): Ми забезпечуємо прозорість щодо обробки твоїх персональних даних і надаємо тобі доступ до твоїх персональних даних.",
        "Обмеження мети (Purpose limitation): Ми обробляємо твої персональні дані лише з визначених цілей, про які ми тебе інформуємо, і не використовуємо їх для інших цілей без твоєї згоди або законних підстав.",
        "Мінімізація даних (Data minimization): Ми збираємо лише необхідні дані і не обробляємо їх у більшому обсязі, ніж потрібно для цілей обробки.",
        "Точність даних (Data accuracy): Ми забезпечуємо точність твоїх персональних даних і оновлюємо їх за потреби. Ми також надаємо тобі можливість перевірити та виправити свої дані.",
        "Безпека даних (Data security): Ми забезпечуємо безпеку твоїх персональних даних шляхом впровадження відповідних технічних і організаційних заходів для запобігання несанкціонованому доступу, втраті або розголошенню твоєї особистої інформації. Ми також навчаємо наших працівників дотримуватися принципів захисту даних і забезпечуємо контроль за обробкою твоїх даних третіми сторонами, якщо вони обробляються від нашого імені."
      ],
      subtitle2: "Правові підстави, на яких ми базуємо обробку твоїх даних:",
      points2: [
        "Договір: обробка необхідна для виконання договору, який ми уклали з тобою, або для вжиття певних заходів перед укладенням цього договору.",
        "Юридичний обов’язок: обробка необхідна для виконання юридичного обов’язку.",
        "Законний інтерес: обробка необхідна для реалізації наших законних інтересів, якщо наші інтереси не переважають над інтересами або основними правами і свободами особи, чиї дані стосуються.",
        "Згода: ти надав/ла чітку згоду на обробку своїх персональних даних із визначеною метою."
      ]
    },
    section4: {
      title: "IV. Як ми обробляємо твої дані?",
      content: "Нижче ти знайдеш інформацію про дані, які ми збираємо, з якою метою, на якій правовій основі та як довго ми їх зберігаємо.",
      subtitle: "Як ми використовуємо дані, які ти нам безпосередньо надав/ла?",
      subtitle2: "Правова основа - договір",
      points: [
        "Створення облікового запису, оформлення замовлень та надання відповідей на будь-які питання, пов’язані з їх виконанням. Для цього ми просимо надати твоє ім’я, прізвище, номер телефону, адресу електронної пошти, повну адресу, бажану послугу та можливі додаткові коментарі щодо замовленої послуги та способу оплати. Ці дані обробляються з метою виконання договору та вжиття необхідних заходів перед його укладенням. Надання персональних даних є добровільним, але їх ненадання унеможливить надання послуги.",
        "Ми зберігаємо твої дані, доки у тебе є активний обліковий запис. Після закінчення одного року з моменту видалення облікового запису ми анонімізуємо твої дані, якщо вони не потрібні для досягнення інших цілей, наприклад, на вимогу закону.",
        "Ми надаємо тобі можливість здійснити оплату за наші послуги онлайн. Для цього ми просимо надати номер дебетової/кредитної картки, її термін дії та код CVV. Платіжні транзакції за допомогою популярних методів оплати (Visa/Mastercard) здійснюються виключно через зашифроване з’єднання SSL. Його можна розпізнати за зміною адреси в рядку браузера з \"http://\" на \"https://\", а також за символом \"замка\" у рядку адреси. Ми не зберігаємо ці дані після здійснення оплати. Крім того, ми надаємо можливість оплати через Google Pay, Apple Pay та PayU.",
        "Подання заявки на нашу пропозицію роботи. Для цього ми просимо надати повне ім’я, контактний номер, опис твого запиту, адресу електронної пошти та/або іншу форму зв’язку з тобою. Якщо після розгляду твоєї заявки ми вирішимо співпрацювати, ми зберігатимемо твої дані протягом періоду, визначеного чинним польським законодавством. В іншому випадку ми зберігаємо твої дані не довше 6 місяців."
      ],
      subtitle3: "Правова основа – законний інтерес",
      points2: [
        "Оцінка нашої послуги. Після надання послуги ми просимо її оцінити. Для цього ми обробляємо твої контактні дані, інформацію про надану послугу, оцінку та відгук."
      ],
      subtitle4: "Правова основа – юридичний обов’язок",
      points3: [
        "Виконання вимог закону. Для виконання наших юридичних і податкових обов’язків ми можемо обробляти твої персональні дані. Це включає обробку даних для бухгалтерського обліку та оподаткування послуг, а також для виконання вимог законодавства, визначених спеціальними законами, наприклад, для потреб кримінального провадження або для виконання обов’язку співпраці з поліцією."
      ],
      subtitle5: "Правова основа – згода та/або soft opt-in",
      points4: [
        "Надсилання маркетингових повідомлень електронною поштою. Під час реєстрації та/або оформлення замовлення ми надаємо тобі можливість погодитися або відмовитися від отримання маркетингових повідомлень. Якщо ти погодився/лась отримувати розсилку, ти можеш у будь-який момент скасувати цю згоду, натиснувши кнопку \"Відписатися\" у кожному отриманому повідомленні або надіславши нам електронний лист на вказану адресу: info@startplus-clean.com."
      ],
      subtitle6: "Як ми використовуємо дані, зібрані через веббраузер?",
      points5: [
        "Безпека та захист нашого вебсайту. Ми використовуємо послуги Cloudflare Inc. для підвищення безпеки та захисту нашого вебсайту від хакерських атак. Правовою основою обробки даних є наш законний інтерес.",
        "Покращення нашого вебсайту та аналіз мережевого трафіку. Якщо ти дав/ла згоду, ми можемо використовувати такі інструменти, як Google Analytics, для збору статистики. На основі цих даних ми розуміємо розмір нашої аудиторії та плануємо покращення наших послуг. Дані зберігаються відповідно до Політики конфіденційності Google.",
        "Реклама. Якщо ти дав/ла згоду, ми можемо використовувати такі інструменти, як Google Ads, щоб враховувати поведінку відвідувачів вебсайту в майбутніх рекламних кампаніях. Дані зберігаються відповідно до Політики конфіденційності Google."
      ]
    },
    section5: {
      title: "V. Персональні дані дітей",
      content: "Ми не збираємо жодної інформації про вік наших відвідувачів. Однак ми, за принципом, не надаємо послуги особам віком до 16 років. Якщо ти є батьком або опікуном дитини, чиї персональні дані якимось чином потрапили на наш сайт, просимо негайно зв’язатися з нами, і ми видалимо цю інформацію."
    },
    section6: {
      title: "VI. Одержувачі",
      content: "Ми не передаємо і не розголошуємо твої дані нікому без твого відома. Одержувачами твоїх даних можуть бути:",
      points: [
        "Група startplus-clean. Наші офіси знаходяться в Польщі.",
        "Організації / фізичні особи, з якими ми співпрацюємо. Ми можемо передавати твої дані нашим спеціалістам, які безпосередньо надають тобі послуги. Ми вжили всіх необхідних заходів для захисту твоїх даних. Усі одержувачі, яким ми можемо передавати твої персональні дані, також вживають усіх необхідних заходів для захисту твоїх даних, конфіденційно зберігають твої дані та використовують їх лише для виконання завдань від нашого імені."
      ],
      subtitle: "Сервіси, які ми використовуємо для надання послуг",
      subtitle2: "Сервіси платежів:",
      points2: [
        "PayU. Сервіс надається компанією PayU S.A. Політика конфіденційності PayU.",
        "Google Pay. Сервіс надається компанією Google. Політика конфіденційності Google.",
        "Apple Pay. Сервіс надається компанією Apple Inc. Політика конфіденційності Apple."
      ],
      subtitle3: "Поштові, хостингові та інші сервіси:",
      points3: [
        "Mailchimp. Це сервіс для надсилання інформаційних бюлетенів. Сервіс надається компанією Intuit Inc. Інформацію про захист даних MailChimp можна знайти на вебсайті. Загальна політика конфіденційності Intuit доступна тут.",
        "Digital Ocean. Наш вебсайт розміщений на платформі DigitalOcean LLC. Більше інформації можна знайти тут.",
        "Cloudflare. Сервіс надається компанією Cloudflare Inc. Політика конфіденційності Cloudflare.",
        "Twilio. Сервіс надається компанією Twilio Inc. Політика конфіденційності Twilio."
      ],
      subtitle4: "Аналітичні та рекламні сервіси:",
      points4: [
        "Google Analytics, Google Ads. Сервіси надаються компанією Google. Політика конфіденційності Google."
      ]
    },
    section7: {
      title: "VII. Автоматизоване прийняття рішень в індивідуальних випадках",
      content: "Автоматизоване прийняття рішень в індивідуальних випадках – це процес прийняття рішень за допомогою автоматичних інструментів без участі людини. Ми не приймаємо жодних виключно автоматичних рішень і не проводимо профілювання."
    },
    section8: {
      title: "VIII. Оновлення політики",
      content: "Ми можемо змінювати Політику в будь-який час. На початку тексту вказано версію документа та час, з якого зміни набувають чинності. Якщо ми вносимо суттєві зміни до Політики (наприклад, додаємо нові цілі обробки персональних даних або нові категорії зібраних персональних даних), ми попросимо згоду на оновлену Політику. Продовжуючи використовувати наші Сервіси після оновлення Політики, ти висловлюєш згоду та приймаєш нову Політику. Попередні версії доступні за запитом у компанії за вказаними в Політиці контактами."
    },
    section9: {
      title: "IX. Твої права",
      content: "Відповідно до законодавства Європейського Союзу та Польщі ти маєш право реалізувати певні права в будь-який момент, надіславши відповідні запити поштою (адреса: вул. Едварда Хабіха 18/45, 02-495 Варшава) або електронною поштою (info@startplus-clean.com).",
      subtitle: "Ти маєш право на:",
      points: [
        "доступ (більше інформації).",
        "виправлення (більше інформації).",
        "видалення (більше інформації).",
        "обмеження обробки (більше інформації).",
        "заперечення (більше інформації).",
        "перенесення даних (більше інформації).",
        "подання скарги до наглядового органу (в Польщі – UODO)."
      ]
    },
    section10: {
      title: "X. Наші контакти",
      content: "У питаннях, що стосуються політики конфіденційності та персональних даних, ти можеш зв’язатися з нами електронною поштою info@startplus-clean.com. Ми зобов’язуємося надати відповідь без невиправданих затримок, у будь-якому випадку протягом одного місяця з моменту отримання запиту. За потреби цей термін може бути продовжений ще на два місяці з огляду на складність запиту або кількість запитів. Доступ третіх осіб до листування обмежений і не може бути розголошений без твоєї письмової згоди."
    },
    backButton: "Повернутися",
  },
  ru: {
    title: "Политика конфиденциальности",
    version: "Версия от 22.11.2024",
    intro: "Эта политика конфиденциальности („Политика”) представляет собой свод принципов, которыми мы руководствуемся при обработке персональных данных пользователей вебсайта и приложения („Сервисы”). Целью данной Политики является предоставление информации о способе обработки персональных данных пользователей наших Сервисов и клиентов:",
    introPoints: [
      "при предоставлении услуг,",
      "при посещении вебсайтов, которыми мы управляем, и",
      "при использовании нашего приложения startplus-clean."
    ],
    section1: {
      title: "I. Основные понятия",
      points: [
        "Персональные данные - любая информация, относящаяся к идентифицированному или идентифицируемому физическому лицу.",
        "Обработка персональных данных - любые действия, выполняемые с персональными данными, включая их сбор, фиксацию, организацию, упорядочивание, хранение, адаптацию или изменение, извлечение, просмотр, использование, раскрытие путем передачи, распространения или иного предоставления доступа, согласование или объединение, ограничение, удаление или уничтожение персональных данных.",
        "Согласие лица, чьи данные обрабатываются - любое однозначное выражение воли Пользователя, посредством которого он/она дает согласие на обработку своих персональных данных в определенной цели.",
        "Обоснованный интерес - одна из основ обработки персональных данных. Наш обоснованный интерес основан на стремлении предоставлять услуги высокого качества, сохраняя приоритет интересов, прав и свобод лица, чьи данные обрабатываются.",
        "Файлы cookie - это небольшие фрагменты данных, которые создаются и сохраняются на устройстве пользователя (компьютер, планшет, мобильный телефон и т. д.) во время посещения/просмотра Сервисов. Файлы cookie используются для сохранения настроек пользователя, ведения статистики и других подобных целей. Вы можете в любой момент удалить сохраненные файлы cookie в настройках вашего браузера."
      ]
    },
    section2: {
      title: "II. Кто есть кто?",
      content: "startplus-clean („Мы”, „Компания”, „startplus-clean”) является Администратором персональных данных (Data controller), то есть самостоятельно определяет цели и средства обработки персональных данных и имеет доступ к персональным данным.",
      points: [
        "startplus-clean NATALIIA ZHYVOTIVSKA. Администратором персональных данных Клиента, переданных в форме регистрации, а также субъектом, обрабатывающим эти данные, является Владелец Портала, то есть startplus-clean NATALIIA ZHYVOTIVSKA с местонахождением в Варшаве, ул. Эдварда Хабиха 18/45, 02-495 Варшава, NIP: 5242838146, REGON: 368071450, далее также „Администратор”. Данные для контакта с Администратором: E-mail: info@startplus-clean.com.",
        "Пользователи и клиенты (далее также „Ты”) - физическое лицо, чьи данные обрабатываются (Data subject), старше 16 лет, использующее вебсайт и имеющее возможность воспользоваться нашими Услугами.",
        "Для эффективной работы вебсайта и предоставления услуг высокого качества мы используем услуги третьих сторон, которые выполняют роль Обработчика данных (Data processor), то есть физического или юридического лица, учреждения или другого субъекта, который обрабатывает персональные данные от имени администратора. К ним относятся услуги хостинга, электронной почты, услуги отправки сообщений, услуги сбора статистики посещений, услуги авторизации. Подробности указаны в разделе „Получатели”."
      ]
    },
    section3: {
      title: "III. Наши практики в отношении конфиденциальности",
      subtitle: "Принципы",
      content: "Мы обрабатываем твои персональные данные в соответствии с принципами, установленными Общим регламентом по защите данных (GDPR) в ЕС и положениями законодательства Польши:",
      points: [
        "Законность (Lawfulness): Мы обрабатываем твои персональные данные только в случаях, когда у нас есть законные основания.",
        "Честность (Fairness): Мы обрабатываем твои персональные данные честно и в соответствии с твоими правами.",
        "Прозрачность (Transparency): Мы обеспечиваем прозрачность в отношении обработки твоих персональных данных и предоставляем тебе доступ к твоим персональным данным.",
        "Ограничение цели (Purpose limitation): Мы обрабатываем твои персональные данные только с определенных целей, о которых мы тебя информируем, и не используем их для других целей без твоего согласия или законных оснований.",
        "Минимизация данных (Data minimization): Мы собираем только необходимые данные и не обрабатываем их в большем объеме, чем требуется для целей обработки.",
        "Точность данных (Data accuracy): Мы обеспечиваем точность твоих персональных данных и обновляем их при необходимости. Мы также предоставляем тебе возможность проверить и исправить свои данные.",
        "Безопасность данных (Data security): Мы обеспечиваем безопасность твоих персональных данных путем внедрения соответствующих технических и организационных мер для предотвращения несанкционированного доступа, потери или разглашения твоей личной информации. Мы также обучаем наших сотрудников соблюдению принципов защиты данных и обеспечиваем контроль за обработкой твоих данных третьими сторонами, если они обрабатываются от нашего имени."
      ],
      subtitle2: "Правовые основания, на которых мы основываем обработку твоих данных:",
      points2: [
        "Договор: обработка необходима для выполнения договора, который мы заключили с тобой, или для принятия определенных мер перед заключением этого договора.",
        "Юридическое обязательство: обработка необходима для выполнения юридического обязательства.",
        "Законный интерес: обработка необходима для реализации наших законных интересов, если наши интересы не превалируют над интересами или основными правами и свободами лица, чьи данные обрабатываются.",
        "Согласие: ты предоставил/ла четкое согласие на обработку своих персональных данных с определенной целью."
      ]
    },
    section4: {
      title: "IV. Как мы обрабатываем твои данные?",
      content: "Ниже ты найдешь информацию о данных, которые мы собираем, с какой целью, на каком правовом основании и как долго мы их храним.",
      subtitle: "Как мы используем данные, которые ты нам непосредственно предоставил/ла?",
      subtitle2: "Правовое основание - договор",
      points: [
        "Создание учетной записи, оформление заказов и предоставление ответов на любые вопросы, связанные с их выполнением. Для этого мы просим предоставить твое имя, фамилию, номер телефона, адрес электронной почты, полный адрес, желаемую услугу и возможные дополнительные комментарии относительно заказанной услуги и способа оплаты. Эти данные обрабатываются с целью выполнения договора и принятия необходимых мер перед его заключением. Предоставление персональных данных является добровольным, но их непредоставление сделает невозможным оказание услуги.",
        "Мы храним твои данные, пока у тебя есть активная учетная запись. По истечении одного года с момента удаления учетной записи мы анонимизируем твои данные, если они не нужны для достижения других целей, например, по требованию закона.",
        "Мы предоставляем тебе возможность осуществить оплату за наши услуги онлайн. Для этого мы просим предоставить номер дебетовой/кредитной карты, ее срок действия и код CVV. Платежные транзакции с использованием популярных методов оплаты (Visa/Mastercard) осуществляются исключительно через зашифрованное соединение SSL. Его можно распознать по изменению адреса в строке браузера с \"http://\" на \"https://\", а также по символу \"замка\" в строке адреса. Мы не храним эти данные после осуществления оплаты. Кроме того, мы предоставляем возможность оплаты через Google Pay, Apple Pay и PayU.",
        "Подача заявки на наше предложение о работе. Для этого мы просим предоставить полное имя, контактный номер, описание твоего запроса, адрес электронной почты и/или другую форму связи с тобой. Если после рассмотрения твоей заявки мы решим сотрудничать, мы будем хранить твои данные в течение периода, определенного действующим польским законодательством. В противном случае мы храним твои данные не дольше 6 месяцев."
      ],
      subtitle3: "Правовое основание – законный интерес",
      points2: [
        "Оценка нашей услуги. После предоставления услуги мы просим ее оценить. Для этого мы обрабатываем твои контактные данные, информацию об оказанной услуге, оценку и отзыв."
      ],
      subtitle4: "Правовое основание – юридическое обязательство",
      points3: [
        "Выполнение требований закона. Для выполнения наших юридических и налоговых обязательств мы можем обрабатывать твои персональные данные. Это включает обработку данных для бухгалтерского учета и налогообложения услуг, а также для выполнения требований законодательства, определенных специальными законами, например, для нужд уголовного производства или для выполнения обязанности сотрудничества с полицией."
      ],
      subtitle5: "Правовое основание – согласие и/или soft opt-in",
      points4: [
        "Отправка маркетинговых сообщений по электронной почте. При регистрации и/или оформлении заказа мы предоставляем тебе возможность согласиться или отказаться от получения маркетинговых сообщений. Если ты согласился/лась получать рассылку, ты можешь в любой момент отменить это согласие, нажав кнопку \"Отписаться\" в каждом полученном сообщении или отправив нам электронное письмо на указанный адрес: info@startplus-clean.com."
      ],
      subtitle6: "Как мы используем данные, собранные через веббраузер?",
      points5: [
        "Безопасность и защита нашего вебсайта. Мы используем услуги Cloudflare Inc. для повышения безопасности и защиты нашего вебсайта от хакерских атак. Правовым основанием для обработки данных является наш законный интерес.",
        "Улучшение нашего вебсайта и анализ сетевого трафика. Если ты дал/ла согласие, мы можем использовать такие инструменты, как Google Analytics, для сбора статистики. На основе этих данных мы понимаем размер нашей аудитории и планируем улучшения наших услуг. Данные хранятся в соответствии с Политикой конфиденциальности Google.",
        "Реклама. Если ты дал/ла согласие, мы можем использовать такие инструменты, как Google Ads, чтобы учитывать поведение посетителей вебсайта в будущих рекламных кампаниях. Данные хранятся в соответствии с Политикой конфиденциальности Google."
      ]
    },
    section5: {
      title: "V. Персональные данные детей",
      content: "Мы не собираем никакой информации о возрасте наших посетителей. Однако мы, в принципе, не предоставляем услуги лицам младше 16 лет. Если ты родитель или опекун ребенка, чьи персональные данные каким-либо образом попали на наш сайт, просим немедленно связаться с нами, и мы удалим эту информацию."
    },
    section6: {
      title: "VI. Получатели",
      content: "Мы не передаем и не разглашаем твои данные никому без твоего ведома. Получателями твоих данных могут быть:",
      points: [
        "Группа startplus-clean. Наши офисы находятся в Польше.",
        "Организации / физические лица, с которыми мы сотрудничаем. Мы можем передавать твои данные нашим специалистам, которые непосредственно предоставляют тебе услуги. Мы приняли все необходимые меры для защиты твоих данных. Все получатели, которым мы можем передавать твои персональные данные, также принимают все необходимые меры для защиты твоих данных, конфиденциально хранят твои данные и используют их только для выполнения задач от нашего имени."
      ],
      subtitle: "Сервисы, которые мы используем для предоставления услуг",
      subtitle2: "Сервисы платежей:",
      points2: [
        "PayU. Сервис предоставляется компанией PayU S.A. Политика конфиденциальности PayU.",
        "Google Pay. Сервис предоставляется компанией Google. Политика конфиденциальности Google.",
        "Apple Pay. Сервис предоставляется компанией Apple Inc. Политика конфиденциальности Apple."
      ],
      subtitle3: "Почтовые, хостинговые и другие сервисы:",
      points3: [
        "Mailchimp. Это сервис для отправки информационных бюллетеней. Сервис предоставляется компанией Intuit Inc. Информацию о защите данных MailChimp можно найти на вебсайте. Общая политика конфиденциальности Intuit доступна здесь.",
        "Digital Ocean. Наш вебсайт размещен на платформе DigitalOcean LLC. Более подробную информацию можно найти здесь.",
        "Cloudflare. Сервис предоставляется компанией Cloudflare Inc. Политика конфиденциальности Cloudflare.",
        "Twilio. Сервис предоставляется компанией Twilio Inc. Политика конфиденциальности Twilio."
      ],
      subtitle4: "Аналитические и рекламные сервисы:",
      points4: [
        "Google Analytics, Google Ads. Сервисы предоставляются компанией Google. Политика конфиденциальности Google."
      ]
    },
    section7: {
      title: "VII. Автоматизированное принятие решений в индивидуальных случаях",
      content: "Автоматизированное принятие решений в индивидуальных случаях – это процесс принятия решений с использованием автоматических инструментов без участия человека. Мы не принимаем никаких исключительно автоматических решений и не проводим профилирование."
    },
    section8: {
      title: "VIII. Обновление политики",
      content: "Мы можем изменять Политику в любое время. В начале текста указана версия документа и время, с которого изменения вступают в силу. Если мы вносим существенные изменения в Политику (например, добавляем новые цели обработки персональных данных или новые категории собираемых персональных данных), мы попросим согласие на обновленную Политику. Продолжая использовать наши Сервисы после обновления Политики, ты выражаешь согласие и принимаешь новую Политику. Предыдущие версии доступны по запросу в компании по указанным в Политике контактам."
    },
    section9: {
      title: "IX. Твои права",
      content: "В соответствии с законодательством Европейского Союза и Польши ты имеешь право реализовать определенные права в любое время, направив соответствующие запросы по почте (адрес: ул. Эдварда Хабиха 18/45, 02-495 Варшава) или по электронной почте (info@startplus-clean.com).",
      subtitle: "Ты имеешь право на:",
      points: [
        "доступ (больше информации).",
        "исправление (больше информации).",
        "удаление (больше информации).",
        "ограничение обработки (больше информации).",
        "возражение (больше информации).",
        "перенос данных (больше информации).",
        "подачу жалобы в надзорный орган (в Польше – UODO)."
      ]
    },
    section10: {
      title: "X. Наши контакты",
      content: "По вопросам, касающимся политики конфиденциальности и персональных данных, ты можешь связаться с нами по электронной почте info@startplus-clean.com. Мы обязуемся предоставить ответ без неоправданных задержек, в любом случае в течение одного месяца с момента получения запроса. При необходимости этот срок может быть продлен еще на два месяца в зависимости от сложности запроса или количества запросов. Доступ третьих лиц к переписке ограничен и не может быть раскрыт без твоего письменного согласия."
    },
    backButton: "Вернуться",
  },
  en: {
    title: "Privacy Policy",
    version: "Version as of 22.11.2024",
    intro: "This privacy policy („Policy”) constitutes a set of principles that we follow in the processing of personal data of users of the website and application („Services”). The purpose of this Policy is to provide information on how we process the personal data of users of our Services and our clients:",
    introPoints: [
      "when providing services,",
      "when visiting websites managed by us, and",
      "when using our startplus-clean application."
    ],
    section1: {
      title: "I. Basic Concepts",
      points: [
        "Personal Data - any information relating to an identified or identifiable natural person.",
        "Personal Data Processing - any operations performed on personal data, including their collection, recording, organization, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure, or destruction of personal data.",
        "Consent of the Data Subject - any freely given, specific, informed, and unambiguous indication of the User’s wishes by which they give consent to the processing of their personal data for a specific purpose.",
        "Legitimate Interest - one of the grounds for processing personal data. Our legitimate interest is based on the pursuit of providing high-quality services while prioritizing the interests, rights, and freedoms of the data subject.",
        "Cookies - small pieces of data created and stored on the user’s device (computer, tablet, mobile phone, etc.) while visiting/browsing the Services. Cookies are used to store user settings, conduct statistics, and other similar purposes. You can delete stored cookies at any time in your browser settings."
      ]
    },
    section2: {
      title: "II. Who is Who?",
      content: "startplus-clean („We”, „Company”, „startplus-clean”) is the Data Controller, meaning we independently determine the purposes and means of processing personal data and have access to personal data.",
      points: [
        "startplus-clean NATALIIA ZHYVOTIVSKA. The Data Controller of the Client’s personal data provided in the registration form and the entity processing this data is the Portal Owner, i.e., startplus-clean NATALIIA ZHYVOTIVSKA, located at ul. Edwarda Habicha 18/45, 02-495 Warsaw, NIP: 5242838146, REGON: 368071450, hereinafter also referred to as the „Controller”. Contact details for the Controller: E-mail: info@startplus-clean.com.",
        "Users and Clients (hereinafter also „You”) - a natural person whose data is concerned (Data Subject), over 16 years of age, using the website and having the opportunity to use our Services.",
        "To ensure the effective operation of the website and to provide high-quality services, we use third-party services that act as Data Processors, i.e., a natural or legal person, entity, or other body that processes personal data on behalf of the controller. These include hosting services, email services, messaging services, visitor statistics services, and login services. Details are provided in the „Recipients” section."
      ]
    },
    section3: {
      title: "III. Our Privacy Practices",
      subtitle: "Principles",
      content: "We process your personal data in accordance with the principles established by the General Data Protection Regulation (GDPR) in the EU and the provisions of Polish law:",
      points: [
        "Lawfulness: We process your personal data only when we have lawful grounds.",
        "Fairness: We process your personal data fairly and in accordance with your rights.",
        "Transparency: We ensure transparency regarding the processing of your personal data and provide you with access to your personal data.",
        "Purpose Limitation: We process your personal data only for specified purposes that we inform you about, and we do not use them for other purposes without your consent or lawful grounds.",
        "Data Minimization: We collect only the necessary data and do not process it to a greater extent than required for the purposes of processing.",
        "Data Accuracy: We ensure the accuracy of your personal data and update it as needed. We also provide you with the opportunity to check and correct your data.",
        "Data Security: We ensure the security of your personal data by implementing appropriate technical and organizational measures to prevent unauthorized access, loss, or disclosure of your personal information. We also train our employees to comply with data protection principles and ensure control over the processing of your data by third parties if they process it on our behalf."
      ],
      subtitle2: "Legal Grounds for Processing Your Data:",
      points2: [
        "Contract: Processing is necessary for the performance of a contract we have entered into with you or to take specific actions before entering into that contract.",
        "Legal Obligation: Processing is necessary to comply with a legal obligation.",
        "Legitimate Interest: Processing is necessary to pursue our legitimate interests, provided our interests do not override the interests or fundamental rights and freedoms of the data subject.",
        "Consent: You have given clear consent to the processing of your personal data for a specific purpose."
      ]
    },
    section4: {
      title: "IV. How Do We Process Your Data?",
      content: "Below you will find information about the data we collect, for what purpose, on what legal basis, and how long we store this data.",
      subtitle: "How Do We Use the Data You Directly Provided to Us?",
      subtitle2: "Legal Basis - Contract",
      points: [
        "Creating an account, placing orders, and responding to any questions related to their fulfillment. For this purpose, we ask for your first name, last name, phone number, email address, full address, requested service, and any additional comments regarding the ordered service and payment method. This data is processed to perform the contract and take necessary actions before its conclusion. Providing personal data is voluntary, but failure to provide it will make it impossible to provide the service.",
        "We store your data as long as you have an active account. After one year from the deletion of the account, we anonymize your data if it is not needed for other purposes, such as legal requirements.",
        "We provide you with the option to pay for our services online. For online payment, we ask for your debit/credit card number, its expiration date, and CVV code. Payment transactions using popular payment methods (Visa/Mastercard) are carried out exclusively via an encrypted SSL connection. This can be recognized by the change in the browser address bar from \"http://\" to \"https://\", as well as the \"lock\" symbol in the address bar. We do not store this data after the payment is made. Additionally, we offer payment options via Google Pay, Apple Pay, and PayU.",
        "Applying for our job offer. For this purpose, we ask for your full name, contact number, description of your inquiry, email address, and/or another form of contact with you. If, after reviewing your application, we decide to collaborate, we store your data for the period required by applicable Polish law. Otherwise, we store your data for no longer than 6 months."
      ],
      subtitle3: "Legal Basis – Legitimate Interest",
      points2: [
        "Evaluation of our service. After providing the service, we ask for its evaluation. For this purpose, we process your contact details, information about the provided service, evaluation, and feedback."
      ],
      subtitle4: "Legal Basis – Legal Obligation",
      points3: [
        "Compliance with legal requirements. To fulfill our legal and tax obligations, we may process your personal data. This includes processing data for accounting and taxation of services, as well as to comply with legal requirements specified in special laws, e.g., for the purposes of criminal proceedings or to fulfill the obligation to cooperate with the police."
      ],
      subtitle5: "Legal Basis – Consent and/or Soft Opt-In",
      points4: [
        "Sending marketing messages via email. During registration and/or placing an order, we give you the option to agree or refuse to receive marketing messages. If you have agreed to receive the newsletter, you can withdraw your consent at any time by clicking the \"Unsubscribe\" button in each received message or by sending us an email at the address provided: info@startplus-clean.com."
      ],
      subtitle6: "How Do We Use Data Collected Through the Web Browser?",
      points5: [
        "Security and protection of our website. We use Cloudflare Inc. services to enhance the security and protection of our website against hacker attacks. The legal basis for processing data is our legitimate interest.",
        "Improving our website and analyzing network traffic. If you have given your consent, we may use tools such as Google Analytics to collect statistics. Based on this data, we understand the size of our audience and plan improvements to our services. The data is stored in accordance with Google’s Privacy Policy.",
        "Advertising. If you have given your consent, we may use tools such as Google Ads to take into account the behavior of website visitors in future advertising campaigns. The data is stored in accordance with Google’s Privacy Policy."
      ]
    },
    section5: {
      title: "V. Children’s Personal Data",
      content: "We do not collect any information regarding the age of our visitors. However, we generally do not provide services to individuals under 16 years of age. If you are a parent or guardian of a child whose personal data has somehow been placed on our website, please contact us immediately, and we will delete this information."
    },
    section6: {
      title: "VI. Recipients",
      content: "We do not share or disclose your data to anyone without your knowledge. Recipients of your data may include:",
      points: [
        "startplus-clean Group. Our offices are located in Poland.",
        "Organizations / individuals we collaborate with. We may transfer your data to our specialists who directly provide you with services. We have taken all necessary measures to protect your data. All recipients to whom we may transfer your personal data also take all necessary measures to protect your data, store your data confidentially, and use it only to perform tasks on our behalf."
      ],
      subtitle: "Services We Use to Provide Services",
      subtitle2: "Payment Services:",
      points2: [
        "PayU. The service is provided by PayU S.A. PayU Privacy Policy.",
        "Google Pay. The service is provided by Google. Google Privacy Policy.",
        "Apple Pay. The service is provided by Apple Inc. Apple Privacy Policy."
      ],
      subtitle3: "Email, Hosting, and Other Services:",
      points3: [
        "Mailchimp. This is a service for sending newsletters. The service is provided by Intuit Inc. Information about MailChimp data protection can be found on the website. Intuit’s general privacy policy is available here.",
        "Digital Ocean. Our website is hosted on the platform DigitalOcean LLC. More information can be found here.",
        "Cloudflare. The service is provided by Cloudflare Inc. Cloudflare Privacy Policy.",
        "Twilio. The service is provided by Twilio Inc. Twilio Privacy Policy."
      ],
      subtitle4: "Analytical and Advertising Services:",
      points4: [
        "Google Analytics, Google Ads. The services are provided by Google. Google Privacy Policy."
      ]
    },
    section7: {
      title: "VII. Automated Decision-Making in Individual Cases",
      content: "Automated decision-making in individual cases refers to the process of making decisions using automated tools without any human involvement. We do not make any solely automated decisions and do not conduct profiling."
    },
    section8: {
      title: "VIII. Policy Updates",
      content: "We may change the Policy at any time. At the beginning of the text, the version of the document and the date from which the changes take effect are specified. If we make significant changes to the Policy (e.g., adding new purposes for processing personal data or new categories of collected personal data), we will request your consent to the updated Policy. By continuing to use our Services after the Policy update, you express your consent and accept the new Policy. Previous versions are available upon request at the company using the contact details provided in the Policy."
    },
    section9: {
      title: "IX. Your Rights",
      content: "In accordance with the legislation of the European Union and Poland, you have the right to exercise certain rights at any time by submitting appropriate requests by mail (address: ul. Edwarda Habicha 18/45, 02-495 Warsaw) or by email (info@startplus-clean.com).",
      subtitle: "You have the right to:",
      points: [
        "access (more information).",
        "rectification (more information).",
        "erasure (more information).",
        "restriction of processing (more information).",
        "objection (more information).",
        "data portability (more information).",
        "lodge a complaint with a supervisory authority (in Poland – UODO)."
      ]
    },
    section10: {
      title: "X. Our Contact Details",
      content: "For matters related to the privacy policy and personal data, you can contact us via email at info@startplus-clean.com. We commit to responding without undue delay, in any case within one month of receiving the request. If necessary, this period may be extended by an additional two months due to the complexity of the request or the number of requests. Access by third parties to the correspondence is restricted and cannot be disclosed without your written consent."
    },
    backButton: "Back",
  },
};
/* ==== КОМПОНЕНТ PRIVACY POLICY ==== */
export default function PrivacyPolicyPage({ lang = "pl" }) {
  const t = useMemo(() => dict[lang] || dict.pl, [lang]);
  const navigate = useNavigate();

  return (
    <div className={css.container}>
      <h1 className={css.title}>{t.title}</h1>
      <p className={css.version}>{t.version}</p>
      <p className={css.intro}>{t.intro}</p>
      <ul className={css.introList}>
        {t.introPoints.map((point, index) => (
          <li key={index} className={css.introItem}>{point}</li>
        ))}
      </ul>

      {/* Розділ I */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section1.title}</h2>
        <ul className={css.list}>
          {t.section1.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ II */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section2.title}</h2>
        <p className={css.sectionContent}>{t.section2.content}</p>
        <ul className={css.list}>
          {t.section2.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ III */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section3.title}</h2>
        <h3 className={css.subTitle}>{t.section3.subtitle}</h3>
        <p className={css.sectionContent}>{t.section3.content}</p>
        <ul className={css.list}>
          {t.section3.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h3 className={css.subTitle}>{t.section3.subtitle2}</h3>
        <ul className={css.list}>
          {t.section3.points2.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ IV */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section4.title}</h2>
        <p className={css.sectionContent}>{t.section4.content}</p>
        <h3 className={css.subTitle}>{t.section4.subtitle}</h3>
        <h4 className={css.subSubTitle}>{t.section4.subtitle2}</h4>
        <ul className={css.list}>
          {t.section4.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h4 className={css.subSubTitle}>{t.section4.subtitle3}</h4>
        <ul className={css.list}>
          {t.section4.points2.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h4 className={css.subSubTitle}>{t.section4.subtitle4}</h4>
        <ul className={css.list}>
          {t.section4.points3.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h4 className={css.subSubTitle}>{t.section4.subtitle5}</h4>
        <ul className={css.list}>
          {t.section4.points4.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h4 className={css.subSubTitle}>{t.section4.subtitle6}</h4>
        <ul className={css.list}>
          {t.section4.points5.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ V */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section5.title}</h2>
        <p className={css.sectionContent}>{t.section5.content}</p>
      </section>

      {/* Розділ VI */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section6.title}</h2>
        <p className={css.sectionContent}>{t.section6.content}</p>
        <ul className={css.list}>
          {t.section6.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h3 className={css.subTitle}>{t.section6.subtitle}</h3>
        <h4 className={css.subSubTitle}>{t.section6.subtitle2}</h4>
        <ul className={css.list}>
          {t.section6.points2.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h4 className={css.subSubTitle}>{t.section6.subtitle3}</h4>
        <ul className={css.list}>
          {t.section6.points3.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h4 className={css.subSubTitle}>{t.section6.subtitle4}</h4>
        <ul className={css.list}>
          {t.section6.points4.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ VII */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section7.title}</h2>
        <p className={css.sectionContent}>{t.section7.content}</p>
      </section>

      {/* Розділ VIII */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section8.title}</h2>
        <p className={css.sectionContent}>{t.section8.content}</p>
      </section>

      {/* Розділ IX */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section9.title}</h2>
        <p className={css.sectionContent}>{t.section9.content}</p>
        <h3 className={css.subTitle}>{t.section9.subtitle}</h3>
        <ul className={css.list}>
          {t.section9.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ X */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section10.title}</h2>
        <p className={css.sectionContent}>{t.section10.content}</p>
      </section>

      {/* Кнопка "Повернутися" */}
      <button onClick={() => navigate("/")} className={css.backButton}>
        {t.backButton}
      </button>
    </div>
  );
}