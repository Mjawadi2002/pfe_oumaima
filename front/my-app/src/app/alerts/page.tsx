'use client';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './alerts.module.css'; 
import {
  Search,
  User,
  Bell as NotificationBell,
  Trash2,
  MoreVertical,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
  Activity,
  X,
  Power,
} from 'lucide-react';

interface Alert {
  id: string;
  message: string;
  type: 'Critical' | 'Warning' | 'Error' | 'Info' | 'Success';
  date: string;
  status: 'Read' | 'Unread';
}

interface Notification {
  id: number;
  type: 'alert' | 'data' | string;
  message: string;
  time: string;
  read: boolean;
}

// Default data
const defaultAlerts: Alert[] = [
  { id: '1', message: 'High temperature detected', type: 'Critical', date: 'Mon Jun 15 2025', status: 'Unread' },
  { id: '2', message: 'Low battery warning', type: 'Warning', date: 'Mon Jun 15 2025', status: 'Read' },
  { id: '3', message: 'Connection lost', type: 'Error', date: 'Mon Jun 15 2025', status: 'Unread' },
  { id: '4', message: 'System update available', type: 'Info', date: 'Mon Jun 15 2025', status: 'Read' },
  { id: '5', message: 'New device connected', type: 'Success', date: 'Mon Jun 15 2025', status: 'Unread' },
];

const defaultNotifications: Notification[] = [
  { id: 1, type: 'alert', message: 'Critical alert: High temperature detected', time: '5 minutes ago', read: false },
  { id: 2, type: 'data', message: 'New alert data received', time: '15 minutes ago', read: false },
  { id: 3, type: 'alert', message: 'Alert status changed', time: '1 hour ago', read: true },
];

export default function AlertsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state with URL params or defaults
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(searchParams.get('items')) || 5);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  const notificationRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    setAlerts(defaultAlerts);
  }, []);

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

  // Update time (client-only)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedAlerts(isChecked ? alerts.map((alert) => alert.id) : []);
  };

  const handleAlertSelect = (alertId: string) => {
    setSelectedAlerts((prev) => {
      const newSelection = prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId];
      setSelectAll(newSelection.length === alerts.length);
      return newSelection;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedAlerts.length === 0) return;
    
    const newAlerts = alerts.filter(alert => !selectedAlerts.includes(alert.id));
    setAlerts(newAlerts);
    setSelectedAlerts([]);
    setSelectAll(false);
  };

  const handleDelete = async (alertId: string) => {
    try {
      // Remove the alert from the local state
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      setActiveDropdown(null);
      
      // Optional: You can still keep the API call if you want to sync with the backend
      /*
      const response = await fetch('/api/alerts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: alertId }),
      });

      if (!response.ok) {
        console.error('Failed to delete alert from backend');
        // You might want to revert the local state if the backend deletion fails
      }
      */
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleMarkAllAsRead = () => {
    if (selectedAlerts.length === 0) return;
    
    const newAlerts = alerts.map(alert => {
      if (selectedAlerts.includes(alert.id)) {
        return { ...alert, status: 'Read' as const };
      }
      return alert;
    });
    
    setAlerts(newAlerts);
    setSelectedAlerts([]);
    setSelectAll(false);
    setActiveDropdown(null);
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: alertId }),
      });

      if (response.ok) {
        const updatedAlerts = await response.json();
        setAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === alertId ? { ...alert, status: 'Read' } : alert
          )
        );
        setActiveDropdown(null);
      } else {
        console.error('Failed to mark alert as read');
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleTurnOffNode = async (alertId: string) => {
    try {
      // Here you would typically make an API call to turn off the node
      // For now, we'll just show a success message
      console.log(`Turning off node for alert ${alertId}`);
      
      // You would typically make an API call like this:
      /*
      const response = await fetch('/api/nodes/turn-off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      });

      if (response.ok) {
        // Handle success
      } else {
        // Handle error
      }
      */
      
      // For now, we'll just mark the alert as handled
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId ? { ...alert, status: 'Read' } : alert
        )
      );
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error turning off node:', error);
    }
  };

  const toggleDropdown = (alertId: string) => {
    setActiveDropdown(activeDropdown === alertId ? null : alertId);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPaginationInfo = (): string => {
    const totalAlerts = alerts.length;
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalAlerts);
    return `Displaying ${startIndex} to ${endIndex} out of ${totalAlerts}`;
  };

  const handlePageChange = (direction: 'first' | 'prev' | 'next' | 'last') => {
    const totalPages = Math.ceil(alerts.length / itemsPerPage);
    if (direction === 'first') setCurrentPage(1);
    else if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    else if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
    else if (direction === 'last') setCurrentPage(totalPages);
  };

  const getFilteredAlerts = (): Alert[] => {
    if (!searchQuery.trim()) return alerts;
    return alerts.filter(
      (alert) =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getCurrentPageAlerts = (): Alert[] => {
    const filteredAlerts = getFilteredAlerts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAlerts.slice(startIndex, endIndex);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className={styles.notificationTypeIconAlert} />;
      case 'data':
        return <Activity className={styles.notificationTypeIconData} />;
      default:
        return <NotificationBell className={styles.notificationTypeIcon} />;
    }
  };

  const markAllAsReadNotifications = () => {
    setNotifications(notifications.map((notification) => ({
      ...notification,
      read: true,
    })));
  };

  const handleViewAllNotifications = () => {
    router.push('/notifications');
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Alerts</h1>
          <p className={styles.headerSubtitle}>Monitor your system alerts</p>
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
                    <button className={styles.markAllRead} onClick={markAllAsReadNotifications}>
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
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <span className={styles.notificationTime}>{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.notificationFooter}>
                  <button className={styles.viewAllButton} onClick={handleViewAllNotifications}>
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={styles.userProfile} onClick={() => router.push('/profile')} style={{ cursor: 'pointer' }}>
            <div className={styles.avatar}>
              <User className={styles.avatarIcon} />
            </div>
            <div className={styles.userInfo}>
                <p className={styles.userName}>{userName || 'User'}</p>
                <p className={styles.userRole}>{userRole || 'Role'}</p>
              </div>
          </div>
        </div>
      </div>

      <div className={styles.sousHeader}>
        <p className={styles.timeText}>Time: {formatTime(currentTime)}</p>
      </div>

      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search for a specific alert"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {selectedAlerts.length > 0 && (
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.markReadButton} 
                    onClick={handleMarkAllAsRead}
                    disabled={selectedAlerts.length === 0}
                  >
                    <Eye className={styles.markReadIcon} />
                    Mark All as Read ({selectedAlerts.length})
                  </button>
                  <button 
                    className={styles.deleteSelectedButton} 
                    onClick={handleDeleteSelected}
                    disabled={selectedAlerts.length === 0}
                  >
                    <Trash2 className={styles.deleteIcon} />
                    Delete Selected ({selectedAlerts.length})
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.checkboxColumn}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className={styles.columnTitle}>Message</th>
                  <th className={styles.columnTitle}>Type</th>
                  <th className={styles.columnTitle}>Date</th>
                  <th className={styles.columnTitle}>Status</th>
                  <th className={styles.columnTitle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageAlerts().map((alert) => (
                  <tr key={alert.id} className={styles.tableRow}>
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={() => handleAlertSelect(alert.id)}
                      />
                    </td>
                    <td className={styles.cell}>{alert.message}</td>
                    <td className={styles.cell}>
                      <span className={`${styles.alertTypeBadge} ${styles[alert.type.toLowerCase()]}`}>
                        {alert.type}
                      </span>
                    </td>
                    <td className={styles.cell}>{alert.date}</td>
                    <td className={styles.cell}>
                      <span className={`${styles.statusBadge} ${styles[alert.status.toLowerCase()]}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className={styles.cell}>
                      <div className={styles.actionContainer}>
                        <button 
                          className={styles.actionButton} 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(alert.id);
                          }}
                        >
                          <MoreVertical className={styles.actionIcon} />
                        </button>
                        {activeDropdown === alert.id && (
                          <div className={styles.dropdownMenu}>
                            <button 
                              className={styles.dropdownItem} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(alert.id);
                              }}
                            >
                              <Eye className={styles.dropdownIcon} />
                              Mark as Read
                            </button>
                            {alert.type === 'Critical' && (
                              <button 
                                className={styles.dropdownItem} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTurnOffNode(alert.id);
                                }}
                              >
                                <Power className={styles.dropdownIcon} />
                                Turn Off Node
                              </button>
                            )}
                            <button 
                              className={styles.dropdownItem} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(alert.id);
                              }}
                            >
                              <Trash2 className={styles.dropdownIcon} />
                              Delete Alert
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <div className={styles.paginationLeft}>
              <span className={styles.show}>Show</span>
              <select className={styles.select} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={alerts.length}>All</option>
              </select>
            </div>
            <div className={styles.paginationInfo}>{getPaginationInfo()}</div>
            <div className={styles.paginationControls}>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange('first')}
                disabled={currentPage === 1}
              >
                <ChevronFirst className={styles.navIcon} />
              </button>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                <ChevronLeft className={styles.navIcon} />
              </button>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange('next')}
                disabled={currentPage === Math.ceil(alerts.length / itemsPerPage)}
              >
                <ChevronRight className={styles.navIcon} />
              </button>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange('last')}
                disabled={currentPage === Math.ceil(alerts.length / itemsPerPage)}
              >
                <ChevronLast className={styles.navIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}