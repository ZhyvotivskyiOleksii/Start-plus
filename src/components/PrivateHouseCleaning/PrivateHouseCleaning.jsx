import React, { useState, useEffect, useRef } from "react";
import css from "../Calculator/Calculator.module.css";
import { FaCalendarAlt, FaPercentage, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function PrivateHouseCleaning({ lang }) {
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

  // Ініціалізація поточного місяця і року з актуальної дати
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [bookedDates] = useState(new Set(["2025-03-15"]));
  const [discounts] = useState({
    "2025-03-10": 18,
    "2025-03-11": 20,
    "2025-03-12": 15,
    "2025-03-13": 20,
    "2025-03-14": 15,
    "2025-03-15": 15,
    "2025-03-16": 20,
    "2025-03-17": 20,
    "2025-03-18": 18,
    "2025-03-25": 20,
    "2025-03-26": 10,
    "2025-03-27": 20,
    "2025-03-28": 20,
    "2025-03-29": 20,
    "2025-03-30": 15,
    "2025-04-03": 18,
  });
  const [promoCodes] = useState([]);
  const [cleaningFrequency, setCleaningFrequency] = useState("Jednorazowe sprzątanie");
  const [vacuumNeeded, setVacuumNeeded] = useState(false);

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

  // Цены для частного дома
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
    { id: 7, name: "Sprzątanie ogrodu/terasy", price: 50.00, oldPrice: 60.00, icon: "/icon/garden.png", type: "quantity", additionalTime: 30 },
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
    const promoCode = promoCodes.find((code) => code.code === promo.toUpperCase());
    if (promoCode) setDiscount(promoCode.discount);
    else if (promo.toLowerCase() === "weekend") setDiscount(20);
    else if (promo.toLowerCase() === "twoweeks") setDiscount(15);
    else if (promo.toLowerCase() === "month") setDiscount(10);
    else setDiscount(0);
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
      if (service.type === "quantity" && qty > 0) return sum + service.price * qty;
      return sum;
    }, 0);
    total += servicesCost + (cities[selectedCity] || 0);
    if (clientType === "Firma") total *= companyMultiplier;
    return total.toFixed(2);
  }

  function calculateTotal() {
    let total = parseFloat(calculateBasePrice());
    let appliedDiscount = discount;
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const dateDiscount = discounts[dateString] || 0;
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
    // Базовое время: 4 часа 20 минут (4.33 часа) — включает 1 комнату и 1 ванную
    let baseHours = 4.33;

    // Если выбраны дополнительные услуги, базовое время сбрасываем до 0
    const hasAdditionalServices = paidServices.some((service) => {
      const qty = selectedServices[service.id];
      return (service.type === "checkbox" && qty) || (service.type === "quantity" && qty > 0);
    });

    if (hasAdditionalServices) {
      baseHours = 0;
    }

    // Время за дополнительные комнаты (сверх 1): 30 минут (0.5 часа) за каждую
    const additionalRooms = Math.max(0, rooms - 1);
    const roomTime = additionalRooms * 0.5;

    // Время за дополнительные ванные (сверх 1): 1 час 20 минут (1.33 часа) за каждую
    const additionalBathrooms = Math.max(0, bathrooms - 1);
    const bathroomTime = additionalBathrooms * 1.33;

    // Время за дополнительные услуги
    const additionalServiceTime = paidServices.reduce((sum, service) => {
      const qty = selectedServices[service.id];
      if (service.type === "checkbox" && qty) return sum + (service.additionalTime / 60);
      if (service.type === "quantity" && qty > 0) return sum + (service.additionalTime / 60) * qty;
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
          {isToday && <span className={css["day-label"]}>dziś</span>}
          {isTomorrow && <span className={css["day-label"]}>jutro</span>}
          {isPast && <span className={css["day-label"]}>niedostępny</span>}
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
      setSelectedServices((prev) => ({ ...prev, [id]: !prev[id] }));
    } else if (service.type === "quantity") {
      setSelectedServices((prev) => ({
        ...prev,
        [id]: prev[id] === 0 ? 1 : 0,
      }));
    }
  };

  const handleQuantityChange = (id, delta) => {
    setSelectedServices((prev) => {
      const newQty = Math.max(0, prev[id] + delta);
      return { ...prev, [id]: newQty };
    });
  };

  async function handleOrder() {
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
  }

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        <h2 className={css["cacl-title"]}>Sprzątanie domu prywatnego {selectedCity}</h2>
        <p className={css.subtitle}>Wybierz poniższe parametry, aby obliczyć koszt.</p>
      </div>

      <section className={css["calculator-impuls"]}>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            <div className={css["user-type"]}>
              <button
                className={clientType === "Osoba prywatna" ? css.active : ""}
                onClick={() => setClientType("Osoba prywatna")}
              >
                Osoba prywatna
              </button>
              <button
                className={clientType === "Firma" ? css.active : ""}
                onClick={() => setClientType("Firma")}
              >
                Firma +23%
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
                  {rooms === 1 ? "pokój" : rooms >= 2 && rooms <= 4 ? "pokoje" : "pokoi"}
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
                    ? "łazienka"
                    : bathrooms >= 2 && bathrooms <= 4
                    ? "łazienki"
                    : "łazienek"}
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
              * Kompleksowe sprzątanie całego domu, w tym kuchni, toalety oraz łazienki
            </p>

            <div className={css["additional-services"]}>
              <h4>Dodatkowe usługi</h4>
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
                      Kuchnia
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
                        Aneks kuchenny
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
                    <p>Na zamówieniu potrzebny jest odkurzacz</p>
                    <p>Przywieziemy ręczny odkurzacz do sprzątania</p>
                  </div>
                  <button className={css["vacuum-price"]}>{vacuumCost.toFixed(2)} zł</button>
                </div>
              </label>
            </div>

            <div className={css["calendar-section"]} ref={calendarRef}>
              <h4>WYBIERZ DOGODNY TERMIN I GODZINĘ SPRZĄTANIA</h4>
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
                    <h5>Godzina</h5>
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
                  <p>Można zacząć w dowolnym momencie</p>
                </div>
              </div>
            </div>

            <div className={css["frequency-section"]}>
              <h4>CHĘTNOŚĆ CZĘSTOTLIWOŚCI SPRZĄTANIA</h4>
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
                      onClick={() => setCleaningFrequency(freq)}
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
              <h4>Dodatkowe usługi płatne</h4>
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
              <h4>WPROWADŹ SWÓJ ADRES</h4>
              <div className={css["city-select"]}>
                <button
                  className={css["city-button"]}
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                >
                  Wybierz miasto: {selectedCity} +{cities[selectedCity].toFixed(2)} zł ▼
                </button>
                {showCityDropdown && (
                  <div className={css["city-dropdown"]}>
                    <input
                      type="text"
                      placeholder="Wprowadź nazwę miejscowości..."
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
                    <label className={css["input-label"]}>Ulica</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className={`${css["address-input"]} ${street ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Kod pocztowy</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={`${css["address-input"]} ${postalCode ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Numer domu</label>
                    <input
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className={`${css["address-input"]} ${houseNumber ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Numer mieszkania</label>
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
                    <label className={css["input-label"]}>Budynek</label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className={`${css["address-input"]} ${building ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Piętro</label>
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className={`${css["address-input"]} ${floor ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Kod od domofonu</label>
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
              <h4>DANE KONTAKTOWE</h4>
              <div className={css["contact-fields"]}>
                <div className={css["contact-row"]}>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Imię</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${css["contact-input"]} ${name ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Telefon kontaktowy</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${css["contact-input"]} ${phone ? css.filled : ""}`}
                    />
                  </div>
                  <div className={css["input-group"]}>
                    <label className={css["input-label"]}>Adres e-mail</label>
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
                    <label className={css["input-label"]}>Dodatkowa informacja do zamówienia</label>
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
                Składając zamówienie zgadzam się z Regulaminem i Polityką prywatności.
              </label>
              <label className={css["agreement-label"]}>
                <input
                  type="checkbox"
                  checked={agreeToMarketing}
                  onChange={(e) => setAgreeToMarketing(e.target.checked)}
                  className={css["custom-checkbox"]}
                />
                Wyrażam zgodę na przetwarzanie moich danych osobowych przez administratora
              </label>
            </div>
          </div>

          <div className={css["calculator-right"]} ref={rightBlockRef}>
            <h2>
              Sprzątanie domu z {rooms}{" "}
              {rooms === 1 ? "pokój" : rooms >= 2 && rooms <= 4 ? "pokoje" : "pokoi"}{" "}
              i {bathrooms}{" "}
              {bathrooms === 1
                ? "łazienka"
                : bathrooms >= 2 && bathrooms <= 4
                ? "łazienki"
                : "łazienek"}
              {kitchen ? ", kuchnia" : kitchenAnnex ? ", aneks kuchenny" : ""}, przedpokój
              <br />
              {calculateBasePrice()} zł
            </h2>

            <div className={css["location-info"]}>
              <h4>Lokalizacja</h4>
              <p>{selectedCity}</p>
            </div>

            <div className={css["specialist-info"]}>
              <img src="/icon/bucket.svg" alt="Specialists" />
              <p>
                Nasi wykonawcy posiadają wszystkie niezbędne środki czystości oraz sprzęt.
              </p>
            </div>

            <h4>Przybliżony czas pracy: {formatWorkTime()}</h4>
            {calculateCleanersAndTime().cleaners > 1 && (
              <div className={css.cleaners}>
                {Array.from({ length: calculateCleanersAndTime().cleaners }, (_, i) => (
                  <span key={i} className={css["cleaners-icon"]}>
                    👤
                  </span>
                ))}
                <p>Kilka sprzątaczy: {calculateCleanersAndTime().cleaners}</p>
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
                <p>Wybierz termin i godzinę</p>
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
              <p>Dodatkowy koszt dojazdu: +{cities[selectedCity].toFixed(2)} zł</p>
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
                    <p>Przywieziemy ręczny odkurzacz do sprzątania</p>
                  </div>
                  <div className={css["service-price"]}>
                    <p>{vacuumCost.toFixed(2)} zł</p>
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
                  placeholder="Promokod"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />
                <button onClick={handlePromoApply}>Zastosuj</button>
              </div>
            </div>

            <div className={css.total}>
              <p>
                <strong>Do zapłaty:</strong> {calculateTotal()} zł{" "}
                <del>{calculateStrikethroughPrice()} zł</del>
              </p>

              <button
                className={`${css["sticky-order-button"]} ${isSticked ? css.sticked : ""}`}
                onClick={handleOrder}
              >
                Zamawiam za {calculateTotal()} zł
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