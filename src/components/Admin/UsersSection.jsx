import { useState, useEffect, useCallback, useRef } from "react";
import css from "./AdminPanel.module.css";
import { FaUsers, FaUserCircle, FaChartBar, FaShoppingCart } from "react-icons/fa";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import UserStats from "./UserStats";
import UserOrders from "./UserOrders";
import DeleteUserModal from "./DeleteUserModal";

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

  const debounceTimeoutUsers = useRef(null);
  const debounceTimeoutOrders = useRef(null);
  const debounceTimeoutStats = useRef(null);

  const fetchUsers = useCallback(async () => {
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
  }, [api, statusFilter, searchQuery]);

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

  const fetchStats = useCallback(async () => {
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
  }, [api, statsPeriod]);

  const fetchOrders = useCallback(async () => {
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
  }, [api, serviceTypeFilter, orderStatusFilter, dateFrom, dateTo]);

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
    fetchUsers();
    fetchStats();
    fetchOrders();

    const interval = setInterval(() => {
      fetchUsers();
      fetchStats();
      fetchOrders();
    }, 300000);

    return () => clearInterval(interval);
  }, [fetchUsers, fetchStats, fetchOrders]);

  useEffect(() => {
    if (debounceTimeoutUsers.current) {
      clearTimeout(debounceTimeoutUsers.current);
    }

    debounceTimeoutUsers.current = setTimeout(() => {
      localStorage.setItem("statusFilter", statusFilter);
      localStorage.setItem("searchQuery", searchQuery);
      fetchUsers();
    }, 500);

    return () => clearTimeout(debounceTimeoutUsers.current);
  }, [statusFilter, searchQuery, fetchUsers]);

  useEffect(() => {
    if (debounceTimeoutOrders.current) {
      clearTimeout(debounceTimeoutOrders.current);
    }

    debounceTimeoutOrders.current = setTimeout(() => {
      localStorage.setItem("serviceTypeFilter", serviceTypeFilter);
      localStorage.setItem("orderStatusFilter", orderStatusFilter);
      localStorage.setItem("dateFrom", dateFrom);
      localStorage.setItem("dateTo", dateTo);
      fetchOrders();
    }, 500);

    return () => clearTimeout(debounceTimeoutOrders.current);
  }, [serviceTypeFilter, orderStatusFilter, dateFrom, dateTo, fetchOrders]);

  useEffect(() => {
    if (debounceTimeoutStats.current) {
      clearTimeout(debounceTimeoutStats.current);
    }

    debounceTimeoutStats.current = setTimeout(() => {
      localStorage.setItem("statsPeriod", statsPeriod);
      fetchStats();
    }, 500);

    return () => clearTimeout(debounceTimeoutStats.current);
  }, [statsPeriod, fetchStats]);

  useEffect(() => {
    localStorage.setItem("usersActiveTab", activeTab);
  }, [activeTab]);

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
          <UserList
            users={users}
            setUsers={setUsers}
            setActiveTab={setActiveTab}
            setSelectedUser={setSelectedUser}
            fetchUsers={fetchUsers}
            fetchUserDetails={fetchUserDetails}
            handleOpenDeleteModal={handleOpenDeleteModal}
            isLoading={isLoading}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === "details" && selectedUser && (
          <UserDetails
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            updateUser={updateUser}
            updateOrder={updateOrder}
            isLoading={isLoading}
          />
        )}

        {activeTab === "stats" && (
          <UserStats
            stats={stats}
            setStats={setStats}
            fetchStats={fetchStats}
            statsPeriod={statsPeriod}
            setStatsPeriod={setStatsPeriod}
            isLoading={isLoading}
          />
        )}

        {activeTab === "orders" && (
          <UserOrders
            orders={orders}
            setOrders={setOrders}
            fetchOrders={fetchOrders}
            serviceTypeFilter={serviceTypeFilter}
            setServiceTypeFilter={setServiceTypeFilter}
            orderStatusFilter={orderStatusFilter}
            setOrderStatusFilter={setOrderStatusFilter}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            updateOrder={updateOrder}
            isLoading={isLoading}
          />
        )}

        <DeleteUserModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          handleConfirmDelete={handleConfirmDelete}
          userToDelete={userToDelete}
        />
      </div>
    </div>
  );
}

export default UsersSection;