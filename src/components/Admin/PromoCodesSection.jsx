import css from "./AdminPanel.module.css";
import { FaPercentage, FaTrash } from "react-icons/fa";

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
          <button onClick={generatePromoCode} disabled={isLoading} className={css.generateButton}>
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
                  <button className={css.deleteBtn} onClick={() => deletePromoCode(p.id)}>
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

export default PromoCodesSection;