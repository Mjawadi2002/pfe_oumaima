'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './nodedetails.module.css';
import { 
  Bell as NotificationBell,
  User,
  AlertTriangle,
  Activity,
  X,
} from 'lucide-react';

interface NodeData {
  id: number;
  name: string;
  status: 'Online' | 'Offline';
  type: 'temperature' | 'humidity' | 'gas' | 'wind';
  connectedDate: string;
  lastUpdate: string;
  value: number;
  unit: string;
}

interface Notification {
  id: number;
  type: 'alert' | 'data';
  message: string;
  time: string;
  read: boolean;
}

export default function NodeDetails() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [nodeData, setNodeData] = useState<NodeData | null>(null);

  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      message: 'High temperature detected in Node',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'data',
      message: 'New sensor data received',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'alert',
      message: 'Connection status changed',
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
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // In a real app, you would fetch the node data based on the URL parameter
    // For now, we'll use mock data
    const mockNodeData: NodeData = {
      id: 1,
      name: 'Temperature Node 1',
      status: 'Online',
      type: 'temperature',
      connectedDate: '2024-03-15',
      lastUpdate: '2024-03-20T10:30:00',
      value: 25.5,
      unit: '°C'
    };
    setNodeData(mockNodeData);
  }, []);

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

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <>
    </>
  );
}
