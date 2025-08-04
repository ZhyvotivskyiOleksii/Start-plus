import css from "./AdminPanel.module.css";
import { FaTrash, FaEye } from "react-icons/fa";

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
  t,
}) {
  return (
    <div className={css.usersList}>
      <h4>{t.title}</h4>
      {isLoading ? (
        <p>{t.loading}</p>
      ) : users.length === 0 ? (
        <p>{t.noUsers}</p>
      ) : (
        <table className={css.userTable}>
          <thead>
            <tr>
              <th>{t.id}</th>
              <th>{t.name}</th>
              <th>{t.phone}</th>
              <th>{t.email}</th>
              <th>{t.totalOrders}</th>
              <th>{t.totalSpent}</th>
              <th>{t.registrationDate}</th>
              <th>{t.lastLogin}</th>
              <th>{t.status}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name || t.noData}</td>
                <td>{user.phone || t.noData}</td>
                <td>{user.email || t.noData}</td>
                <td>{user.order_count || 0}</td>
                <td>{user.total_spent ? `${user.total_spent} zł` : "0 zł"}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>{user.last_login ? new Date(user.last_login).toLocaleString() : t.noData}</td>
                <td>
                  <span
                    className={css.statusBadge}
                    style={{
                      backgroundColor:
                        user.status === "active" ? "#5a4af4" :
                        user.status === "inactive" ? "#a0a9c0" : "#ff4d4f",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {t[user.status] || user.status}
                  </span>
                </td>
                <td>
                  <button
                    className={css.actionBtn}
                    onClick={() => {
                      setActiveTab("details");
                      setSelectedUser(user);
                      fetchUserDetails(user.id);
                    }}
                    title={t.viewDetails}
                  >
                    <FaEye />
                  </button>
                  <button
                    className={css.deleteBtn}
                    onClick={() => handleOpenDeleteModal(user.id, user.name)}
                    title={t.deleteUser}
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