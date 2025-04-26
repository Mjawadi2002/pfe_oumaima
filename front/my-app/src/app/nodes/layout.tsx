'use client';

import { Sidebar } from '../components/sidebar';
import { ReactNode, useState, createContext, useContext } from 'react';
import AddNodeModal from '../components/addnodemodal';
import styles from './nodes.module.css';

interface NodeData {
    name: string;
    connectedDate: string;
    status: 'Online' | 'Offline';
    type: 'temperature' | 'humidity' | 'gas' | 'wind';
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

export default function NodesLayout({
  children,
}: {
  children: React.ReactNode;
}) 
{
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Function to handle adding a node
  const handleAddNode = (nodeData: NodeData) => {
    // Create and dispatch the custom event
    const event = new CustomEvent('newNodeAdded', { detail: nodeData });
    window.dispatchEvent(event);
    setIsModalOpen(false);
  };

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <div className={styles.appContainer}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={styles.mainContent}>
          {children}
          <AddNodeModal 
            isOpen={isModalOpen}
            onClose={closeModal}
            onAddNode={handleAddNode}
          />
        </div>
      </div>
    </ModalContext.Provider>
  );
} 