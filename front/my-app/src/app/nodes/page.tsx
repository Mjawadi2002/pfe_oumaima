'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Bell as NotificationBell, X, Search, Plus, User } from 'lucide-react';
import Link from 'next/link';
import styles from './nodes.module.css';

interface Notification {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}

interface DecodedToken {
  userId: number;
  userName: string;
  role: string;
  exp: number;
}

export default function NodesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notificationRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: 'Node 1 is offline', type: 'error', timestamp: '10:30 AM', read: false },
    { id: 2, message: 'New node connected', type: 'info', timestamp: '09:15 AM', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(searchParams.get('items')) || 5);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserName(decoded.userName);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    if (itemsPerPage !== 5) params.set('items', itemsPerPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
  };

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Nodes</h1>
          <p className={styles.headerSubtitle}>Visualize your nodes</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.notificationContainer} ref={notificationRef}>
            <div
              className={styles.notificationBadge}
              style={{ display: notifications.filter((n) => !n.read).length > 0 ? 'block' : 'none' }}
            >
              {notifications.filter((n) => !n.read).length}
            </div>
            <NotificationBell className={styles.notificationIcon} onClick={toggleNotifications} />
            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <h3>Notifications</h3>
                  <div className={styles.notificationActions}>
                    <button className={styles.markAllRead} onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                    <button
                      className={styles.closeNotifications}
                      onClick={() => setShowNotifications(false)}
                    >
                      <X className={styles.closeIcon} />
                    </button>
                  </div>
                </div>
                <div className={styles.notificationList}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`}
                    >
                      <div className={styles.notificationIconWrapper}>
                        <NotificationBell className={styles.notificationTypeIcon} />
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <span className={styles.notificationTime}>{notification.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.notificationFooter}>
                  <Link href="/notifications">
                    <button className={styles.viewAllButton}>View All Notifications</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/profile">
            <div className={styles.userProfile} style={{ cursor: 'pointer' }}>
              <div className={styles.avatar}>
                <User className={styles.avatarIcon} />
              </div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{userName || 'User'}</p>
                <p className={styles.userRole}>{userRole || 'Role'}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Time */}
      <div className={styles.nodeInfo}>
        <p className={styles.timeText}>Time: {formatTime(currentTime)}</p>
      </div>

      {/* Search and Add Node */}
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.sousHeader}>
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                />
              </div>
              <button className={styles.nodesButton} onClick={handleSearchSubmit}>
                Nodes
              </button>
            </div>
            <button className={styles.addButton} onClick={() => router.push('/add-node')}>
              <Plus className={styles.actionIcon} />
              Add Node
            </button>
          </div>

          {/* Node table or other content */}
        </div>
      </div>
    </>
  );
}
