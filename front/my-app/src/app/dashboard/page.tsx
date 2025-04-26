'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import styles from './dashboard.module.css'; 
import { 
  User,
  User as ProfileIcon,
  Network as NodesIcon,
  Bell as AlertsIcon,
  Server as GatewayIcon,
  Users as UsersIcon
} from 'lucide-react';

interface DecodedToken {
  userId: number;
  userName: string;
  role: string;
  exp: number;
}

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export default function Dashboard() {
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  // Decode token and get user data from localStorage
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

  // Cards configuration based on user role
  const getCards = (): DashboardCard[] => {
    if (userRole === 'admin') {
      return [
        {
          title: 'Gateway Configuration',
          description: 'Configure your nodes and gateways',
          icon: <GatewayIcon className={styles.cardIcon} />,
          link: '/gateway'
        },
        {
          title: 'Users',
          description: 'Manage application users',
          icon: <UsersIcon className={styles.cardIcon} />,
          link: '/users'
        }
      ];
    } else {
      return [
        {
          title: 'Profile',
          description: 'View and edit your profile',
          icon: <ProfileIcon className={styles.cardIcon} />,
          link: '/profile'
        },
        {
          title: 'Associated Nodes',
          description: 'View your connected nodes',
          icon: <NodesIcon className={styles.cardIcon} />,
          link: '/nodes'
        },
        {
          title: 'Alerts',
          description: 'View your notifications',
          icon: <AlertsIcon className={styles.cardIcon} />,
          link: '/alerts'
        }
      ];
    }
  };

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Dashboard</h1>
          <p className={styles.headerSubtitle}>
            {userRole === 'admin' ? 'Administration Panel' : 'User Dashboard'}
          </p>
        </div>
        <Link href="/profile">
          <div className={styles.userProfile}>
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

      {/* Cards Grid */}
      <div className={styles.cardsContainer}>
        {getCards().map((card, index) => (
          <Link key={index} href={card.link}>
            <div className={styles.card}>
              {card.icon}
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}