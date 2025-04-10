import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import css from "./AdminPanel.module.css";

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newDiscountDate, setNewDiscountDate] = useState("");
  const [newDiscountPercent, setNewDiscountPercent] = useState(0);
  const [newPromoDiscount, setNewPromoDiscount] = useState(0);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscounts();
    fetchPromoCodes();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      if (response.data.message === "Login successful") {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  const fetchDiscounts = async () => {
    const response = await axios.get("http://localhost:5000/api/discounts");
    setDiscounts(response.data);
  };

  const addDiscount = async () => {
    if (newDiscountDate && newDiscountPercent >= 0 && newDiscountPercent <= 100) {
      await axios.post("http://localhost:5000/api/discounts", {
        date: newDiscountDate,
        percentage: newDiscountPercent,
      });
      fetchDiscounts();
      setNewDiscountDate("");
      setNewDiscountPercent(0);
    }
  };

  const generatePromoCode = async () => {
    const code = `PROMO${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    await axios.post("http://localhost:5000/api/promo-codes", {
      code,
      discount: newPromoDiscount,
    });
    setNewPromoCode(code);
    fetchPromoCodes();
    setNewPromoDiscount(0);
  };

  const fetchPromoCodes = async () => {
    const response = await axios.get("http://localhost:5000/api/promo-codes");
    setPromoCodes(response.data);
  };

  if (!isLoggedIn) {
    return (
      <section className={css["calc-wrap"]}>
        <div className={css.container}>
          <h2 className={css["cacl-title"]}>Login</h2>
        </div>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            <div className={css["admin-section"]}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={css["calc-wrap"]}>
      <div className={css.container}>
        <h2 className={css["cacl-title"]}>Panel Administratora</h2>
      </div>
      <section className={css["calculator-impuls"]}>
        <div className={css["calculator-container"]}>
          <div className={css["calculator-left"]}>
            <div className={css["admin-section"]}>
              <h4>Ustaw zniżki na daty</h4>
              <input
                type="date"
                value={newDiscountDate}
                onChange={(e) => setNewDiscountDate(e.target.value)}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={newDiscountPercent}
                onChange={(e) => setNewDiscountPercent(Number(e.target.value))}
                placeholder="Procent zniżki"
              />
              <button onClick={addDiscount}>Dodaj zniżkę</button>
              <ul>
                {discounts.map((discount) => (
                  <li key={discount.id}>
                    {discount.date} - {discount.percentage}%
                  </li>
                ))}
              </ul>
            </div>
            <div className={css["admin-section"]}>
              <h4>Generuj promokody</h4>
              <input
                type="number"
                min="0"
                max="100"
                value={newPromoDiscount}
                onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                placeholder="Procent zniżki"
              />
              <button onClick={generatePromoCode}>Generuj promokod</button>
              {newPromoCode && <p>Nowy promokod: {newPromoCode}</p>}
              <ul>
                {promoCodes.map((code) => (
                  <li key={code.id}>
                    {code.code} - {code.discount}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <button className={css["admin-button"]} onClick={() => navigate("/")}>
        Wróć
      </button>
    </section>
  );
}