import { useState } from "react";
import css from "./AdminPanel.module.css";
import { FaUser, FaPhone, FaEnvelope, FaHome, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

function UserDetails({ selectedUser, setSelectedUser, updateUser, updateOrder, isLoading, t }) {
  const [editUser, setEditUser] = useState({
    name: selectedUser.name || "",
    phone: selectedUser.phone || "",
    email: selectedUser.email || "",
    status: selectedUser.status || "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(selectedUser.id, editUser);
  };

  return (
    <div className={css.userDetails}>
      <h4>{t.userDetails}</h4>
      <div className={css.userInfo}>
        <div className={css.infoRow}>
          <FaUser className={css.infoIcon} />
          <p>
            <strong>{t.id}</strong>
            <span>{selectedUser.id}</span>
          </p>
        </div>
        <div className={css.infoRow}>
          <FaUser className={css.infoIcon} />
          <p>
            <strong>{t.name}</strong>
            <input
              type="text"
              name="name"
              value={editUser.name}
              onChange={handleChange}
              placeholder={t.noData}
            />
          </p>
        </div>
        <div className={css.infoRow}>
          <FaPhone className={css.infoIcon} />
          <p>
            <strong>{t.phone}</strong>
            <input
              type="text"
              name="phone"
              value={editUser.phone}
              onChange={handleChange}
              placeholder={t.noData}
            />
          </p>
        </div>
        <div className={css.infoRow}>
          <FaEnvelope className={css.infoIcon} />
          <p>
            <strong>{t.email}</strong>
            <input
              type="email"
              name="email"
              value={editUser.email}
              onChange={handleChange}
              placeholder={t.noData}
            />
          </p>
        </div>
        <div className={css.infoRow}>
          <FaHome className={css.infoIcon} />
          <p>
            <strong>{t.clientType}</strong>
            <span>{selectedUser.client_type || t.noData}</span>
          </p>
        </div>
        <div className={css.infoRow}>
          <FaCalendarAlt className={css.infoIcon} />
          <p>
            <strong>{t.registrationDate}</strong>
            <span>{new Date(selectedUser.created_at).toLocaleString()}</span>
          </p>
        </div>
        <div className={css.infoRow}>
          <FaMoneyBillWave className={css.infoIcon} />
          <p>
            <strong>{t.totalSpent}</strong>
            <span>{selectedUser.total_spent ? `${selectedUser.total_spent} zł` : "0 zł"}</span>
          </p>
        </div>
        <div className={css.infoRow}>
          <strong>{t.status}</strong>
          <select name="status" value={editUser.status} onChange={handleChange}>
            <option value="active">{t.active}</option>
            <option value="inactive">{t.inactive}</option>
            <option value="banned">{t.banned}</option>
          </select>
        </div>
        <button className={css.saveBtn} onClick={handleSave} disabled={isLoading}>
          {t.save}
        </button>
      </div>

      <h4>{t.orderHistory}</h4>
      {selectedUser.orders && selectedUser.orders.length > 0 ? (
        <table className={css.orderTable}>
          <thead>
            <tr><th>{t.id}</th><th>{t.serviceType}</th><th>{t.price}</th><th>{t.date}</th><th>{t.status}</th><th>{t.paymentStatus}</th><th>{t.details}</th></tr>
          </thead>
          <tbody>
            {selectedUser.orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{t[order.service_type] || order.service_type || t.noData}</td>
                <td>{order.total_price} zł</td>
                <td>{order.order_date ? new Date(order.order_date).toLocaleString() : t.noData}</td>
                <td>
                  <select value={order.status} onChange={(e) => updateOrder(order.id, e.target.value)}>
                    <option value="pending">{t.pending}</option>
                    <option value="completed">{t.completed}</option>
                    <option value="cancelled">{t.cancelled}</option>
                  </select>
                </td>
                <td>
                  <span
                    className={css.statusBadge}
                    style={{
                      backgroundColor:
                        order.payment_status === "completed" ? "#5a4af4" :
                        order.payment_status === "cancelled" ? "#ff4d4f" : "#a0a9c0",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {order.payment_status === "completed" ? t.paid :
                     order.payment_status === "cancelled" ? t.cancelled :
                     t.pendingPayment}
                  </span>
                </td>
                <td>{order.details || t.noData}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t.noOrders}</p>
      )}
    </div>
  );
}

export default UserDetails;