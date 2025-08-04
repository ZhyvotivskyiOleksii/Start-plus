import React, { useState, useEffect } from "react";
import css from "./Login.module.css";
import { useNavigate } from "react-router-dom";

export default function Login({ lang, handleLogin }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+48");
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [agree, setAgree] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {}, [showVerification]);

  const translations = {
    pl: {
      title: "Zaloguj się lub zarejestruj",
      phonePlaceholder: "Numer telefonu",
      getCodeButton: "Otrzymaj kod",
      description:
        "Konto powiązane z numerem telefonu. Otrzymasz kod SMS do logowania lub rejestracji.",
      agree: "Zgadzam się z Regulaminem",
      error: "Nieprawidłowy numer telefonu",
      verifyPlaceholder: "Wprowadź kod SMS",
      verifyButton: "Potwierdź",
    },
    en: {
      title: "Log In or Register",
      phonePlaceholder: "Phone number",
      getCodeButton: "Get Code",
      description:
        "Account linked to phone. Get SMS code for login.",
      agree: "I agree with the Terms",
      error: "Invalid phone number",
      verifyPlaceholder: "Enter SMS code",
      verifyButton: "Verify",
    },
    uk: {
      title: "Увійти або зареєструватися",
      phonePlaceholder: "Номер телефону",
      getCodeButton: "Отримати код",
      description:
        "Обліковий запис пов’язаний з номером. Отримай код SMS для входу або реєстрації.",
      agree: "Я погоджуюся з умовами",
      error: "Неправильний номер телефону",
      verifyPlaceholder: "Введіть код SMS",
      verifyButton: "Підтвердити",
    },
    ru: {
      title: "Войти или зарегистрироваться",
      phonePlaceholder: "Номер телефона",
      getCodeButton: "Получить код",
      description:
        "Аккаунт связан с номером. Получи код SMS для входа или регистрации.",
      agree: "Я согласен с правилами",
      error: "Неверный номер телефона",
      verifyPlaceholder: "Введите код SMS",
      verifyButton: "Подтвердить",
    },
  };

  const t = translations[lang] || translations.pl;

  const countryCodes = [
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+380", name: "Ukraine", flag: "🇺🇦" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+372", name: "Estonia", flag: "🇪🇪" },
    { code: "+358", name: "Finland", flag: "🇫🇮" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+353", name: "Ireland", flag: "🇮🇪" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+40", name: "Romania", flag: "🇷🇴" },
    { code: "+421", name: "Slovakia", flag: "🇸🇰" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  ];

  const API = import.meta.env.VITE_API_BASE_URL || "https://startplus-clean.com/sms-auth-php";

  const normalizePhone = (code, number) => {
    const cleanedNumber = number.replace(/[^0-9]/g, "");
    if (cleanedNumber.length >= 9) {
      return code + cleanedNumber;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setError("Musisz zaakceptować regulamin");
      return;
    }
    const fullPhone = normalizePhone(countryCode, phone);
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    if (!fullPhone || !phoneRegex.test(fullPhone)) {
      setError(t.error);
      setShowVerification(false);
      return;
    }
    try {
      const response = await fetch(`${API}/api/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        if (message === "Код уже надіслано, зачекайте") {
          setShowVerification(true); // Показуємо поле вводу
          setError(message); // Показуємо повідомлення
        } else {
          throw new Error(message);
        }
      } else {
        setShowVerification(true);
        setError("");
      }
    } catch (err) {
      setError(err.message);
      setShowVerification(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const fullPhone = normalizePhone(countryCode, phone);
    if (!smsCode) {
      setVerifyError("Введіть код");
      return;
    }
    if (!showVerification) return;
    try {
      const response = await fetch(`${API}/api/verify-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code: smsCode }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }
      const data = await response.json();
      if (typeof handleLogin !== "function") {
        throw new Error("handleLogin is not defined");
      }
      handleLogin(data.token, fullPhone);
      localStorage.setItem("phone", fullPhone);
      setPhone("");
      setSmsCode("");
      setShowVerification(false);
      setError("");
      setVerifyError("");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setVerifyError(err.message);
    }
  };

  const selectedCountry = countryCodes.find((c) => c.code === countryCode);

  return (
    <div className={css.loginContainer}>
      <div className={css.loginBox}>
        <h2 className={css.title}>{t.title}</h2>
        <form
          onSubmit={showVerification ? handleVerifyCode : handleSubmit}
          className={css.form}
        >
          <div className={css.phoneInputWrapper}>
            <label className={css.label}>{t.phonePlaceholder}</label>
            <div className={css.phoneInput}>
              <div className={css.countrySection}>
                <span className={css.countryCodeDisplay}>
                  {selectedCountry?.flag} {countryCode}
                </span>
                <button
                  type="button"
                  className={css.countryToggle}
                  onClick={() => setIsCountryListOpen(!isCountryListOpen)}
                >
                  <span className={css.arrowDown}>▼</span>
                </button>
              </div>
              <div className={css.verticalDivider}></div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={css.phoneNumber}
                placeholder={t.phonePlaceholder}
              />
            </div>
            {isCountryListOpen && (
              <div className={css.countryList}>
                {countryCodes.map((c) => (
                  <div
                    key={c.code}
                    className={css.countryItem}
                    onClick={() => {
                      setCountryCode(c.code);
                      setIsCountryListOpen(false);
                    }}
                  >
                    {c.flag} {c.name} ({c.code})
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className={css.error}>{error}</p>}

          {showVerification && (
            <div className={css.verifyInputWrapper}>
              <label className={css.label}>{t.verifyPlaceholder}</label>
              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                className={css.smsCodeInput}
                placeholder={t.verifyPlaceholder}
              />
              {verifyError && <p className={css.error}>{verifyError}</p>}
            </div>
          )}

          <p className={css.description}>{t.description}</p>
          <div className={css.toggleWrapper}>
            <label className={css.toggleLabel}>
              <div className={css.toggle}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className={css.slider}></span>
              </div>
              <span>{t.agree}</span>
            </label>
          </div>

          <button type="submit" className={css.actionButton}>
            {showVerification ? t.verifyButton : t.getCodeButton}
          </button>
        </form>
      </div>
    </div>
  );
}