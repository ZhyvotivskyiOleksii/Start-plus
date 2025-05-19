import css from "./AdminPanel.module.css";
import { FaChevronLeft, FaChevronRight, FaPercentage, FaTrash } from "react-icons/fa"; // Added FaTrash
import { IoBrush, IoConstruct, IoWater, IoBusiness, IoHome } from "react-icons/io5";

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
    { id: "office-cleaning", label: "Office clean", icon: <IoBusiness /> },
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
                            <button className={css.deleteBtn} onClick={() => deleteDiscount(d.id)}>
                              <FaTrash /> {/* FaTrash is now defined */}
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

export default CalculatorSection;