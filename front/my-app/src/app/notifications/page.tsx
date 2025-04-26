'use client';

import styles from './notifications.module.css';
import Link from 'next/link';
import {User,
    Search,
    Bell as NotificationBell,
    Filter,
    SortAsc,
    SortDesc,
    AlertTriangle,
    Activity,
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Eye
} from 'lucide-react';
import { useState , useEffect} from 'react';
import { useRouter } from 'next/navigation';

export default function Notifications() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    
    // Sample notifications data - in a real app, this would come from your backend
    const [notifications, setNotifications] = useState<{
        id: number;
        type: string;
        message: string;
        time: string;
        read: boolean;
        date: string;
    }[]>([
        {
            id: 1,
            type: 'alert',
            message: 'Critical alert: High temperature detected',
            time: '5 minutes ago',
            read: false,
            date: '2024-03-20T10:30:00'
        },
        {
            id: 2,
            type: 'data',
            message: 'New data received from Node 1',
            time: '15 minutes ago',
            read: false,
            date: '2024-03-20T10:15:00'
        },
        {
            id: 3,
            type: 'alert',
            message: 'Alert status changed',
            time: '1 hour ago',
            read: true,
            date: '2024-03-20T09:30:00'
        },
    ]);

    // Update time every second (client-only)
      useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
      }, []);

      const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      };

      const handleProfileClick = (): void => {
        router.push('/profile');
      };

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setCurrentPage(1);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const getFilteredNotifications = () => {
        let filtered = notifications;

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(n => n.type === filterType);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(n => 
                n.message.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        });

        return filtered;
    };

    const getPaginationInfo = (): string => {
        const totalNotifications = getFilteredNotifications().length;
        const startIndex = (currentPage - 1) * itemsPerPage + 1;
        const endIndex = Math.min(startIndex + itemsPerPage - 1, totalNotifications);
        return `Displaying ${startIndex} to ${endIndex} out of ${totalNotifications}`;
    };

    const handlePageChange = (direction: string) => {
        const totalPages = Math.ceil(getFilteredNotifications().length / itemsPerPage);
        if (direction === 'first') {
            setCurrentPage(1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'last') {
            setCurrentPage(totalPages);
        }
    };

    const getCurrentPageNotifications = () => {
        const filteredNotifications = getFilteredNotifications();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredNotifications.slice(startIndex, endIndex);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'alert':
                return <AlertTriangle className={`${styles.notificationTypeIcon} ${styles.alertIcon}`} />;
            case 'data':
                return <Activity className={`${styles.notificationTypeIcon} ${styles.dataIcon}`} />;
            default:
                return <NotificationBell className={styles.notificationTypeIcon} />;
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const currentPageIds = getCurrentPageNotifications().map(n => n.id);
            setSelectedNotifications(currentPageIds);
        } else {
            setSelectedNotifications([]);
        }
    };

    const handleSelectNotification = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedNotifications(prev => [...prev, id]);
        } else {
            setSelectedNotifications(prev => prev.filter(notificationId => notificationId !== id));
        }
    };

    const handleMarkAsRead = () => {
        setNotifications(prev => prev.map(notification => {
            if (selectedNotifications.includes(notification.id)) {
                return { ...notification, read: true };
            }
            return notification;
        }));
        setSelectedNotifications([]);
    };

    const handleDeleteSelected = () => {
        setNotifications(prev => prev.filter(notification => 
            !selectedNotifications.includes(notification.id)
        ));
        setSelectedNotifications([]);
    };

    const handleView = (nodeId: number) => {
        router.push(`/nodedetails/${nodeId}`);
        setActiveDropdown(null);
    };

    const toggleDropdown = (nodeId: number) => {
        setActiveDropdown(activeDropdown === nodeId ? null : nodeId);
    };

    return (
        <>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.headerTitle}>Notifications</h1>
                    <p className={styles.headerSubtitle}>View and manage your notifications</p>
                </div>
                <div className={styles.headerRight}>       
                    <Link href="/profile">
                        <div className={styles.userProfile} style={{ cursor: 'pointer' }}>
                            <div className={styles.avatar}>
                                <User className={styles.avatarIcon} />
                            </div>
                            <div className={styles.userInfo}>
                                <p className={styles.userName}>Ahmed Dridi</p>
                                <p className={styles.userRole}>Admin</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className={styles.nodeInfo}>
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
                                    placeholder="Search notifications"
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.markReadButton}
                                    onClick={handleMarkAsRead}
                                    disabled={selectedNotifications.length === 0}
                                >
                                    Mark as Read
                                </button>
                                <button 
                                    className={styles.deleteSelectedButton}
                                    onClick={handleDeleteSelected}
                                    disabled={selectedNotifications.length === 0}
                                >
                                    Delete Selected
                                </button>
                            </div>
                            <div className={styles.filterContainer}>
                                <Filter className={styles.filterIcon} />
                                <select 
                                    className={styles.filterSelect}
                                    value={filterType}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="alert">Alerts</option>
                                    <option value="data">Data Updates</option>
                                </select>
                            </div>
                            <button 
                                className={styles.sortButton}
                                onClick={toggleSortOrder}
                            >
                                {sortOrder === 'asc' ? <SortAsc className={styles.sortIcon} /> : <SortDesc className={styles.sortIcon} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th className={`${styles.columnTitle} ${styles.checkboxColumn}`}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            onChange={handleSelectAll}
                                            checked={
                                                getCurrentPageNotifications().length > 0 &&
                                                getCurrentPageNotifications().every(n => 
                                                    selectedNotifications.includes(n.id)
                                                )
                                            }
                                        />
                                    </th>
                                    <th className={styles.columnTitle}>Type</th>
                                    <th className={styles.columnTitle}>Message</th>
                                    <th className={styles.columnTitle}>Time</th>
                                    <th className={styles.columnTitle}>Date</th>
                                    <th className={styles.columnTitle}>Status</th>
                                    <th className={styles.columnTitle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageNotifications().map(notification => (
                                    <tr key={notification.id} className={styles.tableRow}>
                                        <td className={`${styles.cell} ${styles.checkboxCell}`}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={selectedNotifications.includes(notification.id)}
                                                onChange={(e) => handleSelectNotification(notification.id, e.target.checked)}
                                            />
                                        </td>
                                        <td className={styles.cell}>
                                            <div className={styles.notificationIconWrapper}>
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        </td>
                                        <td className={styles.cell}>
                                            <p className={styles.notificationMessage}>{notification.message}</p>
                                        </td>
                                        <td className={styles.cell}>
                                            <span className={styles.notificationTime}>{notification.time}</span>
                                        </td>
                                        <td className={styles.cell}>
                                            <span className={styles.notificationDate}>
                                                {new Date(notification.date).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className={styles.cell}>
                                            <span className={`${styles.statusBadge} ${notification.read ? styles.read : styles.unread}`}>
                                                {notification.read ? 'Read' : 'Unread'}
                                            </span>
                                        </td>
                                        <td className={styles.cell}>
                                            <div className={styles.actionContainer}>
                                                <button 
                                                    className={styles.actionButton} 
                                                    onClick={() => toggleDropdown(notification.id)}
                                                >
                                                    <MoreVertical className={styles.actionIcon} />
                                                </button>
                                                {activeDropdown === notification.id && (
                                                    <div className={styles.dropdownMenu}>
                                                        <button 
                                                            className={styles.dropdownItem} 
                                                            onClick={() => handleView(notification.id)}
                                                        >
                                                            <Eye className={styles.dropdownIcon} />
                                                            View Node
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
                            <span className={styles.textMuted}>Show</span>
                            <select 
                                className={styles.select} 
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={notifications.length}>All</option>
                            </select>
                        </div>
                        <div className={styles.paginationInfo}>
                            {getPaginationInfo()}
                        </div>
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
                                disabled={currentPage === Math.ceil(getFilteredNotifications().length / itemsPerPage)}
                            >
                                <ChevronRight className={styles.navIcon} />
                            </button>
                            <button 
                                className={styles.navButton}
                                onClick={() => handlePageChange('last')}
                                disabled={currentPage === Math.ceil(getFilteredNotifications().length / itemsPerPage)}
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