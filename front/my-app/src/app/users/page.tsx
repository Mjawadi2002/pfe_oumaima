'use client';
import React, { useState, useEffect } from 'react';
import styles from './users.module.css';
import {  FaPlus,FaUser, FaEdit, FaTrash, FaEnvelope, FaUserShield, FaUserTag } from 'react-icons/fa';
import Modal from '@/app/components/Modal';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userName: string;
  role: string;
  [key: string]: any;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  // Get authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    // Decode token to get user role
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Invalid token');
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/users', {
          headers: getAuthHeaders()
        });

        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        if (err instanceof Error && err.message.includes('Unauthorized')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete user');
        if (err instanceof Error && err.message.includes('Unauthorized')) {
          router.push('/login');
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/${currentUser.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(currentUser)
      });

      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        router.push('/login');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <div className={styles.loading}>Loading users...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      
      {/* Only show create button for admin */}
      {userRole === 'admin' && (
        <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
  <FaPlus className={styles.plusIcon} /> 
  +
</button>
      )}
      
      <div className={styles.usersGrid}>
        {users.map(user => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userHeader}>
              <FaUser className={styles.userIcon} />
              <h3 className={styles.userName}>{user.name}</h3>
            </div>
            
            <div className={styles.userDetails}>
              <div className={styles.detailItem}>
                <FaEnvelope className={styles.detailIcon} />
                <span>{user.email}</span>
              </div>
              <div className={styles.detailItem}>
                {user.role === 'admin' ? (
                  <FaUserShield className={styles.detailIcon} />
                ) : (
                  <FaUserTag className={styles.detailIcon} />
                )}
                <span className={user.role === 'admin' ? styles.adminRole : styles.clientRole}>
                  {user.role}
                </span>
              </div>
            </div>
            
            {userRole === 'admin' && (
              <div className={styles.userActions}>
                <button 
                  onClick={() => handleEdit(user)}
                  className={styles.editButton}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(user.id)}
                  className={styles.deleteButton}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <h2>{currentUser ? 'Edit User' : 'Create New User'}</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentUser?.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={currentUser?.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={currentUser?.role || 'client'}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>
          
          <div className={styles.modalActions}>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              {currentUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;