'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import styles from './editemail.module.css';

export default function EditEmail() {
    const router = useRouter();
    const [currentEmail, setCurrentEmail] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');
    const [confirmEmail, setConfirmEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validate emails
        if (newEmail !== confirmEmail) {
            setError('Email addresses do not match');
            return;
        }
        
        if (!newEmail.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        // Here you would typically make an API call to update the email
        console.log('Email update submitted');
        // After successful update, you might want to navigate back or show a success message
    };

    const handleBack = () => {
        router.push('/settings');
    };

    return (
        <div className={styles.editEmailContainer}>
            <div className={styles.editEmailHeader}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft className={styles.backIcon} />
                    Back to Settings
                </button>
                <h1>Edit Email</h1>
            </div>

            <div className={styles.editEmailCard}>
                <div className={styles.emailIconContainer}>
                    <Mail className={styles.emailIcon} />
                </div>

                <form onSubmit={handleSubmit} className={styles.emailForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="currentEmail">Current Email</label>
                        <input
                            type="email"
                            id="currentEmail"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            required
                            placeholder="Enter your current email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="newEmail">New Email</label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            placeholder="Enter your new email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmEmail">Confirm New Email</label>
                        <input
                            type="email"
                            id="confirmEmail"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            required
                            placeholder="Confirm your new email"
                        />
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <button type="submit" className={styles.submitButton}>
                        Update Email
                    </button>
                </form>
            </div>
        </div>
    );
}
