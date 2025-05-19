import { useNavigate } from "react-router-dom";
import css from "./AdminPanel.module.css";
import { FaCogs } from "react-icons/fa";
import { IoCalculator, IoPricetagsOutline, IoLogOutOutline } from "react-icons/io5";
import { MdGroups } from "react-icons/md";

function Sidebar({ currentSection, setCurrentSection, isSidebarActive, handleLogout }) {
  const navigate = useNavigate();
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
              <FaCogs />
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
        <li
          className={css.logoutButton}
          onClick={() => {
            handleLogout();
            navigate("/");
          }}
        >
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

export default Sidebar;