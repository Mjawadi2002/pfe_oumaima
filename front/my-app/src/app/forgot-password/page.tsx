'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../login/login.css';

interface FormData {
  email: string;
}

interface Errors {
  email?: string;
}

export default function ForgotPassword() {
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send a password reset email
      alert('Password reset instructions have been sent to your email');
      router.push('/login');
    }
  };

  return (
    <div className="login-page">
      <video autoPlay muted loop className="background-video">
        <source src="/assets/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-card">
        <div className="login-logo">
          <img src="/assets/logo_pfe.png" alt="Company Logo" className="login-logo" />
        </div>
        <div className="login-title">
          <h1 className="login-welcome-text">Reset Password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-input">
            <label className="login-label">Your email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`login-input-field ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button">
              Send Reset Link
            </button>
            <button type="button" className="login-register-button">
              <Link href="/login">Back to Login</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 