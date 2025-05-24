import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import css from "./WindowCleaningCalculator.module.css";
import { FaCalendarAlt, FaPercentage, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

export default function WindowCleaningCalculator({ lang, type, title }) {
  const [windows, setWindows] = useState(5);
  const [balconies, setBalconies] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookedDates] = useState(new Set(["2025-04-15"]));
  const [discounts, setDiscounts] = useState({});
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Warszawa");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [intercomCode, setIntercomCode] = useState("");
  const [clientType, setClientType] = useState("private");
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
  const [isSticked, setIsSticked] = useState(false);

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

  const pricePerWindow = 40.0;
  const pricePerBalcony = 25.0;
  const companyMultiplier = clientType === "company" ? 1.23 : 1.0;

  const months = [
    "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
    "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
  ];
  const availableTimes = [
    "7:30", "8:00", "9:00", "10:00",
    "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00",
  ];

  const texts = {
    pl: {
      title: "Mycie okien",
      windowsLabel: "Okien",
      balconiesLabel: "Balkonów",
      windowsPrice: "40.00 zł/szt",
      balconiesPrice: "25.00 zł/szt",
      subtitle: "Wybierz poniższe parametry, aby obliczyć koszt.",
      calendarTitle: "WYBIERZ DOGODNY TERMIN I GODZINĘ SPRZĄTANIA",
      timeLabel: "Godzina",
      calendarFooter: "Można zacząć w dowolnym momencie",
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
      clientTypeLabel: "Typ klienta",
      privateLabel: "Osoba prywatna",
      companyLabel: "Firma",
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
      windowsBalconiesLabel: "Okna i balkony",
      windowsMinNotice: "Minimalna liczba okien to 5. Jeżeli masz mniej okien, zamów sprzątanie jednopokojowego mieszkania i wskaż ich odpowiednią ilość",
      paymentSuccess: "Płatność zakończona sukcesem! Twoje zamówienie zostało złożone.",
      paymentError: "Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.",
      paymentCanceled: "Płatność została anulowana. Spróbuj ponownie.",
      errorMissingFields: "Proszę wypełnić wszystkie wymagane pola: ",
      invalidEmail: "Proszę wprowadzić prawidłowy adres e-mail.",
      invalidPhone: "Proszę wprowadzić prawidłowy numer telefonu.",
      invalidNip: "Proszę wprowadzić prawidłowy numer NIP.",
    },
    uk: {
      title: "Миття вікон",
      windowsLabel: "Вікон",
      balconiesLabel: "Балконів",
      windowsPrice: "40.00 zł/шт",
      balconiesPrice: "25.00 zł/шт",
      subtitle: "Виберіть параметри нижче, щоб розрахувати вартість.",
      calendarTitle: "ВИБЕРІТЬ ЗРУЧНИЙ ТЕРМІН І ЧАС ПРИБИРАННЯ",
      timeLabel: "Година",
      calendarFooter: "Можна почати в будь-який момент",
      addressTitle: "ВВЕДІТЬ ВАШУ АДРЕСУ",
      cityLabel: "Виберіть місто",
      streetLabel: "Вулиця",
      postalCodeLabel: "Поштовий індекс",
      houseNumberLabel: "Номер будинку",
      apartmentNumberLabel: "Номер квартири",
      buildingLabel: "Будинок",
      floorLabel: "Поверх",
      intercomCodeLabel: "Код домофона",
      citySearchPlaceholder: "Введіть назву населеного пункту...",
      contactTitle: "КОНТАКТНІ ДАНІ",
      clientTypeLabel: "Тип клієнта",
      privateLabel: "Фізична особа",
      companyLabel: "Компанія",
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
      windowsBalconiesLabel: "Вікна та балкони",
      windowsMinNotice: "Мінімальна кількість вікон – 5. Якщо у вас менше вікон, замовте прибирання однокімнатної квартири та вкажіть їх відповідну кількість",
      paymentSuccess: "Оплата успішна! Ваше замовлення прийнято.",
      paymentError: "Виникла помилка під час оформлення замовлення. Спробуйте ще раз.",
      paymentCanceled: "Оплата була скасована. Спробуйте ще раз.",
      errorMissingFields: "Будь ласка, заповніть усі обов’язкові поля: ",
      invalidEmail: "Будь ласка, введіть правильну адресу електронної пошти.",
      invalidPhone: "Будь ласка, введіть правильний номер телефону.",
      invalidNip: "Будь ласка, введіть правильний номер NIP.",
    },
    ru: {
      title: "Мойка окон",
      windowsLabel: "Окон",
      balconiesLabel: "Балконов",
      windowsPrice: "40.00 zł/шт",
      balconiesPrice: "25.00 zł/шт",
      subtitle: "Выберите параметры ниже, чтобы рассчитать стоимость.",
      calendarTitle: "ВЫБЕРИТЕ УДОБНЫЙ СРОК И ВРЕМЯ УБОРКИ",
      timeLabel: "Время",
      calendarFooter: "Можно начать в любой момент",
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
      clientTypeLabel: "Тип клиента",
      privateLabel: "Частное лицо",
      companyLabel: "Компания",
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
      windowsBalconiesLabel: "Окна и балконы",
      windowsMinNotice: "Минимальное количество окон – 5. Если у вас меньше окон, закажите уборку однокомнатной квартиры и укажите их соответствующее количество",
      paymentSuccess: "Оплата прошла успешно! Ваш заказ принят.",
      paymentError: "Произошла ошибка при оформлении заказа. Попробуйте снова.",
      paymentCanceled: "Оплата была отменена. Попробуйте снова.",
      errorMissingFields: "Пожалуйста, заполните все обязательные поля: ",
      invalidEmail: "Пожалуйста, введите правильный адрес электронной почты.",
      invalidPhone: "Пожалуйста, введите правильный номер телефона.",
      invalidNip: "Пожалуйста, введите правильный номер NIP.",
    },
    en: {
      title: "Window Cleaning",
      windowsLabel: "Windows",
      balconiesLabel: "Balconies",
      windowsPrice: "40.00 zł/unit",
      balconiesPrice: "25.00 zł/unit",
      subtitle: "Select the parameters below to calculate the cost.",
      calendarTitle: "CHOOSE A CONVENIENT DATE AND TIME FOR CLEANING",
      timeLabel: "Time",
      calendarFooter: "You can start at any time",
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
      clientTypeLabel: "Client type",
      privateLabel: "Private individual",
      companyLabel: "Company",
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
      windowsBalconiesLabel: "Windows and balconies",
      windowsMinNotice: "The minimum number of windows is 5. If you have fewer windows, order a one-room apartment cleaning and specify their appropriate number",
      paymentSuccess: "Payment successful! Your order has been placed.",
      paymentError: "An error occurred while placing the order. Please try again.",
      paymentCanceled: "Payment was canceled. Please try again.",
      errorMissingFields: "Please fill in all required fields: ",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      invalidNip: "Please enter a valid NIP number.",
    },
  };

  const t = texts[lang] || texts.pl;

  // Очищення помилок при заповненні полів
  useEffect(() => {
    const fetchDiscounts = async () => {
      if (!type || type === "undefined") {
        console.log(`Помилка: type є ${type}, пропускаємо запит до API`);
        return;
      }

      try {
        console.log(`Завантаження знижок для type: ${type}`);
        const { data } = await axios.get(`${API}/discounts?type=${type}`);
        console.log(`Сирі дані знижок для ${type}:`, data);
        const discountMap = data.reduce((acc, discount) => {
          const date = new Date(discount.date + 'T00:00:00Z');
          const formattedDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
          return {
            ...acc,
            [formattedDate]: discount.percentage,
          };
        }, {});
        console.log(`Знижки для ${type} після обробки:`, discountMap);
        if (Object.keys(discountMap).length > 0) {
          setDiscounts(discountMap);
        }
        setError(null);
      } catch (err) {
        console.error(`Помилка завантаження знижок для ${type}:`, err);
        setError(`Не вдалося завантажити знижки для ${type}. Спробуйте ще раз.`);
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

  const handleWindowsChange = (increment) => {
    const parsedValue = parseInt(windows, 10);
    if (isNaN(parsedValue)) {
      setWindows(5 + increment);
    } else {
      setWindows(Math.max(5, parsedValue + increment));
    }
    console.log(`Кількість вікон змінено: ${windows + increment}`);
  };

  const handleBalconiesChange = (increment) => {
    const parsedValue = parseInt(balconies, 10);
    if (isNaN(parsedValue)) {
      setBalconies(Math.max(0, increment));
    } else {
      setBalconies(Math.max(0, parsedValue + increment));
    }
    console.log(`Кількість балконів змінено: ${balconies + increment}`);
  };

  const handleWindowsInputChange = (e) => {
    const value = e.target.value;
    setWindows(value);
    console.log(`Кількість вікон введено вручну: ${value}`);
  };

  const handleBalconiesInputChange = (e) => {
    const value = e.target.value;
    setBalconies(value);
    console.log(`Кількість балконів введено вручну: ${value}`);
  };

  const handleWindowsBlur = () => {
    const parsedValue = parseInt(windows, 10);
    if (isNaN(parsedValue) || windows === "") {
      setWindows(5);
      console.log("Кількість вікон встановлено на мінімальне значення: 5");
    } else {
      setWindows(Math.max(5, parsedValue));
      console.log(`Кількість вікон після перевірки: ${Math.max(5, parsedValue)}`);
    }
  };

  const handleBalconiesBlur = () => {
    const parsedValue = parseInt(balconies, 10);
    if (isNaN(parsedValue) || balconies === "") {
      setBalconies(0);
      console.log("Кількість балконів встановлено на 0");
    } else {
      setBalconies(Math.max(0, parsedValue));
      console.log(`Кількість балконів після перевірки: ${Math.max(0, parsedValue)}`);
    }
  };

  const handlePrevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    console.log(`Перехід до попереднього місяця: ${months[newMonth]} ${newYear}`);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    console.log(`Перехід до наступного місяця: ${months[newMonth]} ${newYear}`);
  };

  const renderCalendar = () => {
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

      console.log(`Дата: ${formattedDate}, Знижка: ${discountValue}`);
      console.log(`Чи показуємо знижку? ${discountValue > 0 ? "Так" : "Ні"}`);

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
              console.log(`Обрана дата: ${formattedDate}`);
            }
          }}
        >
          <span className={css["day-number"]}>{day}</span>
          {discountValue > 0 && <span className={css["discount-label"]}>-{discountValue}%</span>}
          {isToday && <span className={css["day-label"]}>{t.todayLabel}</span>}
          {isTomorrow && <span className={css["day-label"]}>{t.tomorrowLabel}</span>}
          {isPast && <span className={css["day-label"]}>{t.unavailableLabel}</span>}
        </div>
      );
    }
    return days;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    const day = selectedDate.getDate();
    const month = months[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const calculateBasePrice = () => {
    let parsedWindows = parseInt(windows, 10);
    let parsedBalconies = parseInt(balconies, 10);

    if (isNaN(parsedWindows)) parsedWindows = 5;
    if (isNaN(parsedBalconies)) parsedBalconies = 0;

    let total = parsedWindows * pricePerWindow + parsedBalconies * pricePerBalcony;
    total += cities[selectedCity] || 0;
    total *= companyMultiplier;
    console.log(`Розрахунок базової ціни: ${total.toFixed(2)} zł (вікна: ${parsedWindows}, балкони: ${parsedBalconies}, місто: ${selectedCity}, множник: ${companyMultiplier})`);
    return total.toFixed(2);
  };

  const calculateTotal = () => {
    let total = parseFloat(calculateBasePrice());
    let appliedDiscount = discount;
    if (selectedDate) {
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      const dateDiscount = discounts[formattedDate] || 0;
      appliedDiscount = Math.max(appliedDiscount, dateDiscount);
    }
    const discountAmount = total * (appliedDiscount / 100);
    const finalTotal = (total - discountAmount).toFixed(2);
    console.log(`Розрахунок загальної ціни: ${finalTotal} zł (знижка: ${appliedDiscount}%, сума знижки: ${discountAmount.toFixed(2)} zł)`);
    return finalTotal;
  };

  const calculateStrikethroughPrice = () => {
    const strikethroughPrice = (parseFloat(calculateTotal()) * 1.25).toFixed(2);
    console.log(`Розрахунок перекресленої ціни: ${strikethroughPrice} zł`);
    return strikethroughPrice;
  };

  const calculateWorkTime = () => {
    let parsedWindows = parseInt(windows, 10);
    let parsedBalconies = parseInt(balconies, 10);

    if (isNaN(parsedWindows)) parsedWindows = 5;
    if (isNaN(parsedBalconies)) parsedBalconies = 0;

    const windowsTime = parsedWindows * 0.5; // 30 хвилин на вікно
    const balconiesTime = parsedBalconies * 0.75; // 45 хвилин на балкон
    const totalTime = windowsTime + balconiesTime;
    console.log(`Розрахунок часу роботи: ${totalTime} годин (вікна: ${windowsTime}, балкони: ${balconiesTime})`);
    return totalTime;
  };

  const calculateCleanersAndTime = () => {
    const totalHours = calculateWorkTime();
    const cleaners = Math.ceil(totalHours / 9); // Один прибиральник працює до 9 годин
    const adjustedHours = totalHours / cleaners;
    const hours = Math.floor(adjustedHours);
    const minutes = Math.round((adjustedHours - hours) * 60);
    console.log(`Розрахунок прибиральників: ${cleaners}, час: ${hours} год ${minutes} хв`);
    return { hours, minutes, cleaners };
  };

  const formatWorkTime = () => {
    const { hours, minutes } = calculateCleanersAndTime();
    return minutes > 0 ? `${hours} godzin ${minutes} minut` : `${hours} godziny`;
  };

  const handlePromoApply = () => {
    if (promo.toLowerCase() === "weekend") {
      setDiscount(20);
      console.log("Застосовано промокод WEEKEND: знижка 20%");
    } else if (promo.toLowerCase() === "twoweeks") {
      setDiscount(15);
      console.log("Застосовано промокод TWOWEEKS: знижка 15%");
    } else if (promo.toLowerCase() === "month") {
      setDiscount(10);
      console.log("Застосовано промокод MONTH: знижка 10%");
    } else {
      setDiscount(0);
      console.log("Невірний промокод, знижка скинута до 0%");
    }
  };

  const handleOrder = async () => {
    console.log("Початок обробки замовлення...");

    // Перевірка обов'язкових полів
    const missingFields = [];

    if (!selectedDate) {
      calendarRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Дата не обрана");
      missingFields.push("data sprzątania");
    }

    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Час не обраний");
      missingFields.push("godzina sprzątania");
    }

    if (!street) {
      streetRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t.streetLabel.toLowerCase());
    }

    if (!postalCode) {
      postalCodeRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t.postalCodeLabel.toLowerCase());
    }

    if (!houseNumber) {
      houseNumberRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t.houseNumberLabel.toLowerCase());
    }

    if (clientType === "private") {
      if (!name) {
        nameRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        missingFields.push(t.nameLabel.toLowerCase());
      }
    } else {
      if (!companyName) {
        companyNameRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        missingFields.push(t.companyNameLabel.toLowerCase());
      }
      if (!nip) {
        nipRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        missingFields.push(t.nipLabel.toLowerCase());
      } else {
        // Валідація NIP (польський формат: 10 цифр)
        const nipRegex = /^\d{10}$/;
        if (!nipRegex.test(nip)) {
          nipRef.current?.classList.add(css["error-border"], css["shake-anim"]);
          setError(t.invalidNip);
          nipRef.current?.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }

    if (!phone) {
      phoneRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t.phoneLabel.toLowerCase());
    } else {
      // Валідація телефону (простий формат: 9-12 цифр)
      const phoneRegex = /^\d{9,12}$/;
      if (!phoneRegex.test(phone)) {
        phoneRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        setError(t.invalidPhone);
        phoneRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (!email) {
      emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t.emailLabel.toLowerCase());
    } else {
      // Валідація email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
        setError(t.invalidEmail);
        emailRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (!agreeToTerms || !agreeToMarketing) {
      agreementRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Не погоджено з умовами або маркетингом");
      missingFields.push("zgoda na regulamin i przetwarzanie danych");
    }

    if (missingFields.length > 0) {
      const errorMessage = `${t.errorMissingFields} ${missingFields.join(", ")}.`;
      console.log(`Помилка: Відсутні обов’язкові поля: ${missingFields.join(", ")}`);
      setError(errorMessage);
      if (missingFields.includes("data sprzątania") || missingFields.includes("godzina sprzątania")) {
        calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (missingFields.includes(t.streetLabel.toLowerCase()) || missingFields.includes(t.postalCodeLabel.toLowerCase()) || missingFields.includes(t.houseNumberLabel.toLowerCase())) {
        streetRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (missingFields.includes(t.nameLabel.toLowerCase()) || missingFields.includes(t.companyNameLabel.toLowerCase()) || missingFields.includes(t.nipLabel.toLowerCase()) || missingFields.includes(t.phoneLabel.toLowerCase()) || missingFields.includes(t.emailLabel.toLowerCase())) {
        nameRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Форматування дати у формат YYYY-MM-DD
    const formattedDate = selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : null;

    const orderData = {
      order_type: "window_cleaning",
      windows: parseInt(windows, 10) || 5,
      balconies: parseInt(balconies, 10) || 0,
      total_price: parseFloat(calculateTotal()),
      selected_date: formattedDate,
      selected_time: selectedTime,
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
        client_type: clientType === "private" ? "Osoba prywatna" : "Firma",
        name: clientType === "private" ? name : undefined,
        company_name: clientType === "company" ? companyName : undefined,
        nip: clientType === "company" ? nip : undefined,
        phone,
        email,
        additional_info: additionalInfo,
      },
      payment_status: "pending",
    };

    console.log("Дані замовлення:", orderData);

    try {
      // 1. Створюємо замовлення
      console.log("Відправка запиту на створення замовлення...");
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не вдалося створити замовлення.");
      }

      const { orderId } = await response.json();
      console.log(`Замовлення створено з ID: ${orderId}`);

      // 2. Ініціалізуємо платіж через PayU
      const amount = parseFloat(calculateTotal());
      console.log(`Ініціалізація платежу PayU для суми: ${amount} zł...`);
      const paymentResponse = await fetch(`${API}/create-payu-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          total_price: amount,
          description: `Mycie okien #${orderId}`,
          client_email: orderData.client_info.email,
          client_phone: orderData.client_info.phone,
          client_info: {
            name: clientType === "private" ? (orderData.client_info.name || "Jan Kowalski") : orderData.client_info.company_name || "Firma",
          },
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Не вдалося ініціалізувати платіж.");
      }

      const { redirectUri } = await paymentResponse.json();
      console.log(`Отримано URL для оплати: ${redirectUri}`);

      // 3. Перенаправляємо користувача на сторінку оплати PayU
      window.location.href = redirectUri;
      console.log("Користувача перенаправлено на сторінку оплати PayU");
    } catch (error) {
      console.error("Помилка при оформленні замовлення:", error);
      setError(error.message || t.paymentError);
    }
  };

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        <h2 className={css["cacl-title"]}>{t.title} {selectedCity}</h2>
        <p className={css.subtitle}>{t.subtitle}</p>
      </div>

      {error && <div className={css.error}>{error}</div>}

      <section className={css["calculator-impuls"]}>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            <div className={css["user-type"]}>
              <button
                className={`${css["user-type-button"]} ${clientType === "private" ? css.active : ""}`}
                onClick={() => {
                  setClientType("private");
                  console.log("Обрано тип клієнта: Фізична особа");
                }}
              >
                {t.privateLabel}
              </button>
              <button
                className={`${css["user-type-button"]} ${clientType === "company" ? css.active : ""}`}
                onClick={() => {
                  setClientType("company");
                  console.log("Обрано тип клієнта: Компанія");
                }}
              >
                {t.companyLabel}
              </button>
            </div>

            <div className={css["quantity-selector"]}>
              <div className={css["counters-wrapper"]}>
                <div className={css.counter}>
                  <button
                    className={css["counter-button"]}
                    onClick={() => handleWindowsChange(-1)}
                    disabled={windows <= 5}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={windows}
                    onChange={handleWindowsInputChange}
                    onBlur={handleWindowsBlur}
                    className={css["counter-value"]}
                    style={{
                      width: "60px",
                      textAlign: "center",
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                      MozAppearance: "textfield",
                    }}
                    min="5"
                  />
                  <div className={css["counter-label-container"]}>
                    <img src="/icon/window.png" alt="Window" className={css["counter-icon"]} />
                    <span className={css["counter-label"]}>{t.windowsLabel}</span>
                  </div>
                  <button
                    className={css["counter-button"]}
                    onClick={() => handleWindowsChange(1)}
                  >
                    +
                  </button>
                </div>

                <div className={css.counter}>
                  <button
                    className={css["counter-button"]}
                    onClick={() => handleBalconiesChange(-1)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={balconies}
                    onChange={handleBalconiesInputChange}
                    onBlur={handleBalconiesBlur}
                    className={css["counter-value"]}
                    style={{
                      width: "60px",
                      textAlign: "center",
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                      MozAppearance: "textfield",
                    }}
                    min="0"
                  />
                  <div className={css["counter-label-container"]}>
                    <img src="/icon/balcony.png" alt="Balcony" className={css["counter-icon"]} />
                    <span className={css["counter-label"]}>{t.balconiesLabel}</span>
                  </div>
                  <button
                    className={css["counter-button"]}
                    onClick={() => handleBalconiesChange(1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className={css["windows-min-notice"]}>{t.windowsMinNotice}</p>
            </div>

            <div className={css["calendar-section"]} ref={calendarRef}>
              <h4>{t.calendarTitle}</h4>
              <div className={css["calendar-container"]}>
                <div className={css["calendar-time-wrapper"]}>
                  <div className={css["calendar-wrapper"]}>
                    <div className={css["calendar-header"]}>
                      <button onClick={handlePrevMonth} className={css["nav-button"]}>
                        <FaChevronLeft />
                      </button>
                      <h5>
                        {months[currentMonth]} {currentYear}
                      </h5>
                      <button onClick={handleNextMonth} className={css["nav-button"]}>
                        <FaChevronRight />
                      </button>
                    </div>

                    <div className={css["calendar-days"]}>
                      <div>pon</div>
                      <div>wt</div>
                      <div>śr</div>
                      <div>czw</div>
                      <div>pt</div>
                      <div>sob</div>
                      <div>niedz</div>
                    </div>

                    <div className={css["calendar-grid"]}>
                      {renderCalendar()}
                    </div>
                  </div>

                  <div className={css["time-wrapper"]} ref={timeSlotsRef}>
                    <h5>{t.timeLabel}</h5>
                    <div className={css["time-slots"]}>
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          className={`${css["time-slot"]} ${
                            selectedTime === time ? css.selected : ""
                          }`}
                          onClick={() => {
                            setSelectedTime(time);
                            console.log(`Обрано час: ${time}`);
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
                  <p>{t.calendarFooter}</p>
                </div>
              </div>
            </div>

            <div className={css["address-section"]}>
              <h4>{t.addressTitle}</h4>
              <div className={css["city-select"]}>
                <button
                  className={css["city-button"]}
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                >
                  {t.cityLabel}: {selectedCity} +{cities[selectedCity].toFixed(2)} zł ▼
                </button>
                {showCityDropdown && (
                  <div className={css["city-dropdown"]}>
                    <input
                      type="text"
                      placeholder={t.citySearchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        console.log(`Пошук міста: ${e.target.value}`);
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
                          console.log(`Обрано місто: ${city} (+${cost} zł)`);
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
                    <label className={css["input-label"]}>{t.streetLabel}</label>
                    <input
                      ref={streetRef}
                      type="text"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        console.log(`Введено вулицю: ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${street ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.postalCodeLabel}</label>
                    <input
                      ref={postalCodeRef}
                      type="text"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        console.log(`Введено поштовий код: ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${postalCode ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.houseNumberLabel}</label>
                    <input
                      ref={houseNumberRef}
                      type="text"
                      value={houseNumber}
                      onChange={(e) => {
                        setHouseNumber(e.target.value);
                        console.log(`Введено номер будинку: ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${houseNumber ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.apartmentNumberLabel}</label>
                    <input
                      type="text"
                      value={apartmentNumber}
                      onChange={(e) => {
                        setApartmentNumber(e.target.value);
                        console.log(`Введено номер квартири: ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${apartmentNumber ? css.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={css["address-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.buildingLabel}</label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => {
                        setBuilding(e.target.value);
                        console.log(`Введено будівлю: ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${building ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.floorLabel}</label>
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) => {
                        setFloor(e.target.value);
                        console.log(`Введено поверх: ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${floor ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.intercomCodeLabel}</label>
                    <input
                      type="text"
                      value={intercomCode}
                      onChange={(e) => {
                        setIntercomCode(e.target.value);
                        console.log(`Введено код домофону: ${e.target.value}`);
                      }}
                      className={`${css["address-input"]} ${intercomCode ? css.filled : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={css["contact-section"]}>
              <h4>{t.contactTitle}</h4>
              <div className={css["contact-fields"]}>
                <div className={css["contact-row"]}>
                  {clientType === "private" ? (
                    <div className={css["input-group"]}>
                      <label className={css["input-label"]}>{t.nameLabel}</label>
                      <input
                        ref={nameRef}
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          console.log(`Введено ім'я: ${e.target.value}`);
                        }}
                        className={`${css["contact-input"]} ${name ? css.filled : ""}`}
                      />
                    </div>
                  ) : (
                    <>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>{t.companyNameLabel}</label>
                        <input
                          ref={companyNameRef}
                          type="text"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            console.log(`Введено назву компанії: ${e.target.value}`);
                          }}
                          className={`${css["contact-input"]} ${companyName ? css.filled : ""}`}
                        />
                      </div>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>{t.nipLabel}</label>
                        <input
                          ref={nipRef}
                          type="text"
                          value={nip}
                          onChange={(e) => {
                            setNip(e.target.value);
                            console.log(`Введено NIP: ${e.target.value}`);
                          }}
                          className={`${css["contact-input"]} ${nip ? css.filled : ""}`}
                        />
                      </div>
                    </>
                  )}
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.phoneLabel}</label>
                    <input
                      ref={phoneRef}
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        console.log(`Введено телефон: ${e.target.value}`);
                      }}
                      className={`${css["contact-input"]} ${phone ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.emailLabel}</label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        console.log(`Введено email: ${e.target.value}`);
                      }}
                      className={`${css["contact-input"]} ${email ? css.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={css["contact-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.additionalInfoLabel}</label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => {
                        setAdditionalInfo(e.target.value);
                        console.log(`Введено додаткову інформацію: ${e.target.value}`);
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
                    console.log(`Згода з умовами: ${e.target.checked}`);
                  }}
                  className={css["custom-checkbox"]}
                />
                {t.agreement1}
              </label>
              <label className={css["agreement-label"]}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => {
                    setAgreeToMarketing(e.target.checked);
                    console.log(`Згода на маркетинг: ${e.target.checked}`);
                  }}
                  className={css["custom-checkbox"]}
                />
                {t.agreement2}
              </label>
            </div>
          </div>

          <div className={css["calculator-right"]}>
            <h2>
              {t.windowsBalconiesLabel}:{" "}
              <span className={css["bold-text"]}>{windows} okien</span>,{" "}
              <span className={css["bold-text"]}>{balconies} balkonów</span>,
              <br />
              {calculateBasePrice()} zł
            </h2>

            <div className={css["location-info"]}>
              <h4>{t.locationLabel}</h4>
              <p>{selectedCity}</p>
            </div>

            <div className={css["specialist-info"]}>
              <img src="/icon/bucket.png" alt="Specialists" />
              <p>{t.specialistInfo}</p>
            </div>

            <h4>
              {t.workTimeLabel}:{" "}
              <span className={css["bold-text"]}>{formatWorkTime()}</span>
            </h4>
            {calculateCleanersAndTime().cleaners > 1 && (
              <div className={css.cleaners}>
                {Array.from({ length: calculateCleanersAndTime().cleaners }, (_, i) => (
                  <span key={i} className={css["cleaners-icon"]}>
                    👤
                  </span>
                ))}
                <p>{t.cleanersLabel}: {calculateCleanersAndTime().cleaners}</p>
              </div>
            )}

            <div className={css["selected-date"]}>
              <FaCalendarAlt className={css["calendar-icon"]} />
              {selectedDate && selectedTime ? (
                <p>
                  {formatSelectedDate()}, {selectedTime}{" "}
                  {discounts[
                    `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(
                      2,
                      "0"
                    )}-${String(selectedDate.getDate()).padStart(2, "0")}`
                  ] && (
                    <span className={css["discount-inline"]}>
                      -
                      {
                        discounts[
                          `${selectedDate.getFullYear()}-${String(
                            selectedDate.getMonth() + 1
                          ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
                        ]
                      }
                      %
                    </span>
                  )}
                </p>
              ) : (
                <p>{t.datePlaceholder}</p>
              )}
            </div>

            <div className={css["area-windows-info"]}>
              <p>
                {t.windowsLabel}:{" "}
                <span className={css["bold-text"]}>
                  {windows} ({t.windowsPrice})
                </span>
              </p>
              <p>
                {t.balconiesLabel}:{" "}
                <span className={css["bold-text"]}>
                  {balconies} ({t.balconiesPrice})
                </span>
              </p>
            </div>

            <div className={css["location-cost"]}>
              <p>{t.locationCostLabel}: +{cities[selectedCity].toFixed(2)} zł</p>
            </div>

            <div className={css["promo-code"]}>
              <div className={css["promo-container"]}>
                <FaPercentage className={css["promo-icon"]} />
                <input
                  type="text"
                  placeholder={t.promoPlaceholder}
                  value={promo}
                  onChange={(e) => {
                    setPromo(e.target.value);
                    console.log(`Введено промокод: ${e.target.value}`);
                  }}
                />
                <button onClick={handlePromoApply}>{t.applyPromo}</button>
              </div>
            </div>

            <div className={css.total}>
              <p>
                <strong>{t.totalLabel}:</strong> {calculateTotal()} zł{" "}
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