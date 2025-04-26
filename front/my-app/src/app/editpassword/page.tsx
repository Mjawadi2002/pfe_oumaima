'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import styles from './editpassword.module.css';

export default function EditPassword() {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validate passwords
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Here you would typically make an API call to update the password
        console.log('Password update submitted');
        // After successful update, you might want to navigate back or show a success message
    };

    const handleBack = () => {
        router.push('/settings');
    };

    return (
        <div className={styles.editPasswordContainer}>
            <div className={styles.editPasswordHeader}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft className={styles.backIcon} />
                    Back to Settings
                </button>
                <h1>Edit Password</h1>
            </div>

            <div className={styles.editPasswordCard}>
                <div className={styles.passwordIconContainer}>
                    <Key className={styles.passwordIcon} />
                </div>

                <form onSubmit={handleSubmit} className={styles.passwordForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="oldPassword">Old Password</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                placeholder="Enter your old password"
                            />
                            <button 
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword">New Password</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter your new password"
                            />
                            <button 
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your new password"
                            />
                            <button 
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <button type="submit" className={styles.submitButton}>
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}