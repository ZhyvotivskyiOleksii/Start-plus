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
  const [promoCodes] = useState([]);
  const [cleaningFrequency, setCleaningFrequency] = useState("Jednorazowe sprzątanie");
  const [vacuumNeeded, setVacuumNeeded] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCity, setSelectedCity] = useState("Warszawa");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cities = {
    "Warszawa": 0.00,
    "Piastów": 30.00,
    "Pruszków": 30.00,
    "Piaseczno": 30.00,
    "Sulejówek": 40.00,
    "Józefów": 70.00,
    "Kobyłka": 50.00,
    "Ożarów Mazowiecki": 50.00,
    "Otwock": 70.00,
    "Zielonka": 40.00,
    "Legionowo": 40.00,
    "Józefosław": 60.00,
    "Nieporęt": 90.00,
    "Ząbki": 30.00,
    "Blonie": 50.00,
    "Stare Babice": 30.00,
    "Brwinów": 50.00,
    "Grodzisk Mazowiecki": 60.00,
    "Marki": 30.00,
    "Raszyn": 25.00,
    "Łomianki": 40.00,
    "Łazy": 50.00,
    "Nowa Iwiczna": 50.00,
    "Wólka": 40.00,
    "Konstancin-Jeziorna": 50.00,
    "Jabłonna": 40.00,
    "Nowy Dwór Mazowiecki": 75.00,
    "Młociny": 60.00,
    "Sołec": 80.00,
    "Leszno": 80.00,
    "Milanówek": 50.00,
    "Izabelin": 70.00,
    "Nadarzyn": 80.00,
    "Żyrardów": 90.00,
    "Wola Krakowska": 100.00,
    "Radzymin": 75.00,
    "Mińsk Mazowiecki": 80.00,
    "Nowa Wola": 60.00,
    "Janki": 45.00,
    "Góra Kalwaria": 100.00,
    "Mysiadło": 40.00,
    "Władysławów": 30.00,
    "Ustanów": 90.00,
  };

  const filteredCities = Object.entries(cities).filter(([city]) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [intercomCode, setIntercomCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

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

  const paidServices = [
    { id: 1, name: "Mycie piekarnika", price: 32.00, oldPrice: 40.00, icon: "/icon/oven.png", type: "checkbox", additionalTime: 20 },
    { id: 2, name: "Mycie okapu", price: 32.00, oldPrice: 40.00, icon: "/icon/hood.png", type: "checkbox", additionalTime: 20 },
    { id: 3, name: "Sprzątanie wnętrza szafek kuchennych", price: 52.00, oldPrice: 65.00, icon: "/icon/cupboard.png", type: "checkbox", additionalTime: 20 },
    { id: 4, name: "Mycie naczyń", price: 20.00, oldPrice: 25.00, icon: "/icon/dishes.png", type: "checkbox", additionalTime: 20 },
    { id: 5, name: "Czyszczenie lodówki", price: 32.00, oldPrice: 40.00, icon: "/icon/fridge.png", type: "checkbox", additionalTime: 20 },
    { id: 6, name: "Mycie mikrofalówki", price: 14.40, oldPrice: 18.00, icon: "/icon/microwave.png", type: "checkbox", additionalTime: 20 },
    { id: 7, name: "Sprzątanie balkonu", price: 28.00, oldPrice: 35.00, icon: "/icon/balcony.png", type: "quantity", additionalTime: 20 },
    { id: 8, name: "Mycie okien (szt.)", price: 32.00, oldPrice: 40.00, icon: "/icon/window.png", type: "quantity", additionalTime: 20 },
    { id: 9, name: "Prasowanie", price: 40.00, oldPrice: 50.00, icon: "/icon/iron.png", type: "quantity", additionalTime: 20 },
    { id: 10, name: "Sprzątanie kuwety", price: 8.00, oldPrice: 10.00, icon: "/icon/pets.png", type: "quantity", additionalTime: 20 },
    { id: 11, name: "Dodatkowe godziny", price: 40.00, oldPrice: 50.00, icon: "/icon/time.png", type: "quantity", additionalTime: 20 },
    { id: 12, name: "Czyszczenie wnętrza szafy", price: 44.00, oldPrice: 30.00, icon: "/icon/wardrobe.png", type: "quantity", additionalTime: 20 },
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
    },
    // Додаткові мови (ru, en) можна додати за потреби
  };

  const t = texts[lang] || texts.pl;

  const calendarRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const agreementRef = useRef(null);
  const rightBlockRef = useRef(null);
  const [isSticked, setIsSticked] = useState(true);

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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsSticked(false);
        else setIsSticked(true);
      },
      { root: null, threshold: 0.2 }
    );
    if (rightBlockRef.current) observer.observe(rightBlockRef.current);
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
    if (agreeToTerms && agreeToMarketing && agreementRef.current) {
      agreementRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [agreeToTerms, agreeToMarketing]);

  function handleKitchenChange(e) {
    setKitchen(e.target.checked);
    if (e.target.checked) {
      setKitchenAnnex(false);
      setKitchenCost(kitchenBaseCost);
      console.log("Обрано прибирання кухні: так");
    } else {
      console.log("Обрано прибирання кухні: ні");
    }
  }

  function handleKitchenAnnexChange(e) {
    setKitchenAnnex(e.target.checked);
    if (e.target.checked) {
      setKitchen(false);
      setKitchenCost(kitchenBaseCost - 10);
      console.log("Обрано прибирання кухонного куточка: так");
    } else {
      setKitchen(true);
      setKitchenCost(kitchenBaseCost);
      console.log("Обрано прибирання кухонного куточка: ні");
    }
  }

  function handlePromoApply() {
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
  }

  function handlePrevMonth() {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    console.log(`Перехід до попереднього місяця: ${months[newMonth]} ${newYear}`);
  }

  function handleNextMonth() {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    console.log(`Перехід до наступного місяця: ${months[newMonth]} ${newYear}`);
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
    console.log(`Розрахунок базової ціни: ${total.toFixed(2)} zł (кімнати: ${rooms}, ванні: ${bathrooms}, кухня: ${kitchen ? "так" : "ні"}, куточок: ${kitchenAnnex ? "так" : "ні"}, пилосос: ${vacuumNeeded ? "так" : "ні"}, місто: ${selectedCity}, множник: ${clientType === "Firma" ? companyMultiplier : 1})`);
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
    console.log(`Розрахунок загальної ціни: ${finalTotal} zł (знижка: ${appliedDiscount}%, сума знижки: ${discountAmount.toFixed(2)} zł)`);
    return finalTotal;
  }

  function calculateStrikethroughPrice() {
    const strikethroughPrice = (parseFloat(calculateTotal()) * 1.25).toFixed(2);
    console.log(`Розрахунок перекресленої ціни: ${strikethroughPrice} zł`);
    return strikethroughPrice;
  }

  function calculateWorkTime() {
    let baseHours = 4.33;
    const hasAdditionalServices = paidServices.some((service) => {
      const qty = selectedServices[service.id];
      return (service.type === "checkbox" && qty) || (service.type === "quantity" && qty > 0);
    });

    if (hasAdditionalServices) {
      baseHours = 0;
    }

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
    console.log(`Розрахунок часу роботи: ${totalTime} годин (кімнати: ${roomTime}, ванні: ${bathroomTime}, додаткові послуги: ${additionalServiceTime})`);
    return totalTime;
  }

  function calculateCleanersAndTime() {
    const totalHours = calculateWorkTime();
    const cleaners = Math.ceil(totalHours / 9);
    const adjustedHours = totalHours / cleaners;
    const hours = Math.floor(adjustedHours);
    const minutes = Math.round((adjustedHours - hours) * 60);
    console.log(`Розрахунок прибиральників: ${cleaners}, час: ${hours} год ${minutes} хв`);
    return { hours, minutes, cleaners };
  }

  function formatWorkTime() {
    const { hours, minutes } = calculateCleanersAndTime();
    return minutes > 0 ? `${hours} godzin ${minutes} minut` : `${hours} godziny`;
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
  }

  function formatSelectedDate() {
    if (!selectedDate) return "";
    const day = selectedDate.getDate();
    const month = months[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const handleServiceToggle = (id) => {
    const service = paidServices.find((s) => s.id === id);
    if (service.type === "checkbox") {
      setSelectedServices((prev) => {
        const newState = { ...prev, [id]: !prev[id] };
        console.log(`Послугу "${service.name}" ${!prev[id] ? "додано" : "видалено"}`);
        return newState;
      });
    } else if (service.type === "quantity") {
      setSelectedServices((prev) => {
        const newState = { ...prev, [id]: prev[id] === 0 ? 1 : 0 };
        console.log(`Послугу "${service.name}" ${prev[id] === 0 ? "додано" : "видалено"}`);
        return newState;
      });
    }
  };

  const handleQuantityChange = (id, delta) => {
    setSelectedServices((prev) => {
      const newQty = Math.max(0, prev[id] + delta);
      const service = paidServices.find((s) => s.id === id);
      console.log(`Кількість послуги "${service.name}" змінено на: ${newQty}`);
      return { ...prev, [id]: newQty };
    });
  };

  async function handleOrder() {
    console.log("Початок обробки замовлення...");

    if (!selectedDate) {
      calendarRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Дата не обрана");
      setError("Proszę wybrać datę sprzątania.");
      return;
    }
    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Час не обраний");
      setError("Proszę wybrać godzinę sprzątania.");
      return;
    }
    if (!agreeToTerms || !agreeToMarketing) {
      agreementRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Не погоджено з умовами або маркетингом");
      setError("Proszę zaakceptować regulamin i zgodę na przetwarzanie danych.");
      return;
    }

    const orderData = {
      order_type: "private_house", // Додаємо order_type для таблиці orders
      clientType,
      rooms,
      bathrooms,
      kitchen,
      kitchenAnnex,
      vacuumNeeded,
      selectedServices: paidServices
        .filter(
          (service) =>
            (service.type === "checkbox" && selectedServices[service.id]) ||
            (service.type === "quantity" && selectedServices[service.id] > 0)
        )
        .map((service) => ({
          name: service.name,
          price: service.price,
          quantity: selectedServices[service.id],
        })),
      totalPrice: calculateTotal(),
      selectedDate: selectedDate.toISOString(),
      selectedTime,
      cleaningFrequency,
      city: selectedCity,
      address: {
        street,
        postalCode,
        houseNumber,
        apartmentNumber,
        building,
        floor,
        intercomCode,
      },
      clientInfo: {
        name,
        phone,
        email,
        additionalInfo,
      },
      payment_status: "pending", // Додаємо статус платежу
    };

    console.log("Дані замовлення:", orderData);

    try {
      // 1. Створюємо замовлення
      console.log("Відправка запиту на створення замовлення...");
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Не вдалося створити замовлення.");
      }

      const { orderId } = await response.json();
      console.log(`Замовлення створено з ID: ${orderId}`);

      // 2. Ініціалізуємо платіж через PayU
      const amount = parseFloat(calculateTotal());
      console.log(`Ініціалізація платежу PayU для суми: ${amount} zł...`);
      const paymentResponse = await fetch("http://localhost:3001/api/create-payu-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          email: orderData.clientInfo.email,
          phone: orderData.clientInfo.phone,
          firstName: orderData.clientInfo.name?.split(" ")[0] || "Jan",
          lastName: orderData.clientInfo.name?.split(" ")[1] || "Kowalski",
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Не вдалося ініціалізувати платіж.");
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
  }

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
                className={clientType === "Osoba prywatna" ? css.active : ""}
                onClick={() => {
                  setClientType("Osoba prywatna");
                  console.log("Обрано тип клієнта: Фізична особа");
                }}
              >
                {t.userTypePrivate}
              </button>
              <button
                className={clientType === "Firma" ? css.active : ""}
                onClick={() => {
                  setClientType("Firma");
                  console.log("Обрано тип клієнта: Компанія");
                }}
              >
                {t.userTypeCompany}
              </button>
            </div>

            <div className={css["quantity-selector"]}>
              <div className={css.counter}>
                <button
                  className={css["counter-button"]}
                  onClick={() => {
                    setRooms(Math.max(1, rooms - 1));
                    console.log(`Кількість кімнат змінена: ${Math.max(1, rooms - 1)}`);
                  }}
                >
                  −
                </button>
                <span className={css["counter-value"]}>{rooms}</span>
                <span className={css["counter-label"]}>
                  {rooms === 1 ? t.roomsLabel : rooms >= 2 && rooms <= 4 ? t.roomsLabel2 : t.roomsLabel5}
                </span>
                <button
                  className={css["counter-button"]}
                  onClick={() => {
                    setRooms(rooms + 1);
                    console.log(`Кількість кімнат змінена: ${rooms + 1}`);
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
                    console.log(`Кількість ванних кімнат змінена: ${Math.max(1, bathrooms - 1)}`);
                  }}
                >
                  −
                </button>
                <span className={css["counter-value"]}>{bathrooms}</span>
                <span className={css["counter-label"]}>
                  {bathrooms === 1
                    ? t.bathroomsLabel
                    : bathrooms >= 2 && bathrooms <= 4
                    ? t.bathroomsLabel2
                    : t.bathroomsLabel5}
                </span>
                <button
                  className={css["counter-button"]}
                  onClick={() => {
                    setBathrooms(bathrooms + 1);
                    console.log(`Кількість ванних кімнат змінена: ${bathrooms + 1}`);
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <p className={css.note}>
              {t.note}
            </p>

            <div className={css["additional-services"]}>
              <h4>{t.additionalServices}</h4>
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
                      {t.kitchenLabel}
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
                        {t.kitchenAnnexLabel}
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
                      console.log(`Потрібен пилосос: ${e.target.checked}`);
                    }}
                    className={css["custom-checkbox"]}
                  />
                </div>
                <div className={css["text-price-wrapper"]}>
                  <div>
                    <p>{t.vacuumNotice}</p>
                    <p>{t.vacuumNotice2}</p>
                  </div>
                  <button className={css["vacuum-price"]}>{t.vacuumPrice}</button>
                </div>
              </label>
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

            <div className={css["frequency-section"]}>
              <h4>{t.frequencyTitle}</h4>
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
                        console.log(`Обрана частота прибирання: ${freq} (-${freqDiscount}%)`);
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
              <h4>{t.paidServicesTitle}</h4>
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
                    <p>{service.name}</p>
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
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.nameLabel}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        console.log(`Введено ім'я: ${e.target.value}`);
                      }}
                      className={`${css["contact-input"]} ${name ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.phoneLabel}</label>
                    <input
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

          <div className={css["calculator-right"]} ref={rightBlockRef}>
            <h2>
              Sprzątanie domu z {rooms}{" "}
              {rooms === 1 ? t.roomsLabel : rooms >= 2 && rooms <= 4 ? t.roomsLabel2 : t.roomsLabel5}{" "}
              i {bathrooms}{" "}
              {bathrooms === 1
                ? t.bathroomsLabel
                : bathrooms >= 2 && bathrooms <= 4
                ? t.bathroomsLabel2
                : t.bathroomsLabel5}
              {kitchen ? ", kuchnia" : kitchenAnnex ? ", aneks kuchenny" : ""}, przedpokój
              <br />
              {calculateBasePrice()} zł
            </h2>

            <div className={css["location-info"]}>
              <h4>{t.locationLabel}</h4>
              <p>{selectedCity}</p>
            </div>

            <div className={css["specialist-info"]}>
              <img src="/icon/bucket.svg" alt="Specialists" />
              <p>{t.specialistInfo}</p>
            </div>

            <h4>{t.workTimeLabel}: {formatWorkTime()}</h4>
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
                  {discounts[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`] && (
                    <span className={css["discount-inline"]}>
                      -{discounts[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`]}%
                    </span>
                  )}
                </p>
              ) : (
                <p>{t.datePlaceholder}</p>
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
              <p>{t.locationCostLabel}: +{cities[selectedCity].toFixed(2)} zł</p>
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
                        {service.name}
                        {service.type === "quantity" &&
                          ` (${selectedServices[service.id]}${
                            service.id === 9 || service.id === 11 ? " god" : "x"
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
                    <p>{t.vacuumNotice2}</p>
                  </div>
                  <div className={css["service-price"]}>
                    <p>{vacuumCost.toFixed(2)} zł</p>
                  </div>
                  <button
                    className={css["remove-btn"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVacuumNeeded(false);
                      console.log("Пилосос видалено з замовлення");
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

              <button
                className={`${css["sticky-order-button"]} ${isSticked ? css.sticked : ""}`}
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