'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Bell,
  User,
  AlertTriangle,
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  X,
  Bell as NotificationBell ,
} from 'lucide-react';
import { useNodes } from '@/app/context/Nodecontext';
import styles from './gatewaydetails.module.css';
import Link from 'next/link';

// TypeScript interfaces
interface Notification {
  id: number;
  type: 'alert' | 'data';
  message: string;
  time: string;
  read: boolean;
}

interface Node {
  id: string;
  name: string;
  gatewayName: string;
  status?: string;
  connectedDate?: string;
}

export default function GatewayDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [gatewayUsername, setGatewayUsername] = useState<string>('');
  const [gatewayPassword, setGatewayPassword] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Use the nodes context
  const { nodes } = useNodes();

  // Find the current node based on the ID
  const currentNode = nodes.find((node) => node.id === id);

  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      message: 'High gas level detected in Node 3',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'data',
      message: 'New temperature data received from.Concurrent Node 1',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'alert',
      message: 'Node 2 connection lost',
      time: '1 hour ago',
      read: true,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as HTMLElement)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleViewAllNotifications = () => {
    router.push('/notifications');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className={styles.notificationTypeIconAlert} />;
      case 'data':
        return <Activity className={styles.notificationTypeIconData} />;
      default:
        return <Bell className={styles.notificationTypeIcon} />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleBackClick = () => {
    router.push('/gateway');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setSaveSuccess(true);
  };

  const handleResetClick = () => {
    setGatewayUsername('');
    setGatewayPassword('');
    setIsEditing(false);
  };

  if (!currentNode) {
    return (
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h1 className={styles.headerTitle}>Gateway Not Found</h1>
            <p className={styles.headerSubtitle}>
              The requested gateway could not be found
            </p>
          </div>
        </div>
        <button className={styles.backButton} onClick={handleBackClick}>
          <ArrowLeft className={styles.backIcon} />
          Back to Gateway Configurations
        </button>
      </div>
    );
  }

  return (
    <>

    {/* Header */}
    <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Gateway Details</h1>
          <p className={styles.headerSubtitle}>Gateway for {currentNode.name}</p>
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
                <p className={styles.userName}>Ahmed Dridi</p>
                <p className={styles.userRole}>Admin</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sous Header */}
      <div className={styles.nodeInfo}>
        <p className={styles.timeText}>Time: {formatTime(currentTime)}</p>
      </div>

      {/*Button*/}
      <button className={styles.backButton} onClick={handleBackClick}>
          <ArrowLeft className={styles.backIcon} />
          Back to Gateway Configurations
      </button>

      {/* Gateway Details Content */}
      <div className={styles.gatewayDetailsContainer}>

        {/* Gateway Informations */}
        <div className={styles.gatewayInfoCard}>
          <h2>Gateway Informations</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Node ID:</span>
            <span className={styles.infoValue}>{currentNode.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Node Name:</span>
            <span className={styles.infoValue}>{currentNode.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Status:</span>
            <span className={`infoValue statusBadge ${currentNode.status === 'Online' ? 'status-online' : 'status-offline'}`}>
            {currentNode.status}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Connected Date:</span>
            <span className={styles.infoValue}>{currentNode.connectedDate}</span>
          </div>
        </div>

        {/* Gateway Configurations */ }
        <div className={styles.gatewayConfigCard}>
          <div className={styles.cardHeader}>
            <h2>Gateway Configuration</h2>
            {!isEditing ? (
              <button className={styles.editButton} onClick={handleEditClick}>
                Edit Credentials
              </button>
            ) : (
              <div className={styles.editActions}>
                <button className={styles.saveButton} onClick={handleSaveClick}>
                  <Save size={16} />
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {saveSuccess && (
            <div className={styles.successMessage}>
              Gateway credentials updated successfully!
            </div>
          )}
          <div className={styles.configForm}>
            <div className={styles.formGroup}>
              <label htmlFor="gatewayName">Gateway Name</label>
              <input
                type="text"
                id="gatewayName"
                defaultValue={`Gateway ${currentNode.id}`}
                className={styles.formInput}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gatewayIP">Gateway IP Address</label>
              <input
                type="text"
                id="gatewayIP"
                defaultValue="192.168.1.100"
                className={styles.formInput}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gatewayPort">Gateway Port</label>
              <input
                type="text"
                id="gatewayPort"
                defaultValue="8080"
                className={styles.formInput}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gatewayAuthUsername">Gateway Username</label>
              <input
                type="text"
                id="gatewayAuthUsername"
                placeholder="Enter gateway username"
                className={styles.formInput}
                value={gatewayUsername}
                onChange={(e) => setGatewayUsername(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gatewayAuthPassword">Gateway Password</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="gatewayAuthPassword"
                  placeholder="Enter gateway password"
                  className={styles.formInput}
                  value={gatewayPassword}
                  onChange={(e) => setGatewayPassword(e.target.value)}
                  disabled={!isEditing}
                />
                <button
                  type="button"
                  className={styles.passwordToggleBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!isEditing}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {!isEditing && (
              <div className={styles.formActions}>
                <button className={styles.resetButton} onClick={handleResetClick}>
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}