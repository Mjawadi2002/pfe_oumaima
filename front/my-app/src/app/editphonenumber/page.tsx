'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowLeft } from 'lucide-react';
import styles from './editphonenumber.module.css';

export default function EditPhoneNumber() {
    const router = useRouter();
    const [currentPhone, setCurrentPhone] = useState<string>('');
    const [newPhone, setNewPhone] = useState<string>('');
    const [confirmPhone, setConfirmPhone] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validate phone numbers
        if (newPhone !== confirmPhone) {
            setError('Phone numbers do not match');
            return;
        }
        
        if (newPhone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        // Here you would typically make an API call to update the phone number
        console.log('Phone number update submitted');
        // After successful update, you might want to navigate back or show a success message
    };

    const handleBack = () => {
        router.push('/settings');
    };

    return (
        <div className={styles.editPhoneContainer}>
            <div className={styles.editPhoneHeader}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft className={styles.backIcon} />
                    Back to Settings
                </button>
                <h1>Edit Phone Number</h1>
            </div>

            <div className={styles.editPhoneCard}>
                <div className={styles.phoneIconContainer}>
                    <Phone className={styles.phoneIcon} />
                </div>

                <form onSubmit={handleSubmit} className={styles.phoneForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="currentPhone">Current Phone Number</label>
                        <input
                            type="tel"
                            id="currentPhone"
                            value={currentPhone}
                            onChange={(e) => setCurrentPhone(e.target.value)}
                            required
                            placeholder="Enter your current phone number"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="newPhone">New Phone Number</label>
                        <input
                            type="tel"
                            id="newPhone"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            required
                            placeholder="Enter your new phone number"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPhone">Confirm New Phone Number</label>
                        <input
                            type="tel"
                            id="confirmPhone"
                            value={confirmPhone}
                            onChange={(e) => setConfirmPhone(e.target.value)}
                            required
                            placeholder="Confirm your new phone number"
                        />
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <button type="submit" className={styles.submitButton}>
                        Update Phone Number
                    </button>
                </form>
            </div>
        </div>
    );
}
