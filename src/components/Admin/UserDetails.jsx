import css from "./AdminPanel.module.css";
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaLock } from "react-icons/fa";

function UserDetails({ selectedUser, setSelectedUser, updateUser, updateOrder, isLoading }) {
  return (
    <div className={css.userDetails}>
      <h4>Szczegóły użytkownika</h4>
      <div className={css.userInfo}>
        <div className={css.infoRow}>
          <FaUser className={css.infoIcon} />
          <p>
            <strong>ID:</strong> {selectedUser.id}
          </p>
        </div>
        <div className={css.infoRow}>
          <FaUser className={css.infoIcon} />
          <p>
            <strong>Imię:</strong>
            <input
              type="text"
              value={selectedUser.name || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />
          </p>
        </div>
        <div className={css.infoRow}>
          <FaPhone className={css.infoIcon} />
          <p>
            <strong>Telefon:</strong> {selectedUser.phone}
          </p>
        </div>
        <div className={css.infoRow}>
          <FaEnvelope className={css.infoIcon} />
          <p>
            <strong>Email:</strong>
            <input
              type="email"
              value={selectedUser.email || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
          </p>
        </div>
        <div className={css.infoRow}>
          <FaCalendarAlt className={css.infoIcon} />
          <p>
            <strong>Data rejestracji:</strong> {new Date(selectedUser.created_at).toLocaleString()}
          </p>
        </div>
        <div className={css.infoRow}>
          <FaCalendarAlt className={css.infoIcon} />
          <p>
            <strong>Ostatnie logowanie:</strong>{" "}
            {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : "Brak"}
          </p>
        </div>
        <div className={css.infoRow}>
          <FaLock className={css.infoIcon} />
          <p>
            <strong>Status:</strong>
            <select
              value={selectedUser.status}
              onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
            >
              <option value="active">Aktywne</option>
              <option value="inactive">Nieaktywne</option>
              <option value="banned">Zablokowane</option>
            </select>
          </p>
        </div>
        <button
          className={css.saveBtn}
          onClick={() =>
            updateUser(selectedUser.id, {
              name: selectedUser.name,
              email: selectedUser.email,
              status: selectedUser.status,
            })
          }
          disabled={isLoading}
        >
          {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
        </button>
      </div>
      <h5>Zamówienia użytkownika</h5>
      {Array.isArray(selectedUser.orders) && selectedUser.orders.length > 0 ? (
        <table className={css.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Typ usługi</th>
              <th>Cena</th>
              <th>Data</th>
              <th>Status</th>
              <th>Szczegóły</th>
            </tr>
          </thead>
          <tbody>
            {selectedUser.orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.service_type}</td>
                <td>{order.total_price} zł</td>
                <td>{new Date(order.order_date).toLocaleString()}</td>
                <td>
                  <select value={order.status} onChange={(e) => updateOrder(order.id, e.target.value)}>
                    <option value="pending">Oczekujące</option>
                    <option value="completed">Zrealizowane</option>
                    <option value="cancelled">Anulowane</option>
                  </select>
                </td>
                <td>{order.details || "Brak"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Brak zamówień.</p>
      )}
    </div>
  );
}

export default UserDetails;