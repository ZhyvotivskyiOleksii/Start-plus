import css from "./AdminPanel.module.css";
import { FaBars } from "react-icons/fa";

function Topbar({ isSidebarActive, setIsSidebarActive }) {
  return (
    <div className={css.topbar}>
      <div className={css.toggle} onClick={() => setIsSidebarActive(!isSidebarActive)}>
        <FaBars />
      </div>
    </div>
  );
}

export default Topbar;