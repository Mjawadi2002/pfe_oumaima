'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from '../../components/sidebar';
import styles from './connectiondetails.module.css';

export default function ConnectionDetailsLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className={styles.appContainer}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
} 