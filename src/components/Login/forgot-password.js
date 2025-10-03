// components/ForgotPasswordFlow.jsx
'use client';
import { useState, useRef, useEffect } from "react";
import { Grid, TextField, Button, Typography, InputAdornment, Box, CircularProgress } from "@mui/material";
import { Person, Key, Check, ArrowForward } from "@mui/icons-material";
import axios from "axios";
import styles from "./Login.module.css";
import API from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Add this at the top
import { IconButton } from "@mui/material";

const ForgotPasswordFlow = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1 = Mobile, 2 = OTP, 3 = Reset Password
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Inside your component
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const OtpInput = ({ otp, setOtp, error, setError, onOtpChange }) => {
    const length = 6;
    const [otpArray, setOtpArray] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    // Reset otpArray on mount
    useEffect(() => {
      setOtpArray(Array(length).fill(''));
    }, []); // Only on mount

    // Sync local otpArray with parent otp prop
    useEffect(() => {
      const array = otp.padEnd(length, '').split('').slice(0, length);
      setOtpArray(array);
    }, [otp, length]);

    // Focus first empty field on mount with delay for reliability
    useEffect(() => {
      const firstEmptyIndex = otpArray.findIndex((d) => d === '') !== -1 ? otpArray.findIndex((d) => d === '') : 0;
      setTimeout(() => {
        inputRefs.current[firstEmptyIndex]?.focus();
      }, 0);
    }, []); // Only on mount

    const handleChange = (index, value) => {
      if (!/^\d?$/.test(value)) return; // Allow only digits or empty
      const newOtp = [...otpArray];
      newOtp[index] = value;
      setOtpArray(newOtp);
      const joinedOtp = newOtp.join('').replace(/[^0-9]/g, ''); // Clean any non-digits
      setOtp(joinedOtp);
      if (onOtpChange) onOtpChange(joinedOtp);

      // Clear error on typing
      if (error) setError("");

      // Auto move to next box with delay for reliability
      if (value && index < length - 1) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    };

    const handleKeyDown = (index, e) => {
      if (e.key === 'Backspace') {
        e.preventDefault(); // Prevent default backspace behavior
        const currentValue = otpArray[index];
        const newOtp = [...otpArray];

        if (currentValue !== '') {
          newOtp[index] = ''; // Clear current if not empty
          setOtpArray(newOtp);
          setOtp(newOtp.join(''));
        } else if (index > 0) {
          // If empty, move to previous and clear it
          newOtp[index - 1] = '';
          setOtpArray(newOtp);
          setOtp(newOtp.join(''));
          setTimeout(() => {
            inputRefs.current[index - 1]?.focus();
          }, 0);
        }
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length); // Extract digits only
      if (pasted.length > 0) {
        const newOtp = pasted.split('').concat(Array(length - pasted.length).fill(''));
        setOtpArray(newOtp);
        setOtp(newOtp.join(''));
        // Focus the next field after pasted digits
        const nextIndex = Math.min(length - 1, pasted.length);
        setTimeout(() => {
          inputRefs.current[nextIndex]?.focus();
        }, 0);
      }
    };

    return (
      <Box display="flex" justifyContent="space-between" maxWidth="18rem" mx="auto">
        {Array.from({ length }).map((_, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)} // Direct ref to input element
            value={otpArray[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              inputMode: 'numeric',
              style: { textAlign: 'center', fontSize: '1.5rem' },
              autoFocus: index === 0, // Auto-focus only first input
            }}
            sx={{
              width: '2.5rem',
              height: '2.5rem',
              '& .MuiInputBase-input': {
                textAlign: 'center',
                padding: 0,
              },
              mr: index < length - 1 ? 1 : 0,
            }}
            error={Boolean(error)}
          />
        ))}
      </Box>
    );
  };

  const maskMobile = (mobile) => {
    if (!mobile) return '';
    const firstTwo = mobile.slice(0, 2);
    const lastThree = mobile.slice(-3);
    const masked = firstTwo + '*'.repeat(mobile.length - 5) + lastThree;
    return masked;
  };

  // Step 1: Check if mobile exists and send OTP
  const handleSendOtp = async () => {
    if (!mobile.trim()) {
      setError("Mobile number is required");
      return;
    }

    try {
      setLoading(true);

      // -----------------------------
      // Step 1: Check if user exists
      // -----------------------------
      const checkReqData = { mobile: mobile.trim() };
      const encCheckReq = DataEncrypt(JSON.stringify(checkReqData));

      const checkResponse = await API.post('/api/users/check-user-by-mobile',
        { encReq: encCheckReq },
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`
          }
        }
      );

      const decryptedCheck = DataDecrypt(checkResponse.data);
      console.log("decryptedCheck: ", decryptedCheck);

      if (!decryptedCheck.exists) {
        setError("User with this mobile number does not exist");
        return;
      }

      // -----------------------------
      // Step 2: Prepare OTP request
      // -----------------------------
      // Use email and name from user data if present
      const { email, first_name, last_name } = decryptedCheck.data || {};
      const fullName = `${first_name || ''} ${last_name || ''}`.trim();

      const otpReqData = {
        mode: 'API',                     // Required
        type: 'Mobile',                  // Required
        category: 'Forgot Password',     // Required
        mobile: mobile.trim(),           // Required
        email: email || '',              // Optional but send if available
        name: fullName || ''             // Optional but send if available
      };

      const encOtpReq = DataEncrypt(JSON.stringify(otpReqData));

      // -----------------------------
      // Step 3: Send OTP
      // -----------------------------
      const response = await API.post('/api/otp/8930cae4a942a0286226f1651dfbff89216174c8',
        { encReq: encOtpReq },
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`
          }
        }
      );

      const decryptedResponse = DataDecrypt(response.data);
      console.log('Forgot password OTP response:', decryptedResponse);

      if (decryptedResponse.status === 200) {
        setStep(2); // Move to OTP verification step
        setError("");
      } else {
        setError(decryptedResponse.message || "Failed to send OTP");
      }

    } catch (err) {
      console.error('Send OTP error:', err);
      let errorMsg = 'Something went wrong while sending OTP';
      if (err?.response?.data) {
        try {
          const decryptedError = DataDecrypt(err.response.data);
          errorMsg = decryptedError.message || errorMsg;
        } catch {
          errorMsg = err.response.data || errorMsg;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);

      // Prepare request data
      const reqData = {
        otp: otp.trim(),
        mode: 'API',
        type: 'Mobile',
        category: 'Forgot Password',
        mobile: mobile.trim(),
      };

      const encReq = DataEncrypt(JSON.stringify(reqData));

      const response = await API.post(
        '/api/otp/3ae2750febeb3583bec28c67c42063120cb72963',
        { encReq },
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`
          }
        }
      );

      // Decrypt response
      const decryptedResponse = DataDecrypt(response.data);
      console.log('OTP verification response:', decryptedResponse);

      // Backend sends different structures for success/error
      const status = decryptedResponse?.status;
      const messageObj = decryptedResponse?.message;

      if (status === 200) {
        // Success: OTP verified
        setStep(3);
        setError("");
        alert(messageObj?.message || "OTP verified successfully");
      } else if (status === 401) {
        // Wrong OTP
        setError(messageObj || "Wrong OTP");
      } else if (status === 500 && messageObj?.message === "Otp expired") {
        // Expired OTP
        setError("OTP has expired. Please request a new one.");
      } else {
        // Fallback for other errors
        setError(messageObj?.message || "OTP verification failed");
      }

    } catch (err) {
      console.error('OTP verification error:', err);

      let errorMsg = 'OTP verification failed';
      // Handle encrypted error responses
      if (err?.response?.data) {
        try {
          const decryptedError = DataDecrypt(err.response.data);
          const errStatus = decryptedError?.status;
          const errMessage = decryptedError?.message?.message || decryptedError?.message || decryptedError?.error;
          if (errStatus === 401) errorMsg = errMessage || "Wrong OTP";
          else if (errStatus === 500 && errMessage === "Otp expired") errorMsg = "OTP has expired. Please request a new one.";
          else errorMsg = errMessage || errorMsg;
        } catch {
          errorMsg = "OTP verification failed";
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Prepare the request data
      const reqData = {
        mobile: mobile.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim()
      };

      // Encrypt the request
      const encReq = DataEncrypt(JSON.stringify(reqData));

      // Send encrypted request to backend
      const response = await API.post(
        "/api/users/d1a207b38c8b705457e740a084bcf96d959ea01e",
        { encReq },
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`
          }
        }
      );

      // Decrypt the response
      const decryptedResponse = DataDecrypt(response.data);

      console.log("decryptedResponse ", decryptedResponse)
      if (decryptedResponse.status === 200) {
        alert(decryptedResponse.message || "Password reset successfully");
        onBack(); // return to login page
      } else {
        setError(decryptedResponse.message || "Failed to reset password");
      }

    } catch (err) {
      console.error(err);
      let errorMsg = 'Something went wrong';
      if (err?.response?.data) {
        try {
          const decryptedError = DataDecrypt(err.response.data);
          errorMsg = decryptedError.message || errorMsg;
        } catch {
          errorMsg = err.response.data || errorMsg;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Grid container spacing={3} className={styles.formContainer}>
      {step === 1 && (
        <>
          <Grid item xs={12}>
            <Typography className={styles.inputLabel}>Mobile Number</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => { setMobile(e.target.value); if (error) setError(""); }}
              error={Boolean(error)}
              helperText={error}
              InputProps={{
                className: styles.textInput,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className={styles.inputIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              endIcon={<ArrowForward />}
              onClick={handleSendOtp}
              disabled={loading}
              className={styles.loginButton}
              sx={{

                height: '36px',          // smaller height
                padding: '4px 12px',     // smaller padding
                fontSize: '0.875rem',    // slightly smaller font
                borderRadius: "5px"
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
            </Button>
          </Grid>

        </>
      )}
      {step === 2 && (
        <>
          <Grid item xs={12}>
            <Typography
              className={styles.inputLabel}
              align="center"
              sx={{ mb: 1 }} // optional spacing
            >
              We have sent an OTP on {maskMobile(mobile)}.<br />
              Please enter it below to continue.
            </Typography>
          </Grid>


          <Grid item xs={12}>
            <OtpInput
              otp={otp}
              setOtp={setOtp}
              error={error}
              setError={setError}
              onOtpChange={(newOtp) => console.log('OTP updated:', newOtp)} // Optional logging
            />
            {error && (
              <Box mt={1} display="flex" justifyContent="center">
                <Typography color="error" variant="caption">
                  {error}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              endIcon={<ArrowForward />}
              fullWidth
              sx={{
                height: '32px',
                padding: '4px 12px',
                fontSize: '0.875rem',
                borderRadius: '5px'
              }}
            >
              {loading ? <CircularProgress size={18} color="inherit" /> : "Verify OTP"}
            </Button>
          </Grid>
        </>
      )}


      {step === 3 && (
        <>
          <Grid item xs={12}>
            <Typography className={styles.inputLabel}>Mobile Number</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={mobile}           // show previously entered mobile
              disabled                  // disable editing
              InputProps={{
                className: styles.textInput,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className={styles.inputIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography className={styles.inputLabel}>New Password</Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              variant="outlined"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
              error={Boolean(error)}
              helperText={error}
              InputProps={{
                className: styles.textInput,
                startAdornment: (
                  <InputAdornment position="start">
                    <Key className={styles.inputIcon} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography className={styles.inputLabel}>Confirm Password</Typography>
            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(""); }}
              error={Boolean(error)}
              helperText={error}
              InputProps={{
                className: styles.textInput,
                startAdornment: (
                  <InputAdornment position="start">
                    <Check className={styles.inputIcon} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={handleResetPassword}
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </Button>
          </Grid>
        </>
      )}


      <Grid item xs={12}>
        <Typography
          className={styles.backLink}
          onClick={onBack}
        >
          ← Back to Login
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordFlow;
