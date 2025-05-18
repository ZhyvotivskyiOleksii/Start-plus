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

  const handleOfficeAreaInputChange = (e) => {
    const value = e.target.value;
    setOfficeArea(value);
  };

  const handleWorkspacesInputChange = (e) => {
    const value = e.target.value;
    setWorkspaces(value);
  };

  const handleOfficeAreaBlur = () => {
    const parsedValue = parseInt(officeArea, 10);
    if (isNaN(parsedValue) || officeArea === "") {
      setOfficeArea(10);
    } else {
      setOfficeArea(Math.max(10, parsedValue));
    }
  };

  const handleWorkspacesBlur = () => {
    const parsedValue = parseInt(workspaces, 10);
    if (isNaN(parsedValue) || workspaces === "") {
      setWorkspaces(0);
    } else {
      setWorkspaces(Math.max(0, parsedValue));
    }
  };

  const handlePromoApply = () => {
    const promoCodes = [
      { code: "WEEKEND", discount: 20 },
      { code: "TWOWEEKS", discount: 15 },
      { code: "MONTH", discount: 10 },
    ];
    const promoCode = promoCodes.find((code) => code.code === promo.toUpperCase());
    if (promoCode) setDiscount(promoCode.discount);
    else if (promo.toLowerCase() === "weekend") setDiscount(20);
    else if (promo.toLowerCase() === "twoweeks") setDiscount(15);
    else if (promo.toLowerCase() === "month") setDiscount(10);
    else setDiscount(0);
  };

  const calculateBasePrice = () => {
    let parsedOfficeArea = parseInt(officeArea, 10);
    let parsedWorkspaces = parseInt(workspaces, 10);

    if (isNaN(parsedOfficeArea)) parsedOfficeArea = 10;
    if (isNaN(parsedWorkspaces)) parsedWorkspaces = 0;

    let total = Math.max(basePrice, parsedOfficeArea * pricePerSquareMeter);
    total += parsedWorkspaces * pricePerWorkspace;
    total += cities[selectedCity] || 0;
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
    return (total - discountAmount).toFixed(2);
  };

  const calculateStrikethroughPrice = () => {
    return (parseFloat(calculateTotal()) * 1.25).toFixed(2);
  };

  const calculateWorkTime = () => {
    let parsedOfficeArea = parseInt(officeArea, 10);
    let parsedWorkspaces = parseInt(workspaces, 10);

    if (isNaN(parsedOfficeArea)) parsedOfficeArea = 10;
    if (isNaN(parsedWorkspaces)) parsedWorkspaces = 0;

    let baseHours = 2;
    const areaTime = parsedOfficeArea * 0.05;
    const workspaceTime = parsedWorkspaces * 0.1;
    return (baseHours + areaTime + workspaceTime).toFixed(1);
  };

  const calculateCleanersAndTime = () => {
    const totalHours = calculateWorkTime();
    const cleaners = Math.ceil(totalHours / 9);
    const adjustedHours = totalHours / cleaners;
    const hours = Math.floor(adjustedHours);
    const minutes = Math.round((adjustedHours - hours) * 60);
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
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
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
          onClick={() => isSelectable && setSelectedDate(date)}
        >
          <span className={calcCss["day-number"]}>{day}</span>
          {discountValue > 0 && <span className={calcCss["discount-label"]}>-{discountValue}%</span>}
          {isToday && <span className={calcCss["day-label"]}>dziś</span>}
          {isTomorrow && <span className={calcCss["day-label"]}>jutro</span>}
          {isPast && <span className={calcCss["day-label"]}>niedostępny</span>}
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
    if (!agreeToTerms || !agreeToMarketing) {
      alert("Proszę zaakceptować regulamin i zgodę na przetwarzanie danych.");
      return;
    }

    // Додаткові перевірки, якщо календар активний
    /*
    if (!selectedDate) {
      calendarRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(calcCss["error-border"], calcCss["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    */

    const parsedOfficeArea = parseInt(officeArea, 10) || 10;
    const parsedWorkspaces = parseInt(workspaces, 10) || 0;

    const orderData = {
      officeArea: parsedOfficeArea,
      workspaces: parsedWorkspaces,
      cleaningFrequency,
      totalPrice: calculateTotal(),
      selectedDate: selectedDate ? selectedDate.toISOString() : null,
      selectedTime,
      city: selectedCity,
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
    };

    try {
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Zamówienie złożone! Twój account został utworzony. Sprawdź SMS z kodem do logowania.");
      } else {
        alert("Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Wystąpił błąd podczas składания zamówienia. Spróbuj ponownie.");
    }
  }

  return (
    <section className={`${officeCss["calc-wrap"]} ${calcCss["calc-wrap"]}`}>
      <div className={`${officeCss.container} ${calcCss.container}`}>
        <h2 className={`${officeCss["cacl-title"]} ${calcCss["cacl-title"]}`}>
          {title} {selectedCity}
        </h2>
        <p className={`${officeCss.subtitle} ${calcCss.subtitle}`}>
          Wybierz parametry, aby obliczyć koszt u sprzątania biura.
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
                  <h4>Powierzchnia biura (m²)</h4>
                </div>
                <div className={`${officeCss.counter} ${calcCss.counter}`}>
                  <button
                    className={`${officeCss["counter-button"]} ${calcCss["counter-button"]}`}
                    onClick={() => {
                      const parsedValue = parseInt(officeArea, 10);
                      if (isNaN(parsedValue)) {
                        setOfficeArea(10);
                      } else {
                        setOfficeArea(Math.max(10, parsedValue - 1));
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
                      } else {
                        setOfficeArea(parsedValue + 1);
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
                  <h4>Liczba miejsc pracy</h4>
                </div>
                <div className={`${officeCss.counter} ${calcCss.counter}`}>
                  <button
                    className={`${officeCss["counter-button"]} ${calcCss["counter-button"]}`}
                    onClick={() => {
                      const parsedValue = parseInt(workspaces, 10);
                      if (isNaN(parsedValue)) {
                        setWorkspaces(0);
                      } else {
                        setWorkspaces(Math.max(0, parsedValue - 1));
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
                      } else {
                        setWorkspaces(parsedValue + 1);
                      }
                    }}
                  >
                    +
                  </button>
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
                          onClick={() => setSelectedTime(time)}
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
              <h4>CHĘTNOŚĆ CZĘSTOTLIWOŚCI SPRZĄTANIA</h4>
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
                      onClick={() => setCleaningFrequency(freq)}
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
              <h4>DANE KONTAKTOWE</h4>
              <div className={`${officeCss["contact-fields"]} ${calcCss["contact-fields"]}`}>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Imię
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${name ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Telefon kontaktowy
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${phone ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Adres e-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${email ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
                <h4>DANE DO FAKTURY VAT</h4>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Nazwa firmy
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${companyName ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      NIP
                    </label>
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${nip ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Adres
                    </label>
                    <input
                      type="text"
                      value={vatAddress}
                      onChange={(e) => setVatAddress(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${vatAddress ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Miasto
                    </label>
                    <input
                      type="text"
                      value={vatCity}
                      onChange={(e) => setVatCity(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${vatCity ? calcCss.filled : ""}`}
                    />
                  </div>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Kod pocztowy
                    </label>
                    <input
                      type="text"
                      value={vatPostalCode}
                      onChange={(e) => setVatPostalCode(e.target.value)}
                      className={`${officeCss["contact-input"]} ${calcCss["contact-input"]} ${vatPostalCode ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={`${officeCss["contact-row"]} ${calcCss["contact-row"]}`}>
                  <div className={`${officeCss["input-group"]} ${calcCss["input-group"]}`}>
                    <label className={`${officeCss["input-label"]} ${calcCss["input-label"]}`}>
                      Dodatkowa informacja do zamówienia
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className={`${officeCss["contact-textarea"]} ${calcCss["contact-textarea"]} ${additionalInfo ? calcCss.filled : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${officeCss["agreement-section"]} ${calcCss["agreement-section"]}`}>
              <label className={`${officeCss["agreement-label"]} ${calcCss["agreement-label"]}`}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className={`${officeCss["custom-checkbox"]} ${calcCss["custom-checkbox"]}`}
                />
                Składając zamówienie zgadzam się z Regulaminem i Polityką prywatności.
              </label>
              <label className={`${officeCss["agreement-label"]} ${calcCss["agreement-label"]}`}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => setAgreeToMarketing(e.target.checked)}
                  className={`${officeCss["custom-checkbox"]} ${calcCss["custom-checkbox"]}`}
                />
                Wyrażam zgodę na przetwarzanie moich danych osobowych przez administratora
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
              <h4>Lokalizacja</h4>
              <p>{selectedCity}</p>
            </div>

            <div className={`${officeCss["specialist-info"]} ${calcCss["specialist-info"]}`}>
              <img src="/icon/bucket.svg" alt="Specialists" />
              <p>
                Nasi wykonawcy posiadają wszystkie niezbędne środki czystości oraz sprzęt.
              </p>
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
              <p>Dodatkowy koszt dojazdu: +{cities[selectedCity].toFixed(2)} zł</p>
            </div>

            <div className={`${officeCss["work-time"]} ${calcCss["work-time"]}`}>
              <p>Przybliżony czas pracy: {formatWorkTime()} godzin</p>
            </div>

            <div className={`${officeCss["promo-code"]} ${calcCss["promo-code"]}`}>
              <div className={`${officeCss["promo-container"]} ${calcCss["promo-container"]}`}>
                <FaPercentage className={`${officeCss["promo-icon"]} ${calcCss["promo-icon"]}`} />
                <input
                  type="text"
                  placeholder="Promokod"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />
                <button onClick={handlePromoApply}>Zastosuj</button>
              </div>
            </div>

            <div className={`${officeCss.total} ${calcCss.total}`}>
              <p>
                <strong>Do zapłaty:</strong>{" "}
                {calculateTotal()} zł{" "}
                <del>{calculateStrikethroughPrice()} zł</del>
              </p>
              <div className={`${officeCss["vat-container"]} ${calcCss["vat-container"]}`}>
                <img src="/icon/invoice.png" alt="Invoice" className={`${officeCss["invoice-icon"]} ${calcCss["invoice-icon"]}`} />
                <span className={`${officeCss["vat-text"]} ${calcCss["vat-text"]}`}>
                  Cena zawiera VAT, faktura zostanie wysłana na email po zakończeniu sprzątania
                </span>
              </div>

              <button
                className={`${officeCss["order-button"]} ${calcCss["order-button"]}`}
                onClick={handleOrder}
              >
                Zamawiam za {calculateTotal()} zł
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