import Modal from "react-modal";
import css from "./AdminPanel.module.css";

function DeleteUserModal({ isModalOpen, handleCloseModal, handleConfirmDelete, userToDelete }) {
  return (
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
  );
}

export default DeleteUserModal;