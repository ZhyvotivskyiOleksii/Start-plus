import { useEffect } from "react";
import css from "./AdminPanel.module.css";
import { FaTrash } from "react-icons/fa";

function UserList({
  users,
  setUsers,
  setActiveTab,
  setSelectedUser,
  fetchUsers,
  fetchUserDetails,
  handleOpenDeleteModal,
  isLoading,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}) {
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className={css.usersList}>
      <h4>Lista użytkowników</h4>
      <div className={css.filters}>
        <div className={css.inputGroup}>
          <label className={css.inputLabel}>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
  );
}

export default UserList;