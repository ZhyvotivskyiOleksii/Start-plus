import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import css from "./AdminPanel.module.css";
import LoginForm from "./LoginForm";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CalculatorSection from "./CalculatorSection";
import PromoCodesSection from "./PromoCodesSection";
import UsersSection from "./UsersSection";

Modal.setAppElement("#root");

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
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
  const [currentCalculatorTab, setCurrentCalculatorTab] = useState("regular");
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
        localStorage.setItem("isLoggedIn", "true");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    setCurrentSection(null);
  };

  const fetchDiscounts = async (type = "regular") => {
    try {
      console.log(`Fetching discounts for type: ${type}`);
      const { data } = await api.get(`/discounts?type=${type}`);
      console.log(`Discounts for ${type}:`, data);
      if (!Array.isArray(data)) {
        throw new Error("Received data is not an array");
      }
      setDiscounts(data);
      setError("");
    } catch (err) {
      console.error(`Error fetching discounts for ${type}:`, err);
      setError(`Failed to fetch discounts for ${type}: ${err.message}`);
      setDiscounts([]);
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
    if (!newDiscountDate || !newDiscountPercent || !currentCalculatorTab) {
      setError("Будь ласка, заповніть усі поля.");
      return;
    }
    if (newDiscountPercent < 0 || newDiscountPercent > 100) {
      setError("Відсоток знижки має бути від 0 до 100.");
      return;
    }
    setIsLoading(true);
    try {
      const normalizedDate = new Date(newDiscountDate);
      const formattedDate = `${normalizedDate.getFullYear()}-${String(normalizedDate.getMonth() + 1).padStart(2, "0")}-${String(normalizedDate.getDate()).padStart(2, "0")}`;
      console.log(`Adding discount for date: ${formattedDate}, type: ${currentCalculatorTab}, percentage: ${newDiscountPercent}`);
      const response = await api.post("/discounts", {
        date: formattedDate,
        percentage: parseInt(newDiscountPercent),
        type: currentCalculatorTab,
      });
      console.log("Add discount response:", response.data);

      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchDiscounts(currentCalculatorTab);
      setNewDiscountDate("");
      setNewDiscountPercent("");
      setError("");
    } catch (err) {
      console.error("Error adding discount:", err);
      setError("Не вдалося додати знижку: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDiscount = async (id) => {
    try {
      await api.delete(`/discounts/${id}`);
      fetchDiscounts(currentCalculatorTab);
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
      if (currentSection === "calculator" && currentCalculatorTab) {
        fetchDiscounts(currentCalculatorTab);
      }
      if (currentSection === "promocodes") {
        fetchPromoCodes();
      }
    }
  }, [isLoggedIn, currentCalculatorTab, currentSection]);

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
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const discountValue = discounts.find((d) => d.date === formattedDate && d.type === currentCalculatorTab)?.percentage || 0;

      console.log(`Date: ${formattedDate}, Type: ${currentCalculatorTab}, Discount: ${discountValue}`);

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
          handleLogout={handleLogout}
        />
        <div className={`${css.main} ${isSidebarActive ? css.active : ""}`}>
          <Topbar isSidebarActive={isSidebarActive} setIsSidebarActive={setIsSidebarActive} />
          <div className={css.contentArea}>
            {error && <p className={css.error}>{error}</p>}
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
                deleteDiscount={deleteDiscount}
                discounts={discounts}
                isLoading={isLoading}
                error={error}
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
            {currentSection === "users" && <UsersSection api={api} />}
          </div>
        </div>
      </div>
    </section>
  );
}