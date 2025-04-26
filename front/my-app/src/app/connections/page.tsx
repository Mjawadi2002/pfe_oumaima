"use client";
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef } from "react";
import { useRouter , useSearchParams} from "next/navigation";
import {
  Search,
  User,
  Bell,
  MoreVertical,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  Trash2,
  Plus,
  AlertTriangle,
  X,
  Activity,
} from "lucide-react";
import { useModal } from "./layout";
import styles from "./connections.module.css";

// Define TypeScript interfaces
interface Connection {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  connectedDate: string;
}

interface Notification {
  id: number;
  type: "alert" | "data" | string;
  message: string;
  time: string;
  read: boolean;
}

export default function Connections() {
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useModal();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(searchParams.get('items')) || 5);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [displayedConnections, setDisplayedConnections] = useState<Connection[]>([]);

  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      name: "Connection 1",
      status: "Active",
      connectedDate: "Mon Jun 15 2025",
    },
    {
      id: "2",
      name: "Connection 2",
      status: "Inactive",
      connectedDate: "Mon Jun 15 2025",
    },
    {
      id: "3",
      name: "Connection 3",
      status: "Active",
      connectedDate: "Mon Jun 15 2025",
    },
    {
      id: "4",
      name: "Connection 4",
      status: "Active",
      connectedDate: "Mon Jun 15 2025",
    },
    {
      id: "5",
      name: "Connection 5",
      status: "Inactive",
      connectedDate: "Mon Jun 15 2025",
    },
  ]);

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

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "alert",
      message: "High gas level detected in Node 3",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "data",
      message: "New temperature data received from Node 1",
      time: "15 minutes ago",
      read: false,
    },
    {
      id: 3,
      type: "alert",
      message: "Node 2 connection lost",
      time: "1 hour ago",
      read: true,
    },
  ]);

  // Initialize displayedConnections with connections
  useEffect(() => {
    setDisplayedConnections(connections);
  }, [connections]);

  // Listen for newConnectionAdded event
  useEffect(() => {
    const handleNewConnection = (event: Event) => {
      const customEvent = event as CustomEvent<Connection>;
      handleAddConnection(customEvent.detail);
    };
    window.addEventListener("newConnectionAdded", handleNewConnection);
    return () => window.removeEventListener("newConnectionAdded", handleNewConnection);
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside for notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedConnections(connections.map((conn) => conn.id));
    } else {
      setSelectedConnections([]);
    }
  };

  const handleDelete = (connectionId: string) => {
    setConnections((prevConnections) =>
      prevConnections.filter((conn) => conn.id !== connectionId)
    );
    setActiveDropdown(null);
  };

  const handleView = (connectionId: string) => {
    router.push(`/connectiondetails/${connectionId}`);
    setActiveDropdown(null);
  };

  const toggleDropdown = (connectionId: string) => {
    setActiveDropdown(activeDropdown === connectionId ? null : connectionId);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPaginationInfo = (): string => {
    const totalConnections = connections.length;
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalConnections);
    return `Displaying ${startIndex} to ${endIndex} out of ${totalConnections}`;
  };

  const handlePageChange = (direction: "first" | "prev" | "next" | "last") => {
    const totalPages = Math.ceil(connections.length / itemsPerPage);
    if (direction === "first") {
      setCurrentPage(1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "last") {
      setCurrentPage(totalPages);
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) {
      setDisplayedConnections(connections);
      return;
    }
    
    const filtered = connections.filter(
      (conn) =>
        conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setDisplayedConnections(filtered);
    setCurrentPage(1);
  };

  const getCurrentPageConnections = (): Connection[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return displayedConnections.slice(startIndex, endIndex);
  };

  const handleCopyId = (connectionId: string) => {
    navigator.clipboard.writeText(connectionId);
    setActiveDropdown(null);
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className={styles.notificationTypeIconAlert} />;
      case "data":
        return <Activity className={styles.notificationTypeIconData} />;
      default:
        return <Bell className={styles.notificationTypeIcon} />;
    }
  };

  const handleViewAllNotifications = () => {
    router.push("/notifications");
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleAddConnection = async (newConnection: Connection) => {
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConnection),
      });

      if (response.ok) {
        const addedConnection = await response.json();
        setConnections((prev) => [...prev, addedConnection]);
      } else {
        console.error('Failed to add connection');
      }
    } catch (error) {
      console.error('Error adding connection:', error);
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Connections</h1>
          <p className={styles.headerSubtitle}>Manage your connections</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.notificationContainer} ref={notificationRef}>
            <div
              className={styles.notificationBadge}
              style={{ display: notifications.filter((n) => !n.read).length > 0 ? 'block' : 'none' }}
            >
              {notifications.filter((n) => !n.read).length}
            </div>
            <Bell className={styles.notificationIcon} onClick={toggleNotifications} />
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
          <div className={styles.userProfile} onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
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
      <div>
        <p className={styles.timeText}>Time: {formatTime(currentTime)}</p>
      </div>

      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.sousHeader}>
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search connections..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <button 
                className={styles.nodesButton}
                onClick={handleSearchSubmit}
              >
                Search
              </button>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.addButton} onClick={openModal}>
                <Plus size={16} />
                Add Connection
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.columnTitle}>NAME</th>
                  <th className={styles.columnTitle}>STATUS</th>
                  <th className={styles.columnTitle}>CONNECTED DATE</th>
                  <th className={styles.columnTitle}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageConnections().map((connection) => (
                  <tr key={connection.id} className={styles.tableRow}>
                    <td className={styles.cell}>{connection.name}</td>
                    <td className={styles.cell}>
                      <span
                        className={`${styles.statusBadge} ${
                          connection.status === "Active"
                            ? styles.statusActive
                            : styles.statusOffline
                        }`}
                      >
                        {connection.status}
                      </span>
                    </td>
                    <td className={styles.cell}>{connection.connectedDate}</td>
                    <td className={styles.cell}>
                      <div className={styles.actionContainer}>
                        <button
                          className={styles.actionButton}
                          onClick={() => toggleDropdown(connection.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeDropdown === connection.id && (
                          <div className={styles.dropdownMenu}>
                            <button
                              className={styles.dropdownItem}
                              onClick={() => handleView(connection.id)}
                            >
                              <Eye size={16} className={styles.dropdownIcon} />
                              View Details
                            </button>
                            <button
                              className={styles.dropdownItem}
                              onClick={() => handleCopyId(connection.id)}
                            >
                              <Copy size={16} className={styles.dropdownIcon} />
                              Copy ID
                            </button>
                            <button
                              className={styles.dropdownItem}
                              onClick={() => handleDelete(connection.id)}
                            >
                              <Trash2 size={16} className={styles.dropdownIcon} />
                              Delete
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
              <select className={styles.select} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={connections.length}>All</option>
              </select>
            </div>
            <div className={styles.paginationInfo}>{getPaginationInfo()}</div>
            <div className={styles.paginationControls}>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange("first")}
                disabled={currentPage === 1}
              >
                <ChevronFirst size={16} />
              </button>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange("next")}
                disabled={
                  currentPage === Math.ceil(connections.length / itemsPerPage)
                }
              >
                <ChevronRight size={16} />
              </button>
              <button
                className={styles.navButton}
                onClick={() => handlePageChange("last")}
                disabled={
                  currentPage === Math.ceil(connections.length / itemsPerPage)
                }
              >
                <ChevronLast size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}