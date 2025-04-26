'use client';

import API from '@/app/utils/axios';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './register.css';

// Define types for form data and errors
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const re = /^[a-zA-Z0-9_]{3,}$/;
    return re.test(username);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username =
        'Username must be at least 3 characters and can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await API.post('/users', {
          name: formData.username,
          email: formData.email,
          password: formData.password
        });
        console.log('Registered user:', res.data);
        router.push('/login');
      } catch (err: any) {
        console.error('Registration failed:', err.response?.data || err.message);
        alert('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  return (
    <div className="register-page">
      <video autoPlay muted loop className="background-video">
        <source src="/assets/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="register-card">
        <div className="register-title">
          <div className="register-logo">
            <img src="/assets/logo_pfe.png" alt="Company Logo" className="register-logo" />
          </div>
          <h1 className="register-create-text">Create an account</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label className="register-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="oumaimadridi (min. 3 characters)"
              className={`register-input-field ${errors.username ? 'error' : ''}`}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="register-form-group">
            <label className="register-label">Your email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="oumaima.dridi@example.com"
              className={`register-input-field ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="register-form-group">
            <label className="register-label">Set a password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="•••••••• (min. 6 characters)"
              className={`register-input-field ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="register-form-group">
            <label className="register-label">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`register-input-field ${errors.confirmPassword ? 'error' : ''}`}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div>
            <button type="submit" className="register-signup-btn">
              Sign up
            </button>
          </div>

          <div>
            <p className="register-login-link">
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
