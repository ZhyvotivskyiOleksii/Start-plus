import css from "./Logo.module.css";

export default function Logo() {
  return (
    <a href="/" className={css.logoContainer}> 
      <img src="/logo.webp" width="60px" alt="logo" />
      <span className={css.logoText}>Start  <span className={css.logoPlus} >Plus</span> </span>
    </a>
  );
}
