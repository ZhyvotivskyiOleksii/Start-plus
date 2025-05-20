import css from "./AdminPanel.module.css";

function UserOrders({
  orders,
  setOrders,
  fetchOrders,
  serviceTypeFilter,
  setServiceTypeFilter,
  orderStatusFilter,
  setOrderStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  updateOrder,
  isLoading,
}) {
  return (
    <div className={css.ordersList}>
      <h4>Zamówienia</h4>
      <div className={css.filters}>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>Typ usługi</label>
          <select value={serviceTypeFilter} onChange={(e) => setServiceTypeFilter(e.target.value)}>
            <option value="">Wszystkie</option>
            <option value="regular">Zwykłe sprzątanie</option>
            <option value="post-renovation">Po remoncie</option>
            <option value="window-cleaning">Mycie okien</option>
            <option value="office-cleaning">Uборка офісів</option>
            <option value="private-house">Dom prywatny</option>
          </select>
        </div>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>Status</label>
          <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
            <option value="">Wszystkie</option>
            <option value="pending">Oczekujące</option>
            <option value="completed">Zrealizowane</option>
            <option value="cancelled">Anulowane</option>
          </select>
        </div>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>Data od</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>Data do</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>
      {isLoading ? (
        <p>Ładowanie...</p>
      ) : orders.length === 0 ? (
        <p>Brak zamówień.</p>
      ) : (
        <table className={css.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Użytkownik</th>
              <th>Typ usługi</th>
              <th>Cena</th>
              <th>Data</th>
              <th>Status</th>
              <th>Status Płatności</th> {/* Новий стовпець */}
              <th>Szczegóły</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id ? `ID: ${order.user_id}` : "Brak użytkownika"}</td>
                <td>{order.service_type || "Brak"}</td>
                <td>{order.total_price} zł</td>
                <td>{order.order_date ? new Date(order.order_date).toLocaleString() : "Brak daty"}</td>
                <td>
                  <select value={order.status} onChange={(e) => updateOrder(order.id, e.target.value)}>
                    <option value="pending">Oczekujące</option>
                    <option value="completed">Zrealizowane</option>
                    <option value="cancelled">Anulowane</option>
                  </select>
                </td>
                <td>
                  {order.payment_status === "completed" ? "Opłacone" : 
                   order.payment_status === "cancelled" ? "Anulowane" : 
                   "Oczekujące na płatność"}
                </td>
                <td>{order.details || "Brak"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserOrders;