import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import css from "./AdminPanel.module.css";
import {
  FaCalendarAlt,
  FaPercentage,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaUser,
  FaLock,
} from "react-icons/fa";
import {
  IoCalculator,
  IoPricetagsOutline,
  IoLogOutOutline,
  IoBrush,
  IoConstruct,
  IoWater,
  IoBusiness,
  IoHome,
} from "react-icons/io5";
import { MdGroups } from "react-icons/md";

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

function LoginForm({ username, setUsername, password, setPassword, handleLogin, isLoading, error }) {
  return (
    <section className={css.calcWrap}>
      <div className={css.loginContainer}>
        <h2 className={css.calcTitle}>Admin Login</h2>
        {error && <p className={css.error}>{error}</p>}
        <div className={css.inputGroup}>
          <FaUser className={css.inputIcon} />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={isLoading}
            className={css.input}
          />
        </div>
        <div className={css.inputGroup}>
          <FaLock className={css.inputIcon} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
            className={css.input}
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={css.loginButton}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </section>
  );
}

function Sidebar({ currentSection, setCurrentSection, isSidebarActive, navigate }) {
  const menuItems = [
    { id: "calculator", label: "Kalkulator", icon: <IoCalculator /> },
    { id: "users", label: "Użytkownicy", icon: <MdGroups /> },
    { id: "promocodes", label: "Promokody", icon: <IoPricetagsOutline /> },
  ];

  return (
    <div className={`${css.navigation} ${isSidebarActive ? css.active : ""}`}>
      <ul>
        <li className={css.navHeader}>
          <div className={css.navItem}>
            <span className={css.icon}>
              <IoCalculator />
            </span>
            <span className={css.title}>Admin Panel</span>
          </div>
        </li>
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={currentSection === item.id ? css.active : ""}
            onClick={() => setCurrentSection(item.id)}
          >
            <div className={css.navItem}>
              <span className={css.icon}>{item.icon}</span>
              <span className={css.title}>{item.label}</span>
            </div>
          </li>
        ))}
        <li className={css.logoutButton} onClick={() => navigate("/")}>
          <div className={css.navItem}>
            <span className={css.icon}>
              <IoLogOutOutline />
            </span>
            <span className={css.title}>Wróć</span>
          </div>
        </li>
      </ul>
    </div>
  );
}

function Topbar({ isSidebarActive, setIsSidebarActive }) {
  return (
    <div className={css.topbar}>
      <div className={css.toggle} onClick={() => setIsSidebarActive(!isSidebarActive)}>
        <FaBars />
      </div>
    </div>
  );
}

function CalculatorSection({
  currentCalculatorTab,
  setCurrentCalculatorTab,
  currentMonth,
  currentYear,
  handlePrevMonth,
  handleNextMonth,
  renderCalendar,
  newDiscountDate,
  newDiscountPercent,
  setNewDiscountPercent,
  addDiscount,
  isLoading,
}) {
  const calculatorTabs = [
    { id: "regular", label: "Zwykłe sprzątanie", icon: <IoBrush /> },
    { id: "post-renovation", label: "Po remoncie", icon: <IoConstruct /> },
    { id: "window-cleaning", label: "Mycie okien", icon: <IoWater /> },
    { id: "office-cleaning", label: "Uборка офісів", icon: <IoBusiness /> },
    { id: "private-house", label: "Dom prywatny", icon: <IoHome /> },
  ];

  return (
    <div className={css.rightPanel}>
      <div className={css.adminPanel}>
        <div className={css.calculatorTabs}>
          {calculatorTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${css.tabButton} ${currentCalculatorTab === tab.id ? css.active : ""}`}
              onClick={() => setCurrentCalculatorTab(tab.id)}
            >
              <span className={css.tabIcon}>{tab.icon}</span>
              <span className={css.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
        {currentCalculatorTab && (
          <>
            <h4>Wybierz datę i ustaw zniżkę</h4>
            <div className={css.calendarSection}>
              <div className={css.calendarContainer}>
                <div className={css.calendarWrapper}>
                  <div className={css.calendarHeader}>
                    <button onClick={handlePrevMonth} className={css.navButton}>
                      <FaChevronLeft />
                    </button>
                    <h5>
                      {[
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
                      ][currentMonth]}{" "}
                      {currentYear}
                    </h5>
                    <button onClick={handleNextMonth} className={css.navButton}>
                      <FaChevronRight />
                    </button>
                  </div>
                  <div className={css.calendarDays}>
                    <div>pon</div>
                    <div>wt</div>
                    <div>śr</div>
                    <div>czw</div>
                    <div>pt</div>
                    <div>sob</div>
                    <div>niedz</div>
                  </div>
                  <div className={css.calendarGrid}>{renderCalendar()}</div>
                </div>
              </div>
            </div>
            {newDiscountDate && (
              <div className={css.discountForm}>
                <h4>Zniżka dla {newDiscountDate}</h4>
                <div className={css.inputGroup}>
                  <FaPercentage className={css.inputIcon} />
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
          </>
        )}
      </div>
    </div>
  );
}

function PromoCodesSection({
  newPromoDiscount,
  setNewPromoDiscount,
  generatePromoCode,
  newPromoCode,
  promoCodes,
  deletePromoCode,
  isLoading,
}) {
  return (
    <div className={css.rightPanel}>
      <div className={css.adminPanel}>
        <h4 className={css.sectionTitle}>Generuj promokody</h4>
        <div className={css.promoForm}>
          <div className={css.inputGroup}>
            <FaPercentage className={css.inputIcon} />
            <input
              type="number"
              min="0"
              max="100"
              value={newPromoDiscount}
              onChange={(e) => setNewPromoDiscount(e.target.value)}
              placeholder="Procent zniżki"
              disabled={isLoading}
              className={css.input}
            />
          </div>
          <button
            onClick={generatePromoCode}
            disabled={isLoading}
            className={css.generateButton}
          >
            {isLoading ? "Generating..." : "Generuj promokod"}
          </button>
        </div>
        {newPromoCode && (
          <div className={css.promoResult}>
            <p>
              Nowy promokod: <strong>{newPromoCode}</strong>
            </p>
          </div>
        )}
        <div className={css.promoList}>
          <h5 className={css.listTitle}>Lista promokodów</h5>
          {promoCodes.length === 0 ? (
            <p className={css.noPromo}>Brak promokodów.</p>
          ) : (
            <ul className={css.itemList}>
              {promoCodes.map((p) => (
                <li key={p.id} className={css.promoItem}>
                  <span className={css.promoCode}>{p.code}</span>
                  <span className={css.promoDiscount}>{p.discount}%</span>
                  <button
                    className={css.deleteBtn}
                    onClick={() => deletePromoCode(p.id)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersSection() {
  return (
    <div className={css.rightPanel}>
      <div className={css.adminPanel}>
        <h4>Użytkownicy</h4>
        <p>Tutaj będzie lista użytkowników (w przyszłości).</p>
      </div>
    </div>
  );
}

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
      days.push(<div key={`empty-${i}`} className={css.calendarDay}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
      const discountValue = discounts.find((d) => d.date === formattedDate)?.percentage || 0;

      days.push(
        <div
          key={day}
          className={`${css.calendarDay} ${discountValue ? css.discount : ""}`}
          onClick={() => setNewDiscountDate(formattedDate)}
        >
          <span className={css.dayNumber}>{day}</span>
          {discountValue > 0 && <span className={css.discountLabel}>-{discountValue}%</span>}
        </div>
      );
    }
    return days;
  }

  if (!isLoggedIn) {
    return (
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <section className={css.calcWrap}>
      <div className={css.container}>
        <Sidebar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          isSidebarActive={isSidebarActive}
          navigate={navigate}
        />
        <div className={`${css.main} ${isSidebarActive ? css.active : ""}`}>
          <Topbar isSidebarActive={isSidebarActive} setIsSidebarActive={setIsSidebarActive} />
          <div className={css.contentArea}>
            {currentSection === "calculator" && (
              <CalculatorSection
                currentCalculatorTab={currentCalculatorTab}
                setCurrentCalculatorTab={setCurrentCalculatorTab}
                currentMonth={currentMonth}
                currentYear={currentYear}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                renderCalendar={renderCalendar}
                newDiscountDate={newDiscountDate}
                newDiscountPercent={newDiscountPercent}
                setNewDiscountPercent={setNewDiscountPercent}
                addDiscount={addDiscount}
                isLoading={isLoading}
              />
            )}
            {currentSection === "promocodes" && (
              <PromoCodesSection
                newPromoDiscount={newPromoDiscount}
                setNewPromoDiscount={setNewPromoDiscount}
                generatePromoCode={generatePromoCode}
                newPromoCode={newPromoCode}
                promoCodes={promoCodes}
                deletePromoCode={deletePromoCode}
                isLoading={isLoading}
              />
            )}
            {currentSection === "users" && <UsersSection />}
          </div>
        </div>
      </div>
    </section>
  );
}