import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import officeCss from "./OfficeCleaning.module.css";
import calcCss from "../Calculator/Calculator.module.css";
import { FaCalendarAlt, FaPercentage, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

export default function OfficeCleaning({ lang, type, title }) {
  const [officeArea, setOfficeArea] = useState(10);
  const [workspaces, setWorkspaces] = useState(0);
  const [cleaningFrequency, setCleaningFrequency] = useState("Jednorazowe sprzątanie");
  const [selectedCity, setSelectedCity] = useState("Warszawa");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookedDates] = useState(new Set(["2025-03-15"]));
  const [discounts, setDiscounts] = useState({});
  const [promoCodes, setPromoCodes] = useState([]);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nip, setNip] = useState("");
  const [vatAddress, setVatAddress] = useState("");
  const [vatCity, setVatCity] = useState("");
  const [vatPostalCode, setVatPostalCode] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [intercomCode, setIntercomCode] = useState("");

  // Refs для підсвітки помилок
  const streetRef = useRef(null);
  const postalCodeRef = useRef(null);
  const houseNumberRef = useRef(null);
  const nameRef = useRef(null);
  const companyNameRef = useRef(null);
  const nipRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const vatAddressRef = useRef(null);
  const vatCityRef = useRef(null);
  const vatPostalCodeRef = useRef(null);
  const calendarRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const agreementRef = useRef(null);
  const sentinelRef = useRef(null);
  const location = useLocation();
  const orderButtonRef = useRef(null);
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

  const basePrice = 246.00;
  const pricePerSquareMeter = 6.15;
  const pricePerWorkspace = 12.30;

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
      title: title || "Sprzątanie biura",
      subtitle: "Wybierz parametry, aby obliczyć koszt u sprzątania biura.",
      areaLabel: "Powierzchnia biura (m²)",
      workspacesLabel: "Liczba miejsc pracy",
      frequencyTitle: "CHĘTNOŚĆ CZĘSTOTLIWOŚCI SPRZĄTANIA",
      calendarTitle: "WYBIERZ DOGODNY TERMIN I GODZINĘ SPRZĄTANIA",
      timeLabel: "Godzina",
      calendarFooter: "Można zacząć w dowolnym momencie",
      cityLabel: "Wybierz miasto",
      citySearchPlaceholder: "Wprowadź nazwę miejscowości...",
      contactTitle: "DANE KONTAKTOWE",
      nameLabel: "Imię",
      phoneLabel: "Telefon kontaktowy",
      emailLabel: "Adres e-mail",
      additionalInfoLabel: "Dodatkowa informacja do zamówienia",
      vatTitle: "DANE DO FAKTURY VAT",
      companyNameLabel: "Nazwa firmy",
      nipLabel: "NIP",
      vatAddressLabel: "Adres",
      vatCityLabel: "Miasto",
      vatPostalCodeLabel: "Kod pocztowy",
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
      vatText: "Cena zawiera VAT, faktura zostanie wysłana na email po zakończeniu sprzątania",
      paymentSuccess: "Płatność zakończona sukcesem! Twoje zamówienie zostało złożone.",
      paymentError: "Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.",
      paymentCanceled: "Płatność została anulowana. Spróbuj ponownie.",
      addressTitle: "WPROWADŹ SWÓJ ADRES",
      streetLabel: "Ulica",
      postalCodeLabel: "Kod pocztowy",
      houseNumberLabel: "Numer domu",
      apartmentNumberLabel: "Numer mieszkania",
      buildingLabel: "Budynek",
      floorLabel: "Piętro",
      intercomCodeLabel: "Kod od domofonu",
      errorMissingFields: "Proszę wypełnić wszystkie wymagane pola: ",
      invalidEmail: "Proszę wprowadzić prawidłowy adres e-mail.",
      invalidPhone: "Proszę wprowadzić prawidłowy numer telefonu.",
      invalidNip: "Proszę wprowadzić prawidłowy numer NIP.",
    },
    uk: {
      title: title || "Прибирання офісу",
      subtitle: "Виберіть параметри, щоб розрахувати вартість прибирання офісу.",
      areaLabel: "Площа офісу (м²)",
      workspacesLabel: "Кількість робочих місць",
      frequencyTitle: "ЧАСТОТА ПРИБИРАННЯ",
      calendarTitle: "ВИБЕРІТЬ ЗРУЧНИЙ ТЕРМІН І ЧАС ПРИБИРАННЯ",
      timeLabel: "Година",
      calendarFooter: "Можна почати в будь-який момент",
      cityLabel: "Виберіть місто",
      citySearchPlaceholder: "Введіть назву населеного пункту...",
      contactTitle: "КОНТАКТНІ ДАНІ",
      nameLabel: "Ім'я",
      phoneLabel: "Контактний телефон",
      emailLabel: "Адреса електронної пошти",
      additionalInfoLabel: "Додаткова інформація до замовлення",
      vatTitle: "ДАНІ ДЛЯ РАХУНКУ-ФАКТУРИ VAT",
      companyNameLabel: "Назва компанії",
      nipLabel: "NIP",
      vatAddressLabel: "Адреса",
      vatCityLabel: "Місто",
      vatPostalCodeLabel: "Поштовий індекс",
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
      vatText: "Ціна включає VAT, рахунок-фактура буде надісланий на email після завершення прибирання",
      paymentSuccess: "Оплата успішна! Ваше замовлення прийнято.",
      paymentError: "Виникла помилка під час оформлення замовлення. Спробуйте ще раз.",
      paymentCanceled: "Оплата була скасована. Спробуйте ще раз.",
      addressTitle: "ВВЕДІТЬ ВАШУ АДРЕСУ",
      streetLabel: "Вулиця",
      postalCodeLabel: "Поштовий індекс",
      houseNumberLabel: "Номер будинку",
      apartmentNumberLabel: "Номер квартири",
      buildingLabel: "Будівля",
      floorLabel: "Поверх",
      intercomCodeLabel: "Код домофона",
      errorMissingFields: "Будь ласка, заповніть усі обов’язкові поля: ",
      invalidEmail: "Будь ласка, введіть правильну адресу електронної пошти.",
      invalidPhone: "Будь ласка, введіть правильний номер телефону.",
      invalidNip: "Будь ласка, введіть правильний номер NIP.",
    },
    ru: {
      title: title || "Уборка офиса",
      subtitle: "Выберите параметры, чтобы рассчитать стоимость уборки офиса.",
      areaLabel: "Площадь офиса (м²)",
      workspacesLabel: "Количество рабочих мест",
      frequencyTitle: "ЧАСТОТА УБОРКИ",
      calendarTitle: "ВЫБЕРИТЕ УДОБНЫЙ СРОК И ВРЕМЯ УБОРКИ",
      timeLabel: "Время",
      calendarFooter: "Можно начать в любой момент",
      cityLabel: "Выберите город",
      citySearchPlaceholder: "Введите название населенного пункта...",
      contactTitle: "КОНТАКТНЫЕ ДАННЫЕ",
      nameLabel: "Имя",
      phoneLabel: "Контактный телефон",
      emailLabel: "Адрес электронной почты",
      additionalInfoLabel: "Дополнительная информация к заказу",
      vatTitle: "ДАННЫЕ ДЛЯ СЧЕТА-ФАКТУРЫ VAT",
      companyNameLabel: "Название компании",
      nipLabel: "NIP",
      vatAddressLabel: "Адрес",
      vatCityLabel: "Город",
      vatPostalCodeLabel: "Почтовый индекс",
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
      vatText: "Цена включает VAT, счет-фактура будет отправлен на email после завершения уборки",
      paymentSuccess: "Оплата прошла успешно! Ваш заказ принят.",
      paymentError: "Произошла ошибка при оформлении заказа. Попробуйте снова.",
      paymentCanceled: "Оплата была отменена. Попробуйте снова.",
      addressTitle: "ВВЕДИТЕ ВАШ АДРЕС",
      streetLabel: "Улица",
      postalCodeLabel: "Почтовый индекс",
      houseNumberLabel: "Номер дома",
      apartmentNumberLabel: "Номер квартиры",
      buildingLabel: "Здание",
      floorLabel: "Этаж",
      intercomCodeLabel: "Код домофона",
      errorMissingFields: "Пожалуйста, заполните все обязательные поля: ",
      invalidEmail: "Пожалуйста, введите правильный адрес электронной почты.",
      invalidPhone: "Пожалуйста, введите правильный номер телефона.",
      invalidNip: "Пожалуйста, введите правильный номер NIP.",
    },
    en: {
      title: title || "Office Cleaning",
      subtitle: "Select the parameters to calculate the cost of office cleaning.",
      areaLabel: "Office area (m²)",
      workspacesLabel: "Number of workspaces",
      frequencyTitle: "CLEANING FREQUENCY",
      calendarTitle: "CHOOSE A CONVENIENT DATE AND TIME FOR CLEANING",
      timeLabel: "Time",
      calendarFooter: "You can start at any time",
      cityLabel: "Select city",
      citySearchPlaceholder: "Enter the name of the locality...",
      contactTitle: "CONTACT DETAILS",
      nameLabel: "Name",
      phoneLabel: "Contact phone",
      emailLabel: "Email address",
      additionalInfoLabel: "Additional order information",
      vatTitle: "VAT INVOICE DETAILS",
      companyNameLabel: "Company name",
      nipLabel: "NIP",
      vatAddressLabel: "Address",
      vatCityLabel: "City",
      vatPostalCodeLabel: "Postal code",
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
      vatText: "Price includes VAT, invoice will be sent to email after cleaning",
      paymentSuccess: "Payment successful! Your order has been placed.",
      paymentError: "An error occurred while placing the order. Please try again.",
      paymentCanceled: "Payment was canceled. Please try again.",
      addressTitle: "ENTER YOUR ADDRESS",
      streetLabel: "Street",
      postalCodeLabel: "Postal code",
      houseNumberLabel: "House number",
      apartmentNumberLabel: "Apartment number",
      buildingLabel: "Building",
      floorLabel: "Floor",
      intercomCodeLabel: "Intercom code",
      errorMissingFields: "Please fill in all required fields: ",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      invalidNip: "Please enter a valid NIP number.",
    },
  };

  const t = texts[lang] || texts.pl;
  useEffect(() => {
    const { state } = location;
    if (state?.frequency && frequencyDiscounts[state.frequency] !== undefined) {
      setCleaningFrequency(state.frequency);
      console.log(`Обрана частота прибирання: ${state.frequency} (-${frequencyDiscounts[state.frequency]}%)`);
    }
  }, [location]);
  // Завантаження промокодів з API
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        console.log("Завантаження промокодів...");
        const { data } = await axios.get(`${API}/promo-codes`);
        setPromoCodes(data);
        console.log("Промокоди завантажено:", data);
      } catch (err) {
        console.error("Помилка завантаження промокодів:", err);
        setError("Не вдалося завантажити промокоди. Спробуйте ще раз.");
      }
    };
    fetchPromoCodes();
  }, []);

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
      button.classList.add(calcCss.sticked);
      button.classList.remove(calcCss.inPlace);
      setIsSticked(true);
    };
    const unstick = () => {
      button.classList.remove(calcCss.sticked);
      button.classList.add(calcCss.inPlace);
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
      calendarRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime && timeSlotsRef.current) {
      timeSlotsRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [selectedTime]);

  useEffect(() => {
    if (street && streetRef.current) {
      streetRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [street]);

  useEffect(() => {
    if (postalCode && postalCodeRef.current) {
      postalCodeRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [postalCode]);

  useEffect(() => {
    if (houseNumber && houseNumberRef.current) {
      houseNumberRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [houseNumber]);

  useEffect(() => {
    if (name && nameRef.current) {
      nameRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [name]);

  useEffect(() => {
    if (companyName && companyNameRef.current) {
      companyNameRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [companyName]);

  useEffect(() => {
    if (nip && nipRef.current) {
      nipRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [nip]);

  useEffect(() => {
    if (phone && phoneRef.current) {
      phoneRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [phone]);

  useEffect(() => {
    if (email && emailRef.current) {
      emailRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [email]);

  useEffect(() => {
    if (vatAddress && vatAddressRef.current) {
      vatAddressRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [vatAddress]);

  useEffect(() => {
    if (vatCity && vatCityRef.current) {
      vatCityRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [vatCity]);

  useEffect(() => {
    if (vatPostalCode && vatPostalCodeRef.current) {
      vatPostalCodeRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [vatPostalCode]);

  useEffect(() => {
    if (agreeToTerms && agreeToMarketing && agreementRef.current) {
      agreementRef.current.classList.remove(calcCss["error-border"], calcCss["shake-anim"]);
    }
  }, [agreeToTerms, agreeToMarketing]);

  const handleOfficeAreaInputChange = (e) => {
    const value = e.target.value;
    setOfficeArea(value);
    console.log(`Площа офісу введена вручну: ${value} м²`);
  };

  const handleWorkspacesInputChange = (e) => {
    const value = e.target.value;
    setWorkspaces(value);
    console.log(`Кількість робочих місць введена вручну: ${value}`);
  };

  const handleOfficeAreaBlur = () => {
    const parsedValue = parseInt(officeArea, 10);
    if (isNaN(parsedValue) || officeArea === "") {
      setOfficeArea(10);
      console.log("Площа офісу встановлена на мінімальне значення: 10 м²");
    } else {
      setOfficeArea(Math.max(10, parsedValue));
      console.log(`Площа офісу після перевірки: ${Math.max(10, parsedValue)} м²`);
    }
  };

  const handleWorkspacesBlur = () => {
    const parsedValue = parseInt(workspaces, 10);
    if (isNaN(parsedValue) || workspaces === "") {
      setWorkspaces(0);
      console.log("Кількість робочих місць встановлена на 0");
    } else {
      setWorkspaces(Math.max(0, parsedValue));
      console.log(`Кількість робочих місць після перевірки: ${Math.max(0, parsedValue)}`);
    }
  };

  const handlePromoApply = () => {
    const promoCode = promoCodes.find((code) => code.code === promo.toUpperCase());
    if (promoCode) {
      setDiscount(promoCode.discount);
      console.log(`Застосовано промокод ${promoCode.code}: знижка ${promoCode.discount}%`);
    } else if (promo.toLowerCase() === "weekend") {
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

  const calculateBasePrice = () => {
    let parsedOfficeArea = parseInt(officeArea, 10);
    let parsedWorkspaces = parseInt(workspaces, 10);

    if (isNaN(parsedOfficeArea)) parsedOfficeArea = 10;
    if (isNaN(parsedWorkspaces)) parsedWorkspaces = 0;

    let total = Math.max(basePrice, parsedOfficeArea * pricePerSquareMeter);
    total += parsedWorkspaces * pricePerWorkspace;
    total += cities[selectedCity] || 0;
    console.log(`Розрахунок базової ціни: ${total.toFixed(2)} zł (площа: ${parsedOfficeArea} м², робочі місця: ${parsedWorkspaces}, місто: ${selectedCity})`);
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
    const freqDiscount = frequencyDiscounts[cleaningFrequency] || 0;
    appliedDiscount = Math.max(appliedDiscount, freqDiscount);
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
    let parsedOfficeArea = parseInt(officeArea, 10);
    let parsedWorkspaces = parseInt(workspaces, 10);

    if (isNaN(parsedOfficeArea)) parsedOfficeArea = 10;
    if (isNaN(parsedWorkspaces)) parsedWorkspaces = 0;

    let baseHours = 2;
    const areaTime = parsedOfficeArea * 0.05;
    const workspaceTime = parsedWorkspaces * 0.1;
    const totalTime = (baseHours + areaTime + workspaceTime).toFixed(1);
    console.log(`Розрахунок часу роботи: ${totalTime} годин (площа: ${areaTime}, робочі місця: ${workspaceTime})`);
    return totalTime;
  };

  const calculateCleanersAndTime = () => {
    const totalHours = calculateWorkTime();
    const cleaners = Math.ceil(totalHours / 9);
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
      days.push(<div key={`empty-${i}`} className={calcCss["calendar-day"]}></div>);
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
            ${calcCss["calendar-day"]}
            ${!isSelectable ? calcCss.disabled : ""}
            ${isSelected ? calcCss.selected : ""}
            ${discountValue > 0 ? calcCss.discount : ""}
            ${isPast ? calcCss.past : ""}
            ${isToday ? calcCss.today : ""}
            ${isTomorrow ? calcCss.tomorrow : ""}
            ${isSelectable ? calcCss.hoverable : ""}
          `}
          onClick={() => {
            if (isSelectable) {
              setSelectedDate(date);
              console.log(`Обрана дата: ${formattedDate}`);
            }
          }}
        >
          <span className={calcCss["day-number"]}>{day}</span>
          {discountValue > 0 && <span className={calcCss["discount-label"]}>-{discountValue}%</span>}
          {isToday && <span className={calcCss["day-label"]}>{t.todayLabel}</span>}
          {isTomorrow && <span className={calcCss["day-label"]}>{t.tomorrowLabel}</span>}
          {isPast && <span className={calcCss["day-label"]}>{t.unavailableLabel}</span>}
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

  async function handleOrder() {
    console.log("Початок обробки замовлення...");

    // Перевірка обов'язкових полів
    const missingFields = [];

    if (!selectedDate) {
      calendarRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Дата не обрана");
      missingFields.push("data sprzątania");
    }

    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Час не обраний");
      missingFields.push("godzina sprzątania");
    }

    if (!street) {
      streetRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.streetLabel.toLowerCase());
    }

    if (!postalCode) {
      postalCodeRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.postalCodeLabel.toLowerCase());
    }

    if (!houseNumber) {
      houseNumberRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.houseNumberLabel.toLowerCase());
    }

    if (!name) {
      nameRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.nameLabel.toLowerCase());
    }

    if (!companyName) {
      companyNameRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.companyNameLabel.toLowerCase());
    }

    if (!nip) {
      nipRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.nipLabel.toLowerCase());
    } else {
      // Валідація NIP (польський формат: 10 цифр)
      const nipRegex = /^\d{10}$/;
      if (!nipRegex.test(nip)) {
        nipRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
        setError(t.invalidNip);
        nipRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (!phone) {
      phoneRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.phoneLabel.toLowerCase());
    } else {
      // Валідація телефону (простий формат: 9-12 цифр)
      const phoneRegex = /^\d{9,12}$/;
      if (!phoneRegex.test(phone)) {
        phoneRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
        setError(t.invalidPhone);
        phoneRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (!email) {
      emailRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.emailLabel.toLowerCase());
    } else {
      // Валідація email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
        setError(t.invalidEmail);
        emailRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Перевірка VAT полів
    if (!vatAddress) {
      vatAddressRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.vatAddressLabel.toLowerCase());
    }

    if (!vatCity) {
      vatCityRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.vatCityLabel.toLowerCase());
    }

    if (!vatPostalCode) {
      vatPostalCodeRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      missingFields.push(t.vatPostalCodeLabel.toLowerCase());
    }

    if (!agreeToTerms || !agreeToMarketing) {
      agreementRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
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
      } else if (missingFields.includes(t.vatAddressLabel.toLowerCase()) || missingFields.includes(t.vatCityLabel.toLowerCase()) || missingFields.includes(t.vatPostalCodeLabel.toLowerCase())) {
        vatAddressRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const parsedOfficeArea = parseInt(officeArea, 10) || 10;
    const parsedWorkspaces = parseInt(workspaces, 10) || 0;

    const formattedDate = selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : null;

    const orderData = {
      order_type: "office",
      office_area: parsedOfficeArea,
      workspaces: parsedWorkspaces,
      cleaning_frequency: cleaningFrequency,
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
        client_type: "Firma",
        name,
        company_name: companyName,
        nip,
        phone,
        email,
        additional_info: additionalInfo,
        vat_info: {
          vat_address: vatAddress,
          vat_city: vatCity,
          vat_postal_code: vatPostalCode,
        },
      },
      payment_status: "pending",
    };

    console.log("Дані замовлення:", orderData);

    try {
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
          description: `Sprzątanie biura #${orderId}`,
          client_email: orderData.client_info.email,
          client_phone: orderData.client_info.phone,
          client_info: {
            name: orderData.client_info.company_name || "Firma",
          },
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Не вдалося ініціалізувати платіж.");
      }

      const { redirectUri } = await paymentResponse.json();
      console.log(`Отримано URL для оплати: ${redirectUri}`);

      window.location.href = redirectUri;
      console.log("Користувача перенаправлено на сторінку оплати PayU");
    } catch (error) {
      console.error("Помилка при оформленні замовлення:", error);
      setError(error.message || t.paymentError);
    }
  }

  return (
    <section className={`${officeCss["calc-wrap"]} ${calcCss["calc-wrap"]}`}>
      <div className={`${officeCss.container} ${calcCss.container}`}>
        <h2 className={`${officeCss["cacl-title"]} ${calcCss["cacl-title"]}`}>
          {t.title} {selectedCity}
        </h2>
        <p className={`${officeCss.subtitle} ${calcCss.subtitle}`}>
          {t.subtitle}
        </p>
      </div>

      {error && <div className={calcCss.error}>{error}</div>}

      <section className={`${officeCss["calculator-impuls"]} ${calcCss["calculator-impuls"]}`}>
        <div className={`${officeCss["calculator-container"]} ${calcCss["calculator-container"]}`}>
          <div className={`${officeCss["calculator-left"]} ${calcCss["calculator-left"]}`}>
            <div className={`${officeCss["quantity-selector"]} ${calcCss["quantity-selector"]}`}>
              <div className={`${officeCss["quantity-item"]} ${calcCss["quantity-item"]}`}>
                <div className={`${officeCss["quantity-header"]} ${calcCss["quantity-header"]}`}>
                  <img src="/icon/area.png" alt="Area" className={`${officeCss["quantity-icon"]} ${calcCss["quantity-icon"]}`} />
                  <h4>{t.areaLabel}</h4>
                </div>
                <div className={`${officeCss.counter} ${calcCss.counter}`}>
                  <button
                    className={`${officeCss["counter-button"]} ${calcCss["counter-button"]}`}
                    onClick={() => {
                      const parsedValue = parseInt(officeArea, 10);
                      if (isNaN(parsedValue)) {
                        setOfficeArea(10);
                        console.log("Площа офісу встановлена на мінімальне значення: 10 м²");
                      } else {
                        setOfficeArea(Math.max(10, parsedValue - 1));
                        console.log(`Площа офісу змінена: ${Math.max(10, parsedValue - 1)} м²`);
                      }
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={officeArea}
                    onChange={handleOfficeAreaInputChange}
                    onBlur={handleOfficeAreaBlur}
                    className={`${officeCss["counter-input"]} ${calcCss["counter-input"]}`}
                    min="10"
                  />
                  <span className={`${officeCss["counter-label"]} ${calcCss["counter-label"]}`}>
                    m²
                  </span>
                  <button
                    className={`${officeCss["counter-button"]} ${calcCss["counter-button"]}`}
                    onClick={() => {
                      const parsedValue = parseInt(officeArea, 10);
                      if (isNaN(parsedValue)) {
                        setOfficeArea(11);
                        console.log("Площа офісу змінена: 11 м²");
                      } else {
                        setOfficeArea(parsedValue + 1);
                        console.log(`Площа офісу змінена: ${parsedValue + 1} м²`);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={`${officeCss["quantity-item"]} ${calcCss["quantity-item"]}`}>
                <div className={`${officeCss["quantity-header"]} ${calcCss["quantity-header"]}`}>
                  <img src="/icon/workspace.png" alt="Workspace" className={`${officeCss["quantity-icon"]} ${calcCss["quantity-icon"]}`} />
                  <h4>{t.workspacesLabel}</h4>
                </div>
                <div className={`${officeCss.counter} ${calcCss.counter}`}>
                  <button
                    className={`${officeCss["counter-button"]} ${calcCss["counter-button"]}`}
                    onClick={() => {
                      const parsedValue = parseInt(workspaces, 10);
                      if (isNaN(parsedValue)) {
                        setWorkspaces(0);
                        console.log("Кількість робочих місць встановлена на 0");
                      } else {
                        setWorkspaces(Math.max(0, parsedValue - 1));
                        console.log(`Кількість робочих місць змінена: ${Math.max(0, parsedValue - 1)}`);
                      }
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={workspaces}
                    onChange={handleWorkspacesInputChange}
                    onBlur={handleWorkspacesBlur}
                    className={`${officeCss["counter-input"]} ${calcCss["counter-input"]}`}
                    min="0"
                  />
                  <span className={`${officeCss["counter-label"]} ${calcCss["counter-label"]}`}>
                    {workspaces === 1 ? "miejsce pracy" : "miejsc pracy"}
                  </span>
                  <button
                    className={`${officeCss["counter-button"]} ${calcCss["counter-button"]}`}
                    onClick={() => {
                      const parsedValue = parseInt(workspaces, 10);
                      if (isNaN(parsedValue)) {
                        setWorkspaces(1);
                        console.log("Кількість робочих місць змінена: 1");
                      } else {
                        setWorkspaces(parsedValue + 1);
                        console.log(`Кількість робочих місць змінена: ${parsedValue + 1}`);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className={`${officeCss["calendar-section"]} ${calcCss["calendar-section"]}`} ref={calendarRef}>
              <h4>{t.calendarTitle}</h4>
              <div className={`${officeCss["calendar-container"]} ${calcCss["calendar-container"]}`}>
                <div className={`${officeCss["calendar-time-wrapper"]} ${calcCss["calendar-time-wrapper"]}`}>
                  <div className={`${officeCss["calendar-wrapper"]} ${calcCss["calendar-wrapper"]}`}>
                    <div className={`${officeCss["calendar-header"]} ${calcCss["calendar-header"]}`}>
                      <button onClick={handlePrevMonth} className={`${officeCss["nav-button"]} ${calcCss["nav-button"]}`}>
                        <FaChevronLeft />
                      </button>
                      <h5>
                        {months[currentMonth]} {currentYear}
                      </h5>
                      <button onClick={handleNextMonth} className={`${officeCss["nav-button"]} ${calcCss["nav-button"]}`}>
                        <FaChevronRight />
                      </button>
                    </div>

                    <div className={`${officeCss["calendar-days"]} ${calcCss["calendar-days"]}`}>
                      <div>pon</div>
                      <div>wt</div>
                      <div>śr</div>
                      <div>czw</div>
                      <div>pt</div>
                      <div>sob</div>
                      <div>niedz</div>
                    </div>

                    <div className={`${officeCss["calendar-grid"]} ${calcCss["calendar-grid"]}`}>
                      {renderCalendar()}
                    </div>
                  </div>

                  <div className={`${officeCss["time-wrapper"]} ${calcCss["time-wrapper"]}`} ref={timeSlotsRef}>
                    <h5>{t.timeLabel}</h5>
                    <div className={`${officeCss["time-slots"]} ${calcCss["time-slots"]}`}>
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          className={`${officeCss["time-slot"]} ${calcCss["time-slot"]} ${
                            selectedTime === time ? calcCss.selected : ""
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

                <div className={`${officeCss["calendar-footer"]} ${calcCss["calendar-footer"]}`}>
                  <p>{t.calendarFooter}</p>
                </div>
              </div>
            </div>

            <div className={`${officeCss["address-section"]} ${calcCss["address-section"]}`}>
              <h4>{t.addressTitle}</h4>
              <div className={`${officeCss["city-select"]} ${calcCss["city-select"]}`}>
                <button
                  className={`${officeCss["city-button"]} ${calcCss["city-button"]}`}
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                >
                  {t.cityLabel}: {selectedCity} +{cities[selectedCity].toFixed(2)} zł ▼
                </button>
                {showCityDropdown && (
                  <div className={`${officeCss["city-dropdown"]} ${calcCss["city-dropdown"]}`}>
                    <input
                      type="text"
                      placeholder={t.citySearchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        console.log(`Пошук міста: ${e.target.value}`);
                      }}
                      className={`${officeCss["city-search"]} ${calcCss["city-search"]}`}
                    />
                    {filteredCities.map(([city, cost]) => (
                      <button
                        key={city}
                        className={`${officeCss["city-option"]} ${calcCss["city-option"]} ${
                          selectedCity === city ? calcCss.selected : ""
                        }`}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                          setSearchQuery("");
                          console.log(`Обрано місто: ${city} (+${cost} zł)`);
                        }}
                      >
                        {city}
                        <span className={`${officeCss["city-price"]} ${calcCss["city-price"]}`}>
                          +{cost.toFixed(2)} zł
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={`${officeCss["address-fields"]} ${calcCss["address-fields"]}`}>
                <div className={`${officeCss["address-row"]} ${calcCss["address-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.streetLabel}
                    </label>
                    <input
                      ref={streetRef}
                      type="text"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        console.log(`Введено вулицю: ${e.target.value}`);
                      }}
                      className={`${officeCss["address-input"]} ${calcCss["address-input"]} ${street ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.postalCodeLabel}
                    </label>
                    <input
                      ref={postalCodeRef}
                      type="text"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        console.log(`Введено поштовий код: ${e.target.value}`);
                      }}
                      className={`${officeCss["address-input"]} ${calcCss["address-input"]} ${postalCode ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.houseNumberLabel}
                    </label>
                    <input
                      ref={houseNumberRef}
                      type="text"
                      value={houseNumber}
                      onChange={(e) => {
                        setHouseNumber(e.target.value);
                        console.log(`Введено номер будинку: ${e.target.value}`);
                      }}
                      className={`${officeCss["address-input"]} ${calcCss["address-input"]} ${houseNumber ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.apartmentNumberLabel}
                    </label>
                    <input
                      type="text"
                      value={apartmentNumber}
                      onChange={(e) => {
                        setApartmentNumber(e.target.value);
                        console.log(`Введено номер квартири: ${e.target.value}`);
                      }}
                      className={`${officeCss["address-input"]} ${calcCss["address-input"]} ${apartmentNumber ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={`${officeCss["address-row"]} ${calcCss["address-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.buildingLabel}
                    </label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => {
                        setBuilding(e.target.value);
                        console.log(`Введено будівлю: ${e.target.value}`);
                      }}
                      className={`${officeCss["address-input"]} ${calcCss["address-input"]} ${building ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.floorLabel}
                    </label>
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) => {
                        setFloor(e.target.value);
                        console.log(`Введено поверх: ${e.target.value}`);
                      }}
                      className={`${officeCss["address-input"]} ${calcCss["address-input"]} ${floor ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.intercomCodeLabel}
                    </label>
                    <input
                      type="text"
                      value={intercomCode}
                      onChange={(e) => {
                        setIntercomCode(e.target.value);
                        console.log(`Введено код домофону: ${e.target.value}`);
                      }}
                      className={`${officeCss["address-input"]} ${calcCss["address-input"]} ${intercomCode ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${officeCss["frequency-section"]} ${calcCss["frequency-section"]}`}>
              <h4>{t.frequencyTitle}</h4>
              <div className={`${officeCss["frequency-options"]} ${calcCss["frequency-options"]}`}>
                {Object.entries(frequencyDiscounts).map(([freq, freqDiscount]) => {
                  const freqPrice = (
                    parseFloat(calculateBasePrice()) * (1 - freqDiscount / 100)
                  ).toFixed(2);
                  const isSelected = cleaningFrequency === freq;

                  return (
                    <div
                      key={freq}
                      className={`${officeCss["frequency-option"]} ${calcCss["frequency-option"]} ${
                        isSelected ? calcCss.selected : ""
                      }`}
                      onClick={() => {
                        setCleaningFrequency(freq);
                        console.log(`Обрана частота прибирання: ${freq} (-${freqDiscount}%)`);
                      }}
                    >
                      <div className={`${officeCss["frequency-content"]} ${calcCss["frequency-content"]}`}>
                        <p className={`${officeCss["frequency-title"]} ${calcCss["frequency-title"]}`}>
                          {freq}
                        </p>
                        <p className={`${officeCss["frequency-discount"]} ${calcCss["frequency-discount"]}`}>
                          -{freqDiscount}%
                        </p>
                        <p className={`${officeCss["frequency-price"]} ${calcCss["frequency-price"]}`}>
                          {freqPrice} zł
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${officeCss["contact-section"]} ${calcCss["contact-section"]}`}>
              <h4>{t.contactTitle}</h4>
              <div className={`${officeCss["contact-fields"]} ${calcCss["contact-fields"]}`}>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.nameLabel}
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        console.log(`Введено ім'я: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${name ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.phoneLabel}
                    </label>
                    <input
                      ref={phoneRef}
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        console.log(`Введено телефон: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${phone ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.emailLabel}
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        console.log(`Введено email: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${email ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
                <h4>{t.vatTitle}</h4>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.companyNameLabel}
                    </label>
                    <input
                      ref={companyNameRef}
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        console.log(`Введено назву компанії: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${companyName ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.nipLabel}
                    </label>
                    <input
                      ref={nipRef}
                      type="text"
                      value={nip}
                      onChange={(e) => {
                        setNip(e.target.value);
                        console.log(`Введено NIP: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${nip ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.vatAddressLabel}
                    </label>
                    <input
                      ref={vatAddressRef}
                      type="text"
                      value={vatAddress}
                      onChange={(e) => {
                        setVatAddress(e.target.value);
                        console.log(`Введено адресу для VAT: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${vatAddress ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.vatCityLabel}
                    </label>
                    <input
                      ref={vatCityRef}
                      type="text"
                      value={vatCity}
                      onChange={(e) => {
                        setVatCity(e.target.value);
                        console.log(`Введено місто для VAT: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${vatCity ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.vatPostalCodeLabel}
                    </label>
                    <input
                      ref={vatPostalCodeRef}
                      type="text"
                      value={vatPostalCode}
                      onChange={(e) => {
                        setVatPostalCode(e.target.value);
                        console.log(`Введено поштовий код для VAT: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${vatPostalCode ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      {t.additionalInfoLabel}
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => {
                        setAdditionalInfo(e.target.value);
                        console.log(`Введено додаткову інформацію: ${e.target.value}`);
                      }}
                      className={`${officeCss["contact-textarea"]} ${calcCss["contact-textarea"]} ${additionalInfo ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${officeCss["agreement-section"]} ${calcCss["agreement-section"]}`} ref={agreementRef}>
              <label className={`${officeCss["agreement-label"]} ${calcCss["agreement-label"]}`}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    console.log(`Згода з умовами: ${e.target.checked}`);
                  }}
                  className={`${officeCss["custom-checkbox"]} ${calcCss["custom-checkbox"]}`}
                />
                {t.agreement1}
              </label>
              <label className={`${officeCss["agreement-label"]} ${calcCss["agreement-label"]}`}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => {
                    setAgreeToMarketing(e.target.checked);
                    console.log(`Згода на маркетинг: ${e.target.checked}`);
                  }}
                  className={`${officeCss["custom-checkbox"]} ${calcCss["custom-checkbox"]}`}
                />
                {t.agreement2}
              </label>
            </div>
          </div>

          <div className={`${officeCss["calculator-right"]} ${calcCss["calculator-right"]}`}>       
                 <div className={`${officeCss["office-image"]} ${calcCss["office-image"]}`}>
              <img src="/icon/office.svg" alt="Office" className={`${officeCss["office-icon"]} ${calcCss["office-icon"]}`} />
            </div>
            <h2>
              Sprzątanie biura o powierzchni {officeArea} m² z {workspaces}{" "}
              {workspaces === 1 ? "miejsce pracy" : "miejsc pracy"}
              <br />
              {calculateBasePrice()} zł
            </h2>

            <div className={`${officeCss["location-info"]} ${calcCss["location-info"]}`}>
              <h4>{t.locationLabel}</h4>
              <p>{selectedCity}</p>
            </div>

            <div className={`${officeCss["specialist-info"]} ${calcCss["specialist-info"]}`}>
              <img src="/icon/bucket.png" alt="Specialists" />
              <p>{t.specialistInfo}</p>
            </div>

            <div className={`${officeCss["selected-date"]} ${calcCss["selected-date"]}`}>
              <FaCalendarAlt className={`${officeCss["calendar-icon"]} ${calcCss["calendar-icon"]}`} />
              {selectedDate && selectedTime ? (
                <p>
                  {formatSelectedDate()}, {selectedTime}{" "}
                  {discounts[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`] && (
                    <span className={`${officeCss["discount-inline"]} ${calcCss["discount-inline"]}`}>
                      -{discounts[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`]}%
                    </span>
                  )}
                </p>
              ) : (
                <p>{t.datePlaceholder}</p>
              )}
            </div>

            <div className={`${officeCss["selected-frequency"]} ${calcCss["selected-frequency"]}`}>
              <p>
                {cleaningFrequency}
                {frequencyDiscounts[cleaningFrequency] > 0 && (
                  <span className={`${officeCss["discount-inline"]} ${calcCss["discount-inline"]}`}>
                    -{frequencyDiscounts[cleaningFrequency]}%
                  </span>
                )}
              </p>
            </div>

            <div className={`${officeCss["location-cost"]} ${calcCss["location-cost"]}`}>
              <p>
                {t.locationCostLabel}: <span className={calcCss["bold-text"]}>+{cities[selectedCity].toFixed(2)} zł</span>
              </p>
            </div>

            <div className={`${officeCss["work-time"]} ${calcCss["work-time"]}`}>
              <h4>
                {t.workTimeLabel}: <span className={calcCss["bold-text"]}>{formatWorkTime()}</span>
              </h4>
            </div>
            {calculateCleanersAndTime().cleaners > 1 && (
              <div className={calcCss.cleaners}>
                {Array.from({ length: calculateCleanersAndTime().cleaners }, (_, i) => (
                  <span key={i} className={calcCss["cleaners-icon"]}>
                    👤
                  </span>
                ))}
                <p>{t.cleanersLabel}: {calculateCleanersAndTime().cleaners}</p>
              </div>
            )}

            <div className={`${officeCss["promo-code"]} ${calcCss["promo-code"]}`}>
              <div className={`${officeCss["promo-container"]} ${calcCss["promo-container"]}`}>
                <FaPercentage className={`${officeCss["promo-icon"]} ${calcCss["promo-icon"]}`} />
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

            <div className={`${officeCss.total} ${calcCss.total}`}>
              <p>
                <strong>{t.totalLabel}:</strong>{" "}
                {calculateTotal()} zł{" "}
                <del>{calculateStrikethroughPrice()} zł</del>
              </p>
              <div className={`${officeCss["vat-container"]} ${calcCss["vat-container"]}`}>
                <img src="/icon/invoice.png" alt="Invoice" className={`${officeCss["invoice-icon"]} ${calcCss["invoice-icon"]}`} />
                <span className={`${officeCss["vat-text"]} ${calcCss["vat-text"]}`}>
                  {t.vatText}
                </span>
              </div>

              <div ref={sentinelRef} />
              <button
                ref={orderButtonRef}
                className={`${officeCss["order-button"]} ${calcCss["sticky-order-button"]} ${isSticked ? calcCss.sticked : calcCss.inPlace}`}
                onClick={handleOrder}
              >
                {t.orderButton} {calculateTotal()} zł
              </button>

              <div className={`${officeCss["payment-icons"]} ${calcCss["payment-icons"]}`}>
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