import css from "./AdminPanel.module.css";
import { FaUser, FaLock } from "react-icons/fa";

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
        <button onClick={handleLogin} disabled={isLoading} className={css.loginButton}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </section>
  );
}

export default LoginForm;