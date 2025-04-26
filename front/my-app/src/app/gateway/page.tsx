"use client";
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  User,
  Bell as NotificationBell,
  AlertTriangle,
  Activity,
  X,
  Plus
} from "lucide-react";
import styles from "./gateway.module.css";

interface DecodedToken {
  userName: string;
  role: string;
  [key: string]: any;
}

interface Notification {
  id: number;
  type: "alert" | "data";
  message: string;
  time: string;
  read: boolean;
}

interface Node {
  id: string;
  name: string;
  gateway_name: string;
  temperature?: number;
  humidity?: number;
  gas_level?: number;
  wind_speed?: number;
  gateway_ip_address?: string;
  gateway_port?: number;
  gateway_user?: string;
  gateway_password?: string;
}

export default function Gateway() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]); // 👈 local state

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch nodes locally
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/v1/nodes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch nodes');
        }

        const data = await response.json();
        setNodes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching nodes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleViewAllNotifications = () => {
    router.push("/notifications");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="notification-type-icon alert" />;
      case "data":
        return <Activity className="notification-type-icon data" />;
      default:
        return <Bell className="notification-type-icon" />;
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

  const handleNodeInfoClick = (nodeId: string) => {
    router.push(`/nodedetails/${nodeId}`);
  };

  const handleGatewayClick = (nodeId: string) => {
    router.push(`/gatewaydetails/${nodeId}`);
  };

  const handleCreateNode = () => {
    router.push('/nodes/create');
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading nodes...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  const handleDeleteNode = async (nodeId: string) => {
    const confirmed = confirm("Are you sure you want to delete this node?");
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/v1/nodes/${nodeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!res.ok) throw new Error('Failed to delete node');
  
      setNodes(prev => prev.filter(node => node.id !== nodeId));
    } catch (err) {
      console.error('Error deleting node:', err);
      alert('Something went wrong while deleting the node.');
    }
  };
  

  return (
    <div className={styles.container}>
      {/* ... header and notification JSX unchanged ... */}
      {/* Use local `nodes` state in render */}
      <div className={styles.nodeCardsContainer}>
        {nodes.length > 0 ? (
          nodes.map((node) => (
            <div key={node.id} className={styles.nodeCard}>
              <h3 className={styles.nodeName}>{node.name}</h3>
              <p className={styles.gatewayName}>Gateway: {node.gateway_name}</p>
              <div className={styles.nodeButtons}>
                <button
                  className={styles.nodeInfoBtn}
                  onClick={() => handleNodeInfoClick(node.id)}
                >
                  View Node Info
                </button>
                <button
                  className={styles.gatewayBtn}
                  onClick={() => handleGatewayClick(node.id)}
                >
                  Configure gateway
                </button>
                <button className={styles.deleteBtn}
                  onClick={() => handleDeleteNode(node.id)}
                >
                  <X size={18} className={styles.deleteIcon} />
                  Delete Node
                </button>

              </div>
            </div>
          ))
        ) : (
          <div className={styles.noNodes}>
            <p>No nodes found</p>
          </div>
        )}
      </div>

      {/* Show Create Node button only for admin */}
      {userRole === 'admin' && (
        <button 
          className={styles.createNodeButton}
          onClick={handleCreateNode}
          title="Create new node"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
