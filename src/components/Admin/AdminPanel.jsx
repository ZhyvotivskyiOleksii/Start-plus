import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import css from "./AdminPanel.module.css";
import {
  FaCalendarAlt,
  FaPercentage,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaUser,
  FaLock,
  FaUsers,
  FaUserCircle,
  FaChartBar,
  FaShoppingCart,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import {
  IoCalculator,
  IoPricetagsOutline,
  IoLogOutOutline,
  IoBrush,
  IoConstruct,
  IoWater,
  IoBusiness,
  IoHome,
} from "react-icons/io5";
import { MdGroups } from "react-icons/md";

Modal.setAppElement("#root");

const API = import.meta.env.VITE_API || "http://localhost:3001/api";

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
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={css.loginButton}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </section>
  );
}

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
              <IoCalculator />
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
        <li className={css.logoutButton} onClick={() => {
          handleLogout();
          navigate("/");
        }}>
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

function Topbar({ isSidebarActive, setIsSidebarActive }) {
  return (
    <div className={css.topbar}>
      <div className={css.toggle} onClick={() => setIsSidebarActive(!isSidebarActive)}>
        <FaBars />
      </div>
    </div>
  );
}

function CalculatorSection({
  currentCalculatorTab,
  setCurrentCalculatorTab,
  currentMonth,
  currentYear,
  handlePrevMonth,
  handleNextMonth,
  renderCalendar,
  newDiscountDate,
  newDiscountPercent,
  setNewDiscountPercent,
  addDiscount,
  deleteDiscount,
  discounts,
  isLoading,
  error,
}) {
  const calculatorTabs = [
    { id: "regular", label: "Zwykłe sprzątanie", icon: <IoBrush /> },
    { id: "post-renovation", label: "Po remoncie", icon: <IoConstruct /> },
    { id: "window-cleaning", label: "Mycie okien", icon: <IoWater /> },
    { id: "office-cleaning", label: "Uборка офісів", icon: <IoBusiness /> },
    { id: "private-house", label: "Dom prywatny", icon: <IoHome /> },
  ];

  return (
    <div className={css.rightPanel}>
      <div className={css.adminPanel}>
        <div className={css.calculatorTabs}>
          {calculatorTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${css.tabButton} ${currentCalculatorTab === tab.id ? css.active : ""}`}
              onClick={() => setCurrentCalculatorTab(tab.id)}
            >
              <span className={css.tabIcon}>{tab.icon}</span>
              <span className={css.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
        {error && <p className={css.error}>{error}</p>}
        {currentCalculatorTab && (
          <div className={css.discountSection}>
            <div className={css.calendarSection}>
              <h4>Wybierz datę i ustaw zniżkę</h4>
              <div className={css.calendarContainer}>
                <div className={css.calendarWrapper}>
                  <div className={css.calendarHeader}>
                    <button onClick={handlePrevMonth} className={css.navButton}>
                      <FaChevronLeft />
                    </button>
                    <h5>
                      {[
                        "styczeń",
                        "luty",
                        "marzec",
                        "kwiecień",
                        "maj",
                        "czerwiec",
                        "lipiec",
                        "sierpień",
                        "wrzesień",
                        "październik",
                        "listopad",
                        "grudzień",
                      ][currentMonth]}{" "}
                      {currentYear}
                    </h5>
                    <button onClick={handleNextMonth} className={css.navButton}>
                      <FaChevronRight />
                    </button>
                  </div>
                  <div className={css.calendarDays}>
                    <div>pon</div>
                    <div>wt</div>
                    <div>śr</div>
                    <div>czw</div>
                    <div>pt</div>
                    <div>sob</div>
                    <div>niedz</div>
                  </div>
                  <div className={css.calendarGrid}>{renderCalendar()}</div>
                </div>
              </div>
            </div>

            <div className={css.discountListWrapper}>
              {newDiscountDate ? (
                <div className={css.discountForm}>
                  <h4>Zniżka dla {newDiscountDate}</h4>
                  <div className={css.inputGroup}>
                    <FaPercentage className={css.inputIcon} />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newDiscountPercent}
                      onChange={(e) => setNewDiscountPercent(e.target.value)}
                      placeholder="Procent zniżki"
                      disabled={isLoading}
                    />
                  </div>
                  <button onClick={addDiscount} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Dodaj zniżkę"}
                  </button>
                </div>
              ) : (
                <div className={css.discountPlaceholder}>
                  <p>Wybierz datę na kalendarzu, aby dodać zniżkę.</p>
                </div>
              )}

              <div className={css.discountList}>
                <h5>Lista zniżek</h5>
                {discounts.length === 0 ? (
                  <p>Brak zniżek dla wybranego typu.</p>
                ) : (
                  <table className={css.discountTable}>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Zniżka</th>
                        <th>Działania</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discounts.map((d) => (
                        <tr key={d.id}>
                          <td>{d.date}</td>
                          <td>{d.percentage}%</td>
                          <td>
                            <button
                              className={css.deleteBtn}
                              onClick={() => deleteDiscount(d.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PromoCodesSection({
  newPromoDiscount,
  setNewPromoDiscount,
  generatePromoCode,
  newPromoCode,
  promoCodes,
  deletePromoCode,
  isLoading,
}) {
  return (
    <div className={css.rightPanel}>
      <div className={css.adminPanel}>
        <h4 className={css.sectionTitle}>Generuj promokody</h4>
        <div className={css.promoForm}>
          <div className={css.inputGroup}>
            <FaPercentage className={css.inputIcon} />
            <input
              type="number"
              min="0"
              max="100"
              value={newPromoDiscount}
              onChange={(e) => setNewPromoDiscount(e.target.value)}
              placeholder="Procent zniżki"
              disabled={isLoading}
              className={css.input}
            />
          </div>
          <button
            onClick={generatePromoCode}
            disabled={isLoading}
            className={css.generateButton}
          >
            {isLoading ? "Generating..." : "Generuj promokod"}
          </button>
        </div>
        {newPromoCode && (
          <div className={css.promoResult}>
            <p>
              Nowy promokod: <strong>{newPromoCode}</strong>
            </p>
          </div>
        )}
        <div className={css.promoList}>
          <h5 className={css.listTitle}>Lista promokodów</h5>
          {promoCodes.length === 0 ? (
            <p className={css.noPromo}>Brak promokodów.</p>
          ) : (
            <ul className={css.itemList}>
              {promoCodes.map((p) => (
                <li key={p.id} className={css.promoItem}>
                  <span className={css.promoCode}>{p.code}</span>
                  <span className={css.promoDiscount}>{p.discount}%</span>
                  <button
                    className={css.deleteBtn}
                    onClick={() => deletePromoCode(p.id)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersSection({ api }) {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("usersActiveTab") || "list");
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")) || []);
  const [selectedUser, setSelectedUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("selectedUser"));
    return storedUser && typeof storedUser === "object"
      ? { ...storedUser, orders: Array.isArray(storedUser.orders) ? storedUser.orders : [] }
      : null;
  });
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem("stats")) || null);
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem("orders")) || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(localStorage.getItem("statusFilter") || "");
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [serviceTypeFilter, setServiceTypeFilter] = useState(localStorage.getItem("serviceTypeFilter") || "");
  const [orderStatusFilter, setOrderStatusFilter] = useState(localStorage.getItem("orderStatusFilter") || "");
  const [dateFrom, setDateFrom] = useState(localStorage.getItem("dateFrom") || "");
  const [dateTo, setDateTo] = useState(localStorage.getItem("dateTo") || "");
  const [statsPeriod, setStatsPeriod] = useState(localStorage.getItem("statsPeriod") || "30d");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const { data } = await api.get("/users", { params });
      setUsers(data);
      localStorage.setItem("users", JSON.stringify(data));
      setError("");
    } catch (err) {
      setError("Не вдалося завантажити користувачів.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/users/${id}`);
      const userData = {
        ...data,
        orders: Array.isArray(data.orders) ? data.orders : [],
      };
      setSelectedUser(userData);
      localStorage.setItem("selectedUser", JSON.stringify(userData));
      setError("");
    } catch (err) {
      setError("Не вдалося завантажити деталі користувача.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/users/stats", { params: { period: statsPeriod } });
      setStats(data);
      localStorage.setItem("stats", JSON.stringify(data));
      setError("");
    } catch (err) {
      setError("Не вдалося завантажити статистику.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (serviceTypeFilter) params.service_type = serviceTypeFilter;
      if (orderStatusFilter) params.status = orderStatusFilter;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const { data } = await api.get("/orders", { params });
      setOrders(data);
      localStorage.setItem("orders", JSON.stringify(data));
      setError("");
    } catch (err) {
      setError("Не вдалося завантажити замовлення.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id, updates) => {
    setIsLoading(true);
    try {
      await api.put(`/users/${id}`, updates);
      fetchUsers();
      if (selectedUser) fetchUserDetails(id);
      setError("");
    } catch (err) {
      setError("Не вдалося оновити користувача.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      setSelectedUser(null);
      localStorage.removeItem("selectedUser");
      setActiveTab("list");
      localStorage.setItem("usersActiveTab", "list");
      setError("");
    } catch (err) {
      setError("Не вдалося видалити користувача.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteModal = (id, userName) => {
    setUserToDelete({ id, userName });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
    }
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const updateOrder = async (id, status) => {
    setIsLoading(true);
    try {
      await api.put(`/orders/${id}`, { status });
      fetchOrders();
      if (selectedUser) fetchUserDetails(selectedUser.id);
      setError("");
    } catch (err) {
      setError("Не вдалося оновити замовлення.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchUsers();
    } else if (activeTab === "stats") {
      fetchStats();
    } else if (activeTab === "orders") {
      fetchOrders();
    }
    localStorage.setItem("usersActiveTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("statusFilter", statusFilter);
    fetchUsers();
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    fetchUsers();
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("serviceTypeFilter", serviceTypeFilter);
    localStorage.setItem("orderStatusFilter", orderStatusFilter);
    localStorage.setItem("dateFrom", dateFrom);
    localStorage.setItem("dateTo", dateTo);
    fetchOrders();
  }, [serviceTypeFilter, orderStatusFilter, dateFrom, dateTo]);

  useEffect(() => {
    localStorage.setItem("statsPeriod", statsPeriod);
    fetchStats();
  }, [statsPeriod]);

  const userTabs = [
    { id: "list", label: "Lista użytkowników", icon: <FaUsers /> },
    { id: "details", label: "Szczegóły użytkownika", icon: <FaUserCircle /> },
    { id: "stats", label: "Statystyka", icon: <FaChartBar /> },
    { id: "orders", label: "Zamówienia", icon: <FaShoppingCart /> },
  ];

  return (
    <div className={css.rightPanel}>
      <div className={css.adminPanel}>
        <div className={css.calculatorTabs}>
          {userTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${css.tabButton} ${activeTab === tab.id ? css.active : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "details") setSelectedUser(null);
              }}
              disabled={tab.id === "details" && !selectedUser}
            >
              <span className={css.tabIcon}>{tab.icon}</span>
              <span className={css.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
        {error && <p className={css.error}>{error}</p>}

        {activeTab === "list" && (
          <div className={css.usersList}>
            <h4>Lista użytkowników</h4>
            <div className={css.filters}>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Wszystkie</option>
                  <option value="active">Aktywne</option>
                  <option value="inactive">Nieaktywne</option>
                  <option value="banned">Zablokowane</option>
                </select>
              </div>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>Szukaj</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Imię, telefon, email..."
                />
              </div>
            </div>
            {isLoading ? (
              <p>Ładowanie...</p>
            ) : users.length === 0 ? (
              <p>Brak użytkowników.</p>
            ) : (
              <table className={css.userTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imię</th>
                    <th>Telefon</th>
                    <th>Email</th>
                    <th>Data rejestracji</th>
                    <th>Ostatnie logowanie</th>
                    <th>Status</th>
                    <th>Działania</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name || "Brak"}</td>
                      <td>{user.phone}</td>
                      <td>{user.email || "Brak"}</td>
                      <td>{new Date(user.created_at).toLocaleString()}</td>
                      <td>{user.last_login ? new Date(user.last_login).toLocaleString() : "Brak"}</td>
                      <td>{user.status}</td>
                      <td>
                        <button
                          className={css.actionBtn}
                          onClick={() => {
                            setActiveTab("details");
                            setSelectedUser(user);
                            fetchUserDetails(user.id);
                          }}
                        >
                          Szczegóły
                        </button>
                        <button
                          className={css.deleteBtn}
                          onClick={() => handleOpenDeleteModal(user.id, user.name)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "details" && selectedUser && (
          <div className={css.userDetails}>
            <h4>Szczegóły użytkownika</h4>
            <div className={css.userInfo}>
              <div className={css.infoRow}>
                <FaUser className={css.infoIcon} />
                <p><strong>ID:</strong> {selectedUser.id}</p>
              </div>
              <div className={css.infoRow}>
                <FaUser className={css.infoIcon} />
                <p><strong>Imię:</strong> 
                  <input
                    type="text"
                    value={selectedUser.name || ""}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </p>
              </div>
              <div className={css.infoRow}>
                <FaPhone className={css.infoIcon} />
                <p><strong>Telefon:</strong> {selectedUser.phone}</p>
              </div>
              <div className={css.infoRow}>
                <FaEnvelope className={css.infoIcon} />
                <p><strong>Email:</strong> 
                  <input
                    type="email"
                    value={selectedUser.email || ""}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </p>
              </div>
              <div className={css.infoRow}>
                <FaCalendarAlt className={css.infoIcon} />
                <p><strong>Data rejestracji:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
              </div>
              <div className={css.infoRow}>
                <FaCalendarAlt className={css.infoIcon} />
                <p><strong>Ostatnie logowanie:</strong> {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : "Brak"}</p>
              </div>
              <div className={css.infoRow}>
                <FaLock className={css.infoIcon} />
                <p><strong>Status:</strong> 
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
                onClick={() => updateUser(selectedUser.id, {
                  name: selectedUser.name,
                  email: selectedUser.email,
                  status: selectedUser.status,
                })}
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
                        <select
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, e.target.value)}
                        >
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
        )}

        {activeTab === "stats" && (
          <div className={css.statsSection}>
            <h4>Statystyka</h4>
            <div className={css.filters}>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>Okres</label>
                <select
                  value={statsPeriod}
                  onChange={(e) => setStatsPeriod(e.target.value)}
                >
                  <option value="7d">Ostatnie 7 dni</option>
                  <option value="30d">Ostatnie 30 dni</option>
                  <option value="1y">Ostatni rok</option>
                </select>
              </div>
            </div>
            {isLoading ? (
              <p>Ładowanie...</p>
            ) : !stats ? (
              <p>Brak danych statystycznych.</p>
            ) : (
              <div className={css.statsInfo}>
                <p><strong>Liczba użytkowników:</strong> {stats.total_users}</p>
                <p><strong>Aktywni użytkownicy:</strong> {stats.status_counts?.active || 0}</p>
                <p><strong>Nieaktywni użytkownicy:</strong> {stats.status_counts?.inactive || 0}</p>
                <p><strong>Zablokowani użytkownicy:</strong> {stats.status_counts?.banned || 0}</p>
                <p><strong>Nowi użytkownicy (okres):</strong> {stats.new_users}</p>
                <p><strong>Średnia liczba zamówień na użytkownika:</strong> {stats.avg_orders_per_user}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className={css.ordersList}>
            <h4>Zamówienia</h4>
            <div className={css.filters}>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>Typ usługi</label>
                <select
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                >
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
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="">Wszystkie</option>
                  <option value="pending">Oczekujące</option>
                  <option value="completed">Zrealizowane</option>
                  <option value="cancelled">Anulowane</option>
                </select>
              </div>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>Data od</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>Data do</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
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
                    <th>Szczegóły</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.name || order.phone}</td>
                      <td>{order.service_type}</td>
                      <td>{order.total_price} zł</td>
                      <td>{new Date(order.order_date).toLocaleString()}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, e.target.value)}
                        >
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
            )}
          </div>
        )}

        {/* Модальне вікно для підтвердження видалення */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          className={css.modal}
          overlayClassName={css.modalOverlay}
        >
          <h2 className={css.modalTitle}>Potwierdzenie usunięcia</h2>
          <p className={css.modalMessage}>
            Czy na pewno chcesz usunąć użytkownika{" "}
            <strong>{userToDelete?.userName || `o ID ${userToDelete?.id}`}</strong>?
          </p>
          <div className={css.modalButtons}>
            <button className={css.modalConfirmBtn} onClick={handleConfirmDelete}>
              Tak, usuń
            </button>
            <button className={css.modalCancelBtn} onClick={handleCloseModal}>
              Anuluj
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [newDiscountDate, setNewDiscountDate] = useState("");
  const [newDiscountPercent, setNewDiscountPercent] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("");
  const [newPromoCode, setNewPromoCode] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentCalculatorTab, setCurrentCalculatorTab] = useState("regular");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();
  const api = axios.create({ baseURL: API });

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.post("/login", { username, password });
      if (data.message === "Login successful") {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    setCurrentSection(null);
  };

  const fetchDiscounts = async (type = "regular") => {
    try {
      console.log(`Fetching discounts for type: ${type}`);
      const { data } = await api.get(`/discounts?type=${type}`);
      console.log(`Discounts for ${type}:`, data);
      if (!Array.isArray(data)) {
        throw new Error("Received data is not an array");
      }
      setDiscounts(data);
      setError("");
    } catch (err) {
      console.error(`Error fetching discounts for ${type}:`, err);
      setError(`Failed to fetch discounts for ${type}: ${err.message}`);
      setDiscounts([]);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const { data } = await api.get("/promo-codes");
      setPromoCodes(data);
    } catch {
      setError("Failed to fetch promo codes.");
    }
  };

  const addDiscount = async () => {
    if (!newDiscountDate || !newDiscountPercent || !currentCalculatorTab) {
      setError("Будь ласка, заповніть усі поля.");
      return;
    }
    if (newDiscountPercent < 0 || newDiscountPercent > 100) {
      setError("Відсоток знижки має бути від 0 до 100.");
      return;
    }
    setIsLoading(true);
    try {
      const normalizedDate = new Date(newDiscountDate);
      const formattedDate = `${normalizedDate.getFullYear()}-${String(normalizedDate.getMonth() + 1).padStart(2, "0")}-${String(normalizedDate.getDate()).padStart(2, "0")}`;
      console.log(`Adding discount for date: ${formattedDate}, type: ${currentCalculatorTab}, percentage: ${newDiscountPercent}`);
      const response = await api.post("/discounts", {
        date: formattedDate,
        percentage: parseInt(newDiscountPercent),
        type: currentCalculatorTab,
      });
      console.log("Add discount response:", response.data);

      // Додаємо затримку перед оновленням, щоб переконатися, що бекенд завершив транзакцію
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchDiscounts(currentCalculatorTab);
      setNewDiscountDate("");
      setNewDiscountPercent("");
      setError("");
    } catch (err) {
      console.error("Error adding discount:", err);
      setError("Не вдалося додати знижку: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDiscount = async (id) => {
    try {
      await api.delete(`/discounts/${id}`);
      fetchDiscounts(currentCalculatorTab);
    } catch {
      setError("Failed to delete discount.");
    }
  };

  const generatePromoCode = async () => {
    if (!newPromoDiscount) {
      setError("Please enter a discount percentage.");
      return;
    }
    if (newPromoDiscount < 0 || newPromoDiscount > 100) {
      setError("Discount percentage must be between 0 and 100.");
      return;
    }
    setIsLoading(true);
    try {
      const code = `PROMO${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      await api.post("/promo-codes", { code, discount: newPromoDiscount });
      setNewPromoCode(code);
      fetchPromoCodes();
      setNewPromoDiscount("");
      setError("");
    } catch {
      setError("Failed to generate promo code.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePromoCode = async (id) => {
    try {
      await api.delete(`/promo-codes/${id}`);
      fetchPromoCodes();
    } catch {
      setError("Failed to delete promo code.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (currentSection === "calculator" && currentCalculatorTab) {
        fetchDiscounts(currentCalculatorTab);
      }
      if (currentSection === "promocodes") {
        fetchPromoCodes();
      }
    }
  }, [isLoggedIn, currentCalculatorTab, currentSection]);

  function handlePrevMonth() {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  }

  function handleNextMonth() {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  }

  function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className={css.calendarDay}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const discountValue = discounts.find((d) => d.date === formattedDate && d.type === currentCalculatorTab)?.percentage || 0;

      console.log(`Date: ${formattedDate}, Type: ${currentCalculatorTab}, Discount: ${discountValue}`);

      days.push(
        <div
          key={day}
          className={`${css.calendarDay} ${discountValue ? css.discount : ""}`}
          onClick={() => setNewDiscountDate(formattedDate)}
        >
          <span className={css.dayNumber}>{day}</span>
          {discountValue > 0 && <span className={css.discountLabel}>-{discountValue}%</span>}
        </div>
      );
    }
    return days;
  }

  if (!isLoggedIn) {
    return (
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <section className={css.calcWrap}>
      <div className={css.container}>
        <Sidebar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          isSidebarActive={isSidebarActive}
          handleLogout={handleLogout}
        />
        <div className={`${css.main} ${isSidebarActive ? css.active : ""}`}>
          <Topbar isSidebarActive={isSidebarActive} setIsSidebarActive={setIsSidebarActive} />
          <div className={css.contentArea}>
            {error && <p className={css.error}>{error}</p>}
            {currentSection === "calculator" && (
              <CalculatorSection
                currentCalculatorTab={currentCalculatorTab}
                setCurrentCalculatorTab={setCurrentCalculatorTab}
                currentMonth={currentMonth}
                currentYear={currentYear}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                renderCalendar={renderCalendar}
                newDiscountDate={newDiscountDate}
                newDiscountPercent={newDiscountPercent}
                setNewDiscountPercent={setNewDiscountPercent}
                addDiscount={addDiscount}
                deleteDiscount={deleteDiscount}
                discounts={discounts}
                isLoading={isLoading}
                error={error}
              />
            )}
            {currentSection === "promocodes" && (
              <PromoCodesSection
                newPromoDiscount={newPromoDiscount}
                setNewPromoDiscount={setNewPromoDiscount}
                generatePromoCode={generatePromoCode}
                newPromoCode={newPromoCode}
                promoCodes={promoCodes}
                deletePromoCode={deletePromoCode}
                isLoading={isLoading}
              />
            )}
            {currentSection === "users" && <UsersSection api={api} />}
          </div>
        </div>
      </div>
    </section>
  );
}