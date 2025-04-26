'use client';

import { useState, useEffect, ReactNode , useRef } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import styles from '../nodedetails.module.css';
import { User, Bell as NotificationBell, Search, MoreVertical, AlertTriangle, Activity , Bell , X} from 'lucide-react';

interface NodeData {
  id: number;
  name: string;
  status: 'Online' | 'Offline';
  type: 'temperature' | 'humidity' | 'gas' | 'wind';
  connectedDate: string;
  lastUpdate: string;
  temperature: number;
  humidity: number;
  gasLevel: number;
}
interface Notification {
  id: number;
  type: 'alert' | 'data' | string;
  message: string;
  time: string;
  read: boolean;
}

export default function NodeDetails({ params }: { params: Promise<{ nodeId: string }> }) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const resolvedParams = use(params);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [gasLevel, setGasLevel] = useState<number>(25); 
  const notificationRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // In a real app, you would fetch the node data based on the nodeId parameter
    // For now, we'll use mock data
    const mockNodeData: NodeData = {
      id: parseInt(resolvedParams.nodeId),
      name: `Node ${resolvedParams.nodeId}`,
      status: 'Online',
      type: 'temperature',
      connectedDate: '2024-03-15',
      lastUpdate: '2024-03-20T10:30:00',
      temperature: 25,
      humidity: 65,
      gasLevel: 25
    };
    setNodeData(mockNodeData);
  }, [resolvedParams.nodeId]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getGasStatus = (level: number): string => {
    if (level <= 25) return 'Normal';
    if (level <= 50) return 'Moderate';
    if (level <= 75) return 'High';
    return 'Danger';
  };

  const handleProfileClick = () => {
    router.push('/profile');
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
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Node Details</h1>
          <p className={styles.headerSubtitle}>View detailed information about your node</p>
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
      <div className={styles.nodeInfo}>
        <p className={styles.nodeText}>You're seeing node number {resolvedParams.nodeId}:</p>
      </div>
      <div className={styles.nodeInfo}>
        <p className={styles.timeText}>Time: {formatTime(currentTime)}</p>
      </div>

      {nodeData && (
        <div className={styles.widgetsGrid}>
          {/* Temperature Widget */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Temperature:</h3>
            <div className={styles.widgetContent}>
              <div className={styles.thermometer}>
                <div className={styles.thermometerTube}>
                  <div
                    className={styles.thermometerFill}
                    style={{ height: `${(nodeData.temperature / 50) * 100}%` }}
                  ></div>
                </div>
                <div className={styles.thermometerBulb}></div>
              </div>
              <div className={styles.temperatureValue}>{nodeData.temperature}°C</div>
            </div>
          </div>

          {/* Gas Widget */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Gas Level:</h3>
            <div className={styles.widgetContent}>
              <div className={styles.gasMeter}>
                <div className={styles.gasMeterCircle}>
                  <div className={styles.gasMeterFill}></div>
                  <div className={styles.gasMeterMask}>
                    <div className={styles.gasMeterValue}>{nodeData.gasLevel}%</div>
                  </div>
                </div>
                <div className={styles.gasMeterStatus}>
                  Current Status:{' '}
                  <span className={`${styles.statusText} ${styles[getGasStatus(nodeData.gasLevel).toLowerCase()]}`}>
                    {getGasStatus(nodeData.gasLevel)}
                  </span>
                </div>
                <div className={styles.gasMeterLabels}>
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Humidity Widget */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Humidity:</h3>
            <div className={styles.widgetContent}>
              <div className={styles.humidityMeter}>
                <div className={styles.humidityThermometer}>
                  <div className={styles.humidityTube}>
                    <div className={styles.humidityFill} style={{ height: `${nodeData.humidity}%` }}></div>
                  </div>
                  <div className={styles.humidityBulb}></div>
                </div>
                <div className={styles.humidityValue}>{nodeData.humidity}%</div>
              </div>
            </div>
          </div>


           {/* Wind Widget */}
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>Wind Speed:</h3>
          <div className={styles.widgetContent}>
            <div className={styles.windMeter}>
              <div className={styles.windCompass}>
                <div className={styles.compassCircle}>
                  <div className={styles.compassArrow} style={{ transform: 'rotate(45deg)' }}></div>
                  <div className={styles.compassPoints}>
                    <span className={styles.compassPoint}>N</span>
                    <span className={styles.compassPoint}>E</span>
                    <span className={styles.compassPoint}>S</span>
                    <span className={styles.compassPoint}>W</span>
                  </div>
                </div>
              </div>
              <div className={styles.windInfo}>
                <div className={styles.windValue}>15 km/h</div>
                <div className={styles.windDirection}>North-East</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
} 