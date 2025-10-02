'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './VerifyOtp.module.css';

const VerifyOtp = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  onChangeNumber, 
  onResendOtp,
  phoneNumber ,
  isLoading = false,
  isTestNumber = false
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setTimer(30);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      while (newOtp.length < 6) newOtp.push('');
      setOtp(newOtp);
      inputRefs.current[Math.min(5, pastedData.length - 1)]?.focus();
    }
  };

  const handleSubmit = async (otpValue = otp.join('')) => {
    if (otpValue.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setError('');
    await onVerify(otpValue);
  };

  const resendOtp = async () => {
    setTimer(30);
    setError('');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    
    if (onResendOtp) {
      await onResendOtp();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>Verify Your Phone</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.phoneInfo}>
            <i className="fas fa-mobile-alt"></i>
            <p>Enter the 6-digit code sent to</p>
            <p className={styles.phoneNumber}>{phoneNumber}</p>
            
            {/* Show test OTP hint for test numbers */}
            {isTestNumber && (
              <div className={styles.testOtpHint}>
                <i className="fas fa-info-circle"></i>
                Test OTP: <strong>000000</strong>
              </div>
            )}
            
            <button 
              className={styles.changeNumberBtn}
              onClick={onChangeNumber}
              disabled={isLoading}
            >
              <i className="fas fa-edit"></i>
              Change Number
            </button>
          </div>

          <div className={styles.inputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`${styles.digit} ${error ? styles.error : ''}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className={styles.timerSection}>
            {timer > 0 ? (
              <p>Resend code in <span className={styles.timer}>{timer}s</span></p>
            ) : (
              <button className={styles.resendBtn} onClick={resendOtp} disabled={isLoading}>
                Resend OTP
              </button>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerButtons}>
            <button
              className={styles.backButton}
              onClick={onClose}
              disabled={isLoading}
            >
              <i className="fas fa-arrow-left"></i>
              Back
            </button>
            
            <button
              className={styles.verifyBtn}
              onClick={() => handleSubmit()}
              disabled={isLoading || otp.some(digit => digit === '')}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="fas fa-shield-alt"></i>
                  Verify OTP
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;