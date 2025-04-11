import React from "react";
import s from "./Button.module.css";

const Button = ({ size = "md", variant = "primary", children, ...props }) => {
  return (
    <button className={`${s.ctaButton} ${s[size]} ${s[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
