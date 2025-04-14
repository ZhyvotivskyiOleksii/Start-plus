import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./Login.module.css";

export default function Login({ lang, handleLogin }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+48");
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    console.log("Тест: showVerification змінився на", showVerification);
  }, [showVerification]);

  const translations = {
    pl: {
      title: "Zaloguj się lub zarejestruj",
      phonePlaceholder: "Numer telefonu",
      getCodeButton: "Otrzymaj kod",
      description:
        "Konto jest powiązane z Twoim numerem telefonu. Za każdym razem otrzymasz unikalny kod, który musisz wpisać, aby zalogować się do strony. Gdy wpiszesz swój numer po raz pierwszy, przejdziesz do strony rejestracji. Za każdym kolejnym razem zalogujesz się do swojego konta.",
      agree: "Zgadzam się z Regulaminem",
      error: "Nieprawidłowy номер телефону",
      verifyPlaceholder: "Wprowadź kod SMS",
      verifyButton: "Potwierdź",
    },
    en: {
      title: "Log In or Register",
      phonePlaceholder: "Phone number",
      getCodeButton: "Get Code",
      description:
        "Your account is linked to your phone number. Each time you will receive a unique code that you must enter to log in to the site. When you enter your number for the first time, you will be directed to the registration page. Each subsequent time you will log in to your account.",
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
        "Ваш обліковий запис пов’язаний із вашим номером телефону. Кожен раз ви отримуватимете унікальний код, який потрібно ввести для входу на сайт. Коли ви вперше введете свій номер, вас буде перенаправлено на сторінку реєстрації. Кожен наступний раз ви входитимете до свого облікового запису.",
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
        "Ваш аккаунт связан с вашим номером телефона. Каждый раз вы будете получать уникальный код, который нужно ввести для входа на сайт. Когда вы впервые введете свой номер, вас направят на страницу регистрации. Каждый последующий раз вы будете входить в свой аккаунт.",
      agree: "Я согласен с правилами",
      error: "Неверный номер телефона",
      verifyPlaceholder: "Введите код SMS",
      verifyButton: "Подтвердить",
    },
  };

  const t = translations[lang] || translations["pl"];

  const countryCodes = [
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+372", name: "Estonia", flag: "🇪🇪" },
    { code: "+358", name: "Finland", flag: "🇫🇮" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+353", name: "Ireland", flag: "🇮🇪" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+40", name: "Romania", flag: "🇷🇴" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+421", name: "Slovakia", flag: "🇸🇰" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const fullPhone = countryCode + phone.replace(/[^0-9]/g, "");

    if (phoneRegex.test(fullPhone)) {
      try {
        console.log(`Тест: Відправка SMS на ${fullPhone}`);
        const response = await fetch("http://localhost:3001/api/send-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: fullPhone }),
        });
        if (!response.ok) {
          throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Тест: SMS надіслано, показуємо поле для коду");
        setShowVerification(true);
        setError("");
      } catch (error) {
        console.log("Тест: Помилка підключення:", error);
        setError("Помилка підключення: " + error.message);
        setShowVerification(false);
      }
    } else {
      setError(t.error);
      setShowVerification(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const fullPhone = countryCode + phone.replace(/[^0-9]/g, "");
    if (!smsCode) {
      setVerifyError("Введіть код");
      return;
    }
    if (!showVerification) {
      console.log("Тест: Верифікація не має викликатися, showVerification = false");
      return;
    }
    try {
      console.log(`Тест: Перевірка коду для ${fullPhone}, введений код: ${smsCode}`);
      const response = await fetch("http://localhost:3001/api/verify-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: fullPhone, code: smsCode }),
      });
      if (!response.ok) {
        throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Тест: Верифікація успішна, викликаємо handleLogin");
      handleLogin(data.token, fullPhone);
      setPhone("");
      setSmsCode("");
      setShowVerification(false);
      setError("");
      setVerifyError("");
    } catch (error) {
      console.log("Тест: Помилка перевірки:", error);
      setVerifyError("Помилка перевірки: " + error.message);
    }
  };

  const selectedCountry = countryCodes.find(
    (country) => country.code === countryCode
  );

  return (
    <div className={css.loginContainer}>
      <div className={css.illustration}>
        <img src="/icon/login-passcode.svg" alt="Login illustration" />
      </div>

      <div className={css.loginBox}>
        <h2 className={css.title}>{t.title}</h2>
        <form onSubmit={showVerification ? handleVerifyCode : handleSubmit} className={css.form}>
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
                placeholder=""
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={css.phoneNumber}
              />
            </div>
            {isCountryListOpen && (
              <div className={css.countryList}>
                {countryCodes.map((country) => (
                  <div
                    key={country.code}
                    className={css.countryItem}
                    onClick={() => {
                      setCountryCode(country.code);
                      setIsCountryListOpen(false);
                    }}
                  >
                    {country.flag} {country.name} ({country.code})
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
                placeholder=""
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                className={css.smsCodeInput}
              />
              {verifyError && <p className={css.error}>{verifyError}</p>}
            </div>
          )}

          <button type="submit" className={css.actionButton}>
            {showVerification ? t.verifyButton : t.getCodeButton}
          </button>

          <p className={css.description}>{t.description}</p>
          <label className={css.agree}>
            <input type="checkbox" required />
            <span>{t.agree}</span>
          </label>
        </form>
      </div>
    </div>
  );
}