import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Home,
  ListOrdered,
  Sparkles,
  User,
  Calendar,
  Menu,
  X,
  Clock,
  Percent,
  LogOut,
} from "lucide-react";
import styles from "./Dashboard.module.css";

export default function Dashboard({ lang = "uk", handleLogout }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cardsWrapperRef = useRef(null);

  const [phone, setPhone] = useState(() => localStorage.getItem("phone"));

  const menuItems = {
    uk: [
      { name: "Звичайне", mobileName: "Звичайне Прибирання", icon: "/icon/cleaning-home.png", image: "/images/bear1.png", tag: "Popularne" },
      { name: "Ремонт", mobileName: "Після Ремонту", icon: "/icon/paint.png", image: "/images/bear2.png", tag: "Popularne" },
      { name: "Миття вікон", mobileName: "Миття Вікон", icon: "/icon/window.png", image: "/images/bear3.png", tag: "Popularne" },
      { name: "Приватний будинок", mobileName: "Приватний Будинок", icon: "/icon/house.png", image: "/images/bear4.png", tag: "Nowe" },
      { name: "Прибирання офісів", mobileName: "Прибирання Офісів", icon: "/icon/office.png", image: "/images/bear5.png", tag: "Popularne" },
    ],
  };

  const recommendedServices = [
    { name: "Генеральне прибирання", icon: menuItems[lang]?.find(item => item.name === "Звичайне")?.icon || "/icon/cleaning-home.png", category: "general" },
    { name: "Миття вікон", icon: menuItems[lang]?.find(item => item.name === "Миття вікон")?.icon || "/icon/window.png", category: "window-cleaning" },
    { name: "Прибирання після ремонту", icon: menuItems[lang]?.find(item => item.name === "Ремонт")?.icon || "/icon/paint.png", category: "renovation" },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);

      const storedPhone = localStorage.getItem("phone");
      if (!storedPhone) {
        console.log("No phone in localStorage, redirecting to /login");
        if (isMounted) {
          setIsLoading(false);
          navigate("/login", { replace: true });
        }
        return;
      }

      setPhone(storedPhone);
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3001"
            : "https://startplus-clean.com/sms-auth-php";

        const userResponse = await fetch(
          `${baseUrl}/api/users?phone=${encodeURIComponent(storedPhone)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error("Error fetching user:", errorData);
          if (userResponse.status === 404) {
            localStorage.removeItem("phone");
            localStorage.removeItem("token");
            if (isMounted) {
              setPhone(null);
              setIsLoading(false);
              navigate("/login", { replace: true });
            }
            return;
          }
          throw new Error(errorData.message || "Помилка завантаження даних користувача");
        }
        let userData = await userResponse.json();
        if (Array.isArray(userData) && userData.length === 1) {
          userData = userData[0];
        }
        console.log("User Data:", userData);
        if (isMounted) setUser(userData);

        if (!userData.id) {
          console.error("User data does not contain id:", userData);
          throw new Error("Invalid user data: no id provided");
        }

        const fetchOrders = async () => {
          try {
            const orderResponse = await fetch(
              `${baseUrl}/api/orders?user_id=${userData.id}&limit=1`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!orderResponse.ok) {
              const errorData = await orderResponse.json();
              console.error("Error fetching orders:", errorData);
              if (isMounted) setOrder(null);
            } else {
              const orders = await orderResponse.json();
              console.log("Orders Data:", orders);
              if (orders && orders.length > 0 && isMounted) {
                const latestOrder = orders[0];
                setOrder({
                  order_id: latestOrder.id,
                  order_date: latestOrder.order_date || "Н/Д",
                  address: latestOrder.address || {},
                  city: latestOrder.city || "Н/Д",
                  total_price: latestOrder.total_price || 0,
                  payment_status: latestOrder.payment_status || "pending",
                  order_details: latestOrder.order_details || {},
                  order_type: latestOrder.order_type || "standard",
                  additionalInfo: latestOrder.client_info?.additional_info || latestOrder.details || "Н/Д",
                  is_subscription: latestOrder.order_details?.cleaning_frequency && latestOrder.order_details.cleaning_frequency !== "Одноразово",
                  windows: latestOrder.windows || null,
                  balconies: latestOrder.balconies || null,
                  area: latestOrder.area || null,
                  office_area: latestOrder.office_area || null,
                  workspaces: latestOrder.workspaces || null,
                  cleaning_frequency: latestOrder.cleaning_frequency || null,
                });
              } else if (isMounted) {
                setOrder(null);
              }
            }
          } catch (orderError) {
            console.error("Error fetching orders:", orderError.message);
            if (isMounted) setOrder(null);
          }
        };

        await fetchOrders();
        const intervalId = setInterval(fetchOrders, 30000);

        const statsResponse = await fetch(
          `${baseUrl}/api/users/stats?period=30d`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json();
          console.error("Error fetching stats:", errorData);
          throw new Error(errorData.message || "Помилка завантаження статистики");
        }
        const statsData = await statsResponse.json();
        console.log("Stats Data:", statsData);
        if (isMounted) setStats(statsData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        if (isMounted) {
          setError(error.message);
          setIsLoading(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }

      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    };

    fetchData();
  }, [navigate]);

  const translations = {
    uk: {
      greeting: "Привіт!",
      subGreeting: "Раді бачити тебе!",
      lastOrder: "Минуле замовлення",
      date: "Н/Д",
      address: "Н/Д",
      price: "0 злотих",
      repeat: "Повторити",
      order: "Замовити",
      details: "Деталі",
      bonus: "Ваш бонус",
      bonusAmount: "0 злотих",
      recommendedServices: "Рекомендовані послуги",
      cleaning: "Генеральне прибирання",
      cleaningPrice: "155.92 злотих – 255.92 злотих",
      windowCleaning: "Миття вікон",
      windowPrice: "40.00 злотих – 52.00 злотих",
      createNewOrder: "Створіть нове замовлення",
      createNewOrderDesc:
        "Привіт, швидше створюйте замовлення і ми знайдемо кращого фахівця.",
      newOrder: "Нове замовлення",
      noOrders: "Ви ще не зробили замовлення. Створіть перше прибирання!",
      nav: {
        dashboard: "Дашборд",
        orders: "Замовлення",
        bonus: "Бонус",
        services: "Послуги",
        profile: "Профіль",
      },
      loading: "Завантаження...",
      logout: "Вийти",
      error: "Помилка завантаження даних. Спробуйте пізніше.",
      orderTypes: {
        standard: "Стандартне прибирання",
        general: "Генеральне прибирання",
        window_cleaning: "Миття вікон",
        renovation: "Прибирання після ремонту",
        office: "Офісне прибирання",
        private_house: "Прибирання приватного будинку",
        apartment: "Прибирання квартири",
      },
      bonusInfo: {
        title: "Як працюють ваші бонуси?",
        earn: "Заробляйте 5% від кожної суми замовлення від 50 злотих!",
        limit: "Використовуйте до 50% від суми нового замовлення.",
        expiry: "Бонуси дійсні 6 місяців з моменту нарахування.",
        note: "1 бонус = 1 зл",
        pendingNote: "Бонуси будуть вам нараховані після оплати замовлення",
      },
    },
  };

  const t = translations[lang] || translations.uk;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (window.innerWidth <= 768) {
        setCurrentIndex((i) => (i + 1) % recommendedServices.length);
      }
    },
    onSwipedRight: () => {
      if (window.innerWidth <= 768) {
        setCurrentIndex((i) => (i - 1 + recommendedServices.length) % recommendedServices.length);
      }
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  const handleMenuClick = (name) => {
    if (name === t.cleaning) navigate("/calculator");
    if (name === t.windowCleaning) navigate("/window-cleaning");
  };

  const handleBackToSite = () => {
    navigate("/");
  };

  const handleCreateOrder = () => {
    navigate("/calculator");
  };

  const handleRepeatOrder = () => {
    if (!order || order.is_subscription) {
      alert("Повторення доступне тільки для одноразових замовлень!");
      return;
    }

    const calculatorRoutes = {
      window_cleaning: "/window-cleaning",
      general: "/calculator",
      standard: "/calculator",
      apartment: "/calculator",
      private_house: "/calculator",
      renovation: "/calculator",
      office: "/calculator",
    };

    const orderData = {
      order_type: order.order_type,
      address: order.address,
      city: order.city,
      total_price: order.total_price,
      order_details: {
        ...order.order_details,
        order_date: undefined,
        time: undefined,
        windows: order.windows,
        balconies: order.balconies,
        area: order.area,
        office_area: order.office_area,
        workspaces: order.workspaces,
        cleaning_frequency: order.cleaning_frequency,
        rooms: order.order_details?.rooms,
        bathrooms: order.order_details?.bathrooms,
        kitchen: order.order_details?.kitchen,
        kitchen_annex: order.order_details?.kitchen_annex,
        vacuum_needed: order.order_details?.vacuum_needed,
        selected_services: order.order_details?.selected_services,
      },
    };

    const targetRoute = calculatorRoutes[order.order_type] || "/calculator";
    navigate(targetRoute, { state: { prefilledOrder: orderData } });
  };

  const handleServiceClick = (category) => {
    const routes = {
      general: "/quick-order?category=general",
      "window-cleaning": "/window-cleaning",
      "renovation": "/renovation",
    };
    navigate(routes[category] || "/quick-order?category=general");
  };

  const navIcons = {
    dashboard: <Home color="#5a3bb5" size={20} />,
    orders: <ListOrdered color="#5a3bb5" size={20} />,
    bonus: <Gift color="#5a3bb5" size={20} />,
    services: <Sparkles color="#5a3bb5" size={20} />,
    profile: <User color="#5a3bb5" size={20} />,
  };

  const isActive = (path) => location.pathname === `/${path}`;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openBonusModal = () => setShowBonusModal(true);
  const closeBonusModal = () => setShowBonusModal(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const CalendarWidget = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);

    const currentDate = new Date();
    const month = new Date(currentYear, currentMonth).toLocaleDateString("uk-UA", {
      month: "long",
      year: "numeric",
    });
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    const dayNames = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"];

    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className={`${styles.calendarDay} ${styles.empty}`}
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === currentDate.toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      days.push(
        <div
          key={day}
          className={`${styles.calendarDay} ${
            isToday ? styles.today : ""
          } ${isSelected ? styles.selected : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    const handlePrevMonth = () => {
      setCurrentMonth((prev) => {
        if (prev === 0) {
          setCurrentYear((y) => y - 1);
          return 11;
        }
        return prev - 1;
      });
    };

    const handleNextMonth = () => {
      setCurrentMonth((prev) => {
        if (prev === 11) {
          setCurrentYear((y) => y + 1);
          return 0;
        }
        return prev + 1;
      });
    };

    return (
      <div className={styles.calendarWidget}>
        <div className={styles.calendarHeader}>
          <h3>{month}</h3>
          <div className={styles.calendarNav}>
            <button onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className={styles.calendarDaysHeader}>
          {dayNames.map((day, index) => (
            <div key={`${day}-${index}`} className={styles.calendarDayName}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.calendarGrid}>{days}</div>
      </div>
    );
  };

  const displayName = isLoading
    ? t.loading
    : user?.name && user.name.trim()
    ? user.name
    : user?.phone || t.nav.profile;

  const bonusBalance = user?.bonus_balance
    ? `${parseFloat(user.bonus_balance).toFixed(2)} злотих`
    : "0.00 злотих";
  const isBonusPending = !order || order.payment_status !== "completed";

  const orderIcon = order
    ? menuItems[lang]?.find(item => item.name === t.orderTypes[order.order_type] || item.name === order.order_type)?.icon || "/icon/cleaning-home.png"
    : "/icon/cleaning-home.png";

  const getButtonText = () => {
    return t.details;
  };

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.errorMessage}>
          <p>{t.error}: {error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.mobileHeader}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <button className={styles.backBtn} onClick={handleBackToSite}>
          <span>На сайт</span>
        </button>
      </header>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt="User Avatar" />
              ) : (
                <User size={60} color="#5a3bb5" />
              )}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userNameWrapper}>
                <h3>{t.greeting} {displayName} 👋</h3>
              </div>
              {user?.email && <p className={styles.userEmail}>{user.email}</p>}
              <p className={styles.subGreeting}>{t.subGreeting}</p>
            </div>
          </div>
          <button className={styles.closeSidebar} onClick={toggleSidebar}>
            <X size={20} color="#5a3bb5" />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {Object.entries(t.nav).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                navigate(`/${key}`);
                setIsSidebarOpen(false);
              }}
              className={`${styles.navButton} ${isActive(key) ? styles.active : ""}`}
            >
              <span className={styles.navItemContent}>
                {navIcons[key]}
                <span>{label}</span>
              </span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className={`${styles.navButton} ${styles.logoutButton}`}
            style={{ marginTop: "auto" }}
          >
            <span className={styles.navItemContent}>
              <LogOut color="#d32f2f" size={18} />
              <span>{t.logout}</span>
            </span>
          </button>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>
      )}

      <div className={styles.mainWrapper}>
        <main className={styles.mainContent}>
          <div className={`${styles.avatarSection} ${styles.mobileOnly}`}>
            <div className={styles.userAvatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
              ) : (
                <User size={50} color="#5a3bb5" />
              )}
            </div>
            <div>
              <h1 className={styles.greeting}>{t.greeting} {displayName} 👋</h1>
              {user?.email && <p className={styles.userEmail}>{user.email}</p>}
              <p className={styles.subGreeting}>{t.subGreeting}</p>
            </div>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.mainColumn}>
              <section className={styles.orderSection}>
                <h2 className={styles.sectionTitle}>{t.lastOrder}</h2>
                {isLoading ? (
                  <div className={styles.loader}>{t.loading}</div>
                ) : order ? (
                  <div className={styles.cardOrder}>
                    <div className={styles.cardContent}>
                      <img src={orderIcon} alt="Order Icon" className={styles.cardIcon} />
                      <div className={styles.cardText}>
                        <p className={styles.orderType}>
                          {t.orderTypes[order.order_type] || t.cleaning}
                        </p>
                        <p>
                          {order.order_date} <br />
                          {order.address.street || order.city || "Н/Д"}
                        </p>
                      </div>
                      <div className={styles.priceDivider}>
                        <span className={styles.verticalLine}></span>
                        <span className={styles.price}>{order.total_price} злотих</span>
                      </div>
                    </div>
                    <div className={styles.btnGroup}>
                      <button
                        onClick={handleRepeatOrder}
                        className={`${styles.borderButton} ${order.is_subscription ? styles.disabledButton : ""}`}
                        disabled={order.is_subscription}
                      >
                        {t.repeat}
                      </button>
                      <button
                        className={styles.detailsButton}
                        onClick={openModal}
                      >
                        {getButtonText()}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noOrderCard}>
                    <p className={styles.noOrderText}>{t.noOrders}</p>
                    <button
                      className={styles.noOrderButton}
                      onClick={handleCreateOrder}
                    >
                      {t.newOrder}
                    </button>
                  </div>
                )}
              </section>

              <section className={`${styles.newOrderSection} ${styles.desktopTabletOnly}`}>
                <div className={styles.newOrderCard}>
                  <div className={styles.newOrderContent}>
                    <h3>{t.createNewOrder}</h3>
                    <p>{t.createNewOrderDesc}</p>
                    <button className={styles.newOrderButton} onClick={handleCreateOrder}>{t.newOrder}</button>
                  </div>
                </div>
              </section>

              <section className={styles.bonusSection}>
                <div className={styles.bonusCard}>
                  <div className={styles.bonusHeader}>{t.bonus}</div>
                  <div className={styles.bonusContent}>
                    <Gift className={styles.bonusIcon} size={48} />
                    <p className={styles.bonusAmount} style={{ color: isBonusPending ? "#a0a0a0" : "var(--primary-color)" }}>
                      {isLoading
                        ? t.loading
                        : bonusBalance}
                      {isBonusPending && (
                        <span className={styles.bonusPending}>
                          {t.bonusInfo.pendingNote}
                        </span>
                      )}
                    </p>
                    <button
                      className={styles.bonusDetailsButton}
                      onClick={openBonusModal}
                    >
                      {t.details}
                    </button>
                  </div>
                </div>
              </section>

              <section className={styles.servicesSection}>
                <div className={styles.servicesHeader}>
                  <h2 className={styles.sectionTitle}>{t.recommendedServices}</h2>
                  <div className={`${styles.arrows} ${styles.mobileOnly}`}>
                    <button
                      className={styles.arrow}
                      onClick={() => setCurrentIndex((i) => (i - 1 + recommendedServices.length) % recommendedServices.length)}
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      className={styles.arrow}
                      onClick={() => setCurrentIndex((i) => (i + 1) % recommendedServices.length)}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>

                <div className={styles.servicesContainer}>
                  <div
                    className={`${styles.carousel} ${styles.mobileOnly}`}
                    {...swipeHandlers}
                  >
                    <div
                      className={styles.cards}
                      ref={cardsWrapperRef}
                      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                      {recommendedServices.map((service, index) => (
                        <div key={index} className={styles.serviceCard}>
                          <img src={service.icon} alt={service.name} className={styles.cardIcon} />
                          <p className={styles.serviceName}>{service.name}</p>
                          <button
                            onClick={() => handleServiceClick(service.category)}
                            className={styles.detailsButton}
                          >
                            {t.order}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`${styles.servicesGrid} ${styles.desktopTabletOnly}`}
                  >
                    {recommendedServices.map((service, index) => (
                      <div key={index} className={styles.serviceCard}>
                        <img src={service.icon} alt={service.name} className={styles.cardIcon} />
                        <p className={styles.serviceName}>{service.name}</p>
                        <button
                          onClick={() => handleServiceClick(service.category)}
                          className={styles.detailsButton}
                        >
                          {t.order}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${styles.dots} ${styles.mobileOnly}`}>
                  {recommendedServices.map((_, i) => (
                    <span
                      key={i}
                      className={
                        i === currentIndex ? styles.dotActive : styles.dot
                      }
                      onClick={() => setCurrentIndex(i)}
                    />
                  ))}
                </div>
              </section>
            </div>

            <div className={`${styles.rightSidebar} ${styles.desktopOnly}`}>
              <CalendarWidget />
            </div>
          </div>
        </main>
      </div>

      {showModal && order && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Деталі замовлення</h3>
            <p>
              <strong>ID замовлення:</strong> {order.order_id} <br />
              <strong>Тип замовлення:</strong> {t.orderTypes[order.order_type] || order.order_type || "Н/Д"} <br />
              <strong>Дата:</strong> {order.order_date} <br />
              <strong>Адреса:</strong> {`${order.address?.street || "Н/Д"}, ${order.address?.house_number || ""}${order.address?.apartment_number ? `/${order.address.apartment_number}` : ""}, ${order.city}`} <br />
              <strong>Ціна:</strong> {order.total_price} злотих <br />
              {["general", "standard", "apartment", "private_house"].includes(order.order_type) && (
                <>
                  {order.order_details?.rooms && <><strong>Кімнати:</strong> {order.order_details.rooms} <br /></>}
                  {order.order_details?.bathrooms && <><strong>Лазієнки:</strong> {order.order_details.bathrooms} <br /></>}
                  {order.order_details?.kitchen && <><strong>Кухня:</strong> {order.order_details.kitchen} <br /></>}
                  {order.order_details?.kitchen_annex && <><strong>Анекс кухні:</strong> {order.order_details.kitchen_annex} <br /></>}
                  {order.order_details?.vacuum_needed && <><strong>Потрібен пилосос:</strong> {order.order_details.vacuum_needed} <br /></>}
                  {order.order_details?.cleaning_frequency && <><strong>Частота прибирання:</strong> {order.order_details.cleaning_frequency} <br /></>}
                  {order.order_details?.selected_services && (
                    <>
                      <strong>Послуги:</strong>
                      <ul className={styles.modalServiceList}>
                        {order.order_details.selected_services !== "Brak"
                          ? order.order_details.selected_services.map((service, index) => (
                              <li key={index}>
                                {service.name}: {service.quantity}x - {service.price} зл
                              </li>
                            ))
                          : <li>Немає послуг</li>}
                      </ul>
                    </>
                  )}
                </>
              )}
              {order.order_type === "window_cleaning" && (
                <>
                  {order.windows && <><strong>Кількість вікон:</strong> {order.windows} <br /></>}
                  {order.balconies && <><strong>Кількість балконів:</strong> {order.balconies} <br /></>}
                </>
              )}
              {order.order_type === "renovation" && (
                <>
                  {order.area && <><strong>Площа:</strong> {order.area} <br /></>}
                  {order.windows && <><strong>Кількість вікон:</strong> {order.windows} <br /></>}
                </>
              )}
              {order.order_type === "office" && (
                <>
                  {order.office_area && <><strong>Площа офісу:</strong> {order.office_area} <br /></>}
                  {order.workspaces && <><strong>Робочі місця:</strong> {order.workspaces} <br /></>}
                  {order.cleaning_frequency && <><strong>Частота прибирання:</strong> {order.cleaning_frequency} <br /></>}
                </>
              )}
              <strong>Додаткова інформація:</strong> {order.additionalInfo} <br />
            </p>
            <button className={styles.closeButton} onClick={closeModal}>
              Закрити
            </button>
          </div>
        </div>
      )}

      {showBonusModal && (
        <div className={styles.modalOverlay} onClick={closeBonusModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{t.bonusInfo.title}</h3>
            <div className={styles.bonusItems}>
              <div className={styles.bonusItem}>
                <Gift size={24} color="#4CAF50" />
                <p>
                  {t.bonusInfo.earn} <br />
                  (Мінімум 50 злотих)
                </p>
              </div>
              <div className={styles.bonusItem}>
                <Percent size={24} color="#FF9800" />
                <p>
                  {t.bonusInfo.limit} <br />
                  (Максимум 50% від суми)
                </p>
              </div>
              <div className={styles.bonusItem}>
                <Clock size={24} color="#2196F3" />
                <p>
                  {t.bonusInfo.expiry} <br />
                  (6 місяців)
                </p>
              </div>
            </div>
            <p className={styles.bonusNote}>{t.bonusInfo.note}</p>
            <button className={styles.closeButton} onClick={closeBonusModal}>
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}