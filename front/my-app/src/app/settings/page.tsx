'use client';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import styles from './settings.module.css';
import {
  Bell,
  User,
  Bell as NotificationBell,
  AlertTriangle,
  Activity,
  Shield,
  X,
  Edit,
  Key,
  Mail,
  Phone,
  BellOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  type: 'alert' | 'data' | string;
  message: string;
  time: string;
  read: boolean;
}

export default function Settings() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
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
      message: 'New temperature data received from Node 1',
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

  // Update time every second (client-only)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
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

  // Handle click-outside for notifications (client-only)
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
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const toggleNotifications = (): void => {
    setShowNotifications((prev) => !prev);
  };

  const getNotificationIcon = (type: string): ReactNode => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className={styles.notificationTypeIconAlert} />;
      case 'data':
        return <Activity className={styles.notificationTypeIconData} />;
      default:
        return <Bell className={styles.notificationTypeIcon} />;
    }
  };

  const markAllAsRead = (): void => {
    setNotifications(notifications.map((notification) => ({
      ...notification,
      read: true,
    })));
  };

  const handleNotificationToggle = (enabled: boolean): void => {
    // Here you would typically also update your app's notification settings
  };

  const handleProfileClick = (): void => {
    router.push('/profile');
  };

  const handleManageProfile = (): void => {
    router.push('/profile');
  };

  const handleEditPassword = (): void => {
    router.push('/editpassword');
  };

  const handleEditEmail = (): void => {
    router.push('/editemail');
  };

  const handleEditPhone = (): void => {
    router.push('/editphonenumber');
  };

  const handleViewAllNotifications = (): void => {
    router.push('/notifications');
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Settings</h1>
          <p className={styles.headerSubtitle}>Manipulate your settings</p>
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
                <p className={styles.userName}>{userName || 'User'}</p>
                <p className={styles.userRole}>{userRole || 'Role'}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sous Header */}
      <div className={styles.nodeInfo}>
        <p className={styles.timeText}>Time: {formatTime(currentTime)}</p>
      </div>

      {/* Settings Cards */}
      <div className={styles.settingsCardsContainer}>
        {/* Profile Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <User className={styles.cardIcon} />
            <h2>Profile</h2>
          </div>
          <div className={styles.profileSection}>
            <div className={styles.profilePictureContainer}>
              <div className={styles.profilePicture}>
                <User className={styles.profileIcon} />
              </div>
              <button className={styles.manageProfileButton} onClick={handleManageProfile}>
                Manage your profile
              </button>
            </div>
          </div>
        </div>

        {/* Account Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <Shield className={styles.cardIcon} />
            <h2>Account</h2>
          </div>
          <div className={styles.accountSection}>
            <div className={styles.accountActions}>
              <button className={styles.accountButton} onClick={handleManageProfile}>
                <Edit className={styles.accountButtonIcon} />
                <span>Manage Profile</span>
              </button>
              <button className={styles.accountButton} onClick={handleEditPassword}>
                <Key className={styles.accountButtonIcon} />
                <span>Edit Password</span>
              </button>
              <button className={styles.accountButton} onClick={handleEditEmail}>
                <Mail className={styles.accountButtonIcon} />
                <span>Edit Email</span>
              </button>
              <button className={styles.accountButton} onClick={handleEditPhone}>
                <Phone className={styles.accountButtonIcon} />
                <span>Edit Phone Number</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <NotificationBell className={styles.cardIcon} />
            <h2>Notifications</h2>
          </div>
          <div className={styles.notificationSection}>
            <div className={styles.notificationToggleContainer}>
              <button
                className={`${styles.notificationToggleButton} ${notificationsEnabled ? styles.active : ''}`}
                onClick={() => handleNotificationToggle(true)}
              >
                <Bell className={styles.notificationToggleIcon} />
                <span>Notifications On</span>
              </button>
              <button
                className={`${styles.notificationToggleButton} ${!notificationsEnabled ? styles.active : ''}`}
                onClick={() => handleNotificationToggle(false)}
              >
                <BellOff className={styles.notificationToggleIcon} />
                <span>Notifications Off</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
