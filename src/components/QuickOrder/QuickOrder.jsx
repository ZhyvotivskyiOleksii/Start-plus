"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import css from "./QuickOrder.module.css";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaQuestionCircle, FaPercentage, FaTimes } from "react-icons/fa";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

const translations = {
  pl: {
    title: "Szybkie Zamówienie",
    standardTitle: "Standardowe",
    generalTitle: "Generalne",
    categoryLabel: "Kategoria sprzątania:",
    categoryStandard: "Standardowe",
    categoryGeneral: "Generalne",
    estimatedPrice: "Szacowana cena: ",
    priceUnit: " PLN",
    formTitle: "Wypełnij dane do zamówienia",
    streetLabel: "Ulica:",
    houseNumberLabel: "Numer domu:",
    cityLabel: "Miasto:",
    nameLabel: "Imię:",
    phoneLabel: "Numer telefonu:",
    emailLabel: "Adres e-mail:",
    dateLabel: "Data sprzątania:",
    timeLabel: "Godzina:",
    notesLabel: "Uwagi (opcjonalne):",
    confirmButton: "Potwierdź zamówienie",
    summaryTitle: "Podsumowanie zamówienia",
    additionalServices: "Dodatkowe usługi",
    errorMessage: "Proszę wypełnić wszystkie wymagane pola: ",
    invalidEmail: "Proszę wprowadzić prawidłowy adres e-mail.",
    orderError: "Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.",
    selectDateTime: "Wybierz termin i godzinę",
    todayLabel: "dziś",
    tomorrowLabel: "jutro",
    pastLabel: "niedostępny",
    calendarFooter: "Można zacząć w dowolnym momencie",
    modalTitle: "Co zawiera sprzątanie?",
    standardCleaningTitle: "Sprzątanie standardowe (od 3h)",
    standardCleaningDescription: "Poniżej prezentujemy listę kontrolną, zawierającą kompleksowy zakres elementów, które zostaną wykonane w ramach tej usługi.",
    generalCleaningTitle: "Sprzątanie generalne (od 4.5h)",
    generalCleaningDescription: "Poniżej prezentujemy listę kontrolną, zawierającą kompleksowy zakres elementów, które zostaną wykonane w ramach tej usługi.",
    roomsAndBedroom: "Pokoje i sypialnia + korytarz",
    standardRooms: [
      "Wytarcie kurzu z powierzchni łatwo dostępnych: półki, ramki do zdjęć, gniazdka i wyłączniki, parapety, sprzęt RTV, meble",
      "Umycie luster",
      "Odkurzenie",
      "Umycie podłogi",
    ],
    kitchen: "Kuchnia",
    standardKitchen: [
      "Wytarcie kurzu z powierzchni łatwo dostępnych",
      "Umycie blatów kuchennych",
      "Umycie sprzętów AGD z zewnątrz",
      "Umycie lub wstawienie brudnych naczyń do zmywarki",
      "Opróżnienie kosza na śmieci",
      "Włożenie nowego worka na śmieci",
      "Odkurzenie",
      "Umycie podłogi",
      "Wyniesienie śmieci*",
    ],
    bathroom: "Łazienka",
    standardBathroom: [
      "Wytarcie kurzu z powierzchni łatwo dostępnych",
      "Umycie luster",
      "Staranne rozwieszenie ręczników",
      "Umycie kubka na szczoteczki",
      "Umycie i dezynfekcja sanitariatów, kabiny prysznicowej/wanny, umywalki",
      "Opróżnienie kosza na śmieci",
      "Odkurzenie",
      "Umycie podłogi",
    ],
    generalRooms: [
      "Wytarcie kurzu z powierzchni łatwo dostępnych: półki, ramki do zdjęć, gniazdka i wyłączniki, parapety, sprzęt RTV, meble, drzwi, futryny, lampy, kratki wentylacyjne, pod łóżkiem, na szafkach",
      "Umycie luster",
      "Złożenie rzeczy leżących na wierzchu",
      "Zmiana pościeli*",
      "Odkurzenie i umycie podłogi",
    ],
    generalKitchen: [
      "Wytarcie kurzu z powierzchni łatwo dostępnych",
      "Wytarcie opraw oświetleniowych",
      "Wytarcie obudowy okapu*",
      "Wytarcie szafek wewnątrz",
      "Umycie blatów kuchennych",
      "Umycie sprzętów AGD (wewnątrz i z zewnątrz)*",
      "Umycie lub wstawienie brudnych naczyń do zmywarki",
      "Opróżnienie kosza na śmieci/wymiana worka na śmieci",
      "Odkurzenie",
      "Umycie podłogi",
      "Wyniesienie śmieci*",
    ],
    generalBathroom: [
      "Wytarcie kurzu z powierzchni łatwo dostępnych",
      "Wytarcie opraw oświetleniowych",
      "Wytarcie kurzu z półek, układanie na miejsce kosmetyków",
      "Staranne rozwieszenie ręczników",
      "Umycie kubka na szczoteczki",
      "Umycie luster",
      "Umycie glazury oraz fug*",
      "Umycie kaloryfera",
      "Umycie i dezynfekcja sanitariatów, kabiny prysznicowej/wanny, umywalki",
      "Opróżnienie kosza na śmieci",
      "Odkurzenie",
      "Umycie podłogi",
    ],
    extraServices: "Dodatkowe usługi",
    extraServicesList: [
      "Prasowanie",
    ],
    notIncluded: "Czego nie robimy podczas sprzątania:",
    notIncludedList: [
      "Nie dźwigamy ciężkich mebli",
      "Nie czyścimy chemicznie dywanów",
      "Nie myjemy ścian",
      "Nie usuwamy głębokich plam i nie czyścimy parą",
      "Nie sprzątamy ogródków",
      "Nie sprzątamy w trudno dostępnych miejscach",
      "Nie odkamieniamy",
      "Nie wieszamy zasłon",
    ],
    optionalNote: "* Usługi wykonywane na życzenie Klienta. Prosimy o ich uwzględnienie w czasie sprzątania.",
    cleaningDetailsLabel: "Co się wlicza do sprzątania mieszkania",
    roomsLabel: "pokój",
    roomsPluralLabel: "pokoje",
    roomsPluralMoreLabel: "pokoi",
    bathroomsLabel: "łazienka",
    bathroomsPluralLabel: "łazienki",
    bathroomsPluralMoreLabel: "łazienek",
    kitchenLabel: ", kuchnia",
    hallwayLabel: ", przedpokój",
    locationLabel: "Lokalizacja",
    specialistsLabel: "Nasi wykonawcy posiadają wszystkie niezbędne środki czystości oraz sprzęt.",
    workTimeLabel: "Przybliżony czas pracy: ",
    frequencyLabel: "Jednorazowe sprzątanie",
    travelCostLabel: "Dodatkowy koszt dojazdu: ",
    promoCodeLabel: "Promokod",
    applyPromoLabel: "Zastosuj",
    totalLabel: "Do zapłaty: ",
    orderButtonLabel: "Zamawiam za ",
    termsAgreement: "Składając zamówienie zgadzam się z Regulaminem i Polityką prywatności.",
    dataProcessingAgreement: "Wyrażam zgodę na przetwarzanie moich danych osobowych przez administratora",
  },
};

export default function QuickOrder({ lang = "pl" }) {
  const {
    title,
    standardTitle,
    generalTitle,
    categoryLabel,
    categoryStandard,
    categoryGeneral,
    estimatedPrice,
    priceUnit,
    formTitle,
    streetLabel,
    houseNumberLabel,
    cityLabel,
    nameLabel,
    phoneLabel,
    emailLabel,
    dateLabel,
    timeLabel,
    notesLabel,
    confirmButton,
    summaryTitle,
    additionalServices,
    errorMessage,
    invalidEmail,
    orderError,
    selectDateTime,
    todayLabel,
    tomorrowLabel,
    pastLabel,
    calendarFooter,
    modalTitle,
    standardCleaningTitle,
    standardCleaningDescription,
    generalCleaningTitle,
    generalCleaningDescription,
    roomsAndBedroom,
    standardRooms,
    kitchen,
    standardKitchen,
    bathroom,
    standardBathroom,
    generalRooms,
    generalKitchen,
    generalBathroom,
    extraServices,
    extraServicesList,
    notIncluded,
    notIncludedList,
    optionalNote,
    cleaningDetailsLabel,
    roomsLabel,
    roomsPluralLabel,
    roomsPluralMoreLabel,
    bathroomsLabel,
    bathroomsPluralLabel,
    bathroomsPluralMoreLabel,
    kitchenLabel,
    hallwayLabel,
    locationLabel,
    specialistsLabel,
    workTimeLabel,
    frequencyLabel,
    travelCostLabel,
    promoCodeLabel,
    applyPromoLabel,
    totalLabel,
    orderButtonLabel,
    termsAgreement,
    dataProcessingAgreement,
  } = translations[lang] || translations.pl;

  const navigate = useNavigate();
  const location = useLocation();
  const api = axios.create({ baseURL: API });

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "standard";

  const [category, setCategory] = useState(initialCategory);
  const [rooms, setRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("Warszawa");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookedDates] = useState(new Set(["2025-03-15"]));
  const [discounts, setDiscounts] = useState({});
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoCodes, setPromoCodes] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [agreeToMarketing, setAgreeToMarketing] = useState(true);

  const streetRef = useRef(null);
  const houseNumberRef = useRef(null);
  const cityRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const calendarRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const agreementRef = useRef(null);
  const orderButtonRef = useRef(null);
  const sentinelRef = useRef(null);

  const cities = {
    Warszawa: 0.0,
    Piastów: 30.0,
    Pruszków: 30.0,
    Piaseczno: 30.0,
    Sulejówek: 40.0,
    Józefów: 70.0,
    Kobyłka: 50.0,
    "Ożarów Mazowiecki": 50.0,
    Otwock: 70.0,
    Zielonka: 40.0,
    Legionowo: 40.0,
    Józefosław: 60.0,
    Nieporęt: 90.0,
    Ząbki: 30.0,
    Blonie: 50.0,
    "Stare Babice": 30.0,
    Brwinów: 50.0,
    "Grodzisk Mazowiecki": 60.0,
    Marki: 30.0,
    Raszyn: 25.0,
    Łomianki: 40.0,
    Łazy: 50.0,
    "Nowa Iwiczna": 50.0,
    Wólka: 40.0,
    "Konstancin-Jeziorna": 50.0,
    Jabłonna: 40.0,
    "Nowy Dwór Mazowiecki": 75.0,
    Młociny: 60.0,
    Sołec: 80.0,
    Leszno: 80.0,
    Milanówek: 50.0,
    Izabelin: 70.0,
    Nadarzyn: 80.0,
    Żyrardów: 90.0,
    "Wola Krakowska": 100.0,
    Radzymin: 75.0,
    "Mińsk Mazowiecki": 80.0,
    "Nowa Wola": 60.0,
    Janki: 45.0,
    "Góra Kalwaria": 100.0,
    Mysiadło: 40.0,
    Władysławów: 30.0,
    Ustanów: 90.0,
  };

  const availableTimes = [
    "7:30",
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const months = [
    "styczeń",
    "luty",
    "marzec",
    "kwiecień",
    "maj",
    "czerwiec",
    "lipiec",
    "sierpień",
    "wrzesień",
    "październik",
    "listopad",
    "grudzień",
  ];

  const basePriceStandard = 184.9;
  const basePriceGeneral = 231.1;
  const roomCost = 50.0;
  const bathroomCost = 30.0;
  const kitchenBaseCost = 10.0;

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const { data } = await api.get("/discounts");
        const discountMap = data.reduce((acc, discount) => {
          const date = new Date(discount.date);
          const formattedDate = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          return { ...acc, [formattedDate]: discount.percentage };
        }, {});
        setDiscounts(discountMap);
      } catch {
        console.error("Failed to fetch discounts");
      }
    };

    const fetchPromoCodes = async () => {
      try {
        const { data } = await api.get("/promo-codes");
        setPromoCodes(data);
      } catch {
        console.error("Failed to fetch promo codes");
      }
    };

    fetchDiscounts();
    fetchPromoCodes();
  }, []);

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      calendarRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime && timeSlotsRef.current) {
      timeSlotsRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [selectedTime]);

  useEffect(() => {
    if (street && streetRef.current) {
      streetRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [street]);

  useEffect(() => {
    if (houseNumber && houseNumberRef.current) {
      houseNumberRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [houseNumber]);

  useEffect(() => {
    if (city && cityRef.current) {
      cityRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [city]);

  useEffect(() => {
    if (name && nameRef.current) {
      nameRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [name]);

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
      agreementRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [agreeToTerms, agreeToMarketing]);

  useEffect(() => {
    if (window.innerWidth > 760) return;

    const marker = sentinelRef.current;
    const button = orderButtonRef.current;
    if (!marker || !button) {
      console.log("Refs not found:", { marker, button });
      return;
    }

    const stick = () => {
      button.classList.add(css.sticked);
      button.classList.remove(css.inPlace);
    };
    const unstick = () => {
      button.classList.remove(css.sticked);
      button.classList.add(css.inPlace);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting ? unstick() : stick();
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `0px 0px -${button.offsetHeight + 16}px 0px`,
      }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  function handlePrevMonth() {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  }

  function handleNextMonth() {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  }

  function calculateBasePrice() {
    const basePrice = category === "standard" ? basePriceStandard : basePriceGeneral;
    let total = basePrice;
    total += (rooms - 1) * roomCost;
    total += (bathrooms - 1) * bathroomCost;
    total += kitchenBaseCost;
    total += cities[city] || 0;
    return total.toFixed(2);
  }

  function calculateTotal() {
    let total = parseFloat(calculateBasePrice());
    let appliedDiscount = discount;
    if (selectedDate) {
      const date = new Date(selectedDate);
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const dateDiscount = discounts[formattedDate] || 0;
      appliedDiscount = Math.max(appliedDiscount, dateDiscount);
    }
    const discountAmount = total * (appliedDiscount / 100);
    return (total - discountAmount).toFixed(2);
  }

  function calculateStrikethroughPrice() {
    return (parseFloat(calculateTotal()) * 1.25).toFixed(2);
  }

  function calculateWorkTime() {
    let baseHours = category === "standard" ? 3 : 4.5;
    const additionalRooms = Math.max(0, rooms - 1);
    const roomTime = additionalRooms * 0.5;
    const additionalBathrooms = Math.max(0, bathrooms - 1);
    const bathroomTime = additionalBathrooms * 1;
    return baseHours + roomTime + bathroomTime;
  }

  function formatWorkTime() {
    const totalHours = calculateWorkTime();
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return minutes > 0
      ? `${hours} godzin ${minutes} minut`
      : `${hours} godziny`;
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
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const discountValue = discounts[formattedDate] || 0;
      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();
      const isPast = date < today && !isToday;
      const isBooked = bookedDates.has(formattedDate);
      const isSelected =
        selectedDate && selectedDate.toDateString() === date.toDateString();
      const isSelectable = !isPast && !isToday && !isTomorrow && !isBooked;

      days.push(
        <div
          key={day}
          className={`
            ${css["calendar-day"]}
            ${!isSelectable ? css.disabled : ""}
            ${isSelected ? css.selected : ""}
            ${discountValue ? css.discount : ""}
            ${isPast ? css.past : ""}
            ${isToday ? css.today : ""}
            ${isTomorrow ? css.tomorrow : ""}
            ${isSelectable ? css.hoverable : ""}
          `}
          onClick={() => isSelectable && setSelectedDate(date)}
        >
          <span className={css["day-number"]}>{day}</span>
          {discountValue > 0 && (
            <span className={css["discount-label"]}>-{discountValue}%</span>
          )}
          {isToday && <span className={css["day-label"]}>{todayLabel}</span>}
          {isTomorrow && <span className={css["day-label"]}>{tomorrowLabel}</span>}
          {isPast && <span className={css["day-label"]}>{pastLabel}</span>}
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

  function handlePromoApply() {
    const promoCode = promoCodes.find(
      (code) => code.code === promo.toUpperCase()
    );
    if (promoCode) {
      setDiscount(promoCode.discount);
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  }

  const handleConfirmOrder = async () => {
    const missingFields = [];

    if (!street) {
      streetRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(streetLabel);
    }
    if (!houseNumber) {
      houseNumberRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(houseNumberLabel);
    }
    if (!city) {
      cityRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(cityLabel);
    }
    if (!name) {
      nameRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(nameLabel);
    }
    if (!phone) {
      phoneRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(phoneLabel);
    }
    if (!email) {
      emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(emailLabel);
    }
    if (!selectedDate) {
      calendarRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(dateLabel);
    }
    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(timeLabel);
    }

    if (missingFields.length > 0) {
      setError(`${errorMessage}${missingFields.join(", ")}.`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(invalidEmail);
      emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      emailRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const formattedDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    const orderData = {
      order_type: "quick_order",
      total_price: parseFloat(calculateTotal()),
      city: city,
      address: {
        street: street,
        house_number: houseNumber,
      },
      client_info: {
        name: name,
        phone: phone,
        email: email,
        additional_info: notes,
      },
      payment_status: "pending",
      selected_date: formattedDate,
      selected_time: selectedTime,
      cleaning_category: category,
      rooms: rooms,
      bathrooms: bathrooms,
    };

    try {
      const response = await api.post("/orders", orderData);
      const { orderId } = response.data;

      if (!orderId) {
        throw new Error("Failed to get orderId from /api/orders response");
      }

      const paymentResponse = await api.post("/create-payu-payment", {
        order_id: orderId,
        total_price: parseFloat(calculateTotal()),
        description: `Quick Order #${orderId}`,
        client_email: orderData.client_info.email,
        client_phone: orderData.client_info.phone,
        client_info: {
          name: orderData.client_info.name || "Client Name",
        },
      });

      const { redirectUri } = paymentResponse.data;

      if (!redirectUri) {
        throw new Error("Failed to get redirectUri from /api/create-payu-payment response");
      }

      window.location.href = redirectUri;
    } catch (error) {
      console.error("Error during order handling:", error);
      setError(error.response?.data?.error || orderError);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        <h2 className={css["cacl-title"]}>
          {title} {category === "standard" ? standardTitle : generalTitle}
        </h2>
      </div>

      <section className={css["calculator-impuls"]}>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            <div className={css["quantity-selector"]}>
              <div className={css.counter}>
                <button
                  className={css["counter-button"]}
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                >
                  −
                </button>
                <span className={css["counter-value"]}>{rooms}</span>
                <span className={css["counter-label"]}>
                  {rooms === 1
                    ? roomsLabel
                    : rooms >= 2 && rooms <= 4
                    ? roomsPluralLabel
                    : roomsPluralMoreLabel}
                </span>
                <button
                  className={css["counter-button"]}
                  onClick={() => setRooms(rooms + 1)}
                >
                  +
                </button>
              </div>

              <div className={css.counter}>
                <button
                  className={css["counter-button"]}
                  onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                >
                  −
                </button>
                <span className={css["counter-value"]}>{bathrooms}</span>
                <span className={css["counter-label"]}>
                  {bathrooms === 1
                    ? bathroomsLabel
                    : bathrooms >= 2 && bathrooms <= 4
                    ? bathroomsPluralLabel
                    : bathroomsPluralMoreLabel}
                </span>
                <button
                  className={css["counter-button"]}
                  onClick={() => setBathrooms(bathrooms + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className={css["calendar-section"]} ref={calendarRef}>
              <div className={css["calendar-header-container"]}>
                <h4>{dateLabel.toUpperCase()}</h4>
                <div className={css["info-container"]}>
                  <FaQuestionCircle
                    className={css["info-icon"]}
                    onClick={openModal}
                    title="Co zawiera sprzątanie?"
                  />
                  <span className={css["info-label"]}>{cleaningDetailsLabel}</span>
                </div>
              </div>
              <div className={css["calendar-container"]}>
                <div className={css["calendar-time-wrapper"]}>
                  <div className={css["calendar-wrapper"]}>
                    <div className={css["calendar-header"]}>
                      <button
                        onClick={handlePrevMonth}
                        className={css["nav-button"]}
                      >
                        <FaChevronLeft />
                      </button>
                      <h5>
                        {months[currentMonth]} {currentYear}
                      </h5>
                      <button
                        onClick={handleNextMonth}
                        className={css["nav-button"]}
                      >
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
                    <h5>{timeLabel}</h5>
                    <div className={css["time-slots"]}>
                      {availableTimes.map((slot) => (
                        <button
                          key={slot}
                          className={`${css["time-slot"]} ${
                            selectedTime === slot ? css.selected : ""
                          }`}
                          onClick={() => setSelectedTime(slot)}
                          disabled={!selectedDate}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={css["calendar-footer"]}>
                  <p>{calendarFooter}</p>
                </div>
              </div>
            </div>

            <div className={css["address-section"]}>
              <h4>WPROWADŹ SWÓJ ADRES</h4>
              <div className={css["address-fields"]}>
                <div className={css["address-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{streetLabel}</label>
                    <input
                      ref={streetRef}
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className={`${css["address-input"]} ${street ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{houseNumberLabel}</label>
                    <input
                      ref={houseNumberRef}
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className={`${css["address-input"]} ${houseNumber ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{cityLabel}</label>
                    <input
                      ref={cityRef}
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`${css["address-input"]} ${city ? css.filled : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={css["contact-section"]}>
              <h4>DANE KONTAKTOWE</h4>
              <div className={css["contact-fields"]}>
                <div className={css["contact-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{nameLabel}</label>
                    <input
                      ref={nameRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${css["contact-input"]} ${name ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{phoneLabel}</label>
                    <input
                      ref={phoneRef}
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${css["contact-input"]} ${phone ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{emailLabel}</label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${css["contact-input"]} ${email ? css.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={css["contact-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{notesLabel}</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={`${css["contact-textarea"]} ${notes ? css.filled : ""}`}
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
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className={css["custom-checkbox"]}
                  disabled
                />
                {termsAgreement}
              </label>
              <label className={css["agreement-label"]}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => setAgreeToMarketing(e.target.checked)}
                  className={css["custom-checkbox"]}
                  disabled
                />
                {dataProcessingAgreement}
              </label>
            </div>
          </div>

          <div className={css["calculator-right"]}>
            <h2>
              Sprzątanie mieszkania z {rooms}{" "}
              {rooms === 1
                ? roomsLabel
                : rooms >= 2 && rooms <= 4
                ? roomsPluralLabel
                : roomsPluralMoreLabel}{" "}
              i {bathrooms}{" "}
              {bathrooms === 1
                ? bathroomsLabel
                : bathrooms >= 2 && bathrooms <= 4
                ? bathroomsPluralLabel
                : bathroomsPluralMoreLabel}
              {kitchenLabel}
              {hallwayLabel}
              <br />
              {calculateBasePrice()} zł
            </h2>

            <div className={css["location-info"]}>
              <h4>{locationLabel}</h4>
              <p>{city}</p>
            </div>

            <div className={css["specialist-info"]}>
              <img src="/icon/bucket.png" alt="Specialists" />
              <p>{specialistsLabel}</p>
            </div>

            <h4>
              {workTimeLabel}{" "}
              <span className={css["bold-text"]}>{formatWorkTime()}</span>
            </h4>

            <div className={css["selected-date"]}>
              <FaCalendarAlt className={css["calendar-icon"]} />
              {selectedDate && selectedTime ? (
                <p>
                  {formatSelectedDate()}, {selectedTime}{" "}
                  {selectedDate &&
                    discounts[
                      `${selectedDate.getFullYear()}-${String(
                        selectedDate.getMonth() + 1
                      ).padStart(2, "0")}-${String(
                        selectedDate.getDate()
                      ).padStart(2, "0")}`
                    ] && (
                      <span className={css["discount-inline"]}>
                        -
                        {
                          discounts[
                            `${selectedDate.getFullYear()}-${String(
                              selectedDate.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              selectedDate.getDate()
                            ).padStart(2, "0")}`
                          ]
                        }
                        %
                      </span>
                    )}
                </p>
              ) : (
                <p>{selectDateTime}</p>
              )}
            </div>

            <div className={css["selected-frequency"]}>
              <p>{frequencyLabel}</p>
            </div>

            <div className={css["location-cost"]}>
              <p>
                {travelCostLabel}{" "}
                <span className={css["bold-text"]}>
                  +{(cities[city] || 0).toFixed(2)} zł
                </span>
              </p>
            </div>

            <div className={css["promo-code"]}>
              <div className={css["promo-container"]}>
                <FaPercentage className={css["promo-icon"]} />
                <input
                  type="text"
                  placeholder={promoCodeLabel}
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />
                <button onClick={handlePromoApply}>{applyPromoLabel}</button>
              </div>
            </div>

            <div className={css.total}>
              {error && <p className={css["error-message"]}>{error}</p>}
              <p>
                <strong>{totalLabel}</strong> {calculateTotal()} zł{" "}
                <del>{calculateStrikethroughPrice()} zł</del>
              </p>
              <div ref={sentinelRef} />
              <button
                ref={orderButtonRef}
                className={`${css["sticky-order-button"]} ${css.sticked}`}
                onClick={handleConfirmOrder}
              >
                {orderButtonLabel} {calculateTotal()}{priceUnit}
              </button>
              <div className={css["payment-icons"]}>
                <img src="/icon/visa.svg" alt="Visa" />
                <img src="/icon/money.svg" alt="MasterCard" />
                <img src="/icon/apple-pay.svg" alt="Apple Pay" />
                <img src="/icon/google-pay.svg" alt="Google Pay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className={css["modal-overlay"]} onClick={closeModal}>
          <div className={css["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <button className={css["modal-close-icon"]} onClick={closeModal}>
              <FaTimes />
            </button>
            <h4>{modalTitle}</h4>
            <div className={css["modal-body"]}>
              <div className={css["service-type"]}>
                {category === "standard" ? (
                  <>
                    <h5>{standardCleaningTitle}</h5>
                    <p className={css["service-description"]}>{standardCleaningDescription}</p>
                    <div className={css["service-category"]}>
                      <strong>{roomsAndBedroom}</strong>
                      <ul>
                        {standardRooms.map((item, index) => (
                          <li key={`standard-rooms-${index}`} className={item.includes("*") ? css["optional-service"] : ""}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={css["service-category"]}>
                      <strong>{kitchen}</strong>
                      <ul>
                        {standardKitchen.map((item, index) => (
                          <li key={`standard-kitchen-${index}`} className={item.includes("*") ? css["optional-service"] : ""}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={css["service-category"]}>
                      <strong>{bathroom}</strong>
                      <ul>
                        {standardBathroom.map((item, index) => (
                          <li key={`standard-bathroom-${index}`} className={item.includes("*") ? css["optional-service"] : ""}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <h5>{generalCleaningTitle}</h5>
                    <p className={css["service-description"]}>{generalCleaningDescription}</p>
                    <div className={css["service-category"]}>
                      <strong>{roomsAndBedroom}</strong>
                      <ul>
                        {generalRooms.map((item, index) => (
                          <li key={`general-rooms-${index}`} className={item.includes("*") ? css["optional-service"] : ""}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={css["service-category"]}>
                      <strong>{kitchen}</strong>
                      <ul>
                        {generalKitchen.map((item, index) => (
                          <li key={`general-kitchen-${index}`} className={item.includes("*") ? css["optional-service"] : ""}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={css["service-category"]}>
                      <strong>{bathroom}</strong>
                      <ul>
                        {generalBathroom.map((item, index) => (
                          <li key={`general-bathroom-${index}`} className={item.includes("*") ? css["optional-service"] : ""}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <div className={css["service-type"]}>
                <strong>{extraServices}</strong>
                <ul>
                  {extraServicesList.map((item, index) => (
                    <li key={`extra-services-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={css["service-type"]}>
                <strong>{notIncluded}</strong>
                <ul className={css["not-included-list"]}>
                  {notIncludedList.map((item, index) => (
                    <li key={`not-included-${index}`} className={css["not-included-item"]}>
                      <span className={css["not-included-icon"]}>✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className={css["optional-note"]}>{optionalNote}</p>
            </div>
            <button className={css["modal-close-button"]} onClick={closeModal}>
              Zamknij
            </button>
          </div>
        </div>
      )}
    </section>
  );
}