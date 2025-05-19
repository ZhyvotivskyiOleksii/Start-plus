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

  // Додаємо поля для адреси, які потрібні для сумісності з таблицею orders
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [intercomCode, setIntercomCode] = useState("");

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

  const frequencyDiscounts = {
    "Raz w tygodniu": 20,
    "Raz na dwa tygodnie": 15,
    "Raz w miesiącu": 10,
    "Jednorazowe sprzątanie": 0,
  };

  const basePrice = 246.00;
  const pricePerSquareMeter = 6.15;
  const pricePerWorkspace = 12.30;

  const calendarRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const agreementRef = useRef(null);

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
    },
    // Додаткові мови можна додати за потреби
  };

  const t = texts[lang] || texts.pl;

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
    const promoCodes = [
      { code: "WEEKEND", discount: 20 },
      { code: "TWOWEEKS", discount: 15 },
      { code: "MONTH", discount: 10 },
    ];
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

    if (!agreeToTerms || !agreeToMarketing) {
      console.log("Помилка: Не погоджено з умовами або маркетингом");
      setError("Proszę zaakceptować regulamin i zgodę na przetwarzanie danych.");
      agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Додаткові перевірки, якщо календар активний
    /*
    if (!selectedDate) {
      calendarRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Дата не обрана");
      return;
    }
    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Помилка: Час не обраний");
      return;
    }
    */

    const parsedOfficeArea = parseInt(officeArea, 10) || 10;
    const parsedWorkspaces = parseInt(workspaces, 10) || 0;

    const orderData = {
      order_type: "office", // Додаємо order_type для таблиці orders
      officeArea: parsedOfficeArea,
      workspaces: parsedWorkspaces,
      cleaningFrequency,
      totalPrice: calculateTotal(),
      selectedDate: selectedDate ? selectedDate.toISOString() : null,
      selectedTime,
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
        vatInfo: {
          companyName,
          nip,
          vatAddress,
          vatCity,
          vatPostalCode,
        },
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
          lastName: orderData.clientInfo.name?.split(" ")[1] || orderData.clientInfo.vatInfo.companyName || "Kowalski",
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

            {/* Закоментований календар для майбутнього використання */}
            {/*
            <div className={`${officeCss["calendar-section"]} ${calcCss["calendar-section"]}`} ref={calendarRef}>
              <h4>WYBIERZ DOGODNY TERMIN I GODZINĘ SPRZĄTANIA</h4>
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
                    <h5>Godzina</h5>
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
                  <p>Można zacząć w dowolnym momencie</p>
                </div>
              </div>
            </div>
            */}

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
              <img src="/icon/bucket.svg" alt="Specialists" />
              <p>{t.specialistInfo}</p>
            </div>

            {/* Закоментоване відображення дати для майбутнього використання */}
            {/*
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
                <p>Wybierz termin i godzinę</p>
              )}
            </div>
            */}

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
              <p>{t.locationCostLabel}: +{cities[selectedCity].toFixed(2)} zł</p>
            </div>

            <div className={`${officeCss["work-time"]} ${calcCss["work-time"]}`}>
              <p>{t.workTimeLabel}: {formatWorkTime()} godzin</p>
            </div>

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

              <button
                className={`${officeCss["order-button"]} ${calcCss["order-button"]}`}
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