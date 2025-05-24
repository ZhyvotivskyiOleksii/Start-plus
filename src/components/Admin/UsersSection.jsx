import { useState, useEffect, useCallback, useRef } from "react";
import css from "./AdminPanel.module.css";
import { FaUsers, FaUserCircle, FaChartBar, FaShoppingCart } from "react-icons/fa";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import UserStats from "./UserStats";
import UserOrders from "./UserOrders";
import DeleteUserModal from "./DeleteUserModal";

function UsersSection({ api, lang = "pl" }) {
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
  const [isLoading, setIsLoading] = useState({ users: false, stats: false, orders: false });
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

  const debounceTimeout = useRef(null);
  const lastFetchTime = useRef(0); // Для ограничения частоты запросов
  const isFetchingOrders = useRef(false); // Флаг, чтобы не делать несколько запросов одновременно

  // Тексты для перевода (оставил без изменений, они длинные)
  const texts = {
    pl: {
      list: "Lista użytkowników",
      details: "Szczegóły użytkownika",
      stats: "Statystyka",
      orders: "Zamówienia",
      error: "Wystąpił błąd. Spróbuj ponownie.",
    },
    uk: {
      list: "Список користувачів",
      details: "Деталі користувача",
      stats: "Статистика",
      orders: "Замовлення",
      error: "Сталася помилка. Спробуйте ще раз.",
    },
    ru: {
      list: "Список пользователей",
      details: "Детали пользователя",
      stats: "Статистика",
      orders: "Заказы",
      error: "Произошла ошибка. Попробуйте снова.",
    },
    en: {
      list: "User List",
      details: "User Details",
      stats: "Statistics",
      orders: "Orders",
      error: "An error occurred. Please try again.",
    },
  };

  const t = { ...texts[lang], ...{
    title: lang === "pl" ? "Lista użytkowników" : lang === "uk" ? "Список користувачів" : lang === "ru" ? "Список пользователей" : "User List",
    userDetails: lang === "pl" ? "Szczegóły użytkownika" : lang === "uk" ? "Деталі користувача" : lang === "ru" ? "Детали пользователя" : "User Details",
    stats: lang === "pl" ? "Statystyka" : lang === "uk" ? "Статистика" : lang === "ru" ? "Статистика" : "Statistics",
    orders: lang === "pl" ? "Zamówienia" : lang === "uk" ? "Замовлення" : lang === "ru" ? "Заказы" : "Orders",
    loading: lang === "pl" ? "Ładowanie..." : lang === "uk" ? "Завантаження..." : lang === "ru" ? "Загрузка..." : "Loading...",
    noData: lang === "pl" ? "Brak" : lang === "uk" ? "Немає даних" : lang === "ru" ? "Нет данных" : "No data",
    all: lang === "pl" ? "Wszystkie" : lang === "uk" ? "Усі" : lang === "ru" ? "Все" : "All",
    error: lang === "pl" ? "Wystąpił błąd. Spróbuj ponownie." : lang === "uk" ? "Сталася помилка. Спробуйте ще раз." : lang === "ru" ? "Произошла ошибка. Попробуйте снова." : "An error occurred. Please try again.",
    save: lang === "pl" ? "Zapisz" : lang === "uk" ? "Зберегти" : lang === "ru" ? "Сохранить" : "Save",
    confirm: lang === "pl" ? "Potwierdź" : lang === "uk" ? "Підтвердити" : lang === "ru" ? "Подтвердить" : "Confirm",
    cancel: lang === "pl" ? "Anuluj" : lang === "uk" ? "Скасувати" : lang === "ru" ? "Отмена" : "Cancel",
    refresh: lang === "pl" ? "Odśwież" : lang === "uk" ? "Оновити" : lang === "ru" ? "Обновить" : "Refresh",

    statusLabel: lang === "pl" ? "Status" : lang === "uk" ? "Статус" : lang === "ru" ? "Статус" : "Status",
    searchLabel: lang === "pl" ? "Szukaj" : lang === "uk" ? "Пошук" : lang === "ru" ? "Поиск" : "Search",
    searchPlaceholder: lang === "pl" ? "Imię, telefon, email..." : lang === "uk" ? "Ім'я, телефон, email..." : lang === "ru" ? "Имя, телефон, email..." : "Name, phone, email...",
    noUsers: lang === "pl" ? "Brak użytkowników." : lang === "uk" ? "Немає користувачів." : lang === "ru" ? "Нет пользователей." : "No users.",
    id: lang === "pl" ? "ID" : lang === "uk" ? "ID" : lang === "ru" ? "ID" : "ID",
    name: lang === "pl" ? "Imię" : lang === "uk" ? "Ім'я" : lang === "ru" ? "Имя" : "Name",
    phone: lang === "pl" ? "Telefon" : lang === "uk" ? "Телефон" : lang === "ru" ? "Телефон" : "Phone",
    email: lang === "pl" ? "Adres e-mail" : lang === "uk" ? "Електронна пошта" : lang === "ru" ? "Электронная почта" : "Email",
    totalOrders: lang === "pl" ? "Liczba zamówień" : lang === "uk" ? "Кількість замовлень" : lang === "ru" ? "Количество заказов" : "Total Orders",
    totalSpent: lang === "pl" ? "Całkowite wydatki" : lang === "uk" ? "Загальні витрати" : lang === "ru" ? "Общие расходы" : "Total Spent",
    registrationDate: lang === "pl" ? "Data rejestracji" : lang === "uk" ? "Дата реєстрації" : lang === "ru" ? "Дата регистрации" : "Registration Date",
    lastLogin: lang === "pl" ? "Ostatnie logowanie" : lang === "uk" ? "Останній вхід" : lang === "ru" ? "Последний вход" : "Last Login",
    status: lang === "pl" ? "Status" : lang === "uk" ? "Статус" : lang === "ru" ? "Статус" : "Status",
    actions: lang === "pl" ? "Działania" : lang === "uk" ? "Дії" : lang === "ru" ? "Действия" : "Actions",
    viewDetails: lang === "pl" ? "Szczegóły" : lang === "uk" ? "Деталі" : lang === "ru" ? "Детали" : "View Details",
    deleteUser: lang === "pl" ? "Usuń użytkownika" : lang === "uk" ? "Видалити користувача" : lang === "ru" ? "Удалить пользователя" : "Delete User",
    active: lang === "pl" ? "Aktywne" : lang === "uk" ? "Активні" : lang === "ru" ? "Активные" : "Active",
    inactive: lang === "pl" ? "Nieaktywne" : lang === "uk" ? "Неактивні" : lang === "ru" ? "Неактивные" : "Inactive",
    banned: lang === "pl" ? "Zablokowane" : lang === "uk" ? "Заблоковані" : lang === "ru" ? "Заблокированные" : "Banned",

    serviceTypeLabel: lang === "pl" ? "Typ usługi" : lang === "uk" ? "Тип послуги" : lang === "ru" ? "Тип услуги" : "Service Type",
    regularCleaning: lang === "pl" ? "Zwykłe sprzątanie" : lang === "uk" ? "Звичайне прибирання" : lang === "ru" ? "Обычная уборка" : "Regular Cleaning",
    postRenovation: lang === "pl" ? "Po remoncie" : lang === "uk" ? "Після ремонту" : lang === "ru" ? "После ремонта" : "Post-Renovation",
    windowCleaning: lang === "pl" ? "Mycie okien" : lang === "uk" ? "Миття вікон" : lang === "ru" ? "Мойка окон" : "Window Cleaning",
    officeCleaning: lang === "pl" ? "Sprzątanie biur" : lang === "uk" ? "Прибирання офісів" : lang === "ru" ? "Уборка офисов" : "Office Cleaning",
    privateHouse: lang === "pl" ? "Dom prywatny" : lang === "uk" ? "Приватний будинок" : lang === "ru" ? "Частный дом" : "Private House",
    noOrders: lang === "pl" ? "Brak zamówień." : lang === "uk" ? "Немає замовлень." : lang === "ru" ? "Нет заказов." : "No orders.",
    user: lang === "pl" ? "Użytkownik" : lang === "uk" ? "Користувач" : lang === "ru" ? "Пользователь" : "User",
    noUser: lang === "pl" ? "Brak użytkownika" : lang === "uk" ? "Немає користувача" : lang === "ru" ? "Нет пользователя" : "No user",
    serviceType: lang === "pl" ? "Typ usługi" : lang === "uk" ? "Тип послуги" : lang === "ru" ? "Тип услуги" : "Service Type",
    price: lang === "pl" ? "Cena" : lang === "uk" ? "Ціна" : lang === "ru" ? "Цена" : "Price",
    date: lang === "pl" ? "Data" : lang === "uk" ? "Дата" : lang === "ru" ? "Дата" : "Date",
    paymentStatus: lang === "pl" ? "Status Płatności" : lang === "uk" ? "Статус платежу" : lang === "ru" ? "Статус платежа" : "Payment Status",
    details: lang === "pl" ? "Szczegóły" : lang === "uk" ? "Деталі" : lang === "ru" ? "Детали" : "Details",
    showDetails: lang === "pl" ? "Pokaż szczegóły" : lang === "uk" ? "Показати деталі" : lang === "ru" ? "Показать детали" : "Show Details",
    hideDetails: lang === "pl" ? "Ukryj szczegóły" : lang === "uk" ? "Сховати деталі" : lang === "ru" ? "Скрыть детали" : "Hide Details",
    address: lang === "pl" ? "Adres" : lang === "uk" ? "Адреса" : lang === "ru" ? "Адрес" : "Address",
    rooms: lang === "pl" ? "Pokoje" : lang === "uk" ? "Кімнати" : lang === "ru" ? "Комнаты" : "Rooms",
    bathrooms: lang === "pl" ? "Łazienki" : lang === "uk" ? "Ванні кімнати" : lang === "ru" ? "Ванные комнаты" : "Bathrooms",
    kitchen: lang === "pl" ? "Kuchnia" : lang === "uk" ? "Кухня" : lang === "ru" ? "Кухня" : "Kitchen",
    kitchenAnnex: lang === "pl" ? "Aneks kuchenny" : lang === "uk" ? "Кухонний куточок" : lang === "ru" ? "Кухонный уголок" : "Kitchen Annex",
    vacuumNeeded: lang === "pl" ? "Potrzebny odkurzacz" : lang === "uk" ? "Потрібен пилосос" : lang === "ru" ? "Нужен пылесос" : "Vacuum Needed",
    cleaningFrequency: lang === "pl" ? "Częstotliwość sprzątania" : lang === "uk" ? "Частота прибирання" : lang === "ru" ? "Частота уборки" : "Cleaning Frequency",
    services: lang === "pl" ? "Usługi" : lang === "uk" ? "Послуги" : lang === "ru" ? "Услуги" : "Services",
    noServices: lang === "pl" ? "Brak usług." : lang === "uk" ? "Немає послуг." : lang === "ru" ? "Нет услуг." : "No services.",
    additionalInfo: lang === "pl" ? "Dodatkowe informacje" : lang === "uk" ? "Додаткова інформація" : lang === "ru" ? "Дополнительная информация" : "Additional Info",
    pending: lang === "pl" ? "Oczekujące" : lang === "uk" ? "Очікує" : lang === "ru" ? "Ожидает" : "Pending",
    completed: lang === "pl" ? "Zrealizowane" : lang === "uk" ? "Виконане" : lang === "ru" ? "Выполнено" : "Completed",
    cancelled: lang === "pl" ? "Anulowane" : lang === "uk" ? "Скасоване" : lang === "ru" ? "Отменено" : "Cancelled",
    paid: lang === "pl" ? "Opłacone" : lang === "uk" ? "Оплачено" : lang === "ru" ? "Оплачено" : "Paid",
    pendingPayment: lang === "pl" ? "Oczekujące na płatność" : lang === "uk" ? "Очікує оплати" : lang === "ru" ? "Ожидает оплаты" : "Pending Payment",
    dateFrom: lang === "pl" ? "Data od" : lang === "uk" ? "Дата від" : lang === "ru" ? "Дата от" : "Date From",
    dateTo: lang === "pl" ? "Data do" : lang === "uk" ? "Дата до" : lang === "ru" ? "Дата до" : "Date To",
    sortBy: lang === "pl" ? "Sortuj według" : lang === "uk" ? "Сортувати за" : lang === "ru" ? "Сортировать по" : "Sort by",
    ascending: lang === "pl" ? "Rosnąco" : lang === "uk" ? "За зростанням" : lang === "ru" ? "По возрастанию" : "Ascending",
    descending: lang === "pl" ? "Malejąco" : lang === "uk" ? "За спаданням" : lang === "ru" ? "По убыванию" : "Descending",

    clientType: lang === "pl" ? "Typ klienta" : lang === "uk" ? "Тип клієнта" : lang === "ru" ? "Тип клиента" : "Client Type",
    orderHistory: lang === "pl" ? "Historia zamówień" : lang === "uk" ? "Історія замовлень" : lang === "ru" ? "История заказов" : "Order History",

    period: lang === "pl" ? "Okres" : lang === "uk" ? "Період" : lang === "ru" ? "Период" : "Period",
    last7Days: lang === "pl" ? "Ostatnie 7 dni" : lang === "uk" ? "Останні 7 днів" : lang === "ru" ? "Последние 7 дней" : "Last 7 Days",
    last30Days: lang === "pl" ? "Ostatnie 30 dni" : lang === "uk" ? "Останні 30 днів" : lang === "ru" ? "Последние 30 дней" : "Last 30 Days",
    lastYear: lang === "pl" ? "Ostatni rok" : lang === "uk" ? "Останній рік" : lang === "ru" ? "Последний год" : "Last Year",
    noStatsData: lang === "pl" ? "Brak danych statystycznych." : lang === "uk" ? "Немає даних статистики." : lang === "ru" ? "Нет данных статистики." : "No statistics data.",
    totalUsers: lang === "pl" ? "Liczba użytkowników:" : lang === "uk" ? "Кількість користувачів:" : lang === "ru" ? "Количество пользователей:" : "Total Users:",
    avgOrdersPerUser: lang === "pl" ? "Średnia liczba zamówień na użytkownika:" : lang === "uk" ? "Середня кількість замовлень на користувача:" : lang === "ru" ? "Среднее количество заказов на пользователя:" : "Average Orders per User:",
    totalOrders: lang === "pl" ? "Całkowita liczba zamówień:" : lang === "uk" ? "Загальна кількість замовлень:" : lang === "ru" ? "Общее количество заказов:" : "Total Orders:",
    totalRevenue: lang === "pl" ? "Całkowity przychód:" : lang === "uk" ? "Загальний дохід:" : lang === "ru" ? "Общий доход:" : "Total Revenue:",
    activeUsers: lang === "pl" ? "Aktywni użytkownicy" : lang === "uk" ? "Активні користувачі" : lang === "ru" ? "Активные пользователи" : "Active Users",
    inactiveUsers: lang === "pl" ? "Nieaktywni użytkownicy" : lang === "uk" ? "Неактивні користувачі" : lang === "ru" ? "Неактивные пользователи" : "Inactive Users",
    bannedUsers: lang === "pl" ? "Zablokowani użytkownicy" : lang === "uk" ? "Заблоковані користувачі" : lang === "ru" ? "Заблокированные пользователи" : "Banned Users",
    userStatus: lang === "pl" ? "Status użytkowników" : lang === "uk" ? "Статус користувачів" : lang === "ru" ? "Статус пользователей" : "User Status",
    userStatusDistribution: lang === "pl" ? "Rozkład statusów użytkowników" : lang === "uk" ? "Розподіл статусів користувачів" : lang === "ru" ? "Распределение статусов пользователей" : "User Status Distribution",
    newUsersPeriod: lang === "pl" ? "Nowi użytkownicy (okres)" : lang === "uk" ? "Нові користувачі (період)" : lang === "ru" ? "Новые пользователи (период)" : "New Users (Period)",
    newUsersInPeriod: lang === "pl" ? "Nowi użytkownicy w wybranym okresie" : lang === "uk" ? "Нові користувачі за вибраний період" : lang === "ru" ? "Новые пользователи за выбранный период" : "New Users in Selected Period",
    numberOfNewUsers: lang === "pl" ? "Liczba nowych użytkowników" : lang === "uk" ? "Кількість нових користувачів" : lang === "ru" ? "Количество новых пользователей" : "Number of New Users",
    estimatedRevenue: lang === "pl" ? "Przybliżony dochód (PLN)" : lang === "uk" ? "Приблизний дохід (PLN)" : lang === "ru" ? "Примерный доход (PLN)" : "Estimated Revenue (PLN)",
    estimatedRevenueInPeriod: lang === "pl" ? "Przybliżony dochód w wybranym okresie" : lang === "uk" ? "Приблизний дохід за вибраний період" : lang === "ru" ? "Примерный доход за выбранный период" : "Estimated Revenue in Selected Period",
    revenue: lang === "pl" ? "Dochód (PLN)" : lang === "uk" ? "Дохід (PLN)" : lang === "ru" ? "Доход (PLN)" : "Revenue (PLN)",

    deleteUser: lang === "pl" ? "Usuń użytkownika" : lang === "uk" ? "Видалити користувача" : lang === "ru" ? "Удалить пользователя" : "Delete User",
    confirmDeleteMessage: lang === "pl" ? "Czy na pewno chcesz usunąć użytkownika" : lang === "uk" ? "Ви впевнені, що хочете видалити користувача" : lang === "ru" ? "Вы уверены, что хотите удалить пользователя" : "Are you sure you want to delete user",

    oven_cleaning: lang === "pl" ? "Mycie piekarnika" : lang === "uk" ? "Миття духовки" : lang === "ru" ? "Мойка духовки" : "Oven cleaning",
    hood_cleaning: lang === "pl" ? "Mycie okapu" : lang === "uk" ? "Миття витяжки" : lang === "ru" ? "Мойка вытяжки" : "Hood cleaning",
    kitchen_cabinets_cleaning: lang === "pl" ? "Sprzątanie wnętrza szafek kuchennych" : lang === "uk" ? "Прибирання всередині кухонних шаф" : lang === "ru" ? "Уборка внутри кухонных шкафов" : "Cleaning inside kitchen cabinets",
    dish_washing: lang === "pl" ? "Mycie naczyń" : lang === "uk" ? "Миття посуду" : lang === "ru" ? "Мойка посуды" : "Dish washing",
    fridge_cleaning: lang === "pl" ? "Czyszczenie lodówki" : lang === "uk" ? "Чищення холодильника" : lang === "ru" ? "Чистка холодильника" : "Fridge cleaning",
    microwave_cleaning: lang === "pl" ? "Mycie mikrofalówki" : lang === "uk" ? "Миття мікрохвильовки" : lang === "ru" ? "Мойка микроволновки" : "Microwave cleaning",
    balcony_cleaning: lang === "pl" ? "Sprzątanie balkonu" : lang === "uk" ? "Прибирання балкону" : lang === "ru" ? "Уборка балкона" : "Balcony cleaning",
    window_cleaning: lang === "pl" ? "Mycie okien (szt.)" : lang === "uk" ? "Миття вікон (шт.)" : lang === "ru" ? "Мойка окон (шт.)" : "Window cleaning (unit)",
    ironing: lang === "pl" ? "Prasowanie" : lang === "uk" ? "Прасування" : lang === "ru" ? "Глажка" : "Ironing",
    pet_tray_cleaning: lang === "pl" ? "Sprzątanie kuwety" : lang === "uk" ? "Прибирання лотка для тварин" : lang === "ru" ? "Уборка лотка для животных" : "Pet tray cleaning",
    extra_hours: lang === "pl" ? "Dodatkowe godziny" : lang === "uk" ? "Додаткові години" : lang === "ru" ? "Дополнительные часы" : "Extra hours",
    wardrobe_cleaning: lang === "pl" ? "Czyszczenie wnętrza szafy" : lang === "uk" ? "Чищення всередині шафи" : lang === "ru" ? "Чистка внутри шкафа" : "Cleaning inside wardrobe",
  }};

  const fetchUsers = useCallback(async (params = {}) => {
    setIsLoading((prev) => ({ ...prev, users: true }));
    try {
      const { data } = await api.get("/users", { params });
      setUsers(data);
      localStorage.setItem("users", JSON.stringify(data));
      setError("");
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading((prev) => ({ ...prev, users: false }));
    }
  }, [api, t]);

  const fetchUserDetails = async (id) => {
    setIsLoading((prev) => ({ ...prev, users: true }));
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
      setError(t.error);
    } finally {
      setIsLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchStats = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, stats: true }));
    try {
      const { data } = await api.get("/users/stats", { params: { period: statsPeriod } });
      setStats(data);
      localStorage.setItem("stats", JSON.stringify(data));
      setError("");
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading((prev) => ({ ...prev, stats: false }));
    }
  }, [api, statsPeriod, t]);

  // Изменение 1: Добавляем защиту от одновременных запросов
  const fetchOrders = useCallback(async (params = {}) => {
    if (isFetchingOrders.current) return; // Если запрос уже выполняется, пропускаем

    const now = Date.now();
    if (now - lastFetchTime.current < 1000) return; // Ограничение: не чаще 1 раза в секунду

    isFetchingOrders.current = true; // Устанавливаем флаг, что запрос начался
    setIsLoading((prev) => ({ ...prev, orders: true }));
    try {
      const { data } = await api.get("/orders", { params });
      setOrders(data);
      localStorage.setItem("orders", JSON.stringify(data));
      setError("");
      lastFetchTime.current = now;
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading((prev) => ({ ...prev, orders: false }));
      isFetchingOrders.current = false; // Сбрасываем флаг после завершения
    }
  }, [api, t]);

  const updateUser = async (id, updates) => {
    setIsLoading((prev) => ({ ...prev, users: true }));
    try {
      await api.put(`/users/${id}`, updates);
      fetchUsers({ status: statusFilter, search: searchQuery });
      if (selectedUser) fetchUserDetails(id);
      setError("");
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const deleteUser = async (id) => {
    setIsLoading((prev) => ({ ...prev, users: true }));
    try {
      await api.delete(`/users/${id}`);
      fetchUsers({ status: statusFilter, search: searchQuery });
      setSelectedUser(null);
      localStorage.removeItem("selectedUser");
      setActiveTab("list");
      localStorage.setItem("usersActiveTab", "list");
      setError("");
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading((prev) => ({ ...prev, users: false }));
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
    setIsLoading((prev) => ({ ...prev, orders: true }));
    try {
      await api.put(`/orders/${id}`, { status });
      fetchOrders({
        service_type: serviceTypeFilter,
        status: orderStatusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      });
      if (selectedUser) fetchUserDetails(selectedUser.id);
      setError("");
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  // Изменение 2: Начальная загрузка данных (убираем лишние зависимости)
  useEffect(() => {
    if (activeTab === "list" && users.length === 0) {
      const paramsUsers = { status: statusFilter, search: searchQuery };
      fetchUsers(paramsUsers);
    }
    if (activeTab === "stats" && !stats) {
      fetchStats();
    }
    if (activeTab === "orders" && orders.length === 0) {
      const paramsOrders = {
        service_type: serviceTypeFilter,
        status: orderStatusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      };
      fetchOrders(paramsOrders);
    }
  }, [activeTab, users.length, stats, orders.length, statusFilter, searchQuery, serviceTypeFilter, orderStatusFilter, dateFrom, dateTo, fetchUsers, fetchStats, fetchOrders]);

  // Изменение 3: Периодическое обновление (убираем зависимости фильтров)
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "list") {
        const paramsUsers = { status: statusFilter, search: searchQuery };
        fetchUsers(paramsUsers);
      }
      if (activeTab === "stats") {
        fetchStats();
      }
      if (activeTab === "orders") {
        const paramsOrders = {
          service_type: serviceTypeFilter,
          status: orderStatusFilter,
          date_from: dateFrom,
          date_to: dateTo,
        };
        fetchOrders(paramsOrders);
      }
    }, 300000); // Каждые 5 минут

    return () => clearInterval(interval);
  }, [activeTab, fetchUsers, fetchStats, fetchOrders]); // Убрали фильтры из зависимостей

  // Изменение 4: Обновление при смене фильтров (убираем fetchOrders из зависимостей)
  useEffect(() => {
    if (activeTab !== "orders") return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const paramsOrders = {
        service_type: serviceTypeFilter,
        status: orderStatusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      };
      fetchOrders(paramsOrders);
    }, 500); // Задержка 500 мс

    return () => clearTimeout(debounceTimeout.current);
  }, [activeTab, serviceTypeFilter, orderStatusFilter, dateFrom, dateTo]); // Убрали fetchOrders

  // Сохранение активной вкладки
  useEffect(() => {
    localStorage.setItem("usersActiveTab", activeTab);
  }, [activeTab]);

  // Обработка изменения фильтров для пользователей
  const handleFetchUsers = () => {
    const params = { status: statusFilter, search: searchQuery };
    localStorage.setItem("statusFilter", statusFilter);
    localStorage.setItem("searchQuery", searchQuery);
    fetchUsers(params);
  };

  // Обработка изменения фильтров для заказов (ручное обновление через кнопку)
  const handleFetchOrders = () => {
    const params = {
      service_type: serviceTypeFilter,
      status: orderStatusFilter,
      date_from: dateFrom,
      date_to: dateTo,
    };
    localStorage.setItem("serviceTypeFilter", serviceTypeFilter);
    localStorage.setItem("orderStatusFilter", orderStatusFilter);
    localStorage.setItem("dateFrom", dateFrom);
    localStorage.setItem("dateTo", dateTo);
    fetchOrders(params);
  };

  // Обработка изменения периода для статистики
  const handleFetchStats = () => {
    localStorage.setItem("statsPeriod", statsPeriod);
    fetchStats();
  };

  const userTabs = [
    { id: "list", label: t.list, icon: <FaUsers /> },
    { id: "details", label: t.details, icon: <FaUserCircle /> },
    { id: "stats", label: t.stats, icon: <FaChartBar /> },
    { id: "orders", label: t.orders, icon: <FaShoppingCart /> },
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
          <div>
            <div className={css.filters}>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>{t.statusLabel}</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">{t.all}</option>
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                  <option value="banned">{t.banned}</option>
                </select>
              </div>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>{t.searchLabel}</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                />
              </div>
              <button className={css.actionBtn} onClick={handleFetchUsers} disabled={isLoading.users}>
                {isLoading.users ? t.loading : t.refresh}
              </button>
            </div>
            <UserList
              users={users}
              setUsers={setUsers}
              setActiveTab={setActiveTab}
              setSelectedUser={setSelectedUser}
              fetchUsers={fetchUsers}
              fetchUserDetails={fetchUserDetails}
              handleOpenDeleteModal={handleOpenDeleteModal}
              isLoading={isLoading.users}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              t={t}
            />
          </div>
        )}

        {activeTab === "details" && selectedUser && (
          <UserDetails
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            updateUser={updateUser}
            updateOrder={updateOrder}
            isLoading={isLoading.users}
            t={t}
          />
        )}

        {activeTab === "stats" && (
          <div>
            <div className={css.filters}>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>{t.period}</label>
                <select value={statsPeriod} onChange={(e) => setStatsPeriod(e.target.value)}>
                  <option value="7d">{t.last7Days}</option>
                  <option value="30d">{t.last30Days}</option>
                  <option value="1y">{t.lastYear}</option>
                </select>
              </div>
              <button className={css.actionBtn} onClick={handleFetchStats} disabled={isLoading.stats}>
                {isLoading.stats ? t.loading : t.refresh}
              </button>
            </div>
            <UserStats
              stats={stats}
              setStats={setStats}
              fetchStats={fetchStats}
              statsPeriod={statsPeriod}
              setStatsPeriod={setStatsPeriod}
              isLoading={isLoading.stats}
              t={t}
            />
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <div className={css.filters}>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>{t.serviceTypeLabel}</label>
                <select value={serviceTypeFilter} onChange={(e) => setServiceTypeFilter(e.target.value)}>
                  <option value="">{t.all}</option>
                  <option value="regular">{t.regularCleaning}</option>
                  <option value="post-renovation">{t.postRenovation}</option>
                  <option value="window-cleaning">{t.windowCleaning}</option>
                  <option value="office-cleaning">{t.officeCleaning}</option>
                  <option value="private-house">{t.privateHouse}</option>
                </select>
              </div>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>{t.statusLabel}</label>
                <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
                  <option value="">{t.all}</option>
                  <option value="pending">{t.pending}</option>
                  <option value="completed">{t.completed}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>
              </div>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>{t.dateFrom}</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className={css.inputGroup}>
                <label className={css.inputLabel}>{t.dateTo}</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <button className={css.actionBtn} onClick={handleFetchOrders} disabled={isLoading.orders}>
                {isLoading.orders ? t.loading : t.refresh}
              </button>
            </div>
            {error && <p className={css.error}>{error}</p>}
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
              isLoading={isLoading.orders}
              t={t}
            />
          </div>
        )}

        <DeleteUserModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          handleConfirmDelete={handleConfirmDelete}
          userToDelete={userToDelete}
          t={t}
        />
      </div>
    </div>
  );
}

export default UsersSection;