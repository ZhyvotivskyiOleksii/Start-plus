import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import css from "./AdminPanel.module.css";

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
  const [currentTab, setCurrentTab] = useState("discounts");

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
      await api.post("/discounts", { date: newDiscountDate, percentage: newDiscountPercent });
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchDiscounts();
      fetchPromoCodes();
    }
  }, [isLoggedIn]);

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
        <h2 className={css["cacl-title"]}>Panel Administratora</h2>
        <div className={css["admin-panel"]}>
          <div className={css.tabs}>
            <button
              className={currentTab === "discounts" ? css.active : ""}
              onClick={() => setCurrentTab("discounts")}
            >
              Zniżki
            </button>
            <button
              className={currentTab === "promos" ? css.active : ""}
              onClick={() => setCurrentTab("promos")}
            >
              Promokody
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}

          {currentTab === "discounts" && (
            <div className={css["tab-content"]}>
              <h4>Ustaw zniżki na daty</h4>
              <div className={css["input-group"]}>
                <input
                  type="date"
                  value={newDiscountDate}
                  onChange={(e) => setNewDiscountDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className={css["input-group"]}>
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
              <ul className={css["item-list"]}>
                {discounts.map((d) => (
                  <li key={d.id}>
                    <span>{d.date}</span>
                    <span>{d.percentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentTab === "promos" && (
            <div className={css["tab-content"]}>
              <h4>Generuj promokody</h4>
              <div className={css["input-group"]}>
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button className={css["admin-button"]} onClick={() => navigate("/")}>
          Wróć
        </button>
      </div>
    </section>
  );
}