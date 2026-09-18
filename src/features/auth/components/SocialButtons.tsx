import React from 'react';

interface SocialButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  isLoading?: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGoogleLogin,
  onAppleLogin,
  isLoading = false,
}) => {
  return (
    <div className="auth-modal__social-group">
      <div className="auth-modal__divider">
        <span className="auth-modal__divider-line"></span>
        <span className="auth-modal__divider-text">Hoặc tiếp tục với</span>
        <span className="auth-modal__divider-line"></span>
      </div>

      <div className="auth-modal__social-buttons">
        {/* Google 1-Touch */}
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={isLoading}
          className="auth-modal__social-btn auth-modal__social-btn--google"
        >
          <svg className="auth-modal__social-svg" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="auth-modal__social-text">Google</span>
        </button>

        {/* Apple 1-Touch */}
        <button
          type="button"
          onClick={onAppleLogin}
          disabled={isLoading}
          className="auth-modal__social-btn auth-modal__social-btn--apple"
        >
          <svg className="auth-modal__social-svg" viewBox="0 0 170 170" width="18" height="18" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.42-6.3-9.98-11.23-21.17-14.77-33.56-3.55-12.39-5.32-23.77-5.32-34.15 0-14.88 3.7-27.13 11.09-36.75 7.39-9.62 16.63-14.54 27.71-14.76 4.9.11 10.15 1.34 15.75 3.69 5.6 2.34 9.4 3.56 11.4 3.68 2.01-.12 5.92-1.38 11.75-3.79 5.82-2.4 11.04-3.55 15.65-3.46 9.03.43 16.73 3.6 23.11 9.5 6.38 5.9 10.74 13.34 13.08 22.31-8.15 4.9-12.18 11.83-12.08 20.79.11 8.7 3.59 15.95 10.45 21.75 6.85 5.79 14.89 9.08 24.12 9.87-2.28 7.39-5.32 15.11-9.12 23.16zM119.22 33.3c0-7.39 2.65-14.33 7.94-20.82 5.29-6.49 11.77-10.65 19.45-12.48.22 1.3.33 2.5.33 3.59 0 7.39-2.76 14.49-8.28 21.3-5.52 6.81-12.15 10.9-19.89 12.28-.44-1.3-.66-2.5-.66-3.87z" />
          </svg>
          <span className="auth-modal__social-text">Apple</span>
        </button>
      </div>
    </div>
  );
};
