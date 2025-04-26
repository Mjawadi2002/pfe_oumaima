'use client';

import { useState } from 'react';
import { Sidebar } from '../components/sidebar';
import styles from './nodedetails.module.css';

export default function NodeDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.appContainer}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
} 