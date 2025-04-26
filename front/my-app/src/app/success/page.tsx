// app/success/page.tsx
import Link from 'next/link';
import './success.css';

export default function Success() {
  return (
    <div className="success-page">
      {/* Video Background */}
      <video autoPlay muted loop className="background-video">
        <source src="/assets/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="success-card">
        <div className="success-logo">
          <img src="/assets/logo_pfe.png" alt="Company Logo" className="success-logo" />
        </div>
        <h2 className="success-title">Account Created Successfully!</h2>
        <p className="success-text">
          Your account has been successfully created.
          You can now log in with your credentials.
        </p>
        <div className="success-button-container">
          <Link href="/login" className="success-button">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}