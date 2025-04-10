import React from "react";
import { useNavigate } from "react-router-dom";
import css from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const userPhone = localStorage.getItem("phone") || "Nieznany numer";

  return (
    <div className={css["dashboard-container"]}>
      <h2>Panel użytkownika</h2>
      <p>Witaj! Twój numer telefonu: {userPhone}</p>
      <button onClick={() => navigate("/")} className={css["back-button"]}>
        Powrót
      </button>
    </div>
  );
}