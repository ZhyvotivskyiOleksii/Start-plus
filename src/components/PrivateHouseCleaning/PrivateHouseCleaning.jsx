import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import css from "../Calculator/Calculator.module.css";
import { FaCalendarAlt, FaPercentage, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

export default function PrivateHouseCleaning({ lang, type, title }) {
  const [clientType, setClientType] = useState("Osoba prywatna");
  const [rooms, setRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [kitchen, setKitchen] = useState(true);
  const [kitchenCost, setKitchenCost] = useState(15.0);
  const [kitchenAnnex, setKitchenAnnex] = useState(false);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookedDates] = useState(new Set(["2025-03-15"]));
  const [discounts, setDiscounts] = useState({});
  const [promoCodes, setPromoCodes] = useState([]);
  const [cleaningFrequency, setCleaningFrequency] = useState("Jednorazowe sprzątanie");
  const [vacuumNeeded, setVacuumNeeded] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCity, setSelectedCity] = useState("Warszawa");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [intercomCode, setIntercomCode] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nip, setNip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

  // Refs для підсвітки помилок
  const streetRef = useRef(null);
  const postalCodeRef = useRef(null);
  const houseNumberRef = useRef(null);
  const nameRef = useRef(null);
  const companyNameRef = useRef(null);
  const nipRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const calendarRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const agreementRef = useRef(null);
  const sentinelRef = useRef(null);
  const orderButtonRef = useRef(null);
  const location = useLocation();
  const [isSticked, setIsSticked] = useState(true);

  const cities = {
    Warszawa: 0.00,
    Piastów: 30.00,
    Pruszków: 30.00,
    Piaseczno: 30.00,
    Sulejówek: 40.00,
    Józefów: 70.00,
    Kobyłka: 50.00,
    "Ożarów Mazowiecki": 50.00,
    Otwock: 70.00,
    Zielonka: 40.00,
    Legionowo: 40.00,
    Józefosław: 60.00,
    Nieporęt: 90.00,
    Ząbki: 30.00,
    Blonie: 50.00,
    "Stare Babice": 30.00,
    Brwinów: 50.00,
    "Grodzisk Mazowiecki": 60.00,
    Marki: 30.00,
    Raszyn: 25.00,
    Łomianki: 40.00,
    Łazy: 50.00,
    "Nowa Iwiczna": 50.00,
    Wólka: 40.00,
    "Konstancin-Jeziorna": 50.00,
    Jabłonna: 40.00,
    "Nowy Dwór Mazowiecki": 75.00,
    Młociny: 60.00,
    Sołec: 80.00,
    Leszno: 80.00,
    Milanówek: 50.00,
    Izabelin: 70.00,
    Nadarzyn: 80.00,
    Żyrardów: 90.00,
    "Wola Krakowska": 100.00,
    Radzymin: 75.00,
    "Mińsk Mazowiecki": 80.00,
    "Nowa Wola": 60.00,
    Janki: 45.00,
    "Góra Kalwaria": 100.00,
    Mysiadło: 40.00,
    Władysławów: 30.00,
    Ustanów: 90.00,
  };

  const filteredCities = Object.entries(cities).filter(([city]) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const frequencyDiscounts = {
    "Raz w tygodniu": 20,
    "Raz na dwa tygodnie": 15,
    "Raz w miesiącu": 10,
    "Jednorazowe sprzątanie": 0,
  };

  const basePrice = 250.0;
  const roomCost = 60.0;
  const bathroomCost = 40.0;
  const kitchenBaseCost = 15.0;
  const companyMultiplier = 1.23;
  const vacuumCost = 28.0;

  const months = {
    pl: [
      "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
      "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
    ],
    uk: [
      "січень", "лютий", "березень", "квітень", "травень", "червень",
      "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"
    ],
    ru: [
      "январь", "февраль", "март", "апрель", "май", "июнь",
      "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
    ],
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  };

  const availableTimes = [
    "7:30", "8:00", "9:00", "10:00",
    "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00",
  ];

  const paidServices = [
    { id: 1, name: "oven_cleaning", price: 32.00, oldPrice: 40.00, icon: "/icon/oven.png", type: "checkbox", additionalTime: 20 },
    { id: 2, name: "hood_cleaning", price: 32.00, oldPrice: 40.00, icon: "/icon/hood.png", type: "checkbox", additionalTime: 20 },
    { id: 3, name: "kitchen_cabinets_cleaning", price: 52.00, oldPrice: 65.00, icon: "/icon/cupboard.png", type: "checkbox", additionalTime: 20 },
    { id: 4, name: "dish_washing", price: 20.00, oldPrice: 25.00, icon: "/icon/dishes.png", type: "checkbox", additionalTime: 20 },
    { id: 5, name: "fridge_cleaning", price: 32.00, oldPrice: 40.00, icon: "/icon/fridge.png", type: "checkbox", additionalTime: 20 },
    { id: 6, name: "microwave_cleaning", price: 14.40, oldPrice: 18.00, icon: "/icon/microwave.png", type: "checkbox", additionalTime: 20 },
    { id: 7, name: "balcony_cleaning", price: 28.00, oldPrice: 35.00, icon: "/icon/balcony.png", type: "quantity", additionalTime: 20 },
    { id: 8, name: "window_cleaning", price: 32.00, oldPrice: 40.00, icon: "/icon/window.png", type: "quantity", additionalTime: 20 },
    { id: 9, name: "ironing", price: 40.00, oldPrice: 50.00, icon: "/icon/iron.png", type: "quantity", additionalTime: 20 },
    { id: 10, name: "pet_tray_cleaning", price: 8.00, oldPrice: 10.00, icon: "/icon/pets.png", type: "quantity", additionalTime: 20 },
    { id: 11, name: "extra_hours", price: 40.00, oldPrice: 50.00, icon: "/icon/time.png", type: "quantity", additionalTime: 60 }, // Додаткові години додають 60 хвилин
    { id: 12, name: "wardrobe_cleaning", price: 44.00, oldPrice: 30.00, icon: "/icon/wardrobe.png", type: "quantity", additionalTime: 20 },
  ];

  const [selectedServices, setSelectedServices] = useState(
    paidServices.reduce((acc, service) => ({
      ...acc,
      [service.id]: service.type === "checkbox" ? false : 0,
    }), {})
  );
  const texts = {
    pl: {
      title: title || "Sprzątanie domu prywatnego",
      subtitle: "Wybierz poniższe parametry, aby obliczyć koszt.",
      userTypePrivate: "Osoba prywatna",
      userTypeCompany: "Firma +23%",
      roomsLabel: "pokój",
      roomsLabel2: "pokoje",
      roomsLabel5: "pokoi",
      bathroomsLabel: "łazienka",
      bathroomsLabel2: "łazienki",
      bathroomsLabel5: "łazienek",
      kitchenLabel: "Kuchnia",
      kitchenAnnexLabel: "Aneks kuchenny",
      note: "* Kompleksowe sprzątanie całego domu, w tym kuchni, toalety oraz łazienki",
      additionalServices: "Dodatkowe usługi",
      vacuumNotice: "Na zamówieniu potrzebny jest odkurzacz",
      vacuumNotice2: "Przywieziemy ręczny odkurzacz do sprzątania",
      vacuumPrice: `${vacuumCost.toFixed(2)} zł`,
      calendarTitle: "WYBIERZ DOGODNY TERMIN I GODZINĘ SPRZĄTANIA",
      timeLabel: "Godzina",
      calendarFooter: "Można zacząć w dowolnym momencie",
      frequencyTitle: "CHĘTNOŚĆ CZĘSTOTLIWOŚCI SPRZĄTANIA",
      paidServicesTitle: "Dodatkowe usługi płatne",
      addressTitle: "WPROWADŹ SWÓJ ADRES",
      cityLabel: "Wybierz miasto",
      streetLabel: "Ulica",
      postalCodeLabel: "Kod pocztowy",
      houseNumberLabel: "Numer domu",
      apartmentNumberLabel: "Numer mieszkania",
      buildingLabel: "Budynek",
      floorLabel: "Piętro",
      intercomCodeLabel: "Kod od domofonu",
      citySearchPlaceholder: "Wprowadź nazwę miejscowości...",
      contactTitle: "DANE KONTAKTOWE",
      nameLabel: "Imię",
      companyNameLabel: "Nazwa firmy",
      nipLabel: "NIP",
      phoneLabel: "Telefon kontaktowy",
      emailLabel: "Adres e-mail",
      additionalInfoLabel: "Dodatkowa informacja do zamówienia",
      agreement1: "Składając zamówienie zgadzam się z Regulaminem i Polityką prywatności.",
      agreement2: "Wyrażam zgodę na przetwarzanie moich danych osobowych przez administratora",
      locationLabel: "Lokalizacja",
      specialistInfo: "Nasi wykonawcy posiadają wszystkie niezbędne środki czystości oraz sprzęt.",
      workTimeLabel: "Przybliżony czas pracy",
      cleanersLabel: "Kilka sprzątaczy",
      datePlaceholder: "Wybierz termin i godzinę",
      locationCostLabel: "Dodatkowy koszt dojazdu",
      promoPlaceholder: "Promokod",
      applyPromo: "Zastosuj",
      totalLabel: "Do zapłaty",
      orderButton: "Zamawiam za",
      todayLabel: "dziś",
      tomorrowLabel: "jutro",
      unavailableLabel: "niedostępny",
      paymentSuccess: "Płatność zakończona sukcesem! Twoje zamówienie zostało złożone.",
      paymentError: "Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.",
      paymentCanceled: "Płatność została anulowana. Spróbuj ponownie.",
      errorMissingFields: "Proszę wypełnić wszystkie wymagane pola: ",
      invalidEmail: "Proszę wprowadzić prawidłowy adres e-mail.",
      invalidPhone: "Proszę wprowadzić prawidłowy numer telefonu.",
      invalidNip: "Proszę wprowadzić prawidłowy numer NIP.",
      hallwayLabel: "przedpokój",
      andLabel: "i",
      agreementErrorLabel: "zgoda na regulamin i przetwarzanie danych",
      oven_cleaning: "Mycie piekarnika",
      hood_cleaning: "Mycie okapu",
      kitchen_cabinets_cleaning: "Sprzątanie wnętrza szafek kuchennych",
      dish_washing: "Mycie naczyń",
      fridge_cleaning: "Czyszczenie lodówki",
      microwave_cleaning: "Mycie mikrofalówki",
      balcony_cleaning: "Sprzątanie balkonu",
      window_cleaning: "Mycie okien (szt.)",
      ironing: "Prasowanie",
      pet_tray_cleaning: "Sprzątanie kuwety",
      extra_hours: "Dodatkowe godziny",
      wardrobe_cleaning: "Czyszczenie wnętrza szafy",
      weekdays: ["pon", "wt", "śr", "czw", "pt", "sob", "niedz"],
      logMessages: {
        loadPromo: "Ładowanie kodów promocyjnych...",
        promoLoaded: "Kody promocyjne załadowane:",
        promoError: "Błąd ładowania kodów promocyjnych:",
        loadDiscounts: "Ładowanie zniżek dla typu:",
        discountsRaw: "Surowe dane zniżek dla",
        discountsProcessed: "Zniżki dla typu po przetworzeniu:",
        discountsError: "Błąd ładowania zniżek dla typu:",
        kitchenSelected: "Wybrano sprzątanie kuchni:",
        kitchenAnnexSelected: "Wybrano sprzątanie aneksu kuchennego:",
        promoApplied: "Zastosowano kod promocyjny",
        discount: "zniżka",
        discountAmount: "kwota zniżki",
        promoInvalid: "Nieprawidłowy kod promocyjny, zniżka zresetowana do 0%",
        prevMonth: "Przejście do poprzedniego miesiąca:",
        nextMonth: "Przejście do następnego miesiąca:",
        basePriceCalc: "Obliczenie ceny podstawowej:",
        totalPriceCalc: "Obliczenie ceny całkowitej:",
        strikethroughPriceCalc: "Obliczenie ceny przekreślonej:",
        workTimeCalc: "Obliczenie czasu pracy:",
        cleanersCalc: "Obliczenie sprzątaczy:",
        dateSelected: "Wybrana data:",
        timeSelected: "Wybrany czas:",
        serviceToggled: "Usługa",
        serviceAdded: "dodana",
        serviceRemoved: "usunięta",
        quantityChanged: "Ilość usługi",
        changedTo: "zmieniono na",
        orderProcessing: "Rozpoczęcie przetwarzania zamówienia...",
        dateError: "Błąd: Data nie wybrana",
        timeError: "Błąd: Godzina nie wybrana",
        termsError: "Błąd: Nie zaakceptowano regulaminu lub zgody marketingowej",
        orderData: "Dane zamówienia:",
        orderRequest: "Wysyłanie żądania utworzenia zamówienia...",
        orderCreated: "Zamówienie utworzone z ID:",
        paymentInit: "Inicjalizacja płatności PayU dla kwoty:",
        paymentUrl: "Otrzymano URL do płatności:",
        paymentRedirect: "Użytkownik przekierowany na stronę płatności PayU",
        orderError: "Błąd podczas składania zamówienia:",
        clientTypePrivate: "Wybrano typ klienta: Osoba prywatna",
        clientTypeCompany: "Wybrano typ klienta: Firma",
        rooms: "pokoje",
        bathrooms: "łazienki",
        kitchen: "kuchnia",
        kitchenAnnex: "aneks",
        vacuum: "odkurzacz",
        city: "miasto",
        multiplier: "mnożnik",
        hours: "godzin",
        minutes: "minut",
        roomsChanged: "Zmieniono liczbę pokoi:",
        bathroomsChanged: "Zmieniono liczbę łazienek:",
        vacuumNeeded: "Potrzebny odkurzacz:",
        vacuumRemoved: "Odkurzacz usunięto z zamówienia",
        citySearch: "Wyszukiwanie miasta:",
        citySelected: "Wybrane miasto:",
        streetEntered: "Wprowadzono ulicę:",
        postalCodeEntered: "Wprowadzono kod pocztowy:",
        houseNumberEntered: "Wprowadzono numer domu:",
        apartmentNumberEntered: "Wprowadzono numer mieszkania:",
        buildingEntered: "Wprowadzono budynek:",
        floorEntered: "Wprowadzono piętro:",
        intercomCodeEntered: "Wprowadzono kod domofonu:",
        nameEntered: "Wprowadzono imię:",
        companyNameEntered: "Wprowadzono nazwę firmy:",
        nipEntered: "Wprowadzono NIP:",
        phoneEntered: "Wprowadzono telefon:",
        emailEntered: "Wprowadzono email:",
        additionalInfoEntered: "Wprowadzono dodatkową informację:",
        termsAgreed: "Zgoda na regulamin:",
        marketingAgreed: "Zgoda na marketing:",
        frequencySelected: "Wybrana częstotliwość sprzątania:",
        promoEntered: "Wprowadzono kod promocyjny:",
        yes: "tak",
        no: "nie",
      },
    },
    uk: {
      title: title || "Прибирання приватного будинку",
      subtitle: "Виберіть параметри нижче, щоб розрахувати вартість.",
      userTypePrivate: "Фізична особа",
      userTypeCompany: "Компанія +23%",
      roomsLabel: "кімната",
      roomsLabel2: "кімнати",
      roomsLabel5: "кімнат",
      bathroomsLabel: "ванна кімната",
      bathroomsLabel2: "ванні кімнати",
      bathroomsLabel5: "ванних кімнат",
      kitchenLabel: "Кухня",
      kitchenAnnexLabel: "Кухонний куточок",
      note: "* Комплексне прибирання всього будинку, включаючи кухню, туалет та ванну кімнату",
      additionalServices: "Додаткові послуги",
      vacuumNotice: "Для замовлення потрібен пилосос",
      vacuumNotice2: "Ми привеземо ручний пилосос для прибирання",
      vacuumPrice: `${vacuumCost.toFixed(2)} zł`,
      calendarTitle: "ВИБЕРІТЬ ЗРУЧНИЙ ТЕРМІН І ЧАС ПРИБИРАННЯ",
      timeLabel: "Година",
      calendarFooter: "Можна почати в будь-який момент",
      frequencyTitle: "ЧАСТОТА ПРИБИРАННЯ",
      paidServicesTitle: "Додаткові платні послуги",
      addressTitle: "ВВЕДІТЬ ВАШУ АДРЕСУ",
      cityLabel: "Виберіть місто",
      streetLabel: "Вулиця",
      postalCodeLabel: "Поштовий індекс",
      houseNumberLabel: "Номер будинку",
      apartmentNumberLabel: "Номер квартири",
      buildingLabel: "Будівля",
      floorLabel: "Поверх",
      intercomCodeLabel: "Код домофона",
      citySearchPlaceholder: "Введіть назву населеного пункту...",
      contactTitle: "КОНТАКТНІ ДАНІ",
      nameLabel: "Ім'я",
      companyNameLabel: "Назва компанії",
      nipLabel: "NIP",
      phoneLabel: "Контактний телефон",
      emailLabel: "Адреса електронної пошти",
      additionalInfoLabel: "Додаткова інформація до замовлення",
      agreement1: "Оформлюючи замовлення, я погоджуюсь з Правилами та Політикою конфіденційності.",
      agreement2: "Я даю згоду на обробку моїх персональних даних адміністратором",
      locationLabel: "Місцезнаходження",
      specialistInfo: "Наші виконавці мають усі необхідні засоби для прибирання та обладнання.",
      workTimeLabel: "Орієнтовний час роботи",
      cleanersLabel: "Кілька прибиральників",
      datePlaceholder: "Виберіть дату і час",
      locationCostLabel: "Додаткова вартість доїзду",
      promoPlaceholder: "Промокод",
      applyPromo: "Застосувати",
      totalLabel: "До сплати",
      orderButton: "Замовляю за",
      todayLabel: "сьогодні",
      tomorrowLabel: "завтра",
      unavailableLabel: "недоступно",
      paymentSuccess: "Оплата успішна! Ваше замовлення прийнято.",
      paymentError: "Виникла помилка під час оформлення замовлення. Спробуйте ще раз.",
      paymentCanceled: "Оплата була скасована. Спробуйте ще раз.",
      errorMissingFields: "Будь ласка, заповніть усі обов’язкові поля: ",
      invalidEmail: "Будь ласка, введіть правильну адресу електронної пошти.",
      invalidPhone: "Будь ласка, введіть правильний номер телефону.",
      invalidNip: "Будь ласка, введіть правильний номер NIP.",
      hallwayLabel: "передпокій",
      andLabel: "та",
      agreementErrorLabel: "згода на правила і обробку даних",
      oven_cleaning: "Миття духовки",
      hood_cleaning: "Миття витяжки",
      kitchen_cabinets_cleaning: "Прибирання всередині кухонних шаф",
      dish_washing: "Миття посуду",
      fridge_cleaning: "Чищення холодильника",
      microwave_cleaning: "Миття мікрохвильовки",
      balcony_cleaning: "Прибирання балкону",
      window_cleaning: "Миття вікон (шт.)",
      ironing: "Прасування",
      pet_tray_cleaning: "Прибирання лотка для тварин",
      extra_hours: "Додаткові години",
      wardrobe_cleaning: "Чищення всередині шафи",
      weekdays: ["пн", "вт", "ср", "чт", "пт", "сб", "нд"],
      logMessages: {
        loadPromo: "Завантаження промокодів...",
        promoLoaded: "Промокоди завантажені:",
        promoError: "Помилка завантаження промокодів:",
        loadDiscounts: "Завантаження знижок для типу:",
        discountsRaw: "Сирі дані знижок для",
        discountsProcessed: "Знижки для типу після обробки:",
        discountsError: "Помилка завантаження знижок для типу:",
        kitchenSelected: "Обрано прибирання кухні:",
        kitchenAnnexSelected: "Обрано прибирання кухонного куточка:",
        promoApplied: "Застосовано промокод",
        discount: "знижка",
        discountAmount: "сума знижки",
        promoInvalid: "Невірний промокод, знижка скинута до 0%",
        prevMonth: "Перехід до попереднього місяця:",
        nextMonth: "Перехід до наступного місяця:",
        basePriceCalc: "Розрахунок базової ціни:",
        totalPriceCalc: "Розрахунок загальної ціни:",
        strikethroughPriceCalc: "Розрахунок перекресленої ціни:",
        workTimeCalc: "Розрахунок часу роботи:",
        cleanersCalc: "Розрахунок прибиральників:",
        dateSelected: "Обрана дата:",
        timeSelected: "Обраний час:",
        serviceToggled: "Послуга",
        serviceAdded: "додана",
        serviceRemoved: "видалена",
        quantityChanged: "Кількість послуги",
        changedTo: "змінено на",
        orderProcessing: "Початок обробки замовлення...",
        dateError: "Помилка: Дата не обрана",
        timeError: "Помилка: Час не обраний",
        termsError: "Помилка: Не погоджено з умовами або маркетингом",
        orderData: "Дані замовлення:",
        orderRequest: "Відправка запиту на створення замовлення...",
        orderCreated: "Замовлення створено з ID:",
        paymentInit: "Ініціалізація платежу PayU для суми:",
        paymentUrl: "Отримано URL для оплати:",
        paymentRedirect: "Користувача перенаправлено на сторінку оплати PayU",
        orderError: "Помилка при оформленні замовлення:",
        clientTypePrivate: "Обрано тип клієнта: Фізична особа",
        clientTypeCompany: "Обрано тип клієнта: Компанія",
        rooms: "кімнати",
        bathrooms: "ванні",
        kitchen: "кухня",
        kitchenAnnex: "куточок",
        vacuum: "пилосос",
        city: "місто",
        multiplier: "множник",
        hours: "годин",
        minutes: "хв",
        roomsChanged: "Змінено кількість кімнат:",
        bathroomsChanged: "Змінено кількість ванних кімнат:",
        vacuumNeeded: "Потрібен пилосос:",
        vacuumRemoved: "Пилосос видалено з замовлення",
        citySearch: "Пошук міста:",
        citySelected: "Обрано місто:",
        streetEntered: "Введено вулицю:",
        postalCodeEntered: "Введено поштовий код:",
        houseNumberEntered: "Введено номер будинку:",
        apartmentNumberEntered: "Введено номер квартири:",
        buildingEntered: "Введено будівлю:",
        floorEntered: "Введено поверх:",
        intercomCodeEntered: "Введено код домофону:",
        nameEntered: "Введено ім'я:",
        companyNameEntered: "Введено назву компанії:",
        nipEntered: "Введено NIP:",
        phoneEntered: "Введено телефон:",
        emailEntered: "Введено email:",
        additionalInfoEntered: "Введено додаткову інформацію:",
        termsAgreed: "Згода з умовами:",
        marketingAgreed: "Згода на маркетинг:",
        frequencySelected: "Обрана частота прибирання:",
        promoEntered: "Введено промокод:",
        yes: "так",
        no: "ні",
      },
    },
    ru: {
      title: title || "Уборка частного дома",
      subtitle: "Выберите параметры ниже, чтобы рассчитать стоимость.",
      userTypePrivate: "Частное лицо",
      userTypeCompany: "Компания +23%",
      roomsLabel: "комната",
      roomsLabel2: "комнаты",
      roomsLabel5: "комнат",
      bathroomsLabel: "ванная комната",
      bathroomsLabel2: "ванные комнаты",
      bathroomsLabel5: "ванных комнат",
      kitchenLabel: "Кухня",
      kitchenAnnexLabel: "Кухонный уголок",
      note: "* Комплексная уборка всего дома, включая кухню, туалет и ванную комнату",
      additionalServices: "Дополнительные услуги",
      vacuumNotice: "Для заказа нужен пылесос",
      vacuumNotice2: "Мы привезем ручной пылесос для уборки",
      vacuumPrice: `${vacuumCost.toFixed(2)} zł`,
      calendarTitle: "ВЫБЕРИТЕ УДОБНЫЙ СРОК И ВРЕМЯ УБОРКИ",
      timeLabel: "Время",
      calendarFooter: "Можно начать в любой момент",
      frequencyTitle: "ЧАСТОТА УБОРКИ",
      paidServicesTitle: "Дополнительные платные услуги",
      addressTitle: "ВВЕДИТЕ ВАШ АДРЕС",
      cityLabel: "Выберите город",
      streetLabel: "Улица",
      postalCodeLabel: "Почтовый индекс",
      houseNumberLabel: "Номер дома",
      apartmentNumberLabel: "Номер квартиры",
      buildingLabel: "Здание",
      floorLabel: "Этаж",
      intercomCodeLabel: "Код домофона",
      citySearchPlaceholder: "Введите название населенного пункта...",
      contactTitle: "КОНТАКТНЫЕ ДАННЫЕ",
      nameLabel: "Имя",
      companyNameLabel: "Название компании",
      nipLabel: "NIP",
      phoneLabel: "Контактный телефон",
      emailLabel: "Адрес электронной почты",
      additionalInfoLabel: "Дополнительная информация к заказу",
      agreement1: "Оформляя заказ, я соглашаюсь с Правилами и Политикой конфиденциальности.",
      agreement2: "Я даю согласие на обработку моих персональных данных администратором",
      locationLabel: "Местоположение",
      specialistInfo: "Наши исполнители имеют все необходимые средства для уборки и оборудование.",
      workTimeLabel: "Примерное время работы",
      cleanersLabel: "Несколько уборщиков",
      datePlaceholder: "Выберите дату и время",
      locationCostLabel: "Дополнительная стоимость доставки",
      promoPlaceholder: "Промокод",
      applyPromo: "Применить",
      totalLabel: "К оплате",
      orderButton: "Заказываю за",
      todayLabel: "сегодня",
      tomorrowLabel: "завтра",
      unavailableLabel: "недоступно",
      paymentSuccess: "Оплата прошла успешно! Ваш заказ принят.",
      paymentError: "Произошла ошибка при оформлении заказа. Попробуйте снова.",
      paymentCanceled: "Оплата была отменена. Попробуйте снова.",
      errorMissingFields: "Пожалуйста, заполните все обязательные поля: ",
      invalidEmail: "Пожалуйста, введите правильный адрес электронной почты.",
      invalidPhone: "Пожалуйста, введите правильный номер телефона.",
      invalidNip: "Пожалуйста, введите правильный номер NIP.",
      hallwayLabel: "прихожая",
      andLabel: "и",
      agreementErrorLabel: "согласие на правила и обработку данных",
      oven_cleaning: "Мойка духовки",
      hood_cleaning: "Мойка вытяжки",
      kitchen_cabinets_cleaning: "Уборка внутри кухонных шкафов",
      dish_washing: "Мойка посуды",
      fridge_cleaning: "Чистка холодильника",
      microwave_cleaning: "Мойка микроволновки",
      balcony_cleaning: "Уборка балкона",
      window_cleaning: "Мойка окон (шт.)",
      ironing: "Глажка",
      pet_tray_cleaning: "Уборка лотка для животных",
      extra_hours: "Дополнительные часы",
      wardrobe_cleaning: "Чистка внутри шкафа",
      weekdays: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
      logMessages: {
        loadPromo: "Загрузка промокодов...",
        promoLoaded: "Промокоды загружены:",
        promoError: "Ошибка загрузки промокодов:",
        loadDiscounts: "Загрузка скидок для типа:",
        discountsRaw: "Сырые данные скидок для",
        discountsProcessed: "Скидки для типа после обработки:",
        discountsError: "Ошибка загрузки скидок для типа:",
        kitchenSelected: "Выбрана уборка кухни:",
        kitchenAnnexSelected: "Выбрана уборка кухонного уголка:",
        promoApplied: "Применен промокод",
        discount: "скидка",
        discountAmount: "сумма скидки",
        promoInvalid: "Неверный промокод, скидка сброшена до 0%",
        prevMonth: "Переход к предыдущему месяцу:",
        nextMonth: "Переход к следующему месяцу:",
        basePriceCalc: "Расчет базовой цены:",
        totalPriceCalc: "Расчет общей цены:",
        strikethroughPriceCalc: "Расчет зачеркнутой цены:",
        workTimeCalc: "Расчет времени работы:",
        cleanersCalc: "Расчет уборщиков:",
        dateSelected: "Выбрана дата:",
        timeSelected: "Выбрано время:",
        serviceToggled: "Услуга",
        serviceAdded: "добавлена",
        serviceRemoved: "удалена",
        quantityChanged: "Количество услуги",
        changedTo: "изменено на",
        orderProcessing: "Начало обработки заказа...",
        dateError: "Ошибка: Дата не выбрана",
        timeError: "Ошибка: Время не выбрано",
        termsError: "Ошибка: Не согласовано с условиями или маркетингом",
        orderData: "Данные заказа:",
        orderRequest: "Отправка запроса на создание заказа...",
        orderCreated: "Заказ создан с ID:",
        paymentInit: "Инициализация платежа PayU для суммы:",
        paymentUrl: "Получен URL для оплаты:",
        paymentRedirect: "Пользователь перенаправлен на страницу оплаты PayU",
        orderError: "Ошибка при оформлении заказа:",
        clientTypePrivate: "Выбран тип клиента: Частное лицо",
        clientTypeCompany: "Выбран тип клиента: Компания",
        rooms: "комнаты",
        bathrooms: "ванные",
        kitchen: "кухня",
        kitchenAnnex: "уголок",
        vacuum: "пылесос",
        city: "город",
        multiplier: "множитель",
        hours: "часов",
        minutes: "мин",
        roomsChanged: "Изменено количество комнат:",
        bathroomsChanged: "Изменено количество ванных комнат:",
        vacuumNeeded: "Нужен пылесос:",
        vacuumRemoved: "Пылесос удален из заказа",
        citySearch: "Поиск города:",
        citySelected: "Выбран город:",
        streetEntered: "Введена улица:",
        postalCodeEntered: "Введен почтовый индекс:",
        houseNumberEntered: "Введен номер дома:",
        apartmentNumberEntered: "Введен номер квартиры:",
        buildingEntered: "Введено здание:",
        floorEntered: "Введен этаж:",
        intercomCodeEntered: "Введен код домофона:",
        nameEntered: "Введено имя:",
        companyNameEntered: "Введено название компании:",
        nipEntered: "Введен NIP:",
        phoneEntered: "Введен телефон:",
        emailEntered: "Введен email:",
        additionalInfoEntered: "Введена дополнительная информация:",
        termsAgreed: "Согласие с условиями:",
        marketingAgreed: "Согласие на маркетинг:",
        frequencySelected: "Выбрана частота уборки:",
        promoEntered: "Введен промокод:",
        yes: "да",
        no: "нет",
      },
    },
    en: {
      title: title || "Private House Cleaning",
      subtitle: "Select the parameters below to calculate the cost.",
      userTypePrivate: "Private individual",
      userTypeCompany: "Company +23%",
      roomsLabel: "room",
      roomsLabel2: "rooms",
      roomsLabel5: "rooms",
      bathroomsLabel: "bathroom",
      bathroomsLabel2: "bathrooms",
      bathroomsLabel5: "bathrooms",
      kitchenLabel: "Kitchen",
      kitchenAnnexLabel: "Kitchen annex",
      note: "* Comprehensive cleaning of the entire house, including kitchen, toilet, and bathroom",
      additionalServices: "Additional services",
      vacuumNotice: "A vacuum cleaner is required for the order",
      vacuumNotice2: "We will bring a handheld vacuum cleaner for cleaning",
      vacuumPrice: `${vacuumCost.toFixed(2)} zł`,
      calendarTitle: "CHOOSE A CONVENIENT DATE AND TIME FOR CLEANING",
      timeLabel: "Time",
      calendarFooter: "You can start at any time",
      frequencyTitle: "CLEANING FREQUENCY",
      paidServicesTitle: "Additional paid services",
      addressTitle: "ENTER YOUR ADDRESS",
      cityLabel: "Select city",
      streetLabel: "Street",
      postalCodeLabel: "Postal code",
      houseNumberLabel: "House number",
      apartmentNumberLabel: "Apartment number",
      buildingLabel: "Building",
      floorLabel: "Floor",
      intercomCodeLabel: "Intercom code",
      citySearchPlaceholder: "Enter the name of the locality...",
      contactTitle: "CONTACT DETAILS",
      nameLabel: "Name",
      companyNameLabel: "Company name",
      nipLabel: "NIP",
      phoneLabel: "Contact phone",
      emailLabel: "Email address",
      additionalInfoLabel: "Additional order information",
      agreement1: "By placing an order, I agree to the Terms and Privacy Policy.",
      agreement2: "I consent to the processing of my personal data by the administrator",
      locationLabel: "Location",
      specialistInfo: "Our cleaners have all the necessary cleaning supplies and equipment.",
      workTimeLabel: "Estimated work time",
      cleanersLabel: "Multiple cleaners",
      datePlaceholder: "Select date and time",
      locationCostLabel: "Additional travel cost",
      promoPlaceholder: "Promo code",
      applyPromo: "Apply",
      totalLabel: "Total to pay",
      orderButton: "Order for",
      todayLabel: "today",
      tomorrowLabel: "tomorrow",
      unavailableLabel: "unavailable",
      paymentSuccess: "Payment successful! Your order has been placed.",
      paymentError: "An error occurred while placing the order. Please try again.",
      paymentCanceled: "Payment was canceled. Please try again.",
      errorMissingFields: "Please fill in all required fields: ",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      invalidNip: "Please enter a valid NIP number.",
      hallwayLabel: "hallway",
      andLabel: "and",
      agreementErrorLabel: "consent to terms and data processing",
      oven_cleaning: "Oven cleaning",
      hood_cleaning: "Hood cleaning",
      kitchen_cabinets_cleaning: "Cleaning inside kitchen cabinets",
      dish_washing: "Dish washing",
      fridge_cleaning: "Fridge cleaning",
      microwave_cleaning: "Microwave cleaning",
      balcony_cleaning: "Balcony cleaning",
      window_cleaning: "Window cleaning (unit)",
      ironing: "Ironing",
      pet_tray_cleaning: "Pet tray cleaning",
      extra_hours: "Extra hours",
      wardrobe_cleaning: "Cleaning inside wardrobe",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      logMessages: {
        loadPromo: "Loading promo codes...",
        promoLoaded: "Promo codes loaded:",
        promoError: "Error loading promo codes:",
        loadDiscounts: "Loading discounts for type:",
        discountsRaw: "Raw discount data for",
        discountsProcessed: "Discounts for type after processing:",
        discountsError: "Error loading discounts for type:",
        kitchenSelected: "Kitchen cleaning selected:",
        kitchenAnnexSelected: "Kitchen annex cleaning selected:",
        promoApplied: "Applied promo code",
        discount: "discount",
        discountAmount: "discount amount",
        promoInvalid: "Invalid promo code, discount reset to 0%",
        prevMonth: "Switch to previous month:",
        nextMonth: "Switch to next month:",
        basePriceCalc: "Base price calculation:",
        totalPriceCalc: "Total price calculation:",
        strikethroughPriceCalc: "Strikethrough price calculation:",
        workTimeCalc: "Work time calculation:",
        cleanersCalc: "Cleaners calculation:",
        dateSelected: "Selected date:",
        timeSelected: "Selected time:",
        serviceToggled: "Service",
        serviceAdded: "added",
        serviceRemoved: "removed",
        quantityChanged: "Service quantity",
        changedTo: "changed to",
        orderProcessing: "Starting order processing...",
        dateError: "Error: Date not selected",
        timeError: "Error: Time not selected",
        termsError: "Error: Terms or marketing consent not agreed",
        orderData: "Order data:",
        orderRequest: "Sending request to create order...",
        orderCreated: "Order created with ID:",
        paymentInit: "Initializing PayU payment for amount:",
        paymentUrl: "Received payment URL:",
        paymentRedirect: "User redirected to PayU payment page",
        orderError: "Error during order processing:",
        clientTypePrivate: "Selected client type: Private individual",
        clientTypeCompany: "Selected client type: Company",
        rooms: "rooms",
        bathrooms: "bathrooms",
        kitchen: "kitchen",
        kitchenAnnex: "annex",
        vacuum: "vacuum",
        city: "city",
        multiplier: "multiplier",
        hours: "hours",
        minutes: "min",
        roomsChanged: "Changed number of rooms:",
        bathroomsChanged: "Changed number of bathrooms:",
        vacuumNeeded: "Vacuum cleaner needed:",
        vacuumRemoved: "Vacuum cleaner removed from order",
        citySearch: "City search:",
        citySelected: "Selected city:",
        streetEntered: "Entered street:",
        postalCodeEntered: "Entered postal code:",
        houseNumberEntered: "Entered house number:",
        apartmentNumberEntered: "Entered apartment number:",
        buildingEntered: "Entered building:",
        floorEntered: "Entered floor:",
        intercomCodeEntered: "Entered intercom code:",
        nameEntered: "Entered name:",
        companyNameEntered: "Entered company name:",
        nipEntered: "Entered NIP:",
        phoneEntered: "Entered phone:",
        emailEntered: "Entered email:",
        additionalInfoEntered: "Entered additional information:",
        termsAgreed: "Terms agreement:",
        marketingAgreed: "Marketing consent:",
        frequencySelected: "Selected cleaning frequency:",
        promoEntered: "Entered promo code:",
        yes: "yes",
        no: "no",
      },
    },
  };
  const t = texts[lang] || texts.pl;


  useEffect(() => {
    const { state } = location;
    if (state?.frequency && frequencyDiscounts[state.frequency] !== undefined) {
      setCleaningFrequency(state.frequency);
      console.log(`${texts[lang].logMessages.frequencySelected} ${state.frequency}`);
    }
  }, [location, lang]);


  // Завантаження промокодів з API
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        console.log(texts[lang].logMessages.loadPromo);
        const { data } = await axios.get(`${API}/promo-codes`);
        setPromoCodes(data);
        console.log(texts[lang].logMessages.promoLoaded, data);
      } catch (err) {
        console.error(texts[lang].logMessages.promoError, err);
        setError("Failed to load promo codes. Please try again.");
      }
    };
    fetchPromoCodes();
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      if (!type || type === "undefined") {
        console.log(`Error: type is ${type}, skipping API request`);
        return;
      }

      try {
        console.log(`${texts[lang].logMessages.loadDiscounts} ${type}`);
        const { data } = await axios.get(`${API}/discounts?type=${type}`);
        console.log(`${texts[lang].logMessages.discountsRaw} ${type}:`, data);
        const discountMap = data.reduce((acc, discount) => {
          const date = new Date(discount.date + 'T00:00:00Z');
          const formattedDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
          return {
            ...acc,
            [formattedDate]: discount.percentage,
          };
        }, {});
        console.log(`${texts[lang].logMessages.discountsProcessed}`, discountMap);
        if (Object.keys(discountMap).length > 0) {
          setDiscounts(discountMap);
        }
        setError(null);
      } catch (err) {
        console.error(`${texts[lang].logMessages.discountsError} ${type}:`, err);
        setError(`Failed to load discounts for ${type}. Please try again.`);
      }
    };
    fetchDiscounts();
  }, [type]);

  useEffect(() => {
    if (window.innerWidth > 760) {
      setIsSticked(false);
      return;
    }

    const marker = sentinelRef.current;
    const button = orderButtonRef.current;
    if (!marker || !button) {
      console.warn("Refs not found:", { marker, button });
      return;
    }

    const stick = () => {
      button.classList.add(css.sticked);
      button.classList.remove(css.inPlace);
      setIsSticked(true);
    };
    const unstick = () => {
      button.classList.remove(css.sticked);
      button.classList.add(css.inPlace);
      setIsSticked(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting ? unstick() : stick();
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `0px 0px -${button.offsetHeight || 60}px 0px`,
      }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      calendarRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime && timeSlotsRef.current) {
      timeSlotsRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [selectedTime]);

  useEffect(() => {
    if (street && streetRef.current) {
      streetRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [street]);

  useEffect(() => {
    if (postalCode && postalCodeRef.current) {
      postalCodeRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [postalCode]);

  useEffect(() => {
    if (houseNumber && houseNumberRef.current) {
      houseNumberRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [houseNumber]);

  useEffect(() => {
    if (name && nameRef.current) {
      nameRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [name]);

  useEffect(() => {
    if (companyName && companyNameRef.current) {
      companyNameRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [companyName]);

  useEffect(() => {
    if (nip && nipRef.current) {
      nipRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [nip]);

  useEffect(() => {
    if (phone && phoneRef.current) {
      phoneRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [phone]);

  useEffect(() => {
    if (email && emailRef.current) {
      emailRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [email]);

  useEffect(() => {
    if (agreeToTerms && agreeToMarketing && agreementRef.current) {
      agreementRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [agreeToTerms, agreeToMarketing]);

  function handleKitchenChange(e) {
    setKitchen(e.target.checked);
    if (e.target.checked) {
      setKitchenAnnex(false);
      setKitchenCost(kitchenBaseCost);
      console.log(`${texts[lang].logMessages.kitchenSelected} ${texts[lang].logMessages.yes || "yes"}`);
    } else {
      console.log(`${texts[lang].logMessages.kitchenSelected} ${texts[lang].logMessages.no || "no"}`);
    }
  }

  function handleKitchenAnnexChange(e) {
    setKitchenAnnex(e.target.checked);
    if (e.target.checked) {
      setKitchen(false);
      setKitchenCost(kitchenBaseCost - 10);
      console.log(`${texts[lang].logMessages.kitchenAnnexSelected} ${texts[lang].logMessages.yes || "yes"}`);
    } else {
      setKitchen(true);
      setKitchenCost(kitchenBaseCost);
      console.log(`${texts[lang].logMessages.kitchenAnnexSelected} ${texts[lang].logMessages.no || "no"}`);
    }
  }

  function handlePromoApply() {
    const promoCode = promoCodes.find((code) => code.code === promo.toUpperCase());
    if (promoCode) {
      setDiscount(promoCode.discount);
      console.log(`${texts[lang].logMessages.promoApplied} ${promoCode.code}: ${texts[lang].logMessages.discount} ${promoCode.discount}%`);
    } else if (promo.toLowerCase() === "weekend") {
      setDiscount(20);
      console.log(`${texts[lang].logMessages.promoApplied} WEEKEND: ${texts[lang].logMessages.discount} 20%`);
    } else if (promo.toLowerCase() === "twoweeks") {
      setDiscount(15);
      console.log(`${texts[lang].logMessages.promoApplied} TWOWEEKS: ${texts[lang].logMessages.discount} 15%`);
    } else if (promo.toLowerCase() === "month") {
      setDiscount(10);
      console.log(`${texts[lang].logMessages.promoApplied} MONTH: ${texts[lang].logMessages.discount} 10%`);
    } else {
      setDiscount(0);
      console.log(texts[lang].logMessages.promoInvalid);
    }
  }

  function handlePrevMonth() {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    console.log(`${texts[lang].logMessages.prevMonth} ${months[lang][newMonth]} ${newYear}`);
  }

  function handleNextMonth() {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    console.log(`${texts[lang].logMessages.nextMonth} ${months[lang][newMonth]} ${newYear}`);
  }

  function calculateBasePrice() {
    let total = basePrice;
    total += (rooms - 1) * roomCost;
    total += (bathrooms - 1) * bathroomCost;
    if (kitchen) total += kitchenCost;
    if (kitchenAnnex) total -= 10.0;
    if (vacuumNeeded) total += vacuumCost;
    const servicesCost = paidServices.reduce((sum, service) => {
      const qty = selectedServices[service.id];
      if (service.type === "checkbox" && qty) return sum + service.price;
      if (service.type === "quantity" && qty > 0) return sum + service.price * qty;
      return sum;
    }, 0);
    total += servicesCost + (cities[selectedCity] || 0);
    if (clientType === "Firma") total *= companyMultiplier;
    console.log(`${texts[lang].logMessages.basePriceCalc} ${total.toFixed(2)} zł (${texts[lang].logMessages.rooms}: ${rooms}, ${texts[lang].logMessages.bathrooms}: ${bathrooms}, ${texts[lang].logMessages.kitchen}: ${kitchen ? texts[lang].logMessages.yes || "yes" : texts[lang].logMessages.no || "no"}, ${texts[lang].logMessages.kitchenAnnex}: ${kitchenAnnex ? texts[lang].logMessages.yes || "yes" : texts[lang].logMessages.no || "no"}, ${texts[lang].logMessages.vacuum}: ${vacuumNeeded ? texts[lang].logMessages.yes || "yes" : texts[lang].logMessages.no || "no"}, ${texts[lang].logMessages.city}: ${selectedCity}, ${texts[lang].logMessages.multiplier}: ${clientType === "Firma" ? companyMultiplier : 1})`);
    return total.toFixed(2);
  }

  function calculateTotal() {
    let total = parseFloat(calculateBasePrice());
    let appliedDiscount = discount;
    if (selectedDate) {
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      const dateDiscount = discounts[formattedDate] || 0;
      appliedDiscount = Math.max(appliedDiscount, dateDiscount);
    }
    const freqDiscount = frequencyDiscounts[cleaningFrequency] || 0;
    appliedDiscount = Math.max(appliedDiscount, freqDiscount);
    const discountAmount = total * (appliedDiscount / 100);
    const finalTotal = (total - discountAmount).toFixed(2);
    console.log(`${texts[lang].logMessages.totalPriceCalc} ${finalTotal} zł (${texts[lang].logMessages.discount}: ${appliedDiscount}%, ${texts[lang].logMessages.discountAmount}: ${discountAmount.toFixed(2)} zł)`);
    return finalTotal;
  }

  function calculateStrikethroughPrice() {
    const strikethroughPrice = (parseFloat(calculateTotal()) * 1.25).toFixed(2);
    console.log(`${texts[lang].logMessages.strikethroughPriceCalc} ${strikethroughPrice} zł`);
    return strikethroughPrice;
  }

  function calculateWorkTime() {
    let baseHours = 4.33; // Базовий час не скидається до 0
    const additionalRooms = Math.max(0, rooms - 1);
    const roomTime = additionalRooms * 0.5;
    const additionalBathrooms = Math.max(0, bathrooms - 1);
    const bathroomTime = additionalBathrooms * 1.33;
    const additionalServiceTime = paidServices.reduce((sum, service) => {
      const qty = selectedServices[service.id];
      if (service.type === "checkbox" && qty) return sum + (service.additionalTime / 60);
      if (service.type === "quantity" && qty > 0) return sum + (service.additionalTime / 60) * qty;
      return sum;
    }, 0);

    const totalTime = baseHours + roomTime + bathroomTime + additionalServiceTime;
    console.log(`${texts[lang].logMessages.workTimeCalc} ${totalTime} ${texts[lang].logMessages.hours || "hours"} (${texts[lang].logMessages.rooms}: ${roomTime}, ${texts[lang].logMessages.bathrooms}: ${bathroomTime}, ${texts[lang].logMessages.additionalServices}: ${additionalServiceTime})`);
    return totalTime;
  }

  function calculateCleanersAndTime() {
    const totalHours = calculateWorkTime();
    const cleaners = Math.ceil(totalHours / 9);
    const adjustedHours = totalHours / cleaners;
    const hours = Math.floor(adjustedHours);
    const minutes = Math.round((adjustedHours - hours) * 60);
    console.log(`${texts[lang].logMessages.cleanersCalc} ${cleaners}, ${texts[lang].logMessages.time}: ${hours} ${texts[lang].logMessages.hours || "hours"} ${minutes} ${texts[lang].logMessages.minutes || "minutes"}`);
    return { hours, minutes, cleaners };
  }

  function formatWorkTime() {
    const { hours, minutes } = calculateCleanersAndTime();
    return minutes > 0 ? `${hours} ${texts[lang].logMessages.hours || "hours"} ${minutes} ${texts[lang].logMessages.minutes || "minutes"}` : `${hours} ${texts[lang].logMessages.hours || "hours"}`;
  }

  function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className={css["calendar-day"]}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const discountValue = discounts[formattedDate] || 0;

      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();
      const isPast = date < today && !isToday;
      const isBooked = bookedDates.has(formattedDate);
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      const isSelectable = !isPast && !isToday && !isTomorrow && !isBooked;

      days.push(
        <div
          key={day}
          className={`
            ${css["calendar-day"]}
            ${!isSelectable ? css.disabled : ""}
            ${isSelected ? css.selected : ""}
            ${discountValue > 0 ? css.discount : ""}
            ${isPast ? css.past : ""}
            ${isToday ? css.today : ""}
            ${isTomorrow ? css.tomorrow : ""}
            ${isSelectable ? css.hoverable : ""}
          `}
          onClick={() => {
            if (isSelectable) {
              setSelectedDate(date);
              console.log(`${texts[lang].logMessages.dateSelected} ${formattedDate}`);
            }
          }}
        >
          <span className={css["day-number"]}>{day}</span>
          {discountValue > 0 && <span className={css["discount-label"]}>-{discountValue}%</span>}
          {isToday && <span className={css["day-label"]}>{texts[lang].todayLabel}</span>}
          {isTomorrow && <span className={css["day-label"]}>{texts[lang].tomorrowLabel}</span>}
          {isPast && <span className={css["day-label"]}>{texts[lang].unavailableLabel}</span>}
        </div>
      );
    }
    return days;
  }

  function formatSelectedDate() {
    if (!selectedDate) return "";
    const day = selectedDate.getDate();
    const month = months[lang][selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const handleServiceToggle = (id) => {
    const service = paidServices.find((s) => s.id === id);
    if (service.type === "checkbox") {
      setSelectedServices((prev) => {
        const newState = { ...prev, [id]: !prev[id] };
        console.log(`${texts[lang].logMessages.serviceToggled} "${service.name}" ${!prev[id] ? texts[lang].logMessages.serviceAdded : texts[lang].logMessages.serviceRemoved}`);
        return newState;
      });
    } else if (service.type === "quantity") {
      setSelectedServices((prev) => {
        const newState = { ...prev, [id]: prev[id] === 0 ? 1 : 0 };
        console.log(`${texts[lang].logMessages.serviceToggled} "${service.name}" ${prev[id] === 0 ? texts[lang].logMessages.serviceAdded : texts[lang].logMessages.serviceRemoved}`);
        return newState;
      });
    }
  };

  const handleQuantityChange = (id, delta) => {
    setSelectedServices((prev) => {
      const newQty = Math.max(0, prev[id] + delta);
      const service = paidServices.find((s) => s.id === id);
      console.log(`${texts[lang].logMessages.quantityChanged} "${service.name}" ${texts[lang].logMessages.changedTo || "changed to"}: ${newQty}`);
      return { ...prev, [id]: newQty };
    });
  };

  async function handleOrder() {
    console.log(texts[lang].logMessages.orderProcessing);

    // Перевірка обов'язкових полів
    const missingFields = [];

    if (!selectedDate) {
      calendarRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log(texts[lang].logMessages.dateError);
      missingFields.push(texts[lang].datePlaceholder.toLowerCase());
    }

    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log(texts[lang].logMessages.timeError);
      missingFields.push(texts[lang].timeLabel.toLowerCase());
    }

    if (!street) {
      streetRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      streetRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(texts[lang].streetLabel.toLowerCase());
    }

    if (!postalCode) {
      postalCodeRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      postalCodeRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(texts[lang].postalCodeLabel.toLowerCase());
    }

    if (!houseNumber) {
      houseNumberRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      houseNumberRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(texts[lang].houseNumberLabel.toLowerCase());
    }

    if (clientType === "Osoba prywatna") {
      if (!name) {
        nameRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        nameRef.current?.scrollIntoView({ behavior: "smooth" });
        missingFields.push(texts[lang].nameLabel.toLowerCase());
      }
    } else {
      if (!companyName) {
        companyNameRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        companyNameRef.current?.scrollIntoView({ behavior: "smooth" });
        missingFields.push(texts[lang].companyNameLabel.toLowerCase());
      }
      if (!nip) {
        nipRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        nipRef.current?.scrollIntoView({ behavior: "smooth" });
        missingFields.push(texts[lang].nipLabel.toLowerCase());
      } else {
        const nipRegex = /^\d{10}$/;
        if (!nipRegex.test(nip)) {
          nipRef.current?.classList.add(css["error-border"], css["shake-anim"]);
          nipRef.current?.scrollIntoView({ behavior: "smooth" });
          setError(texts[lang].invalidNip);
          return;
        }
      }
    }

    if (!phone) {
      phoneRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      phoneRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(texts[lang].phoneLabel.toLowerCase());
    } else {
      const phoneRegex = /^\d{9,12}$/;
      if (!phoneRegex.test(phone)) {
        phoneRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        phoneRef.current?.scrollIntoView({ behavior: "smooth" });
        setError(texts[lang].invalidPhone);
        return;
      }
    }

    if (!email) {
      emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      emailRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(texts[lang].emailLabel.toLowerCase());
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        emailRef.current?.scrollIntoView({ behavior: "smooth" });
        setError(texts[lang].invalidEmail);
        return;
      }
    }

    if (!agreeToTerms || !agreeToMarketing) {
      agreementRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log(texts[lang].logMessages.termsError);
      missingFields.push(texts[lang].agreementErrorLabel);
    }

    if (missingFields.length > 0) {
      const errorMessage = `${texts[lang].errorMissingFields} ${missingFields.join(", ")}.`;
      console.log(`Error: Missing required fields: ${missingFields.join(", ")}`);
      setError(errorMessage);
      return;
    }

    const formattedDate = selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : null;

    const orderData = {
      order_type: "private_house",
      rooms,
      bathrooms,
      kitchen,
      kitchen_annex: kitchenAnnex,
      vacuum_needed: vacuumNeeded,
      selected_services: paidServices
        .filter(
          (service) =>
            (service.type === "checkbox" && selectedServices[service.id]) ||
            (service.type === "quantity" && selectedServices[service.id] > 0)
        )
        .map((service) => ({
          name: service.name,
          price: service.price,
          quantity: service.type === "checkbox" ? true : selectedServices[service.id],
        })),
      total_price: parseFloat(calculateTotal()),
      selected_date: formattedDate,
      selected_time: selectedTime,
      cleaning_frequency: cleaningFrequency,
      city: selectedCity,
      address: {
        street,
        postal_code: postalCode,
        house_number: houseNumber,
        apartment_number: apartmentNumber,
        building,
        floor,
        intercom_code: intercomCode,
      },
      client_info: {
        client_type: clientType,
        name: clientType === "Osoba prywatna" ? name : undefined,
        company_name: clientType === "Firma" ? companyName : undefined,
        nip: clientType === "Firma" ? nip : undefined,
        phone,
        email,
        additional_info: additionalInfo,
      },
      payment_status: "pending",
    };

    console.log(texts[lang].logMessages.orderData, orderData);

    try {
      console.log(texts[lang].logMessages.orderRequest);
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order.");
      }

      const { orderId } = await response.json();
      console.log(`${texts[lang].logMessages.orderCreated} ${orderId}`);

      const amount = parseFloat(calculateTotal());
      console.log(`${texts[lang].logMessages.paymentInit} ${amount} zł...`);
      const paymentResponse = await fetch(`${API}/create-payu-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          total_price: amount,
          description: `Private house cleaning #${orderId}`,
          client_email: orderData.client_info.email,
          client_phone: orderData.client_info.phone,
          client_info: {
            name: clientType === "Osoba prywatna" ? (orderData.client_info.name || "Jan Kowalski") : orderData.client_info.company_name || "Firma",
          },
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Failed to initialize payment.");
      }

      const { redirectUri } = await paymentResponse.json();
      console.log(`${texts[lang].logMessages.paymentUrl} ${redirectUri}`);

      window.location.href = redirectUri;
      console.log(texts[lang].logMessages.paymentRedirect);
    } catch (error) {
      console.error(texts[lang].logMessages.orderError, error);
      setError(error.message || texts[lang].paymentError);
    }
  }

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        <h2 className={css["cacl-title"]}>{texts[lang].title} {selectedCity}</h2>
        <p className={css.subtitle}>{texts[lang].subtitle}</p>
      </div>

      {error && <div className={css.error}>{error}</div>}

      <section className={css["calculator-impuls"]}>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            <div className={css["user-type"]}>
              <button
                className={clientType === "Osoba prywatna" ? css.active : ""}
                onClick={() => {
                  setClientType("Osoba prywatna");
                  console.log(texts[lang].logMessages.clientTypePrivate);
                }}
              >
                {texts[lang].userTypePrivate}
              </button>
              <button
                className={clientType === "Firma" ? css.active : ""}
                onClick={() => {
                  setClientType("Firma");
                  console.log(texts[lang].logMessages.clientTypeCompany);
                }}
              >
                {texts[lang].userTypeCompany}
              </button>
            </div>

            <div className={css["quantity-selector"]}>
              <div className={css.counter}>
                <button
                  className={css["counter-button"]}
                  onClick={() => {
                    setRooms(Math.max(1, rooms - 1));
                    console.log(`${texts[lang].logMessages.roomsChanged} ${Math.max(1, rooms - 1)}`);
                  }}
                >
                  −
                </button>
                <span className={css["counter-value"]}>{rooms}</span>
                <span className={css["counter-label"]}>
                  {rooms === 1 ? texts[lang].roomsLabel : rooms >= 2 && rooms <= 4 ? texts[lang].roomsLabel2 : texts[lang].roomsLabel5}
                </span>
                <button
                  className={css["counter-button"]}
                  onClick={() => {
                    setRooms(rooms + 1);
                    console.log(`${texts[lang].logMessages.roomsChanged} ${rooms + 1}`);
                  }}
                >
                  +
                </button>
              </div>

              <div className={css.counter}>
                <button
                  className={css["counter-button"]}
                  onClick={() => {
                    setBathrooms(Math.max(1, bathrooms - 1));
                    console.log(`${texts[lang].logMessages.bathroomsChanged} ${Math.max(1, bathrooms - 1)}`);
                  }}
                >
                  −
                </button>
                <span className={css["counter-value"]}>{bathrooms}</span>
                <span className={css["counter-label"]}>
                  {bathrooms === 1
                    ? texts[lang].bathroomsLabel
                    : bathrooms >= 2 && bathrooms <= 4
                    ? texts[lang].bathroomsLabel2
                    : texts[lang].bathroomsLabel5}
                </span>
                <button
                  className={css["counter-button"]}
                  onClick={() => {
                    setBathrooms(bathrooms + 1);
                    console.log(`${texts[lang].logMessages.bathroomsChanged} ${bathrooms + 1}`);
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <p className={css.note}>{texts[lang].note}</p>

            <div className={css["additional-services"]}>
              <h4>{texts[lang].additionalServices}</h4>
              <div className={css["service-block"]}>
                <div className={css["service-item"]}>
                  <label className={css["checkbox-label"]}>
                    <img
                      src="/icon/kitchen.svg"
                      alt="Kitchen"
                      className={css["service-icon"]}
                    />
                    <div className={css["checkbox-wrapper"]}>
                      <input
                        type="checkbox"
                        checked={kitchen}
                        onChange={handleKitchenChange}
                        className={css["custom-checkbox"]}
                      />
                      {texts[lang].kitchenLabel}
                    </div>
                  </label>

                  <div className={css["annex-section"]}>
                    <label className={css["checkbox-label"]}>
                      <img
                        src="/icon/kitchen-1.svg"
                        alt="Annex"
                        className={css["service-icon"]}
                      />
                      <div className={css["checkbox-wrapper"]}>
                        <input
                          type="checkbox"
                          checked={kitchenAnnex}
                          onChange={handleKitchenAnnexChange}
                          className={css["custom-checkbox"]}
                        />
                        {texts[lang].kitchenAnnexLabel}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className={css["vacuum-notice"]}>
              <label className={css["checkbox-label"]}>
                <div className={css["icon-checkbox-wrapper"]}>
                  <img
                    src="/icon/odku.png"
                    alt="Vacuum"
                    className={css["service-icon"]}
                  />
                  <input
                    type="checkbox"
                    checked={vacuumNeeded}
                    onChange={(e) => {
                      setVacuumNeeded(e.target.checked);
                      console.log(`${texts[lang].logMessages.vacuumNeeded} ${e.target.checked}`);
                    }}
                    className={css["custom-checkbox"]}
                  />
                </div>
                <div className={css["text-price-wrapper"]}>
                  <div>
                    <p>{texts[lang].vacuumNotice}</p>
                    <p>{texts[lang].vacuumNotice2}</p>
                  </div>
                  <button className={css["vacuum-price"]}>{texts[lang].vacuumPrice}</button>
                </div>
              </label>
            </div>

            <div className={css["calendar-section"]} ref={calendarRef}>
              <h4>{texts[lang].calendarTitle}</h4>
              <div className={css["calendar-container"]}>
                <div className={css["calendar-time-wrapper"]}>
                  <div className={css["calendar-wrapper"]}>
                    <div className={css["calendar-header"]}>
                      <button onClick={handlePrevMonth} className={css["nav-button"]}>
                        <FaChevronLeft />
                      </button>
                      <h5>
                        {months[lang][currentMonth]} {currentYear}
                      </h5>
                      <button onClick={handleNextMonth} className={css["nav-button"]}>
                        <FaChevronRight />
                      </button>
                    </div>

                    <div className={css["calendar-days"]}>
                      {texts[lang].weekdays.map((day, index) => (
                        <div key={index}>{day}</div>
                      ))}
                    </div>

                    <div className={css["calendar-grid"]}>{renderCalendar()}</div>
                  </div>

                  <div className={css["time-wrapper"]} ref={timeSlotsRef}>
                    <h5>{texts[lang].timeLabel}</h5>
                    <div className={css["time-slots"]}>
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          className={`${css["time-slot"]} ${
                            selectedTime === time ? css.selected : ""
                          }`}
                          onClick={() => {
                            setSelectedTime(time);
                            console.log(`${texts[lang].logMessages.timeSelected} ${time}`);
                          }}
                          disabled={!selectedDate}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={css["calendar-footer"]}>
                  <p>{texts[lang].calendarFooter}</p>
                </div>
              </div>
            </div>

            <div className={css["frequency-section"]}>
              <h4>{texts[lang].frequencyTitle}</h4>
              <div className={css["frequency-options"]}>
                {Object.entries(frequencyDiscounts).map(([freq, freqDiscount]) => {
                  const freqPrice = (
                    parseFloat(calculateBasePrice()) * (1 - freqDiscount / 100)
                  ).toFixed(2);
                  const isSelected = cleaningFrequency === freq;

                  return (
                    <div
                      key={freq}
                      className={`${css["frequency-option"]} ${
                        isSelected ? css.selected : ""
                      }`}
                      onClick={() => {
                        setCleaningFrequency(freq);
                        console.log(`${texts[lang].logMessages.frequencySelected} ${freq} (-${freqDiscount}%)`);
                      }}
                    >
                      <div className={css["frequency-content"]}>
                        <p className={css["frequency-title"]}>{freq}</p>
                        <p className={css["frequency-discount"]}>-{freqDiscount}%</p>
                        <p className={css["frequency-price"]}>{freqPrice} zł</p>
                        {freq === "Jednorazowe sprzątanie" && (
                          <span className={css["emoji"]}></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={css["paid-services-section"]}>
              <h4>{texts[lang].paidServicesTitle}</h4>
              <div className={css["paid-services-grid"]}>
                {paidServices.map((service) => (
                  <div
                    key={service.id}
                    className={`${css["paid-service-card"]} ${
                      (service.type === "checkbox" && selectedServices[service.id]) ||
                      (service.type === "quantity" && selectedServices[service.id] > 0)
                        ? css.selected
                        : ""
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <img
                      src={service.icon}
                      alt={service.name}
                      className={css["service-icon"]}
                    />
                    <p>{texts[lang][service.name]}</p>
                    <div className={css["price-wrapper"]}>
                      <span className={css["price-new"]}>
                        {service.price.toFixed(2)} zł
                      </span>
                      {service.oldPrice && (
                        <span className={css["price-old"]}>
                          {service.oldPrice.toFixed(2)} zł
                        </span>
                      )}
                    </div>
                    {service.type === "checkbox" && selectedServices[service.id] ? (
                      <button
                        className={css["remove-btn"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceToggle(service.id);
                        }}
                      >
                        ×
                      </button>
                    ) : service.type === "quantity" && selectedServices[service.id] > 0 ? (
                      <div className={css["quantity-controls"]}>
                        <button
                          className={css["qty-btn"]}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(service.id, -1);
                          }}
                          disabled={selectedServices[service.id] === 0}
                        >
                          −
                        </button>
                        <span className={css["qty-value"]}>
                          {selectedServices[service.id]}
                        </span>
                        <button
                          className={css["qty-btn"]}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(service.id, 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className={css["address-section"]}>
              <h4>{texts[lang].addressTitle}</h4>
              <div className={css["city-select"]}>
                <button
                  className={css["city-button"]}
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                >
                  {texts[lang].cityLabel}: {selectedCity} +{cities[selectedCity].toFixed(2)} zł ▼
                </button>
                {showCityDropdown && (
                  <div className={css["city-dropdown"]}>
                    <input
                      type="text"
                      placeholder={texts[lang].citySearchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        console.log(`${texts[lang].logMessages.citySearch} ${e.target.value}`);
                      }}
                      className={css["city-search"]}
                    />
                    {filteredCities.map(([city, cost]) => (
                      <button
                        key={city}
                        className={`${css["city-option"]} ${
                          selectedCity === city ? css.selected : ""
                        }`}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                          setSearchQuery("");
                          console.log(`${texts[lang].logMessages.citySelected} ${city} (+${cost} zł)`);
                        }}
                      >
                        {city}
                        <span className={css["city-price"]}>+{cost.toFixed(2)} zł</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={css["address-fields"]}>
                <div className={css["address-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].streetLabel}</label>
                    <input
                      ref={streetRef}
                      type="text"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        console.log(`${texts[lang].logMessages.streetEntered} ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${street ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].postalCodeLabel}</label>
                    <input
                      ref={postalCodeRef}
                      type="text"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        console.log(`${texts[lang].logMessages.postalCodeEntered} ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${postalCode ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].houseNumberLabel}</label>
                    <input
                      ref={houseNumberRef}
                      type="text"
                      value={houseNumber}
                      onChange={(e) => {
                        setHouseNumber(e.target.value);
                        console.log(`${texts[lang].logMessages.houseNumberEntered} ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${houseNumber ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].apartmentNumberLabel}</label>
                    <input
                      type="text"
                      value={apartmentNumber}
                      onChange={(e) => {
                        setApartmentNumber(e.target.value);
                        console.log(`${texts[lang].logMessages.apartmentNumberEntered} ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${apartmentNumber ? css.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={css["address-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].buildingLabel}</label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => {
                        setBuilding(e.target.value);
                        console.log(`${texts[lang].logMessages.buildingEntered} ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${building ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].floorLabel}</label>
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) => {
                        setFloor(e.target.value);
                        console.log(`${texts[lang].logMessages.floorEntered} ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${floor ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].intercomCodeLabel}</label>
                    <input
                      type="text"
                      value={intercomCode}
                      onChange={(e) => {
                        setIntercomCode(e.target.value);
                        console.log(`${texts[lang].logMessages.intercomCodeEntered} ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${intercomCode ? css.filled : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={css["contact-section"]}>
              <h4>{texts[lang].contactTitle}</h4>
              <div className={css["contact-fields"]}>
                <div className={css["contact-row"]}>
                  {clientType === "Osoba prywatna" ? (
                    <div className={css["input-group"]}>
                      <label className={css["input-label"]}>{texts[lang].nameLabel}</label>
                      <input
                        ref={nameRef}
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          console.log(`${texts[lang].logMessages.nameEntered} ${e.target.value}`);
                        }}
                        className={`${css["contact-input"]} ${name ? css.filled : ""}`}
                      />
                    </div>
                  ) : (
                    <>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>{texts[lang].companyNameLabel}</label>
                        <input
                          ref={companyNameRef}
                          type="text"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            console.log(`${texts[lang].logMessages.companyNameEntered} ${e.target.value}`);
                          }}
                          className={`${css["contact-input"]} ${companyName ? css.filled : ""}`}
                        />
                      </div>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>{texts[lang].nipLabel}</label>
                        <input
                          ref={nipRef}
                          type="text"
                          value={nip}
                          onChange={(e) => {
                            setNip(e.target.value);
                            console.log(`${texts[lang].logMessages.nipEntered} ${e.target.value}`);
                          }}
                          className={`${css["contact-input"]} ${nip ? css.filled : ""}`}
                        />
                      </div>
                    </>
                  )}
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].phoneLabel}</label>
                    <input
                      ref={phoneRef}
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        console.log(`${texts[lang].logMessages.phoneEntered} ${e.target.value}`);
                      }}
                      className={`${css["contact-input"]} ${phone ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].emailLabel}</label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        console.log(`${texts[lang].logMessages.emailEntered} ${e.target.value}`);
                      }}
                      className={`${css["contact-input"]} ${email ? css.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={css["contact-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{texts[lang].additionalInfoLabel}</label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => {
                        setAdditionalInfo(e.target.value);
                        console.log(`${texts[lang].logMessages.additionalInfoEntered} ${e.target.value}`);
                      }}
                      className={`${css["contact-textarea"]} ${additionalInfo ? css.filled : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={css["agreement-section"]} ref={agreementRef}>
              <label className={css["agreement-label"]}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    console.log(`${texts[lang].logMessages.termsAgreed} ${e.target.checked}`);
                  }}
                  className={css["custom-checkbox"]}
                />
                {texts[lang].agreement1}
              </label>
              <label className={css["agreement-label"]}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => {
                    setAgreeToMarketing(e.target.checked);
                    console.log(`${texts[lang].logMessages.marketingAgreed} ${e.target.checked}`);
                  }}
                  className={css["custom-checkbox"]}
                />
                {texts[lang].agreement2}
              </label>
            </div>
          </div>

          <div className={css["calculator-right"]}>
            <h2>
              {texts[lang].title} {rooms}{" "}
              {rooms === 1 ? texts[lang].roomsLabel : rooms >= 2 && rooms <= 4 ? texts[lang].roomsLabel2 : texts[lang].roomsLabel5}{" "}
              {texts[lang].andLabel || "and"} {bathrooms}{" "}
              {bathrooms === 1
                ? texts[lang].bathroomsLabel
                : bathrooms >= 2 && bathrooms <= 4
                ? texts[lang].bathroomsLabel2
                : texts[lang].bathroomsLabel5}
              {kitchen ? `, ${texts[lang].kitchenLabel.toLowerCase()}` : kitchenAnnex ? `, ${texts[lang].kitchenAnnexLabel.toLowerCase()}` : ""}, {texts[lang].hallwayLabel || "hallway"}
              <br />
              {calculateBasePrice()} zł
            </h2>

            <div className={css["location-info"]}>
              <h4>{texts[lang].locationLabel}</h4>
              <p>{selectedCity}</p>
            </div>

            <div className={css["specialist-info"]}>
              <img src="/icon/bucket.png" alt="Specialists" />
              <p>{texts[lang].specialistInfo}</p>
            </div>

            <h4>
              {texts[lang].workTimeLabel}:{" "}
              <span className={css["bold-text"]}>{formatWorkTime()}</span>
            </h4>
            {calculateCleanersAndTime().cleaners > 1 && (
              <div className={css.cleaners}>
                {Array.from({ length: calculateCleanersAndTime().cleaners }, (_, i) => (
                  <span key={i} className={css["cleaners-icon"]}>
                    👤
                  </span>
                ))}
                <p>{texts[lang].cleanersLabel}: {calculateCleanersAndTime().cleaners}</p>
              </div>
            )}

            <div className={css["selected-date"]}>
              <FaCalendarAlt className={css["calendar-icon"]} />
              {selectedDate && selectedTime ? (
                <p>
                  {formatSelectedDate()}, {selectedTime}{" "}
                  {discounts[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`] && (
                    <span className={css["discount-inline"]}>
                      -{discounts[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`]}%
                    </span>
                  )}
                </p>
              ) : (
                <p>{texts[lang].datePlaceholder}</p>
              )}
            </div>

            <div className={css["selected-frequency"]}>
              <p>
                {cleaningFrequency}
                {frequencyDiscounts[cleaningFrequency] > 0 && (
                  <span className={css["discount-inline"]}>
                    -{frequencyDiscounts[cleaningFrequency]}%
                  </span>
                )}
              </p>
            </div>

            <div className={css["location-cost"]}>
              <p>
                {texts[lang].locationCostLabel}:{" "}
                <span className={css["bold-text"]}>+{cities[selectedCity].toFixed(2)} zł</span>
              </p>
            </div>

            <div className={css["selected-services-container"]}>
              {paidServices.map((service) =>
                (service.type === "checkbox" && selectedServices[service.id]) ||
                (service.type === "quantity" && selectedServices[service.id] > 0) ? (
                  <div key={service.id} className={css["selected-service-item"]} style={{ position: "relative" }}>
                    <div className={css["service-info"]}>
                      <img
                        src={service.icon}
                        alt={service.name}
                        className={css["selected-service-icon"]}
                      />
                      <p>
                        {texts[lang][service.name]}
                        {service.type === "quantity" &&
                          ` (${selectedServices[service.id]}${
                            service.id === 9 || service.id === 11 ? ` ${texts[lang].logMessages.hours || "hours"}` : "x"
                          })`}
                      </p>
                    </div>
                    <div className={css["service-price"]}>
                      <p>
                        {(service.type === "checkbox"
                          ? service.price
                          : service.price * selectedServices[service.id]
                        ).toFixed(2)}{" "}
                        zł
                      </p>
                    </div>
                    <button
                      className={css["remove-btn"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        service.type === "checkbox"
                          ? handleServiceToggle(service.id)
                          : handleQuantityChange(service.id, -selectedServices[service.id]);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : null
              )}

              {vacuumNeeded && (
                <div key="vacuum" className={css["selected-service-item"]} style={{ position: "relative" }}>
                  <div className={css["service-info"]}>
                    <img
                      src="/icon/odku.png"
                      alt="Vacuum"
                      className={css["selected-service-icon"]}
                    />
                    <p>{texts[lang].vacuumNotice2}</p>
                  </div>
                  <div className={css["service-price"]}>
                    <p>{vacuumCost.toFixed(2)} zł</p>
                  </div>
                  <button
                    className={css["remove-btn"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVacuumNeeded(false);
                      console.log(texts[lang].logMessages.vacuumRemoved || "Vacuum removed from order");
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className={css["promo-code"]}>
              <div className={css["promo-container"]}>
                <FaPercentage className={css["promo-icon"]} />
                <input
                  type="text"
                  placeholder={texts[lang].promoPlaceholder}
                  value={promo}
                  onChange={(e) => {
                    setPromo(e.target.value);
                    console.log(`${texts[lang].logMessages.promoEntered} ${e.target.value}`);
                  }}
                />
                <button onClick={handlePromoApply}>{texts[lang].applyPromo}</button>
              </div>
            </div>

            <div className={css.total}>
              <p>
                <strong>{texts[lang].totalLabel}:</strong> {calculateTotal()} zł{" "}
                <del>{calculateStrikethroughPrice()} zł</del>
              </p>

              <div ref={sentinelRef} />
              <button
                ref={orderButtonRef}
                className={`${css["sticky-order-button"]} ${isSticked ? css.sticked : css.inPlace}`}
                onClick={handleOrder}
              >
                {t.orderButton} {calculateTotal()} zł
              </button>

              <div className={css["payment-icons"]}>
                <img src="/icon/visa.svg" alt="Visa" />
                <img src="/icon/money.svg" alt="MasterCard" />
                <img src="/icon/apple-pay.svg" alt="apple-pay" />
                <img src="/icon/google-pay.svg" alt="google-pay" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}