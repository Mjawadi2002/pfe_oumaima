"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import { Sidebar } from "../components/sidebar";
import AddConnectionModal from "../components/addconnectionmodal";
import styles from "./connections.module.css";

// Define TypeScript interface for connection data
interface Connection {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  connectedDate: string;
}

// Create a context for the modal functionality
interface ModalContextType {
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export default function ConnectionsLayout({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);


  // Function to handle adding a connection
  const handleAddConnection = (connectionData: Connection) => {
    // Create and dispatch the custom event
    const event = new CustomEvent("newConnectionAdded", { detail: connectionData });
    window.dispatchEvent(event);
    setIsModalOpen(false);
  };

  // Function to open/close the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <div className={styles.appContainer}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        {children}
        <AddConnectionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddConnection={handleAddConnection}
        />
      </div>
    </ModalContext.Provider>
  );
}