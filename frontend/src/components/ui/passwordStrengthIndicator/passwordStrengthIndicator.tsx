import { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color?: string;
  percent?: number;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const [showTip, setShowTip] = useState<boolean>(false);

  const getStrength = (password: string): StrengthResult => {
    if (!password) return { score: 0, label: 'None' };
    
    let score = 0;
    if (password.length >= 5) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    let label = '';
    let color = '';
    
    switch (true) {
      case (score <= 2):
        label = 'Weak';
        color = 'red';
        break;
      case (score <= 4):
        label = 'Moderate';
        color = 'orange';
        break;
      case (score <= 5):
        label = 'Strong';
        color = 'yellowgreen';
        break;
      default:
        label = 'Very Strong';
        color = 'green';
    }
    
    return { score, label, color, percent: (score / 6) * 100 };
  };

  const strength = getStrength(password);

  return (
    <div className="password-strength-meter">
      <div className="strength-meter-container">
        <div className="strength-meter">
          <div
            className="strength-meter-fill"
            style={{
              width: `${strength.percent}%`,
              backgroundColor: strength.color
            }}
          ></div>
        </div>
        <div
          className="info-icon-container"
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          <AiOutlineInfoCircle className="info-icon" />
          {showTip && (
            <div className="tooltip">
              <p>For a stronger password:</p>
              <ul>
                <li>Use at least 12 characters</li>
                <li>Include uppercase letters (A-Z)</li>
                <li>Include lowercase letters (a-z)</li>
                <li>Include numbers (0-9)</li>
                <li>Include special characters (!@#$%^&*)</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {password && (
        <div className="strength-label" style={{ color: strength.color }}>
          Password strength: <strong>{strength.label}</strong>
        </div>
      )}
    </div>
  );
};