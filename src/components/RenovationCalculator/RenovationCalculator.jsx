import React, { useState, useEffect, useRef } from "react";
import css from "./RenovationCalculator.module.css";
import { FaCalendarAlt, FaPercentage, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function RenovationCalculator({ lang }) {
  const [area, setArea] = useState(0);
  const [windows, setWindows] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date("2025-04-12").getMonth());
  const [currentYear, setCurrentYear] = useState(new Date("2025-04-12").getFullYear());
  const [bookedDates] = useState(new Set(["2025-04-15"]));
  const [discounts] = useState({
    "2025-04-10": 18,
    "2025-04-11": 20,
    "2025-04-12": 15,
    "2025-04-13": 20,
    "2025-04-14": 15,
    "2025-04-15": 15,
    "2025-04-16": 20,
    "2025-04-17": 20,
    "2025-04-18": 18,
  });
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Warszawa");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const pricePerSquareMeter = 7.0;
  const pricePerWindow = 40.0;
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

  // Оставляем только польский текст
  const texts = {
    title: "Mieszkanie po remoncie",
    areaLabel: "Powierzchnia m²",
    windowsLabel: "Okien",
    areaPrice: "7.00 zł/m²",
    windowsPrice: "40.00 zł/szt",
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
    metersLabel: "Metów",
  };

  const t = texts; // Теперь просто используем texts напрямую, так как у нас только один язык

  const calendarRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const agreementRef = useRef(null);
  const rightBlockRef = useRef(null);
  const [isSticked, setIsSticked] = useState(true);

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

  const handleAreaChange = (increment) => {
    setArea((prev) => Math.max(0, prev + increment));
  };

  const handleWindowsChange = (increment) => {
    setWindows((prev) => Math.max(0, prev + increment));
  };

  const handleAreaInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || isNaN(value)) {
      setArea(0);
    } else {
      const numValue = parseInt(value, 10);
      setArea(isNaN(numValue) ? 0 : Math.max(0, numValue));
    }
  };

  const handleWindowsInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || isNaN(value)) {
      setWindows(0);
    } else {
      const numValue = parseInt(value, 10);
      setWindows(isNaN(numValue) ? 0 : Math.max(0, numValue));
    }
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

    const today = new Date("2025-04-12");
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className={css["calendar-day"]}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split("T")[0];
      const discountValue = discounts[dateString] || 0;

      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();
      const isPast = date < today && !isToday;
      const isBooked = bookedDates.has(dateString);
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

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
    let total = area * pricePerSquareMeter + windows * pricePerWindow;
    total += cities[selectedCity] || 0;
    total *= companyMultiplier;
    return total.toFixed(2);
  };

  const calculateTotal = () => {
    let total = parseFloat(calculateBasePrice());
    let appliedDiscount = discount;
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const dateDiscount = discounts[dateString] || 0;
      appliedDiscount = Math.max(appliedDiscount, dateDiscount);
    }
    const discountAmount = total * (appliedDiscount / 100);
    return (total - discountAmount).toFixed(2);
  };

  const calculateStrikethroughPrice = () => {
    return (parseFloat(calculateTotal()) * 1.25).toFixed(2);
  };

  const calculateWorkTime = () => {
    const areaTime = area * (10 / 60);
    const windowsTime = windows * 1;
    return areaTime + windowsTime;
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

  const handlePromoApply = () => {
    if (promo.toLowerCase() === "weekend") setDiscount(20);
    else if (promo.toLowerCase() === "twoweeks") setDiscount(15);
    else if (promo.toLowerCase() === "month") setDiscount(10);
    else setDiscount(0);
  };

  const handleOrder = async () => {
    if (!selectedDate) {
      calendarRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!selectedTime) {
      timeSlotsRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!agreeToTerms || !agreeToMarketing) {
      agreementRef.current?.classList.add(css["error-border"], css["shake-anim"]);
      agreementRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const orderData = {
      area,
      windows,
      totalPrice: calculateTotal(),
      selectedDate: selectedDate.toISOString(),
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
        clientType,
        name,
        companyName: clientType === "company" ? companyName : null,
        nip: clientType === "company" ? nip : null,
        phone,
        email,
        additionalInfo,
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
      alert("Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.");
    }
  };

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        <h2 className={css["cacl-title"]}>{t.title} {selectedCity}</h2>
        <p className={css.subtitle}>{t.subtitle}</p>
      </div>

      <section className={css["calculator-impuls"]}>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            {/* Добавляем блок user-type в начало calculator-left */}
            <div className={css["user-type"]}>
              <button
                className={`${css["user-type-button"]} ${clientType === "private" ? css.active : ""}`}
                onClick={() => setClientType("private")}
              >
                {t.privateLabel}
              </button>
              <button
                className={`${css["user-type-button"]} ${clientType === "company" ? css.active : ""}`}
                onClick={() => setClientType("company")}
              >
                {t.companyLabel}
              </button>
            </div>

            <div className={css["quantity-selector"]}>
              <div className={css.counter}>
                <button
                  className={css["counter-button"]}
                  onClick={() => handleAreaChange(-1)}
                >
                  −
                </button>
                <input
                  type="number"
                  value={area}
                  onChange={handleAreaInputChange}
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
                <span className={css["counter-label"]}>{t.areaLabel}</span>
                <button
                  className={css["counter-button"]}
                  onClick={() => handleAreaChange(1)}
                >
                  +
                </button>
              </div>

              <div className={css.counter}>
                <button
                  className={css["counter-button"]}
                  onClick={() => handleWindowsChange(-1)}
                >
                  −
                </button>
                <input
                  type="number"
                  value={windows}
                  onChange={handleWindowsInputChange}
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
                <span className={css["counter-label"]}>{t.windowsLabel}</span>
                <button
                  className={css["counter-button"]}
                  onClick={() => handleWindowsChange(1)}
                >
                  +
                </button>
              </div>
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
                      onChange={(e) => setStreet(e.target.value)}
                      className={`${css["address-input"]} ${street ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.postalCodeLabel}</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={`${css["address-input"]} ${postalCode ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.houseNumberLabel}</label>
                    <input
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className={`${css["address-input"]} ${houseNumber ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.apartmentNumberLabel}</label>
                    <input
                      type="text"
                      value={apartmentNumber}
                      onChange={(e) => setApartmentNumber(e.target.value)}
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
                      onChange={(e) => setBuilding(e.target.value)}
                      className={`${css["address-input"]} ${building ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.floorLabel}</label>
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className={`${css["address-input"]} ${floor ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.intercomCodeLabel}</label>
                    <input
                      type="text"
                      value={intercomCode}
                      onChange={(e) => setIntercomCode(e.target.value)}
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
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${css["contact-input"]} ${name ? css.filled : ""}`}
                      />
                    </div>
                  ) : (
                    <>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>{t.companyNameLabel}</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className={`${css["contact-input"]} ${companyName ? css.filled : ""}`}
                        />
                      </div>
                      <div className={css["input-group"]}>
                        <label className={css["input-label"]}>{t.nipLabel}</label>
                        <input
                          type="text"
                          value={nip}
                          onChange={(e) => setNip(e.target.value)}
                          className={`${css["contact-input"]} ${nip ? css.filled : ""}`}
                        />
                      </div>
                    </>
                  )}
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.phoneLabel}</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${css["contact-input"]} ${phone ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.emailLabel}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${css["contact-input"]} ${email ? css.filled : ""}`}
                    />
                  </div>
                </div>
                <div className={css["contact-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>{t.additionalInfoLabel}</label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
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
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className={css["custom-checkbox"]}
                />
                {t.agreement1}
              </label>
              <label className={css["agreement-label"]}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => setAgreeToMarketing(e.target.checked)}
                  className={css["custom-checkbox"]}
                />
                {t.agreement2}
              </label>
            </div>
          </div>

          <div className={css["calculator-right"]} ref={rightBlockRef}>
          <h2>
  {t.metersLabel}: {area} m², {t.windowsLabel}: {windows},
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
                  {discounts[selectedDate.toISOString().split("T")[0]] && (
                    <span className={css["discount-inline"]}>
                      -{discounts[selectedDate.toISOString().split("T")[0]]}%
                    </span>
                  )}
                </p>
              ) : (
                <p>{t.datePlaceholder}</p>
              )}
            </div>

            <div className={css["area-windows-info"]}>
              <p>{t.areaLabel}: {area} m²</p>
              <p>{t.windowsLabel}: {windows}</p>
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
                  onChange={(e) => setPromo(e.target.value)}
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