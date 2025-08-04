"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import css from "./Calculator.module.css";
import {
  FaCalendarAlt,
  FaPercentage,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "https://startplus-clean.com/sms-auth-php/api";

export default function Calculator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [clientType, setClientType] = useState(t("calculator.clientTypePrivate"));
  const [rooms, setRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [kitchen, setKitchen] = useState(true);
  const [kitchenCost, setKitchenCost] = useState(10.0);
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
  const [cleaningFrequency, setCleaningFrequency] = useState(t("calculator.frequencyOneTime"));
  const [vacuumNeeded, setVacuumNeeded] = useState(false);
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
  const [agreeToTerms, setAgreeToTerms] = useState(true); // Зміна за замовчуванням на true
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);
  const [error, setError] = useState("");

  const calendarRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const nameRef = useRef(null);
  const companyNameRef = useRef(null);
  const nipRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const streetRef = useRef(null);
  const houseNumberRef = useRef(null);
  const postalCodeRef = useRef(null);
  const agreementRef = useRef(null);
  const orderButtonRef = useRef(null);
  const sentinelRef = useRef(null);
  const api = axios.create({ baseURL: API });

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

  const filteredCities = Object.entries(cities).filter(([city]) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const frequencyDiscounts = {
    [t("calculator.frequencyWeekly")]: 20,
    [t("calculator.frequencyBiweekly")]: 15,
    [t("calculator.frequencyMonthly")]: 10,
    [t("calculator.frequencyOneTime")]: 0,
  };

  const basePrice = 184.9;
  const roomCost = 50.0;
  const bathroomCost = 30.0;
  const kitchenBaseCost = 10.0;
  const companyMultiplier = 1.23;
  const vacuumCost = 28.0;

  const months = [
    t("calculator.monthJanuary"),
    t("calculator.monthFebruary"),
    t("calculator.monthMarch"),
    t("calculator.monthApril"),
    t("calculator.monthMay"),
    t("calculator.monthJune"),
    t("calculator.monthJuly"),
    t("calculator.monthAugust"),
    t("calculator.monthSeptember"),
    t("calculator.monthOctober"),
    t("calculator.monthNovember"),
    t("calculator.monthDecember"),
  ];
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

  const paidServices = [
    {
      id: 1,
      name: t("calculator.serviceOvenCleaning"),
      price: 32.0,
      oldPrice: 40.0,
      icon: "/icon/oven.png",
      type: "checkbox",
      additionalTime: 30,
    },
    {
      id: 2,
      name: t("calculator.serviceHoodCleaning"),
      price: 32.0,
      oldPrice: 40.0,
      icon: "/icon/hood.png",
      type: "checkbox",
      additionalTime: 25,
    },
    {
      id: 3,
      name: t("calculator.serviceKitchenCabinets"),
      price: 52.0,
      oldPrice: 65.0,
      icon: "/icon/cupboard.png",
      type: "checkbox",
      additionalTime: 45,
    },
    {
      id: 4,
      name: t("calculator.serviceDishWashing"),
      price: 20.0,
      oldPrice: 25.0,
      icon: "/icon/dishes.png",
      type: "checkbox",
      additionalTime: 15,
    },
    {
      id: 5,
      name: t("calculator.serviceFridgeCleaning"),
      price: 32.0,
      oldPrice: 40.0,
      icon: "/icon/fridge.png",
      type: "checkbox",
      additionalTime: 30,
    },
    {
      id: 6,
      name: t("calculator.serviceMicrowaveCleaning"),
      price: 14.4,
      oldPrice: 18.0,
      icon: "/icon/microwave.png",
      type: "checkbox",
      additionalTime: 10,
    },
    {
      id: 7,
      name: t("calculator.serviceBalconyCleaning"),
      price: 28.0,
      oldPrice: 35.0,
      icon: "/icon/balcony.png",
      type: "quantity",
      additionalTime: 40,
    },
    {
      id: 8,
      name: t("calculator.serviceWindowCleaning"),
      price: 32.0,
      oldPrice: 40.0,
      icon: "/icon/window.png",
      type: "quantity",
      additionalTime: 20,
    },
    {
      id: 9,
      name: t("calculator.serviceIroning"),
      price: 40.0,
      oldPrice: 50.0,
      icon: "/icon/iron.png",
      type: "quantity",
      additionalTime: 60,
    },
    {
      id: 10,
      name: t("calculator.servicePetLitter"),
      price: 8.0,
      oldPrice: 10.0,
      icon: "/icon/pets.png",
      type: "quantity",
      additionalTime: 10,
    },
    {
      id: 11,
      name: t("calculator.serviceExtraHours"),
      price: 40.0,
      oldPrice: 50.0,
      icon: "/icon/time.png",
      type: "quantity",
      additionalTime: 60,
    },
    {
      id: 12,
      name: t("calculator.serviceWardrobeCleaning"),
      price: 44.0,
      oldPrice: 30.0,
      icon: "/icon/wardrobe.png",
      type: "quantity",
      additionalTime: 50,
    },
  ];

  const [selectedServices, setSelectedServices] = useState(
    paidServices.reduce(
      (acc, service) => ({
        ...acc,
        [service.id]: service.type === "checkbox" ? false : 0,
      }),
      {}
    )
  );

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

  useEffect(() => {
    const { state } = location;
    if (state?.frequency && frequencyDiscounts[state.frequency] !== undefined) {
      setCleaningFrequency(state.frequency);
    }
  }, [location, frequencyDiscounts]);

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
    if (name && nameRef.current) {
      nameRef.current.classList.remove(css["error-border"], css["shake-anim"]);
    }
  }, [name]);

  useEffect(() => {
    if (companyName && companyNameRef.current) {
      companyNameRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
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
    if (postalCode && postalCodeRef.current) {
      postalCodeRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [postalCode]);

  useEffect(() => {
    if (agreeToTerms && agreeToMarketing && agreementRef.current) {
      agreementRef.current.classList.remove(
        css["error-border"],
        css["shake-anim"]
      );
    }
  }, [agreeToTerms, agreeToMarketing]);

  function handleKitchenChange(e) {
    setKitchen(e.target.checked);
    if (e.target.checked) {
      setKitchenAnnex(false);
      setKitchenCost(kitchenBaseCost);
    }
  }

  function handleKitchenAnnexChange(e) {
    setKitchenAnnex(e.target.checked);
    if (e.target.checked) {
      setKitchen(false);
      setKitchenCost(kitchenBaseCost - 10);
    } else {
      setKitchen(true);
      setKitchenCost(kitchenBaseCost);
    }
  }

  function handlePromoApply() {
    const promoCode = promoCodes.find(
      (code) => code.code === promo.toUpperCase()
    );
    if (promoCode) {
      setDiscount(promoCode.discount);
    } else {
      setDiscount(0);
      alert(t("calculator.invalidPromoCode"));
    }
  }

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
    let total = basePrice;
    total += (rooms - 1) * roomCost;
    total += (bathrooms - 1) * bathroomCost;
    if (kitchen) total += kitchenCost;
    if (kitchenAnnex) total -= 10.0;
    if (vacuumNeeded) total += vacuumCost;
    const servicesCost = paidServices.reduce((sum, service) => {
      const qty = selectedServices[service.id];
      if (service.type === "checkbox" && qty) return sum + service.price;
      if (service.type === "quantity" && qty > 0)
        return sum + service.price * qty;
      return sum;
    }, 0);
    total += servicesCost + (cities[selectedCity] || 0);
    if (clientType === t("calculator.clientTypeCompany")) total *= companyMultiplier;
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
    const freqDiscount = frequencyDiscounts[cleaningFrequency] || 0;
    appliedDiscount = Math.max(appliedDiscount, freqDiscount);
    const discountAmount = total * (appliedDiscount / 100);
    return (total - discountAmount).toFixed(2);
  }

  function calculateStrikethroughPrice() {
    return (parseFloat(calculateTotal()) * 1.25).toFixed(2);
  }

  function calculateWorkTime() {
    let baseHours = 3;
    const additionalRooms = Math.max(0, rooms - 1);
    const roomTime = additionalRooms * 0.5;
    const additionalBathrooms = Math.max(0, bathrooms - 1);
    const bathroomTime = additionalBathrooms * 1;
    const additionalServiceTime = paidServices.reduce((sum, service) => {
      const qty = selectedServices[service.id];
      if (service.type === "checkbox" && qty)
        return sum + service.additionalTime / 60;
      if (service.type === "quantity" && qty > 0)
        return sum + (service.additionalTime / 60) * qty;
      return sum;
    }, 0);
    return baseHours + roomTime + bathroomTime + additionalServiceTime;
  }

  function calculateCleanersAndTime() {
    const totalHours = calculateWorkTime();
    const cleaners = Math.ceil(totalHours / 9);
    const adjustedHours = totalHours / cleaners;
    const hours = Math.floor(adjustedHours);
    const minutes = Math.round((adjustedHours - hours) * 60);
    return { hours, minutes, cleaners };
  }

  function formatWorkTime() {
    const { hours, minutes } = calculateCleanersAndTime();
    return minutes > 0
      ? `${hours} ${t("calculator.hours")} ${minutes} ${t("calculator.minutes")}`
      : `${hours} ${t("calculator.hours")}`;
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
          {isToday && <span className={css["day-label"]}>{t("calculator.today")}</span>}
          {isTomorrow && <span className={css["day-label"]}>{t("calculator.tomorrow")}</span>}
          {isPast && <span className={css["day-label"]}>{t("calculator.unavailable")}</span>}
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

  function handleServiceToggle(id) {
    const service = paidServices.find((s) => s.id === id);
    if (service.type === "checkbox") {
      setSelectedServices((prev) => ({ ...prev, [id]: !prev[id] }));
    } else if (service.type === "quantity") {
      setSelectedServices((prev) => ({
        ...prev,
        [id]: prev[id] === 0 ? 1 : 0,
      }));
    }
  }

  function handleQuantityChange(id, delta) {
    setSelectedServices((prev) => {
      const newQty = Math.max(0, prev[id] + delta);
      return { ...prev, [id]: newQty };
    });
  }

  async function handleOrder() {
    const missingFields = [];

    if (!selectedDate) {
      calendarRef.current?.classList.add(
        css["error-border"],
        css["shake-anim"]
      );
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(t("calculator.date"));
    }

    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(
        css["error-border"],
        css["shake-anim"]
      );
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      missingFields.push(t("calculator.time"));
    }

    if (clientType === t("calculator.clientTypePrivate") && !name) {
      nameRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t("calculator.name"));
    }

    if (clientType === t("calculator.clientTypeCompany") && !companyName) {
      companyNameRef.current?.classList.add(
        css["error-border"],
        css["shake-anim"]
      );
      missingFields.push(t("calculator.companyName"));
    }

    if (clientType === t("calculator.clientTypeCompany") && !nip) {
      nipRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t("calculator.nip"));
    }

    if (!phone) {
      phoneRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t("calculator.phone"));
    }

    if (!email) {
      emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      missingFields.push(t("calculator.email"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setError(t("calculator.invalidEmail"));
      emailRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      emailRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!street) {
      streetRef.current?.classList.add(
        css["error-border"],
        css["shake-anim"]
      );
      missingFields.push(t("calculator.street"));
    }

    if (!houseNumber) {
      houseNumberRef.current?.classList.add(
        css["error-border"],
        css["shake-anim"]
      );
      missingFields.push(t("calculator.houseNumber"));
    }

    if (!postalCode) {
      postalCodeRef.current?.classList.add(
        css["error-border"],
        css["shake-anim"]
      );
      missingFields.push(t("calculator.postalCode"));
    }

    if (!agreeToTerms || !agreeToMarketing) {
      agreementRef.current?.classList.add(
        css["error-border"],
        css["shake-anim"]
      );
      missingFields.push(t("calculator.agreement"));
    }

    if (missingFields.length > 0) {
      const errorMessage = `${t("calculator.missingFields")} ${missingFields.join(", ")}.`;
      setError(errorMessage);
      if (
        missingFields.includes(t("calculator.date")) ||
        missingFields.includes(t("calculator.time"))
      ) {
        calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (
        missingFields.includes(t("calculator.name")) ||
        missingFields.includes(t("calculator.companyName")) ||
        missingFields.includes(t("calculator.nip")) ||
        missingFields.includes(t("calculator.phone")) ||
        missingFields.includes(t("calculator.email"))
      ) {
        nameRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (
        missingFields.includes(t("calculator.street")) ||
        missingFields.includes(t("calculator.houseNumber")) ||
        missingFields.includes(t("calculator.postalCode"))
      ) {
        streetRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const formattedDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    const order_type = rooms > 3 ? "private_house" : "apartment";

    const orderData = {
      order_type: order_type,
      total_price: parseFloat(calculateTotal()),
      city: selectedCity,
      address: {
        street: street,
        postal_code: postalCode,
        house_number: houseNumber,
        apartment_number: apartmentNumber,
        building: building,
        floor: floor,
        intercom_code: intercomCode,
      },
      client_info: {
        name: clientType === t("calculator.clientTypePrivate") ? name : undefined,
        company_name: clientType === t("calculator.clientTypeCompany") ? companyName : undefined,
        nip: clientType === t("calculator.clientTypeCompany") ? nip : undefined,
        phone: phone,
        email: email,
        additional_info: additionalInfo,
        client_type: clientType,
      },
      payment_status: "pending",
      rooms: rooms,
      bathrooms: bathrooms,
      kitchen: kitchen,
      kitchen_annex: kitchenAnnex,
      vacuum_needed: vacuumNeeded,
      selected_services: paidServices
        .filter(
          (s) =>
            (s.type === "checkbox" && selectedServices[s.id]) ||
            (s.type === "quantity" && selectedServices[s.id] > 0)
        )
        .map((s) => ({
          name: s.name,
          price: s.price,
          quantity: selectedServices[s.id],
        })),
      selected_date: formattedDate,
      selected_time: selectedTime,
      cleaning_frequency: cleaningFrequency,
    };

    try {
      const response = await api.post("/orders", orderData);
      const { orderId } = response.data;

      if (!orderId) {
        throw new Error(t("calculator.orderIdError"));
      }

      const paymentResponse = await api.post("/create-payu-payment", {
        order_id: orderId,
        total_price: parseFloat(calculateTotal()),
        description: `${t("calculator.paymentDescription")} #${orderId}`,
        client_email: orderData.client_info.email,
        client_phone: orderData.client_info.phone,
        client_info: {
          name: orderData.client_info.name || orderData.client_info.company_name || t("calculator.defaultClientName"),
        },
      });

      const { redirectUri } = paymentResponse.data;

      if (!redirectUri) {
        throw new Error(t("calculator.redirectUriError"));
      }

      window.location.href = redirectUri;
    } catch (error) {
      console.error("Error during order handling:", error);
      setError(
        error.response?.data?.error || t("calculator.orderError")
      );
    }
  }

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        <h2 className={css["cacl-title"]}>
          {t("calculator.title")} {selectedCity}
        </h2>
        <p className={css.subtitle}>
          {t("calculator.subtitle")}
        </p>
      </div>

      <section className={css["calculator-impuls"]}>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            <div className={css["user-type"]}>
              <button
                className={clientType === t("calculator.clientTypePrivate") ? css.active : ""}
                onClick={() => setClientType(t("calculator.clientTypePrivate"))}
              >
                {t("calculator.clientTypePrivate")}
              </button>
              <button
                className={clientType === t("calculator.clientTypeCompany") ? css.active : ""}
                onClick={() => setClientType(t("calculator.clientTypeCompany"))}
              >
                {t("calculator.clientTypeCompany")} +23%
              </button>
            </div>

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
                    ? t("calculator.roomSingular")
                    : rooms >= 2 && rooms <= 4
                    ? t("calculator.roomPlural2to4")
                    : t("calculator.roomPlural")}
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
                    ? t("calculator.bathroomSingular")
                    : bathrooms >= 2 && bathrooms <= 4
                    ? t("calculator.bathroomPlural2to4")
                    : t("calculator.bathroomPlural")}
                </span>
                <button
                  className={css["counter-button"]}
                  onClick={() => setBathrooms(bathrooms + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <p className={css.note}>
              {t("calculator.note")}
            </p>

            <div className={css["additional-services"]}>
              <h4>{t("calculator.additionalServices")}</h4>
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
                      {t("calculator.kitchen")}
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
                        {t("calculator.kitchenAnnex")}
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
                    onChange={(e) => setVacuumNeeded(e.target.checked)}
                    className={css["custom-checkbox"]}
                  />
                </div>
                <div className={css["text-price-wrapper"]}>
                  <div>
                    <p>{t("calculator.vacuumNeeded")}</p>
                    <p>{t("calculator.vacuumProvided")}</p>
                  </div>
                  <button className={css["vacuum-price"]}>
                    {vacuumCost.toFixed(2)} {t("calculator.currency")}
                  </button>
                </div>
              </label>
            </div>

            <div className={css["calendar-section"]} ref={calendarRef}>
              <h4>{t("calculator.selectDateTime")}</h4>
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
                      <div>{t("calculator.dayMonday")}</div>
                      <div>{t("calculator.dayTuesday")}</div>
                      <div>{t("calculator.dayWednesday")}</div>
                      <div>{t("calculator.dayThursday")}</div>
                      <div>{t("calculator.dayFriday")}</div>
                      <div>{t("calculator.daySaturday")}</div>
                      <div>{t("calculator.daySunday")}</div>
                    </div>

                    <div className={css["calendar-grid"]}>
                      {renderCalendar()}
                    </div>
                  </div>

                  <div className={css["time-wrapper"]} ref={timeSlotsRef}>
                    <h5>{t("calculator.time")}</h5>
                    <div className={css["time-slots"]}>
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          className={`${css["time-slot"]} ${
                            selectedTime === time ? css.selected : ""
                          }`}
                          onClick={() => setSelectedTime(time)}
                          disabled={!selectedDate}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={css["calendar-footer"]}>
                  <p>{t("calculator.anyTime")}</p>
                </div>
              </div>
            </div>

            <div className={css["frequency-section"]}>
              <h4>
                {t("calculator.frequentCleaning")}{" "}
                <span className={css["discount-text"]}>
                  {t("calculator.biggerDiscount")}
                </span>
              </h4>
              <div className={css["frequency-options"]}>
                {Object.entries(frequencyDiscounts).map(
                  ([freq, freqDiscount]) => {
                    const freqPrice = (
                      parseFloat(calculateBasePrice()) *
                      (1 - freqDiscount / 100)
                    ).toFixed(2);
                    const isSelected = cleaningFrequency === freq;

                    return (
                      <div
                        key={freq}
                        className={`${css["frequency-option"]} ${
                          isSelected ? css.selected : ""
                        }`}
                        onClick={() => setCleaningFrequency(freq)}
                      >
                        <div className={css["frequency-content"]}>
                          <p className={css["frequency-title"]}>{freq}</p>
                          <p className={css["frequency-discount"]}>
                            -{freqDiscount}%
                          </p>
                          <p className={css["frequency-price"]}>
                            {freqPrice} {t("calculator.currency")}
                          </p>
                          {freq === t("calculator.frequencyOneTime") && (
                            <span className={css["emoji"]}></span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className={css["paid-services-section"]}>
              <h4>{t("calculator.paidServices")}</h4>
              <div className={css["paid-services-grid"]}>
                {paidServices.map((service) => (
                  <div
                    key={service.id}
                    className={`${css["paid-service-card"]} ${
                      (service.type === "checkbox" &&
                        selectedServices[service.id]) ||
                      (service.type === "quantity" &&
                        selectedServices[service.id] > 0)
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
                        {service.price.toFixed(2)} {t("calculator.currency")}
                      </span>
                      {service.oldPrice && (
                        <span className={css["price-old"]}>
                          {service.oldPrice.toFixed(2)} {t("calculator.currency")}
                        </span>
                      )}
                    </div>
                    {service.type === "checkbox" &&
                    selectedServices[service.id] ? (
                      <button
                        className={css["remove-btn"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceToggle(service.id);
                        }}
                      >
                        ×
                      </button>
                    ) : service.type === "quantity" &&
                      selectedServices[service.id] > 0 ? (
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
              <h4>{t("calculator.enterAddress")}</h4>
              <div className={css["city-select"]}>
                <button
                  className={css["city-button"]}
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                >
                  {t("calculator.selectCity")}: {selectedCity} +
                  {cities[selectedCity].toFixed(2)} {t("calculator.currency")} ▼
                </button>
                {showCityDropdown && (
                  <div className={css["city-dropdown"]}>
                    <input
                      type="text"
                      placeholder={t("calculator.cityPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                        }}
                      >
                        {city}
                        <span className={css["city-price"]}>
                          +{cost.toFixed(2)} {t("calculator.currency")}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={css["address-fields"]}>
                <div className={css["address-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t("calculator.street")}</label>
                    <input
                      ref={streetRef}
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className={`${css["address-input"]} ${
                        street ? css.filled : ""
                      }`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t("calculator.postalCode")}</label>
                    <input
                      ref={postalCodeRef}
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={`${css["address-input"]} ${
                        postalCode ? css.filled : ""
                      }`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t("calculator.houseNumber")}</label>
                    <input
                      ref={houseNumberRef}
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className={`${css["address-input"]} ${
                        houseNumber ? css.filled : ""
                      }`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>
                      {t("calculator.apartmentNumber")}
                    </label>
                    <input
                      type="text"
                      value={apartmentNumber}
                      onChange={(e) => setApartmentNumber(e.target.value)}
                      className={`${css["address-input"]} ${
                        apartmentNumber ? css.filled : ""
                      }`}
                    />
                  </div>
                </div>
                <div className={css["address-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t("calculator.building")}</label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className={`${css["address-input"]} ${
                        building ? css.filled : ""
                      }`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t("calculator.floor")}</label>
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className={`${css["address-input"]} ${
                        floor ? css.filled : ""
                      }`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>
                      {t("calculator.intercomCode")}
                    </label>
                    <input
                      type="text"
                      value={intercomCode}
                      onChange={(e) => setIntercomCode(e.target.value)}
                      className={`${css["address-input"]} ${
                        intercomCode ? css.filled : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={css["contact-section"]}>
              <h4>{t("calculator.contactDetails")}</h4>
              <div className={css["contact-fields"]}>
                <div className={css["contact-row"]}>
                  {clientType === t("calculator.clientTypePrivate") ? (
                    <div className={css["input-group"]}>
                      <label className={css["input-label"]}>{t("calculator.name")}</label>
                      <input
                        ref={nameRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${css["contact-input"]} ${
                          name ? css.filled : ""
                        }`}
                      />
                    </div>
                  ) : (
                    <>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>
                          {t("calculator.companyName")}
                        </label>
                        <input
                          ref={companyNameRef}
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className={`${css["contact-input"]} ${
                            companyName ? css.filled : ""
                          }`}
                        />
                      </div>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>{t("calculator.nip")}</label>
                        <input
                          ref={nipRef}
                          type="text"
                          value={nip}
                          onChange={(e) => setNip(e.target.value)}
                          className={`${css["contact-input"]} ${
                            nip ? css.filled : ""
                          }`}
                        />
                      </div>
                    </>
                  )}
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>
                      {t("calculator.phone")}
                    </label>
                    <input
                      ref={phoneRef}
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${css["contact-input"]} ${
                        phone ? css.filled : ""
                      }`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t("calculator.email")}</label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${css["contact-input"]} ${
                        email ? css.filled : ""
                      }`}
                    />
                  </div>
                </div>
                <div className={css["contact-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>
                      {t("calculator.additionalInfo")}
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className={`${css["contact-textarea"]} ${
                        additionalInfo ? css.filled : ""
                      }`}
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
                />
                {t("calculator.termsAgreement")}
              </label>
              <label className={css["agreement-label"]}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => setAgreeToMarketing(e.target.checked)}
                  className={css["custom-checkbox"]}
                />
                {t("calculator.marketingAgreement")}
              </label>
            </div>
          </div>

          <div className={css["calculator-right"]}>
            <h2>
              {t("calculator.title")} {rooms}{" "}
              {rooms === 1
                ? t("calculator.roomSingular")
                : rooms >= 2 && rooms <= 4
                ? t("calculator.roomPlural2to4")
                : t("calculator.roomPlural")}{" "}
              {t("calculator.and")} {bathrooms}{" "}
              {bathrooms === 1
                ? t("calculator.bathroomSingular")
                : bathrooms >= 2 && bathrooms <= 4
                ? t("calculator.bathroomPlural2to4")
                : t("calculator.bathroomPlural")}
              {kitchen ? `, ${t("calculator.kitchen")}` : kitchenAnnex ? `, ${t("calculator.kitchenAnnex")}` : ""}, {t("calculator.hallway")}
              <br />
              {calculateBasePrice()} {t("calculator.currency")}
            </h2>

            <div className={css["location-info"]}>
              <h4>{t("calculator.location")}</h4>
              <p>{selectedCity}</p>
            </div>

            <div className={css["specialist-info"]}>
              <img src="/icon/bucket.png" alt="Specialists" />
              <p>{t("calculator.specialistInfo")}</p>
            </div>

            <h4>
              {t("calculator.estimatedTime")}{" "}
              <span className={css["bold-text"]}>{formatWorkTime()}</span>
            </h4>
            {calculateCleanersAndTime().cleaners > 1 && (
              <div className={css.cleaners}>
                {Array.from(
                  { length: calculateCleanersAndTime().cleaners },
                  (_, i) => (
                    <span key={i} className={css["cleaners-icon"]}>
                      👤
                    </span>
                  )
                )}
                <p>
                  {t("calculator.multipleCleaners")}: {calculateCleanersAndTime().cleaners}
                </p>
              </div>
            )}

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
                <p>{t("calculator.selectDateTimePlaceholder")}</p>
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
                {t("calculator.travelCost")}{" "}
                <span className={css["bold-text"]}>
                  +{cities[selectedCity].toFixed(2)} {t("calculator.currency")}
                </span>
              </p>
            </div>

            <div className={css["selected-services-container"]}>
              {paidServices.map((service) =>
                (service.type === "checkbox" && selectedServices[service.id]) ||
                (service.type === "quantity" &&
                  selectedServices[service.id] > 0) ? (
                  <div
                    key={service.id}
                    className={css["selected-service-item"]}
                    style={{ position: "relative" }}
                  >
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
                            service.id === 9 || service.id === 11 ? ` ${t("calculator.hoursShort")}` : "x"
                          })`}
                      </p>
                    </div>
                    <div className={css["service-price"]}>
                      <p>
                        {(service.type === "checkbox"
                          ? service.price
                          : service.price * selectedServices[service.id]
                        ).toFixed(2)}{" "}
                        {t("calculator.currency")}
                      </p>
                    </div>
                    <button
                      className={css["remove-btn"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        service.type === "checkbox"
                          ? handleServiceToggle(service.id)
                          : handleQuantityChange(
                              service.id,
                              -selectedServices[service.id]
                            );
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : null
              )}

              {vacuumNeeded && (
                <div
                  key="vacuum"
                  className={css["selected-service-item"]}
                  style={{ position: "relative" }}
                >
                  <div className={css["service-info"]}>
                    <img
                      src="/icon/odku.png"
                      alt="Vacuum"
                      className={css["selected-service-icon"]}
                    />
                    <p>{t("calculator.vacuumProvided")}</p>
                  </div>
                  <div className={css["service-price"]}>
                    <p>{vacuumCost.toFixed(2)} {t("calculator.currency")}</p>
                  </div>
                  <button
                    className={css["remove-btn"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVacuumNeeded(false);
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
                  placeholder={t("calculator.promoPlaceholder")}
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />
                <button onClick={handlePromoApply}>{t("calculator.applyPromo")}</button>
              </div>
            </div>

            <div className={css.total}>
              <p>
                <strong>{t("calculator.total")}</strong> {calculateTotal()} {t("calculator.currency")}{" "}
                <del>{calculateStrikethroughPrice()} {t("calculator.currency")}</del>
              </p>
              {error && <p className={css["error-message"]}>{error}</p>}
              <div ref={sentinelRef} />
              <button
                ref={orderButtonRef}
                className={`${css["sticky-order-button"]} ${css.sticked}`}
                onClick={handleOrder}
              >
                {t("calculator.orderButton")} {calculateTotal()} {t("calculator.currency")}
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
    </section>
  );
}