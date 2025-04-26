'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import {
  User,
  Camera,
  Trash2,
  Edit,
  Save,
  X,
  Settings
} from 'lucide-react';
import styles from './profile.module.css';
import API from '@/app/utils/axios';

interface DecodedToken {
  userId: number;
  userName: string;
  role: string;
  exp: number;
}

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState('');
  const [creationDate] = useState('January 1, 2024');

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      router.push('/login');
      return;
    }
  
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.userId);
  
      API.get(`/users/${decoded.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          setProfileName(res.data.name);
          setRole(res.data.role);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          if (err.response?.status === 401) {
            router.push('/login');
          }
        });
    } catch (err) {
      console.error('Invalid token');
      router.push('/login');
    }
  }, [router]);
  

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setIsEditing(false);
    // Save changes to backend here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally, reset to original name if you save a copy beforehand
  };

  const handleChangePicture = () => console.log('Change picture clicked');
  const handleDeletePicture = () => console.log('Delete picture clicked');
  const handleEditAccount = () => router.push('/settings?activeSection=account');

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>Profile</h1>
          <p className={styles.headerSubtitle}>Manage your profile information</p>
        </div>
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profilePictureSection}>
            <div className={styles.profilePictureLarge}>
              <User className={styles.profileIconLarge} />
            </div>
            <button className={styles.editAccountButton} onClick={handleEditAccount}>
              <Settings className={styles.actionIcon} />
              <span>Edit Account</span>
            </button>
            <div className={styles.pictureActions}>
              <button className={styles.pictureActionButton} onClick={handleChangePicture}>
                <Camera className={styles.actionIcon} />
                <span>Change Picture</span>
              </button>
              <button className={`${styles.pictureActionButton} ${styles.delete}`} onClick={handleDeletePicture}>
                <Trash2 className={styles.actionIcon} />
                <span>Delete Picture</span>
              </button>
            </div>
          </div>

          <div className={styles.profileInfoSection}>
            <div className={styles.profileNameContainer}>
              {isEditing ? (
                <div className={styles.nameEditContainer}>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={styles.profileNameInput}
                  />
                  <div className={styles.editActions}>
                    <button className={`${styles.editButton} ${styles.save}`} onClick={handleSave}>
                      <Save className={styles.actionIcon} />
                    </button>
                    <button className={`${styles.editButton} ${styles.cancel}`} onClick={handleCancel}>
                      <X className={styles.actionIcon} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.nameDisplayContainer}>
                  <h2 className={styles.profileName}>{profileName}</h2>
                  <button className={styles.editButton} onClick={handleEdit}>
                    <Edit className={styles.actionIcon} />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.profileDetails}>
              <div className={styles.profileDetailItem}>
                <span className={styles.detailLabel}>ID:</span>
                <span className={styles.detailValue}>#{userId}</span>
              </div>
              <div className={styles.profileDetailItem}>
                <span className={styles.detailLabel}>Role:</span>
                <span className={styles.detailValue}>{role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
