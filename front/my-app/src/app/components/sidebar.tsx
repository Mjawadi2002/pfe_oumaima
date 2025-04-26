'use client';

import './sidebar.css';
import {
  LayoutDashboard,
  Network,
  Share2,
  Bell,
  LogOut,
  Settings,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface MenuItem {
  icon: ReactNode;
  label: string;
  path: string;
  active: boolean;
  hidden?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface DecodedToken {
  role: string;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard className="icon" />, label: 'Dashboard', path: '/dashboard', active: pathname === '/dashboard' },
    { icon: <Network className="icon" />, label: 'Nodes', path: '/nodes', active: pathname === '/nodes' },
    { icon: <Share2 className="icon" />, label: 'Connections', path: '/connections', active: pathname === '/connections' },
    { icon: <Bell className="icon" />, label: 'Alerts', path: '/alerts', active: pathname === '/alerts' },
    {
      icon: <Wrench className="icon" />,
      label: 'Gateway Configurations',
      path: '/gateway',
      active: pathname === '/gateway',
      hidden: userRole === 'client',
    },
    { icon: <Settings className="icon" />, label: 'Settings', path: '/settings', active: pathname === '/settings' },
    {
      icon: <LogOut className="icon" />,
      label: 'Log out',
      path: '/',
      active: false,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="logo-container">
        <div className="logo-text">
          <img src="/assets/logo_pfe.png" alt="Company Logo" style={{ height: '5rem' }} />
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems
          .filter(item => !item.hidden)
          .map((item, index) => (
            <Link href={item.path} key={index} onClick={item.onClick}>
              <div className={`menu-item ${item.active ? 'active' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
      </nav>
    </div>
  );
}
