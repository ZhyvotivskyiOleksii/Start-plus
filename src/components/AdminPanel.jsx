import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import css from "./AdminPanel.module.css";
import {
  FaCalendarAlt,
  FaPercentage,
  FaTrash,
  FaCalculator,
  FaUsers,
  FaTag,
  FaBroom,
  FaTools,
  FaWindowRestore,
  FaBuilding,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [newDiscountDate, setNewDiscountDate] = useState("");
  const [newDiscountPercent, setNewDiscountPercent] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("");
  const [newPromoCode, setNewPromoCode] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentCalculatorTab, setCurrentCalculatorTab] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();
  const api = axios.create({ baseURL: API });

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.post("/login", { username, password });
      if (data.message === "Login successful") {
        setIsLoggedIn(true);
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const { data } = await api.get("/discounts");
      setDiscounts(data);
    } catch {
      setError("Failed to fetch discounts.");
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const { data } = await api.get("/promo-codes");
      setPromoCodes(data);
    } catch {
      setError("Failed to fetch promo codes.");
    }
  };

  const addDiscount = async () => {
    if (!newDiscountDate || !newDiscountPercent) {
      setError("Please fill in all fields.");
      return;
    }
    if (newDiscountPercent < 0 || newDiscountPercent > 100) {
      setError("Discount percentage must be between 0 and 100.");
      return;
    }
    setIsLoading(true);
    try {
      const normalizedDate = new Date(newDiscountDate);
      const formattedDate = normalizedDate.toISOString().split("T")[0];
      await api.post("/discounts", { date: formattedDate, percentage: newDiscountPercent });
      fetchDiscounts();
      setNewDiscountDate("");
      setNewDiscountPercent("");
      setError("");
    } catch {
      setError("Failed to add discount.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDiscount = async (id) => {
    try {
      await api.delete(`/discounts/${id}`);
      fetchDiscounts();
    } catch {
      setError("Failed to delete discount.");
    }
  };

  const generatePromoCode = async () => {
    if (!newPromoDiscount) {
      setError("Please enter a discount percentage.");
      return;
    }
    if (newPromoDiscount < 0 || newPromoDiscount > 100) {
      setError("Discount percentage must be between 0 and 100.");
      return;
    }
    setIsLoading(true);
    try {
      const code = `PROMO${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      await api.post("/promo-codes", { code, discount: newPromoDiscount });
      setNewPromoCode(code);
      fetchPromoCodes();
      setNewPromoDiscount("");
      setError("");
    } catch {
      setError("Failed to generate promo code.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePromoCode = async (id) => {
    try {
      await api.delete(`/promo-codes/${id}`);
      fetchPromoCodes();
    } catch {
      setError("Failed to delete promo code.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDiscounts();
      fetchPromoCodes();
    }
  }, [isLoggedIn]);

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

  function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className={css["calendar-day"]}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const discountValue = discounts.find(d => d.date === formattedDate)?.percentage || 0;

      days.push(
        <div
          key={day}
          className={`
            ${css["calendar-day"]}
            ${discountValue ? css.discount : ""}
          `}
          onClick={() => setNewDiscountDate(formattedDate)}
        >
          <span className={css["day-number"]}>{day}</span>
          {discountValue > 0 && <span className={css["discount-label"]}>-{discountValue}%</span>}
        </div>
      );
    }
    return days;
  }

  if (!isLoggedIn) {
    return (
      <section className={css["calc-wrap"]}>
        <div className={css["login-container"]}>
          <h2 className={css["cacl-title"]}>Admin Login</h2>
          {error && <p className={css.error}>{error}</p>}
          <div className={css["input-group"]}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              disabled={isLoading}
            />
          </div>
          <div className={css["input-group"]}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
            />
          </div>
          <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        {/* Ліва панель */}
        <div className={`${css.navigation} ${isSidebarActive ? css.active : ""}`}>
          <ul>
            <li className={css["nav-header"]}>
              <div className={css["nav-item"]}>
                <span className={css.icon}>
                  <FaCalculator />
                </span>
                <span className={css.title}>Admin Panel</span>
              </div>
            </li>
            <li
              className={currentSection === "calculator" ? css.active : ""}
              onClick={() => setCurrentSection("calculator")}
            >
              <div className={css["nav-item"]}>
                <span className={css.icon}>
                  <FaCalculator />
                </span>
                <span className={css.title}>Kalkulator</span>
              </div>
            </li>
            <li
              className={currentSection === "users" ? css.active : ""}
              onClick={() => setCurrentSection("users")}
            >
              <div className={css["nav-item"]}>
                <span className={css.icon}>
                  <FaUsers />
                </span>
                <span className={css.title}>Użytkownicy</span>
              </div>
            </li>
            <li
              className={currentSection === "promocodes" ? css.active : ""}
              onClick={() => setCurrentSection("promocodes")}
            >
              <div className={css["nav-item"]}>
                <span className={css.icon}>
                  <FaTag />
                </span>
                <span className={css.title}>Promokody</span>
              </div>
            </li>
            <li onClick={() => navigate("/")}>
              <div className={css["nav-item"]}>
                <span className={css.icon}>
                  <FaTag />
                </span>
                <span className={css.title}>Wróć</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Основний контент */}
        <div className={`${css.main} ${isSidebarActive ? css.active : ""}`}>
          <div className={css.topbar}>
            <div className={css.toggle} onClick={() => setIsSidebarActive(!isSidebarActive)}>
              <FaBars />
            </div>
          </div>
          <div className={css["content-area"]}>
            {currentSection === "calculator" && (
              <div className={css["right-panel"]}>
                <div className={css["calculator-tabs"]}>
                  <button
                    className={`${css["tab-button"]} ${currentCalculatorTab === "regular" ? css.active : ""}`}
                    onClick={() => setCurrentCalculatorTab("regular")}
                  >
                    <FaBroom /> Zwyke sprzątanie
                  </button>
                  <button
                    className={`${css["tab-button"]} ${currentCalculatorTab === "post-renovation" ? css.active : ""}`}
                    onClick={() => setCurrentCalculatorTab("post-renovation")}
                  >
                    <FaTools /> Po remoncie
                  </button>
                  <button
                    className={`${css["tab-button"]} ${currentCalculatorTab === "window-cleaning" ? css.active : ""}`}
                    onClick={() => setCurrentCalculatorTab("window-cleaning")}
                  >
                    <FaWindowRestore /> Mycie okien
                  </button>
                  <button
                    className={`${css["tab-button"]} ${currentCalculatorTab === "office-cleaning" ? css.active : ""}`}
                    onClick={() => setCurrentCalculatorTab("office-cleaning")}
                  >
                    <FaBuilding /> Uборка офісів
                  </button>
                  <button
                    className={`${css["tab-button"]} ${currentCalculatorTab === "private-house" ? css.active : ""}`}
                    onClick={() => setCurrentCalculatorTab("private-house")}
                  >
                    <FaHome /> Dom prywatny
                  </button>
                </div>
                {currentCalculatorTab && (
                  <div className={css["admin-panel"]}>
                    <h4>Wybierz datę i ustaw zniżkę</h4>
                    <div className={css["calendar-section"]}>
                      <div className={css["calendar-container"]}>
                        <div className={css["calendar-wrapper"]}>
                          <div className={css["calendar-header"]}>
                            <button onClick={handlePrevMonth} className={css["nav-button"]}>
                              <FaChevronLeft />
                            </button>
                            <h5>
                              {[
                                "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
                                "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
                              ][currentMonth]}{" "}
                              {currentYear}
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
                      </div>
                    </div>

                    {newDiscountDate && (
                      <div className={css["discount-form"]}>
                        <h4>Zniżka dla {newDiscountDate}</h4>
                        <div className={css["input-group"]}>
                          <FaPercentage className={css["input-icon"]} />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newDiscountPercent}
                            onChange={(e) => setNewDiscountPercent(e.target.value)}
                            placeholder="Procent zniżki"
                            disabled={isLoading}
                          />
                        </div>
                        <button onClick={addDiscount} disabled={isLoading}>
                          {isLoading ? "Adding..." : "Dodaj zniżkę"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentSection === "promocodes" && (
              <div className={css["right-panel"]}>
                <div className={css["admin-panel"]}>
                  <h4>Generuj promokody</h4>
                  <div className={css["input-group"]}>
                    <FaPercentage className={css["input-icon"]} />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newPromoDiscount}
                      onChange={(e) => setNewPromoDiscount(e.target.value)}
                      placeholder="Procent zniżki"
                      disabled={isLoading}
                    />
                  </div>
                  <button onClick={generatePromoCode} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generuj promokod"}
                  </button>
                  {newPromoCode && (
                    <p className={css["promo-result"]}>
                      Nowy promokod: <strong>{newPromoCode}</strong>
                    </p>
                  )}
                  <ul className={css["item-list"]}>
                    {promoCodes.map((p) => (
                      <li key={p.id}>
                        <span>{p.code}</span>
                        <span>{p.discount}%</span>
                        <button
                          className={css["delete-btn"]}
                          onClick={() => deletePromoCode(p.id)}
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentSection === "users" && (
              <div className={css["right-panel"]}>
                <div className={css["admin-panel"]}>
                  <h4>Użytkownicy</h4>
                  <p>Tutaj będzie lista użytkowników (в майбутньому).</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}