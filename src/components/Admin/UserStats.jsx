import css from "./AdminPanel.module.css";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { FaCalendarAlt } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, Title, CategoryScale);

function UserStats({ stats, setStats, fetchStats, statsPeriod, setStatsPeriod, isLoading }) {
  // Дані для кругового графіка статусів користувачів
  const statusChartData = stats
    ? {
        labels: ["Aktywni użytkownicy", "Nieaktywni użytkownicy", "Zablokowani użytkownicy"],
        datasets: [
          {
            label: "Status użytkowników",
            data: [
              stats.status_counts?.active || 0,
              stats.status_counts?.inactive || 0,
              stats.status_counts?.banned || 0,
            ],
            backgroundColor: ["#5a4af4", "#a0a9c0", "#ff4d4f"],
            borderColor: ["#4839e0", "#8c94a8", "#e63946"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#1a1a1a",
        },
      },
      title: {
        display: true,
        text: "Rozkład statusów użytkowników",
        font: { size: 16 },
        color: "#1a1a1a",
      },
    },
  };

  // Дані для лінійного графіка нових користувачів
  const newUsersChartData = stats
    ? {
        labels: ["Okres"],
        datasets: [
          {
            label: "Nowi użytkownicy (okres)",
            data: [stats.new_users],
            borderColor: "#5a4af4",
            backgroundColor: "rgba(90, 74, 244, 0.2)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#5a4af4",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#5a4af4",
          },
        ],
      }
    : null;

  const newUsersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#1a1a1a",
        },
      },
      title: {
        display: true,
        text: "Nowi użytkownicy w wybranym okresie",
        font: { size: 16 },
        color: "#1a1a1a",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Liczba nowych użytkowników",
          font: { size: 14 },
          color: "#1a1a1a",
        },
        ticks: {
          color: "#1a1a1a",
        },
      },
      x: {
        title: {
          display: true,
          text: "Okres",
          font: { size: 14 },
          color: "#1a1a1a",
        },
        ticks: {
          color: "#1a1a1a",
        },
      },
    },
  };

  // Дані для графіка приблизного доходу (використовуємо 0, якщо stats.revenue відсутнє)
  const revenueChartData = stats
    ? {
        labels: ["Okres"],
        datasets: [
          {
            label: "Przybliżony dochód (PLN)",
            data: [stats.revenue || 0], // Використовуємо 0, якщо revenue не передано
            borderColor: "#00c4b4",
            backgroundColor: "rgba(0, 196, 180, 0.2)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#00c4b4",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#00c4b4",
            borderWidth: 2,
          },
        ],
      }
    : null;

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#1a1a1a",
        },
      },
      title: {
        display: true,
        text: "Przybliżony dochód w wybranym okresie",
        font: { size: 16 },
        color: "#1a1a1a",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Dochód (PLN)",
          font: { size: 14 },
          color: "#1a1a1a",
        },
        ticks: {
          color: "#1a1a1a",
          callback: (value) => `${value} PLN`,
        },
      },
      x: {
        title: {
          display: true,
          text: "Okres",
          font: { size: 14 },
          color: "#1a1a1a",
        },
        ticks: {
          color: "#1a1a1a",
        },
      },
    },
  };

  return (
    <div className={css.statsSection}>
      <h4>Statystyka</h4>
      <div className={css.filters}>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>Okres</label>
          <div className={css.selectWrapper}>
            <FaCalendarAlt className={css.inputIcon} />
            <select value={statsPeriod} onChange={(e) => setStatsPeriod(e.target.value)}>
              <option value="7d">Ostatnie 7 dni</option>
              <option value="30d">Ostatnie 30 dni</option>
              <option value="1y">Ostatni rok</option>
            </select>
          </div>
        </div>
      </div>
      {isLoading ? (
        <p>Ładowanie...</p>
      ) : !stats ? (
        <p>Brak danych statystycznych.</p>
      ) : (
        <div className={css.statsContainer}>
          <div className={css.statsInfo}>
            <p>
              <strong>Liczba użytkowników:</strong> {stats.total_users}
            </p>
            <p>
              <strong>Średnia liczba zamówień na użytkownika:</strong> {stats.avg_orders_per_user}
            </p>
          </div>

          <div className={css.chartContainer}>
            <div className={css.chartWrapper}>
              {statusChartData && <Pie data={statusChartData} options={statusChartOptions} />}
            </div>
            <div className={css.chartWrapper}>
              {newUsersChartData && <Line data={newUsersChartData} options={newUsersChartOptions} />}
            </div>
            <div className={css.chartWrapper}>
              {revenueChartData && <Line data={revenueChartData} options={revenueChartOptions} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserStats;