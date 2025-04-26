"use client";

import { X } from "lucide-react";
import styles from "./addconnectionmodal.module.css";

// Define TypeScript interface for props
interface Connection {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  connectedDate: string;
}

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConnection: (connection: Connection) => void;
}

export default function AddConnectionModal({
  isOpen,
  onClose,
  onAddConnection,
}: AddConnectionModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const connectionData: Connection = {
      name: formData.get("username") as string,
      id: formData.get("id") as string,
      status: "Active",
      connectedDate: new Date().toDateString(),
    };
    onAddConnection(connectionData);
    onClose();
  };

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-card"]}>
        <div className={styles["modal-header"]}>
          <h2>Add New Connection</h2>
          <button className={styles["close-button"]} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles["input-field"]}
              placeholder="Enter username"
              required
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="id">Connection ID</label>
            <input
              type="text"
              id="id"
              name="id"
              className={styles["input-field"]}
              placeholder="Enter connection ID"
              required
            />
          </div>
          <div className={styles["modal-actions"]}>
            <button
              type="button"
              className={styles["cancel-button"]}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles["add-button"]}>
              Add Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}