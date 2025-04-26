'use client';

import { Sidebar } from '../components/sidebar';
import styles from './users.module.css';
import { useState } from 'react';

export default function UserLayout({children}: { children: React.ReactNode }){
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.appContainer}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={styles.mainContent}>{children}</div>
    </div>
  );
}
