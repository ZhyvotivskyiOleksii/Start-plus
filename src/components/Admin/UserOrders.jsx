import React, { useState } from "react";
import css from "./AdminPanel.module.css";
import { FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

function UserOrders({
  orders,
  setOrders,
  fetchOrders,
  serviceTypeFilter,
  orderStatusFilter,
  dateFrom,
  dateTo,
  updateOrder,
  isLoading,
  t = {},
}) {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [sortField, setSortField] = useState("order_date");
  const [sortDirection, setSortDirection] = useState("desc");

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let valueA, valueB;
    switch (sortField) {
      case "id":
        valueA = a.id;
        valueB = b.id;
        break;
      case "service_type":
        valueA = a.service_type || "";
        valueB = b.service_type || "";
        break;
      case "total_price":
        valueA = a.total_price || 0;
        valueB = b.total_price || 0;
        break;
      case "order_date":
        valueA = new Date(a.order_date || 0);
        valueB = new Date(b.order_date || 0);
        break;
      case "status":
        valueA = a.status || "";
        valueB = b.status || "";
        break;
      case "payment_status":
        valueA = a.payment_status || "";
        valueB = b.payment_status || "";
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const defaultTranslations = {
    title: "Zamówienia",
    loading: "Ładowanie...",
    noOrders: "Brak zamówień.",
    id: "ID",
    user: "Użytkownik",
    serviceType: "Typ usługi",
    price: "Cena",
    date: "Data",
    status: "Status",
    paymentStatus: "Status Płatności",
    details: "Szczegóły",
    noUser: "Brak użytkownika",
    noData: "Brak",
    pending: "Oczekujące",
    completed: "Zrealizowane",
    cancelled: "Anulowane",
    paid: "Opłacone",
    pendingPayment: "Oczekujące na płatność",
    hideDetails: "Ukryj szczegóły",
    showDetails: "Pokaż szczegóły",
    address: "Adres",
    rooms: "Pokoje",
    bathrooms: "Łazienki",
    kitchen: "Kuchnia",
    kitchenAnnex: "Aneks kuchenny",
    vacuumNeeded: "Potrzebny odkurzacz",
    cleaningFrequency: "Częstotliwość sprzątania",
    services: "Usługi",
    noServices: "Brak usług.",
    additionalInfo: "Dodatkowe informacje",
    standard: "Standardowe",
    general: "Generalne",
  };

  const translations = { ...defaultTranslations, ...t };

  return (
    <div className={css.ordersList}>
      <h4>{translations.title}</h4>
      {isLoading ? (
        <p>{translations.loading}</p>
      ) : sortedOrders.length === 0 ? (
        <p>{translations.noOrders}</p>
      ) : (
        <table className={css.orderTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                {translations.id} {sortField === "id" && (sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
              </th>
              <th>{translations.user}</th>
              <th onClick={() => handleSort("service_type")}>
                {translations.serviceType} {sortField === "service_type" && (sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
              </th>
              <th onClick={() => handleSort("total_price")}>
                {translations.price} {sortField === "total_price" && (sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
              </th>
              <th onClick={() => handleSort("order_date")}>
                {translations.date} {sortField === "order_date" && (sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
              </th>
              <th onClick={() => handleSort("status")}>
                {translations.status} {sortField === "status" && (sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
              </th>
              <th onClick={() => handleSort("payment_status")}>
                {translations.paymentStatus} {sortField === "payment_status" && (sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
              </th>
              <th>{translations.details}</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>{order.id}</td>
                  <td>
                    {order.client_info && (order.client_info.name || order.client_info.company_name) ? (
                      <div>
                        {order.client_info.name || order.client_info.company_name} <br />
                        <small>{order.client_info.phone || translations.noData}</small>
                      </div>
                    ) : (
                      translations.noUser
                    )}
                  </td>
                  <td>{translations[order.service_type] || order.service_type || translations.noData}</td>
                  <td>{order.total_price ? `${order.total_price} zł` : translations.noData}</td>
                  <td>{order.order_date ? new Date(order.order_date).toLocaleString() : translations.noData}</td>
                  <td>
                    <select value={order.status} onChange={(e) => updateOrder(order.id, e.target.value)}>
                      <option value="pending">{translations.pending}</option>
                      <option value="completed">{translations.completed}</option>
                      <option value="cancelled">{translations.cancelled}</option>
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
                      {order.payment_status === "completed" ? translations.paid :
                       order.payment_status === "cancelled" ? translations.cancelled :
                       translations.pendingPayment}
                    </span>
                  </td>
                  <td>
                    <button
                      className={css.actionBtn}
                      onClick={() => toggleExpand(order.id)}
                      title={expandedOrders[order.id] ? translations.hideDetails : translations.showDetails}
                    >
                      {expandedOrders[order.id] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </td>
                </tr>
                {expandedOrders[order.id] && (
                  <tr>
                    <td colSpan="8">
                      <div className={css.orderDetails}>
                        <div className={css.infoRow}>
                          <strong>{translations.address}</strong>
                          <span>
                            {order.address && order.city
                              ? `${order.address.street || translations.noData}, ${order.address.house_number || translations.noData}${order.address.apartment_number ? `/${order.address.apartment_number}` : ""}, ${order.city}`
                              : translations.noData}
                          </span>
                        </div>
                        {order.order_details && (
                          <>
                            {order.order_details.rooms && (
                              <div className={css.infoRow}>
                                <strong>{translations.rooms}</strong>
                                <span>{order.order_details.rooms}</span>
                              </div>
                            )}
                            {order.order_details.bathrooms && (
                              <div className={css.infoRow}>
                                <strong>{translations.bathrooms}</strong>
                                <span>{order.order_details.bathrooms}</span>
                              </div>
                            )}
                            {order.order_details.kitchen && (
                              <div className={css.infoRow}>
                                <strong>{translations.kitchen}</strong>
                                <span>{order.order_details.kitchen}</span>
                              </div>
                            )}
                            {order.order_details.kitchen_annex && (
                              <div className={css.infoRow}>
                                <strong>{translations.kitchenAnnex}</strong>
                                <span>{order.order_details.kitchen_annex}</span>
                              </div>
                            )}
                            {order.order_details.vacuum_needed && (
                              <div className={css.infoRow}>
                                <strong>{translations.vacuumNeeded}</strong>
                                <span>{order.order_details.vacuum_needed}</span>
                              </div>
                            )}
                            {order.order_details.cleaning_frequency && (
                              <div className={css.infoRow}>
                                <strong>{translations.cleaningFrequency}</strong>
                                <span>{order.order_details.cleaning_frequency}</span>
                              </div>
                            )}
                            {order.order_details.selected_services && (
                              <div className={css.infoRow}>
                                <strong>{translations.services}</strong>
                                <ul className={css.itemList}>
                                  {order.order_details.selected_services !== "Brak" ? (
                                    order.order_details.selected_services.map((service, index) => (
                                      <li key={`${service.name}-${index}`}>
                                        {translations[service.name] || service.name}: {service.quantity === true ? "1" : service.quantity}x - {service.price} zł
                                      </li>
                                    ))
                                  ) : (
                                    <li>{translations.noServices}</li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                        <div className={css.infoRow}>
                          <strong>{translations.additionalInfo}</strong>
                          <span>{order.client_info?.additional_info || order.details || translations.noData}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserOrders;