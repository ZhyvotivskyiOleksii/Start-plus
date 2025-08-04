import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import css from "./TermsPage.module.css";

/* ==== СЛОВАРЬ ПЕРЕВОДОВ ==== */
const dict = {
  pl: {
    title: "Regulamin portalu internetowego www.startplus-clean.com",
    version: "Wersja z dnia 20.12.2022 r.",
    section1: {
      title: "I. Definicje",
      definitions: [
        { term: "Regulamin", definition: "niniejszy regulamin Portalu „www.startplus-clean.com”, regulujący korzystanie z Portalu, prawa i obowiązki Właściciela Portalu, Klientów oraz Wykonawców, a także zasady świadczenia usług sprzątania." },
        { term: "Właściciel Portalu", definition: "STARTPLUS NATALIIA ZHYVOTIVSKA z siedzibą w Warszawie, ul. Edwarda Habicha 18/45, 02-495 Warszawa, NIP: 5242838146, REGON: 368071450. Dane do kontaktu: E-mail: info@startplus-clean.com, Strona www: www.startplus-clean.com." },
        { term: "Portal", definition: "Portal internetowy „www.startplus-clean.com”, za pośrednictwem którego świadczone są usługi w zakresie realizacji Zleceń Sprzątania oraz prowadzona jest interakcja pomiędzy Klientami a Wykonawcami. Dostęp do Portalu możliwy jest poprzez urządzenia podłączone do sieci Internet." },
        { term: "Wykonawca", definition: "osoba fizyczna lub prawna wykonująca działalność gospodarczą (rejestrowaną lub nierejestrowaną), zarejestrowana na Portalu jako podmiot gotowy do realizacji Zleceń sprzątania lokalu, zgodnie z Regulaminem sprzątania i innymi normami ustalonymi przez Właściciela Portalu." },
        { term: "Klient", definition: "osoba fizyczna posiadająca co najmniej ograniczoną zdolność do czynności prawnych i ukończone 18 lat, a także osoba prawna lub jednostka organizacyjna, posiadająca zdolność prawną i zdolność do czynności prawnej, która zarejestrowała się na Portalu w celu skorzystania z usług sprzątania." },
        { term: "Rejestracja", definition: "proces wypełnienia formularza rejestracyjnego na Portalu, obejmujący podanie wymaganych danych osobowych oraz ustalenie hasła przez Klienta lub Wykonawcę." },
        { term: "Konto Osobiste", definition: "część Portalu dostępna dla Klienta po zalogowaniu (numer telefonu i hasło SMS), zawierająca dane kontaktowe, historię Zamówień, status ich realizacji, adresy Zleceń, numery użytych kart płatniczych oraz informacje o programie bonusowym." },
        { term: "Zamówienie", definition: "zestaw usług sprzątania wybranych przez Klienta w formie elektronicznej za pośrednictwem Portalu lub telefonicznie, określających warunki Umowy, takie jak: nazwa pracy, ilość pracy, miejsce pracy, czas pracy oraz jej koszt, stanowiący ofertę Klienta na sprzątanie lokalu." },
        { term: "Usługa sprzątania", definition: "usługi sprzątania lokali oraz inne usługi w zakresie utrzymania czystości, świadczone przez Wykonawców na rzecz Klientów za pośrednictwem Portalu, zgodnie z niniejszym Regulaminem." },
        { term: "Cena", definition: "cena brutto Usługi, wyrażona w złotych polskich, zawiera podatek VAT. Dla osób fizycznych usługą jest Usługa sprzątania (świadczona przez Wykonawcę), dla osób prawnych – Usługa pozyskania Wykonawcy (świadczona przez Platformę). Cena nie obejmuje napiwku, jest wiążąca i nie podlega negocjacji. Właściciel zastrzega prawo do zmiany ceny w przypadku oczywistej pomyłki." }
      ]
    },
    section2: {
      title: "II. Rejestracja i dokonywanie Zamówień",
      subtitle1: "1. Rejestracja",
      content1: "Korzystanie z Portalu wymaga rejestracji i uzyskania dostępu do Konta Osobistego poprzez podanie danych osobowych, numeru telefonu, adresu e-mail oraz hasła. Klient jest proszony o zapoznanie się i akceptację niniejszego Regulaminu oraz wyrażenie zgody na zawarcie Umowy.",
      note: "Uwaga! Klient wyraża zgodę na przetwarzanie danych osobowych, zaznaczając pole wyboru przy oświadczeniu o treści:",
      declaration: "„Niniejszym oświadczam, że zapoznałem się i akceptuję Regulamin Portalu „www.startplus-clean.com” oraz wyrażam zgodę na wykorzystywanie i przetwarzanie moich danych osobowych zawartych w formularzu rejestracyjnym dla potrzeb rejestracji oraz wykonywania Usług, w tym na ich przekazywanie Wykonawcom, zgodnie z ustawą o Ochronie Danych Osobowych z dnia 10 maja 2018 r. (Dz. U. z 2018 r., poz. 1000), a także Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z 27.04.2016 r. (RODO).”",
      points1: [
        "Brak akceptacji zgody na przetwarzanie danych uniemożliwi realizację Zamówienia.",
        "Rejestracja jest jednorazowa, kolejne Zamówienia wymagają tylko podania numeru telefonu i hasła SMS.",
        "Klient może wyrazić zgodę na otrzymywanie ofert reklamowych i promocji.",
        "Login i hasło są poufne, Klient odpowiada za aktualizację danych i ich bezpieczeństwo.",
        "Podmioty gospodarcze dodatkowo podają dane do wystawienia faktury VAT."
      ],
      subtitle2: "2. Korzystanie z Portalu i Zamawianie",
      points2: [
        "Zamówienia można składać całodobowo poprzez Portal lub telefonicznie.",
        "Przeglądanie usług nie wymaga rejestracji, ale złożenie Zamówienia – tak.",
        "Po złożeniu Zamówienia Klient otrzymuje potwierdzenie e-mailem.",
        "Złożenie Zamówienia stanowi ofertę w rozumieniu Kodeksu cywilnego.",
        "Koszt usług zależy od zakresu prac, ilości pokoi, łazienek oraz wybranych dodatkowych usług.",
        "Właściciel Portalu może odmówić realizacji Zamówienia, jeśli jest ono niezgodne z Regulaminem, zawiera błędy lub obejmuje niedostępne usługi.",
        "Konto Osobiste Klienta zawiera historię Zamówień oraz punkty bonusowe. Warunki programu bonusowego dostępne są na stronie www.startplus-clean.com."
      ]
    },
    section3: {
      title: "III. Realizacja Zamówień",
      subtitle1: "1. Postanowienia ogólne",
      points1: [
        "Właściciel Portalu zapewnia realizację Zamówień przez Wykonawców zgodnie ze standardami określonymi w Regulaminie Sprzątania (Załącznik do Regulaminu).",
        "Klient zapewnia dostęp do lokalu, mediów (woda, elektryczność) oraz opłatę za usługę w wysokości podanej w potwierdzeniu Zamówienia.",
        "W razie nieobecności Klienta w miejscu i czasie wskazanym w Zamówieniu, poniesione koszty obciążają Klienta.",
        "Sporne sytuacje w trakcie realizacji Zamówienia należy zgłosić Właścicielowi Portalu.",
        "Na życzenie Klienta (poprzez funkcjonalność Portalu) wystawiana jest faktura VAT przez Właściciela Portalu w imieniu Wykonawcy."
      ],
      subtitle2: "2. Obszar działania",
      content2: "Usługi świadczone są na obszarze wskazanym na Portalu.",
      subtitle3: "3. Zasady płatności",
      points3: [
        "gotówką – bezpośrednio Wykonawcy przy realizacji Usługi,",
        "kartą płatniczą/kredytową – wyłącznie przy składaniu Zamówienia."
      ],
      additionalPoints: [
        "Wyboru formy płatności należy dokonać w formularzu Zamówienia.",
        "W przypadku płatności bezgotówkowych Klient akceptuje regulaminy dostawców zewnętrznych.",
        "Karta płatnicza jest automatycznie powiązana z kontem Klienta po pierwszej płatności.",
        "W razie braku zapłaty w ciągu 3 dni Właściciel Portalu może pobrać środki z powiązanej karty."
      ]
    },
    section4: {
      title: "IV. Odstąpienie od umowy",
      points: [
        "Klient będący konsumentem nie może odstąpić od Umowy po rozpoczęciu jej realizacji.",
        "Odstąpienie jest możliwe bez podania przyczyny do 4 godzin przed rozpoczęciem Zamówienia, kontaktując się z Właścicielem Portalu. Jeśli pozostało mniej niż 4 godziny, Klient płaci pełną kwotę.",
        "Anulowanie możliwe w godzinach pracy: dni powszednie 8:00-20:00, weekendy 8:00-19:00. Jeśli zgłoszenie następuje np. o 2:00, za godzinę przyjęcia uznaje się 8:00.",
        "Właściciel Portalu może odstąpić od Umowy w przypadku siły wyższej lub podania przez Klienta błędnych danych (np. numer telefonu, adres).",
        "W przypadku odstąpienia Umowa traktowana jest jako niezawarta, a płatności zwracane są w ten sam sposób, w jaki zostały uiszczone.",
        "Właściciel Portalu może odrzucić przyszłe Zamówienia od Klienta w przypadku fałszywych Zamówień lub niewykonania Umowy (np. braku płatności)."
      ]
    },
    section5: {
      title: "V. Reklamacja Usługi sprzątania",
      points: [
        "Klienci mają prawo do składania reklamacji Usługi sprzątania w formie e-mail (info@startplus-clean.com) lub listownie (ul. Edwarda Habicha 18/45, 02-495 Warszawa).",
        "Reklamacja powinna zawierać oczekiwany sposób jej rozpatrzenia.",
        "Właściciel Portalu rozpatruje reklamacje w terminie 14 dni od ich złożenia.",
        "Roszczenia dotyczące jakości usług rozpatruje Wykonawca przy udziale Właściciela Portalu.",
        "Roszczenia co do jakości pracy należy zgłosić w trakcie lub do 12 godzin po realizacji Zamówienia.",
        "Reklamacje dotyczące szkód w mieniu można zgłosić do 3 dni od realizacji Zamówienia, a w przypadku szkód ukrytych – później, z dowodami (np. zdjęcia, filmy).",
        "Rozpatrzenie odszkodowania za szkody uwzględnia okoliczności, wysokość szkody, wartość i zużycie mienia."
      ]
    },
    section6: {
      title: "VI. Polityka prywatności",
      points: [
        "Portal przestrzega RODO. Administratorem danych jest STARTPLUS NATALIIA ZHYVOTIVSKA (ul. Edwarda Habicha 18/45, 02-495 Warszawa, info@startplus-clean.com).",
        "Dane Klienta przetwarzane są w celu realizacji Umowy i działań przed jej zawarciem.",
        "Podanie danych jest dobrowolne, ale niezbędne do zawarcia i realizacji Umowy.",
        "Dane mogą być przekazywane Wykonawcom oraz dostawcom usług zewnętrznych (np. płatności bezgotówkowe).",
        "Dane przechowywane są przez rok od usunięcia konta Klienta, chyba że prawo wymaga inaczej.",
        "Klient ma prawo do dostępu, sprostowania, usunięcia, przenoszenia danych oraz wniesienia skargi do organu nadzorczego (UODO w Polsce).",
        "Administrator nie podejmuje zautomatyzowanych decyzji, w tym profilowania danych osobowych.",
        "Dane gromadzone są w minimalnym zakresie, a adresy IP wykorzystywane są do celów statystycznych."
      ]
    },
    section7: {
      title: "VII. Polityka cookies",
      points: [
        "Portal używa plików cookies w celu realizacji Umowy i dopasowania oferty do potrzeb Klienta.",
        "Klient może ograniczyć lub wyłączyć cookies w ustawieniach przeglądarki, co może ograniczyć funkcjonalność Portalu.",
        "Cookies mogą być używane do prezentowania reklam dostosowanych do preferencji Klienta."
      ],
      subtitle: "Typy Cookies:",
      points2: [
        "systemowe – niezbędne do prawidłowego funkcjonowania strony,",
        "analityczne – służące do zbierania statystyk odwiedzin,",
        "funkcjonalne – umożliwiające personalizację strony poprzez zapamiętywanie preferencji Klienta."
      ]
    },
    section8: {
      title: "VIII. Odpowiedzialność Portalu",
      points: [
        "Właściciel Portalu nie ponosi odpowiedzialności za niewykonanie Umowy z powodu siły wyższej lub działań organów administracyjnych.",
        "Właściciel nie odpowiada za szkody wynikłe z błędów technicznych (np. brak dostępu do Portalu, zakłócenia łączności, wirusy komputerowe).",
        "Właściciel nie ponosi odpowiedzialności za skutki podania przez Klienta nieprawdziwych danych lub niezgodnego z Regulaminem korzystania z Portalu.",
        "Właściciel Portalu nie jest stroną Umowy o świadczenie usług sprzątania, więc nie odpowiada za szkody wyrządzone przez Wykonawcę, ale pośredniczy w sporach (mediacja).",
        "Właściciel Portalu nie odpowiada za szkody pośrednie, przypadkowe, utratę zysków, danych, honoru lub reputacji biznesowej wynikłe z korzystania z Portalu."
      ]
    },
    section9: {
      title: "IX. Wykonawcy Usług",
      points: [
        "Wykonawcami Usług są osoby fizyczne lub prawne prowadzące działalność gospodarczą, zarejestrowane na Portalu.",
        "Wykonawcy rejestrują się na Portalu i podpisują umowę współpracy z Właścicielem Portalu, określającą ich prawa, obowiązki, rozliczenia i fakturowanie.",
        "Wykonawcy samodzielnie zapewniają środki niezbędne do świadczenia usług zgodnie z Regulaminem sprzątania.",
        "Wykonawcy odpowiadają wobec Klientów za wykonanie usług oraz wszelkie szkody powstałe w trakcie ich świadczenia.",
        "W przypadku roszczeń Klientów wobec Wykonawcy, Wykonawca pokrywa koszty sporu, jeśli Właściciel Portalu zostanie zaangażowany.",
        "Wykonawca upoważnia Właściciela Portalu do wystawiania faktur VAT w jego imieniu.",
        "Wykonawcy samodzielnie odpowiadają za obowiązki fiskalne i składkowe wobec Skarbu Państwa i ZUS."
      ]
    },
    section10: {
      title: "X. Postanowienia końcowe",
      points: [
        "Regulamin reguluje świadczenie Usług i funkcjonowanie Portalu. W sprawach nieuregulowanych stosuje się Kodeks cywilny, ustawę o świadczeniu usług drogą elektroniczną (Dz. U. 2013, poz. 1422 z późn. zm.), ustawę o prawach konsumenta (Dz. U. 2014, poz. 827) oraz RODO.",
        "Spory wynikłe z niniejszego Regulaminu rozstrzyga sąd właściwy dla siedziby Właściciela Portalu, o ile przepisy nie stanowią inaczej.",
        "Regulamin wchodzi w życie z dniem 01.12.2020 r."
      ]
    },
    backButton: "Powrót",
  },
  uk: {
    title: "Регламент порталу www.startplus-clean.com",
    version: "Версія від 20.12.2022 р.",
    section1: {
      title: "I. Визначення",
      definitions: [
        { term: "Регламент", definition: "цей регламент Порталу „www.startplus-clean.com”, що регулює використання Порталу, права та обов’язки Власника Порталу, Клієнтів та Виконавців, а також принципи надання послуг прибирання." },
        { term: "Власник Порталу", definition: "STARTPLUS NATALIIA ZHYVOTIVSKA, Варшава, вул. Едварда Хабіха 18/45, 02-495 Варшава, NIP: 5242838146, REGON: 368071450. Контакти: E-mail: info@startplus-clean.com, Вебсайт: www.startplus-clean.com." },
        { term: "Портал", definition: "Інтернет-портал „www.startplus-clean.com”, через який надаються послуги з виконання Замовлень на Прибирання та здійснюється взаємодія між Клієнтами та Виконавцями. Доступ до Порталу можливий через пристрої, підключені до мережі Інтернет." },
        { term: "Виконавець", definition: "фізична або юридична особа, що здійснює господарську діяльність (зареєстровану або незареєстровану), зареєстрована на Порталі як суб’єкт, готовий до виконання Замовлень на прибирання приміщень, відповідно до Регламенту прибирання та іншими нормами, встановленими Власником Порталу." },
        { term: "Клієнт", definition: "фізична особа, яка має щонайменше обмежену правоздатність і досягла 18 років, а також юридична особа або організаційна одиниця, що має правоздатність і здатність до правових дій, яка зареєструвалася на Порталі для замовлення послуг прибирання." },
        { term: "Реєстрація", definition: "процес заповнення реєстраційної форми на Порталі, що включає введення необхідних персональних даних та визначення пароля Клієнтом або Виконавцем." },
        { term: "Особистий кабінет", definition: "розділ Порталу, доступний Клієнту після входу (номер телефону та пароль через SMS), що містить контактні дані, історію Замовлень, статус їх виконання, адреси Замовлень, номери використаних платіжних карток та інформацію про бонусну програму." },
        { term: "Замовлення", definition: "набір послуг з прибирання, обраних Клієнтом в електронній формі через Портал або по телефону, що визначають умови Договору, такі як: назва роботи, обсяг роботи, місце роботи, час роботи та її вартість, що є пропозицією Клієнта на прибирання приміщення." },
        { term: "Послуга прибирання", definition: "послуги прибирання приміщень та інші послуги у сфері підтримання чистоти, що надаються Виконавцями на користь Клієнтів через Портал, відповідно до цього Регламенту." },
        { term: "Ціна", definition: "ціна брутто Послуги, виражена в польських злотих, включає ПДВ. Для фізичних осіб послугою є Послуга прибирання (надається Виконавцем), для юридичних осіб – Послуга пошуку Виконавця (надається Платформою). Ціна не включає чайові, є обов’язковою і не підлягає обговоренню. Власник залишає за собою право змінити ціну у разі очевидної помилки." }
      ]
    },
    section2: {
      title: "II. Реєстрація та оформлення Замовлень",
      subtitle1: "1. Реєстрація",
      content1: "Для використання Порталу потрібна реєстрація з отриманням доступу до Особистого кабінету шляхом введення персональних даних, номера телефону, e-mail та пароля. Клієнт має ознайомитися та прийняти цей Регламент і дати згоду на укладення Договору.",
      note: "Увага! Клієнт погоджується на обробку персональних даних, позначаючи поле вибору біля заяви такого змісту:",
      declaration: "„Цим заявляю, що ознайомився та приймаю Регламент Порталу „www.startplus-clean.com” і даю згоду на використання та обробку моїх персональних даних, зазначених у реєстраційній формі, для потреб реєстрації та виконання Послуг, у тому числі для їх передачі Виконавцям, відповідно до Закону про захист персональних даних від 10 травня 2018 р. (Dz. U. з 2018 р., poz. 1000), а також Регламентом Європейського Парламенту та Ради (ЄС) 2016/679 від 27.04.2016 р. (GDPR).”",
      points1: [
        "Відсутність згоди на обробку даних унеможливлює виконання Замовлення.",
        "Реєстрація одноразова, подальші Замовлення потребують лише введення номера телефону та пароля через SMS.",
        "Клієнт може дати згоду на отримання рекламних пропозицій та акцій.",
        "Логін і пароль є конфіденційними, Клієнт відповідає за їх оновлення та безпеку.",
        "Суб’єкти господарювання додатково вказують дані для виставлення рахунку-фактури ПДВ."
      ],
      subtitle2: "2. Користування Порталом та Замовлення",
      points2: [
        "Замовлення оформлюються цілодобово через Портал або по телефону.",
        "Перегляд послуг не вимагає реєстрації, але оформлення Замовлення – так.",
        "Після оформлення Замовлення Клієнт отримує підтвердження електронною поштою.",
        "Оформлення Замовлення є пропозицією у розумінні Цивільного кодексу.",
        "Вартість послуг залежить від обсягу робіт, кількості кімнат, ванних кімнат та обраних додаткових послуг.",
        "Власник Порталу може відмовити у виконанні Замовлення, якщо воно суперечить Регламенту, містить помилки або включає недоступні послуги.",
        "Особистий кабінет Клієнта містить історію Замовлень та бонусні бали. Умови бонусної програми доступні на сайті www.startplus-clean.com."
      ]
    },
    section3: {
      title: "III. Виконання Замовлень",
      subtitle1: "1. Загальні положення",
      points1: [
        "Власник Порталу забезпечує виконання Замовлень Виконавцями за стандартами, визначеними у Регламенті Прибирання (Додаток до Регламенту).",
        "Клієнт забезпечує доступ до приміщення, комунікації (вода, електрика) та оплату послуги у розмірі, вказаному в підтвердженні Замовлення.",
        "У разі відсутності Клієнта за вказаною адресою та часом Замовлення, витрати покриває Клієнт.",
        "Спірні ситуації під час виконання Замовлення необхідно повідомити Власнику Порталу.",
        "На прохання Клієнта (через функціонал Порталу) виставляється рахунок-фактура ПДВ від імені Виконавця Власником Порталу."
      ],
      subtitle2: "2. Зона діяльності",
      content2: "Послуги надаються в зоні, вказаній на Порталі.",
      subtitle3: "3. Правила оплати",
      points3: [
        "готівкою – безпосередньо Виконавцю під час виконання послуги,",
        "платіжною/кредитною карткою – виключно під час оформлення Замовлення."
      ],
      additionalPoints: [
        "Вибір способу оплати необхідно зробити у формі Замовлення.",
        "У разі безготівкових платежів Клієнт приймає регламенти зовнішніх постачальників.",
        "Картка автоматично прив’язується до кабінету Клієнта після першої оплати.",
        "У разі несплати протягом 3 днів Власник Порталу може списати кошти з прив’язаної картки."
      ]
    },
    section4: {
      title: "IV. Відмова від договору",
      points: [
        "Клієнт-споживач не може відмовитися від Договору після початку його виконання.",
        "Відмова можлива без зазначення причини за 4 години до початку Замовлення, зв’язавшись із Власником Порталу. Якщо залишилося менше 4 годин, Клієнт сплачує повну суму.",
        "Скасування можливе в робочі години: будні 8:00-20:00, вихідні 8:00-19:00. Якщо повідомлення надійшло, наприклад, о 2:00, часом прийняття вважається 8:00.",
        "Власник Порталу може відмовитися від Договору у разі форс-мажору або надання Клієнтом неправильних даних (наприклад, номер телефону, адреса).",
        "У разі відмови Договір вважається неукладеним, а платежі повертаються тим самим способом, яким були сплачені.",
        "Власник Порталу може відхилити майбутні Замовлення від Клієнта у разі фальшивих Замовлень або невиконання Договору (наприклад, несплата)."
      ]
    },
    section5: {
      title: "V. Рекламація Послуги прибирання",
      points: [
        "Клієнти мають право подавати рекламації Послуги прибирання електронною поштою (info@startplus-clean.com) або листом (вул. Едварда Хабіха 18/45, 02-495 Варшава).",
        "Рекламація має містити очікуваний спосіб її розгляду.",
        "Власник Порталу розглядає рекламації протягом 14 днів від дня їх подання.",
        "Претензії щодо якості послуг розглядає Виконавець за участю Власника Порталу.",
        "Претензії щодо якості виконаної роботи необхідно повідомляти під час виконання або до 12 годин після завершення Замовлення.",
        "Рекламації щодо пошкодження майна можна подавати до 3 днів після виконання Замовлення, а у разі прихованих пошкоджень – пізніше, з доказами (наприклад, фото, відео).",
        "Розгляд відшкодування за пошкодження враховує обставини, розмір шкоди, вартість та природний знос майна."
      ]
    },
    section6: {
      title: "VI. Політика конфіденційності",
      points: [
        "Портал дотримується GDPR. Адміністратором даних є STARTPLUS NATALIIA ZHYVOTIVSKA (вул. Едварда Хабіха 18/45, 02-495 Варшава, info@startplus-clean.com).",
        "Дані Клієнта обробляються для виконання Договору та вжиття заходів перед його укладенням.",
        "Надання даних є добровільним, але необхідним для укладення та виконання Договору.",
        "Дані можуть передаватися Виконавцям та постачальникам зовнішніх послуг (наприклад, безготівкові платежі).",
        "Дані зберігаються протягом року з моменту видалення кабінету Клієнта, якщо інше не вимагається законом.",
        "Клієнт має право вимагати доступу, виправлення, видалення, перенесення даних та подати скаргу до наглядового органу (UODO в Польщі).",
        "Адміністратор не приймає автоматизованих рішень, включно з профілюванням персональних даних.",
        "Дані збираються в мінімальному обсязі, необхідному для надання послуг, а IP-адреси використовуються для статистичних цілей."
      ]
    },
    section7: {
      title: "VII. Політика cookies",
      points: [
        "Портал використовує файли cookies для належного виконання Договору та підбору пропозицій для Клієнта.",
        "Клієнт може обмежити або відключити доступ cookies у налаштуваннях браузера, що може обмежити функціональність Порталу.",
        "Cookies також можуть використовуватися для показу реклами, адаптованої до уподобань Клієнта."
      ],
      subtitle: "Типи Cookies:",
      points2: [
        "системні – необхідні для правильного функціонування сторінки,",
        "аналітичні – для збору статистики відвідувань,",
        "функціональні – для персоналізації сторінки шляхом запам’ятовування уподобань Клієнта."
      ]
    },
    section8: {
      title: "VIII. Відповідальність Порталу",
      points: [
        "Власник Порталу не несе відповідальності за невиконання Договору через форс-мажор або дії адміністративних органів.",
        "Власник не відповідає за збитки, спричинені технічними помилками (наприклад, відсутність доступу до Порталу, перебої у зв’язку, комп’ютерні віруси).",
        "Власник не несе відповідальності за наслідки подання Клієнтом неправдивих даних або порушення Регламенту.",
        "Власник Порталу не є стороною Договору про надання послуг прибирання, тому не відповідає за збитки, завдані Виконавцем, але виступає посередником у спорах (медіація).",
        "Власник Порталу не несе відповідальності за непрямі збитки, втрату прибутку, даних, честі чи ділової репутації, що виникли через використання Порталу."
      ]
    },
    section9: {
      title: "IX. Виконавці Послуг",
      points: [
        "Виконавцями Послуг є фізичні або юридичні особи, що ведуть господарську діяльність, зареєстровані на Порталі.",
        "Виконавці реєструються на Порталі та укладають договір співпраці з Власником Порталу, що визначає їхні права, обов’язки, розрахунки та виставлення рахунків.",
        "Виконавці самостійно забезпечують засоби для надання послуг відповідно до Регламенту прибирання.",
        "Виконавці несуть відповідальність перед Клієнтами за виконання послуг та будь-які збитки, що виникли під час їх надання.",
        "У разі претензій Клієнтів до Виконавця, Виконавець покриває витрати спору, якщо Власник Порталу буде залучений.",
        "Виконавець уповноважує Власника Порталу виставляти рахунки-фактури ПДВ від його імені.",
        "Виконавці самостійно відповідають за фіскальні та соціальні внески перед державою та ZUS."
      ]
    },
    section10: {
      title: "X. Прикінцеві положення",
      points: [
        "Регламент регулює надання Послуг та функціонування Порталу. У неврегульованих питаннях застосовуються Цивільний кодекс, Закон про надання електронних послуг (Dz. U. 2013, поз. 1422 зі змінами), Закон про права споживачів (Dz. U. 2014, поз. 827) та GDPR.",
        "Спори, що виникають із цього Регламенту, вирішує суд за місцезнаходженням Власника Порталу, якщо обов’язкові норми не передбачають іншого.",
        "Регламент набуває чинності з 01.12.2020 р."
      ]
    },
    backButton: "Повернутися",
  },
  ru: {
    title: "Регламент портала www.startplus-clean.com",
    version: "Версия от 20.12.2022 г.",
    section1: {
      title: "I. Определения",
      definitions: [
        { term: "Регламент", definition: "настоящий регламент Портала „www.startplus-clean.com”, регулирующий использование Портала, права и обязанности Владельца, Клиентов и Исполнителей, а также принципы оказания услуг уборки." },
        { term: "Владелец Портала", definition: "STARTPLUS NATALIIA ZHYVOTIVSKA, Варшава, ул. Эдварда Хабиха 18/45, 02-495 Варшава, NIP: 5242838146, REGON: 368071450. Контакты: E-mail: info@startplus-clean.com, Вебсайт: www.startplus-clean.com." },
        { term: "Портал", definition: "Интернет-портал „www.startplus-clean.com”, через который оказываются услуги по выполнению Заказов на Уборку и взаимодействие между Клиентами и Исполнителями. Доступ к Порталу возможен через устройства, подключенные к сети Интернет." },
        { term: "Исполнитель", definition: "физическое или юридическое лицо, осуществляющее хозяйственную деятельность (зарегистрированную или незарегистрированную), зарегистрированное на Портале как субъект, готовый выполнять Заказы на уборку помещений, в соответствии с Регламентом уборки и другими нормами, установленными Владельцем Портала." },
        { term: "Клиент", definition: "физическое лицо, достигшее 18 лет и обладающее ограниченной правоспособностью, а также юридическое лицо или организационная единица, обладающая правоспособностью и дееспособностью, зарегистрированная на Портале для заказа услуг уборки." },
        { term: "Регистрация", definition: "процесс заполнения регистрационной формы на Портале, включающий ввод персональных данных и установку пароля Клиентом или Исполнителем." },
        { term: "Личный кабинет", definition: "раздел Портала, доступный Клиенту после входа (номер телефона и пароль через SMS), содержащий контактные данные, историю Заказов, статус их выполнения, адреса Заказов, номера используемых платежных карт и информацию о бонусной программе." },
        { term: "Заказ", definition: "набор услуг уборки, выбранных Клиентом в электронной форме через Портал или по телефону, определяющих условия Договора, такие как: название работы, объем работы, место работы, время работы и ее стоимость, являющийся предложением Клиента на уборку помещения." },
        { term: "Услуга уборки", definition: "услуги уборки помещений и другие услуги в сфере поддержания чистоты, оказываемые Исполнителями в пользу Клиентов через Портал, в соответствии с настоящим Регламентом." },
        { term: "Цена", definition: "цена брутто Услуги, выраженная в польских злотых, включает НДС. Для физических лиц услугой является Услуга уборки (оказывается Исполнителем), для юридических лиц – Услуга поиска Исполнителя (оказывается Платформой). Цена не включает чаевые, является обязательной и не подлежит обсуждению. Владелец оставляет за собой право изменить цену в случае очевидной ошибки." }
      ]
    },
    section2: {
      title: "II. Регистрация и оформление Заказов",
      subtitle1: "1. Регистрация",
      content1: "Для использования Портала требуется регистрация с получением доступа к Личному кабинету путем ввода персональных данных, номера телефона, e-mail и пароля. Клиент должен ознакомиться и принять настоящий Регламент, а также дать согласие на заключение Договора.",
      note: "Внимание! Клиент соглашается на обработку персональных данных, отмечая поле выбора у заявления следующего содержания:",
      declaration: "„Настоящим заявляю, что ознакомился и принимаю Регламент Портала „www.startplus-clean.com” и даю согласие на использование и обработку моих персональных данных, указанных в регистрационной форме, для нужд регистрации и выполнения Услуг, в том числе для их передачи Исполнителям, в соответствии с Законом о защите персональных данных от 10 мая 2018 г. (Dz. U. 2018, поз. 1000) и Регламентом Европейского Парламента и Совета (ЕС) 2016/679 от 27.04.2016 г. (GDPR).”",
      points1: [
        "Отсутствие согласия на обработку данных делает невозможным выполнение Заказа.",
        "Регистрация одноразовая, последующие Заказы требуют только ввода номера телефона и пароля через SMS.",
        "Клиент может дать согласие на получение рекламных предложений и акций.",
        "Логин и пароль конфиденциальны, Клиент отвечает за их обновление и безопасность.",
        "Субъекты хозяйствования дополнительно указывают данные для выставления счета-фактуры НДС."
      ],
      subtitle2: "2. Использование Портала и Заказы",
      points2: [
        "Заказы оформляются круглосуточно через Портал или по телефону.",
        "Просмотр услуг не требует регистрации, но оформление Заказа – да.",
        "После оформления Заказа Клиент получает подтверждение по электронной почте.",
        "Оформление Заказа является предложением в понимании Гражданского кодекса.",
        "Стоимость услуг зависит от объема работ, количества комнат, ванных комнат и выбранных дополнительных услуг.",
        "Владелец Портала может отказать в выполнении Заказа, если он противоречит Регламенту, содержит ошибки или включает недоступные услуги.",
        "Личный кабинет Клиента содержит историю Заказов и бонусные баллы. Условия бонусной программы доступны на сайте www.startplus-clean.com."
      ]
    },
    section3: {
      title: "III. Выполнение Заказов",
      subtitle1: "1. Общие положения",
      points1: [
        "Владелец Портала обеспечивает выполнение Заказов Исполнителями по стандартам, указанным в Регламенте Уборки (Приложение к Регламенту).",
        "Клиент обеспечивает доступ к помещению, коммуникации (вода, электричество) и оплату услуги в размере, указанном в подтверждении Заказа.",
        "В случае отсутствия Клиента по указанному адресу и времени Заказа, расходы покрывает Клиент.",
        "Спорные ситуации во время выполнения Заказа необходимо сообщить Владельцу Портала.",
        "По просьбе Клиента (через функционал Портала) выставляется счет-фактура НДС от имени Исполнителя Владельцем Портала."
      ],
      subtitle2: "2. Зона действия",
      content2: "Услуги предоставляются в зоне, указанной на Портале.",
      subtitle3: "3. Правила оплаты",
      points3: [
        "наличными – непосредственно Исполнителю во время выполнения услуги,",
        "платежной/кредитной картой – исключительно при оформлении Заказа."
      ],
      additionalPoints: [
        "Выбор способа оплаты необходимо сделать в форме Заказа.",
        "При безналичных платежах Клиент принимает регламенты внешних поставщиков.",
        "Карта автоматически привязывается к кабинету Клиента после первой оплаты.",
        "В случае неуплаты в течение 3 дней Владелец Портала может списать средства с привязанной карты."
      ]
    },
    section4: {
      title: "IV. Отказ от договора",
      points: [
        "Клиент-потребитель не может отказаться от Договора после начала его выполнения.",
        "Отказ возможен без указания причины за 4 часа до начала Заказа, связавшись с Владельцем Портала. Если осталось менее 4 часов, Клиент оплачивает полную сумму.",
        "Отмена возможна в рабочее время: будни 8:00-20:00, выходные 8:00-19:00. Если сообщение поступило, например, в 2:00, временем принятия считается 8:00.",
        "Владелец Портала может отказаться от Договора в случае форс-мажора или предоставления Клиентом неверных данных (например, номер телефона, адрес).",
        "В случае отказа Договор считается незаключенным, а платежи возвращаются тем же способом, которым были оплачены.",
        "Владелец Портала может отклонить будущие Заказы от Клиента в случае фальшивых Заказов или невыполнения Договора (например, неуплата)."
      ]
    },
    section5: {
      title: "V. Рекламація Послуги прибирання",
      points: [
        "Клиенты имеют право подавать рекламации Услуги уборки по электронной почте (info@startplus-clean.com) или письмом (ул. Эдварда Хабиха 18/45, 02-495 Варшава).",
        "Рекламація повинна містити очікуваний спосіб її розгляду.",
        "Власник Порталу розглядає рекламації протягом 14 днів від дня їх подання.",
        "Претензії щодо якості послуг розглядає Виконавець за участю Власника Порталу.",
        "Претензії щодо якості виконаної роботи необхідно повідомляти під час виконання або до 12 годин після завершення Замовлення.",
        "Рекламації щодо пошкодження майна можна подавати до 3 днів після виконання Замовлення, а у разі прихованих пошкоджень – пізніше, з доказами (наприклад, фото, відео).",
        "Розгляд відшкодування за пошкодження враховує обставини, розмір шкоди, вартість та природний знос майна."
      ]
    },
    section6: {
      title: "VI. Політика конфіденційності",
      points: [
        "Портал дотримується GDPR. Адміністратором даних є STARTPLUS NATALIIA ZHYVOTIVSKA (вул. Едварда Хабіха 18/45, 02-495 Варшава, info@startplus-clean.com).",
        "Дані Клієнта обробляються для виконання Договору та вжиття заходів перед його укладенням.",
        "Надання даних є добровільним, але необхідним для укладення та виконання Договору.",
        "Дані можуть передаватися Виконавцям та постачальникам зовнішніх послуг (наприклад, безготівкові платежі).",
        "Дані зберігаються протягом року з моменту видалення кабінету Клієнта, якщо інше не вимагається законом.",
        "Клієнт має право вимагати доступу, виправлення, видалення, перенесення даних та подати скаргу до наглядового органу (UODO в Польщі).",
        "Адміністратор не приймає автоматизованих рішень, включно з профілюванням персональних даних.",
        "Дані збираються в мінімальному обсязі, необхідному для надання послуг, а IP-адреси використовуються для статистичних цілей"
      ]
    },
    section7: {
      title: "VII. Політика cookies",
      points: [
        "Портал використовує файли cookies для належного виконання Договору та підбору пропозицій для Клієнта.",
        "Клієнт може обмежити або відключити доступ cookies у налаштуваннях браузера, що може обмежити функціональність Порталу.",
        "Cookies також можуть використовуватися для показу реклами, адаптованої до уподобань Клієнта."
      ],
      subtitle: "Типи Cookies:",
      points2: [
        "системні – необхідні для правильного функціонування сторінки,",
        "аналітичні – для збору статистики відвідувань,",
        "функціональні – для персоналізації сторінки шляхом запам’ятовування уподобань Клієнта."
      ]
    },
    section8: {
      title: "VIII. Відповідальність Порталу",
      points: [
        "Власник Порталу не несе відповідальності за невиконання Договору через форс-мажор або дії адміністративних органів.",
        "Власник не відповідає за збитки, спричинені технічними помилками (наприклад, відсутність доступу до Порталу, перебої у зв’язку, комп’ютерні віруси).",
        "Власник не несе відповідальності за наслідки подання Клієнтом неправдивих даних або порушення Регламенту.",
        "Власник Порталу не є стороною Договору про надання послуг прибирання, тому не відповідає за збитки, завдані Виконавцем, але виступає посередником у спорах (медіація).",
        "Власник Порталу не несе відповідальності за непрямі збитки, втрату прибутку, даних, честі чи ділової репутації, що виникли через використання Порталу."
      ]
    },
    section9: {
      title: "IX. Виконавці Послуг",
      points: [
        "Виконавцями Послуг є фізичні або юридичні особи, що ведуть господарську діяльність, зареєстровані на Порталі.",
        "Виконавці реєструються на Порталі та укладають договір співпраці з Власником Порталу, що визначає їхні права, обов’язки, розрахунки та виставлення рахунків.",
        "Виконавці самостійно забезпечують засоби для надання послуг відповідно до Регламенту прибирання.",
        "Виконавці несуть відповідальність перед Клієнтами за виконання послуг та будь-які збитки, що виникли під час їх надання.",
        "У разі претензій Клієнтів до Виконавця, Виконавець покриває витрати спору, якщо Власник Порталу буде залучений.",
        "Виконавець уповноважує Власника Порталу виставляти рахунки-фактури ПДВ від його імені.",
        "Виконавці самостійно відповідають за фіскальні та соціальні внески перед державою та ZUS."
      ]
    },
    section10: {
      title: "X. Прикінцеві положення",
      points: [
        "Регламент регулює надання Послуг та функціонування Порталу. У неврегульованих питаннях застосовуються Цивільний кодекс, Закон про надання електронних послуг (Dz. U. 2013, поз. 1422 зі змінами), Закон про права споживачів (Dz. U. 2014, поз. 827) та GDPR.",
        "Спори, що виникають із цього Регламенту, вирішує суд за місцезнаходженням Власника Порталу, якщо обов’язкові норми не передбачають іншого.",
        "Регламент набуває чинності з 01.12.2020 р."
      ]
    },
    backButton: "Вернуться",
  },
  en: {
    title: "Terms of Service for www.startplus-clean.com Portal",
    version: "Version as of 20.12.2022",
    section1: {
      title: "I. Definitions",
      definitions: [
        { term: "Terms", definition: "these Terms of the „www.startplus-clean.com” Portal, governing its use, rights, and obligations of the Portal Owner, Clients, and Contractors, as well as the principles of providing cleaning services." },
        { term: "Portal Owner", definition: "STARTPLUS NATALIIA ZHYVOTIVSKA, located at ul. Edwarda Habicha 18/45, 02-495 Warsaw, NIP: 5242838146, REGON: 368071450. Contact details: E-mail: info@startplus-clean.com, Website: www.startplus-clean.com." },
        { term: "Portal", definition: "The „www.startplus-clean.com” internet portal through which cleaning order services are provided and interactions between Clients and Contractors are facilitated. Access to the Portal is possible via devices connected to the Internet." },
        { term: "Contractor", definition: "A natural or legal person engaged in business activity (registered or unregistered), registered on the Portal as an entity ready to perform cleaning orders in accordance with the Cleaning Terms and other standards set by the Portal Owner." },
        { term: "Client", definition: "A natural person (over 18 years) with at least limited legal capacity, or a legal entity/organization with legal capacity, registered on the Portal to order cleaning services." },
        { term: "Registration", definition: "The process of completing the registration form on the Portal, including providing required personal data and setting a password by the Client or Contractor." },
        { term: "Personal Account", definition: "A section of the Portal accessible to the Client after login (phone number and SMS password), containing contact details, order history, order status, order addresses, used payment card numbers, and bonus program information." },
        { term: "Order", definition: "A set of cleaning services selected by the Client electronically via the Portal or by phone, specifying the Agreement terms such as: name of the work, scope of work, place of work, time of work, and its cost, constituting the Client’s offer for cleaning the premises." },
        { term: "Cleaning Service", definition: "Cleaning services for premises and other cleanliness maintenance services provided by Contractors to Clients through the Portal, in accordance with these Terms." },
        { term: "Price", definition: "The gross price of the Service in Polish zlotys, including VAT. For natural persons, the service is the Cleaning Service (provided by the Contractor); for legal entities, the service is the Contractor Recruitment Service (provided by the Platform). The price does not include tips, is binding, and non-negotiable. The Owner reserves the right to change the price in case of an obvious error." }
      ]
    },
    section2: {
      title: "II. Registration and Placing Orders",
      subtitle1: "1. Registration",
      content1: "Using the Portal requires registration and obtaining access to a Personal Account by providing personal data, a phone number, an e-mail, and a password. The Client is required to review and accept these Terms and consent to entering into the Agreement.",
      note: "Note! The Client agrees to data processing by accepting the Terms and GDPR, by checking the relevant box.",
      declaration: "“I hereby declare that I have read and accept the Terms of the „www.startplus-clean.com” Portal and consent to the use and processing of my personal data provided in the registration form for the purposes of registration and service provision, including their transfer to Contractors, in accordance with the Personal Data Protection Act of May 10, 2018 (Dz. U. 2018, poz. 1000), and the Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (GDPR).”",
      points1: [
        "Lack of consent for data processing makes Order fulfillment impossible.",
        "Registration is one-time; subsequent Orders require only entering the phone number and SMS password.",
        "The Client may consent to receiving promotional offers and advertisements.",
        "Login and password are confidential; the Client is responsible for updating and securing them.",
        "Business entities must additionally provide data for issuing a VAT invoice."
      ],
      subtitle2: "2. Using the Portal and Ordering",
      points2: [
        "Orders can be placed 24/7 via the Portal or by phone.",
        "Viewing services does not require registration, but placing an Order does.",
        "After placing an Order, the Client receives an e-mail confirmation.",
        "Placing an Order constitutes an offer under the Civil Code.",
        "The cost of services depends on the scope of work, number of rooms, bathrooms, and selected additional services.",
        "The Portal Owner may refuse to fulfill an Order if it violates the Terms, contains errors, or includes unavailable services.",
        "The Client’s Personal Account includes order history and bonus points. The terms of the bonus program are available at www.startplus-clean.com."
      ]
    },
    section3: {
      title: "III. Order Fulfillment",
      subtitle1: "1. General Provisions",
      points1: [
        "The Portal Owner ensures Orders are fulfilled by Contractors according to standards outlined in the Cleaning Terms (Appendix to the Terms).",
        "The Client provides access to the premises, utilities (water, electricity), and payment for the service as specified in the Order confirmation.",
        "If the Client is absent at the specified place and time of the Order, the incurred costs are borne by the Client.",
        "Disputes during Order fulfillment must be reported to the Portal Owner.",
        "At the Client’s request (via Portal functionality), a VAT invoice is issued by the Portal Owner on behalf of the Contractor."
      ],
      subtitle2: "2. Service Area",
      content2: "Services are provided in the area specified on the Portal.",
      subtitle3: "3. Payment Rules",
      points3: [
        "cash – directly to the Contractor during service,",
        "payment/credit card – upon placing the Order."
      ],
      additionalPoints: [
        "The payment method must be selected in the Order form.",
        "For non-cash payments, the Client accepts the terms of external providers.",
        "The payment card is automatically linked to the Client’s account after the first payment.",
        "If payment is not made within 3 days, the Portal Owner may charge the linked card."
      ]
    },
    section4: {
      title: "IV. Withdrawal from the Agreement",
      points: [
        "A Client who is a consumer cannot withdraw from the Agreement after its execution begins.",
        "Withdrawal is possible without stating a reason up to 4 hours before the Order starts by contacting the Portal Owner. If less than 4 hours remain, the Client pays the full amount.",
        "Cancellation is possible during working hours: weekdays 8:00-20:00, weekends 8:00-19:00. If reported at 2:00 AM, the acceptance time is 8:00 AM.",
        "The Portal Owner may withdraw from the Agreement due to force majeure or incorrect Client data (e.g., phone number, address).",
        "In case of withdrawal, the Agreement is deemed unexecuted, and payments are refunded in the same manner as paid.",
        "The Portal Owner may reject future Orders from a Client in case of false Orders or Agreement non-fulfillment (e.g., non-payment)."
      ]
    },
    section5: {
      title: "V. Complaints Regarding Cleaning Services",
      points: [
        "Clients may file complaints via e-mail (info@startplus-clean.com) or letter (ul. Edwarda Habicha 18/45, 02-495 Warsaw).",
        "The complaint should specify the expected resolution method.",
        "The Portal Owner reviews complaints within 14 days of submission.",
        "Quality claims are handled by the Contractor with the Owner’s involvement.",
        "Claims regarding service quality must be reported during or within 12 hours after Order completion.",
        "Complaints about property damage can be filed within 3 days of Order completion, or later for hidden damages, with evidence (e.g., photos, videos).",
        "Compensation for damages considers the circumstances, extent of damage, value, and natural wear of the property."
      ]
    },
    section6: {
      title: "VI. Privacy Policy",
      points: [
        "The Portal complies with GDPR. The Administrator is STARTPLUS NATALIIA ZHYVOTIVSKA (ul. Edwarda Habicha 18/45, 02-495 Warsaw, info@startplus-clean.com).",
        "Client data is processed to fulfill the Agreement and take pre-contractual actions.",
        "Providing data is voluntary but necessary for concluding and executing the Agreement.",
        "Data may be transferred to Contractors and external service providers (e.g., non-cash payments).",
        "Data is stored for one year after the Client’s account deletion unless otherwise required by law.",
        "Clients have the right to access, correct, delete, transfer their data, and file a complaint with a supervisory authority (UODO in Poland).",
        "The Administrator does not make automated decisions, including profiling of personal data.",
        "Data is collected minimally, and IP addresses are used for statistical purposes."
      ]
    },
    section7: {
      title: "VII. Cookie Policy",
      points: [
        "The Portal uses cookies to fulfill the Agreement and tailor offers to the Client’s needs.",
        "Clients can limit or disable cookies in browser settings, which may restrict Portal functionality.",
        "Cookies may also be used to display ads tailored to the Client’s preferences."
      ],
      subtitle: "Types of Cookies:",
      points2: [
        "system – necessary for proper site operation,",
        "analytical – for collecting visit statistics,",
        "functional – for personalizing the site by saving Client preferences."
      ]
    },
    section8: {
      title: "VIII. Portal Liability",
      points: [
        "The Owner is not liable for non-performance of the Agreement due to force majeure or actions of administrative authorities.",
        "The Owner is not responsible for damages caused by technical errors (e.g., lack of access to the Portal, connectivity issues, computer viruses).",
        "The Owner is not liable for consequences of the Client providing false data or violating the Terms.",
        "The Portal Owner is not a party to the Agreement for cleaning services, thus not liable for damages caused by the Contractor, but mediates disputes (mediation).",
        "The Portal Owner is not liable for indirect damages, loss of profits, data, honor, or business reputation arising from Portal use."
      ]
    },
    section9: {
      title: "IX. Contractors of Services",
      points: [
        "Contractors are natural or legal persons engaged in business activities, registered on the Portal.",
        "Contractors register on the Portal and sign a cooperation agreement with the Portal Owner, defining their rights, obligations, settlements, and invoicing.",
        "Contractors independently provide the means necessary to perform services per the Cleaning Terms.",
        "Contractors are responsible to Clients for service performance and any damages incurred during their provision.",
        "In case of Client claims against a Contractor, the Contractor covers dispute costs if the Portal Owner is involved.",
        "Contractors authorize the Owner to issue VAT invoices on their behalf.",
        "Contractors are independently responsible for fiscal and social contribution obligations to the state and ZUS."
      ]
    },
    section10: {
      title: "X. Final Provisions",
      points: [
        "The Terms govern the provision of Services and Portal operation. Unregulated matters are subject to the Civil Code, the Act on Electronic Services (Dz. U. 2013, poz. 1422 as amended), the Consumer Rights Act (Dz. U. 2014, poz. 827), and GDPR.",
        "Disputes arising from these Terms are resolved by the court at the Owner’s location, unless mandatory provisions state otherwise.",
        "The Terms take effect on 01.12.2020."
      ]
    },
    backButton: "Back",
  },
};

/* ==== КОМПОНЕНТ TERMS OF SERVICE ==== */
export default function TermsPage({ lang = "pl" }) {
  const t = useMemo(() => dict[lang] || dict.pl, [lang]);
  const navigate = useNavigate();

  return (
    <div className={css.container}>
      <h1 className={css.title}>{t.title}</h1>
      <p className={css.version}>{t.version}</p>

      {/* Розділ I */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section1.title}</h2>
        {t.section1.definitions.map((item, index) => (
          <div key={index} className={css.definition}>
            <strong>{item.term}</strong> - {item.definition}
          </div>
        ))}
      </section>

      {/* Розділ II */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section2.title}</h2>
        <h3 className={css.subTitle}>{t.section2.subtitle1}</h3>
        <p className={css.sectionContent}>{t.section2.content1}</p>
        <p className={css.note}>{t.section2.note}</p>
        <p className={css.declaration}>{t.section2.declaration}</p>
        <ul className={css.list}>
          {t.section2.points1.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h3 className={css.subTitle}>{t.section2.subtitle2}</h3>
        <ul className={css.list}>
          {t.section2.points2.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ III */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section3.title}</h2>
        <h3 className={css.subTitle}>{t.section3.subtitle1}</h3>
        <ul className={css.list}>
          {t.section3.points1.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h3 className={css.subTitle}>{t.section3.subtitle2}</h3>
        <p className={css.sectionContent}>{t.section3.content2}</p>
        <h3 className={css.subTitle}>{t.section3.subtitle3}</h3>
        <p className={css.sectionContent}>{t.section3.content3}</p>
        <ul className={css.list}>
          {t.section3.points3.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
          {t.section3.additionalPoints && t.section3.additionalPoints.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ IV */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section4.title}</h2>
        <ul className={css.list}>
          {t.section4.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ V */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section5.title}</h2>
        <ul className={css.list}>
          {t.section5.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ VI */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section6.title}</h2>
        <ul className={css.list}>
          {t.section6.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ VII */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section7.title}</h2>
        <ul className={css.list}>
          {t.section7.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
        <h3 className={css.subTitle}>{t.section7.subtitle}</h3>
        <ul className={css.list}>
          {t.section7.points2.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ VIII */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section8.title}</h2>
        <ul className={css.list}>
          {t.section8.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ IX */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section9.title}</h2>
        <ul className={css.list}>
          {t.section9.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Розділ X */}
      <section className={css.section}>
        <h2 className={css.sectionTitle}>{t.section10.title}</h2>
        <ul className={css.list}>
          {t.section10.points.map((point, index) => (
            <li key={index} className={css.listItem}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Кнопка "Повернутися" */}
      <button onClick={() => navigate("/")} className={css.backButton}>
        {t.backButton}
      </button>
    </div>
  );
}