'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/app/utils/axios'; // your custom axios instance
import './login.css';

// Types
interface FormData {
  emailOrUsername: string;
  password: string;
}

interface Errors {
  emailOrUsername?: string;
  password?: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    emailOrUsername: '',
    password: ''
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

    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = 'Email or username is required';
    } else {
      const isEmail = validateEmail(formData.emailOrUsername);
      const isUsername = validateUsername(formData.emailOrUsername);

      if (!isEmail && !isUsername) {
        newErrors.emailOrUsername =
          'Please enter a valid email or username (min 3 characters)';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        const res = await API.post('/users/login', {
          identifier: formData.emailOrUsername,
          password: formData.password
        });

        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        router.push('/dashboard');
      } catch (err: any) {
        console.error('Login failed:', err.response?.data || err.message);
        alert('Login failed: ' + (err.response?.data?.error || 'Unknown error'));
      }
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
          <h1 className="login-welcome-text">Welcome Back</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-input">
            <label className="login-label">Your email/username</label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`login-input-field ${errors.emailOrUsername ? 'error' : ''}`}
            />
            {errors.emailOrUsername && (
              <span className="error-message">{errors.emailOrUsername}</span>
            )}
          </div>
          <div className="login-input">
            <label className="login-label">Your password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your secure password"
              className={`login-input-field ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="forgot-password">
            <Link href="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button">
              Login
            </button>
            <Link href="/register">
              <button type="button" className="login-register-button">
                Register
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
