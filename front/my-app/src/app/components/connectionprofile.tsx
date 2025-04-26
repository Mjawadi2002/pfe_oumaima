import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import styles from "./connectionprofile.module.css";

// Define TypeScript interface for connection data
interface Connection {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  connectedDate: string;
  username: string;
  lastActive: string;
  totalNodesConnected: number;
}

interface ConnectionProfileProps {
  id: string;
}

export default function ConnectionProfile({ id }: ConnectionProfileProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [connection, setConnection] = useState<Connection | null>(null);

  const fetchConnectionData = async () => {
    try {
      const response = await fetch('/api/connections');
      const connections = await response.json();
      const foundConnection = connections.find((conn: Connection) => conn.id === id);
      
      if (foundConnection) {
        // Add additional fields for the detailed view
        setConnection({
          ...foundConnection,
          username: 'user123',
          lastActive: '2 hours ago',
          totalNodesConnected: 150
        });
      } else {
        console.error('Connection not found');
      }
    } catch (error) {
      console.error('Error fetching connection data:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchConnectionData();

    // Listen for connection updates
    const handleConnectionUpdate = () => {
      fetchConnectionData();
    };
    window.addEventListener('connectionUpdated', handleConnectionUpdate);

    return () => {
      clearInterval(timer);
      window.removeEventListener('connectionUpdated', handleConnectionUpdate);
    };
  }, [id]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!connection) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Connection Profile</h1>
        <p className={styles.subtitle}>View connection details</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <User size={40} />
          </div>
          <div className={styles.profileInfo}>
            <h2>{connection.name}</h2>
            <span className={`${styles.status} ${connection.status === 'Active' ? styles.active : styles.inactive}`}>
              {connection.status}
            </span>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <label>Connection ID</label>
            <span>{connection.id}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Username</label>
            <span>{connection.username}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Connected Since</label>
            <span>{connection.connectedDate}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Last Active</label>
            <span>{connection.lastActive}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Total Nodes Connected</label>
            <span>{connection.totalNodesConnected}</span>
          </div>
        </div>
      </div>
    </div>
  );
}