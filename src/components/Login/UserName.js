import { Grid, TextField, Button, Typography, InputAdornment, IconButton, Box, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff, Person, Lock, ArrowForward } from "@mui/icons-material";
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';

import styles from "./Login.module.css";
import VerifyOtp from "@/components/Otp/VerifyOtp";

const UserName = ({ onForgotPassword, onUnblock }) => {
    const route = useRouter();

    const [formData, setFormData] = useState({
        mobileNumber: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const [alert, setAlert] = useState({ open: false, type: false, message: null });
    const [loading, setLoading] = useState(false);
    
    // OTP Dialog State
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [userData, setUserData] = useState(null);
    const [otpLoading, setOtpLoading] = useState(false);

    const handleSignUpClick = () => {
        route.push('/sign-up');
    };

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
        if (errors.captcha) {
            setErrors(prev => ({
                ...prev,
                captcha: ""
            }));
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ open: false, type: false, message: null });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Build error object
        const newErrors = {
            mobileNumber: !formData.mobileNumber.trim() ? "Mobile number is required." : "",
            password: !formData.password ? "Password is required." : "",
            captcha: !captchaToken ? "Please complete the CAPTCHA." : ""
        };
        setErrors(newErrors);

        // If any error message is not empty → stop here
        if (Object.values(newErrors).some((msg) => msg !== "")) {
            setLoading(false);
            return;
        }

        try {
            // Prepare request data
            const reqData = {
                username: formData.mobileNumber,
                password: formData.password,
                is_admin: 1,
                captchaToken
            };

            const response = await api.post('/api/users/admin_login', reqData);
            console.log("Login response:", response);

            if (response.status === 200) {
                const responseData = response.data;
                
                // Extract token and refreshToken from response
                const token = responseData.token;
                const refreshToken = responseData.refreshToken || responseData.refresh_token; // Handle different naming conventions
                const userData = responseData.data || responseData.user; // Handle different response structures

                if (!token) {
                    throw new Error('No token received from server');
                }

                // Store authentication tokens
                sessionStorage.setItem('token', token);
                if (refreshToken) {
                    sessionStorage.setItem('refreshToken', refreshToken);
                }
                sessionStorage.setItem('role', 'user');

                // Store user data if available
                if (userData) {
                    // Store each field from backend separately
                    sessionStorage.setItem('id', userData.id || '');
                    sessionStorage.setItem('mlm_id', userData.mlm_id || '');
                    sessionStorage.setItem('first_name', userData.first_name || '');
                    sessionStorage.setItem('last_name', userData.last_name || '');
                    sessionStorage.setItem('username', userData.username || '');
                    sessionStorage.setItem('email', userData.email || '');
                    sessionStorage.setItem('mobile', userData.mobile || '');
                    sessionStorage.setItem('refered_by', userData.refered_by || '');
                    sessionStorage.setItem('country', userData.country || '');
                    sessionStorage.setItem('state', userData.state || '');
                    sessionStorage.setItem('circle', userData.circle || '');
                    sessionStorage.setItem('district', userData.district || '');
                    sessionStorage.setItem('division', userData.division || '');
                    sessionStorage.setItem('region', userData.region || '');
                    sessionStorage.setItem('block', userData.block || '');
                    sessionStorage.setItem('pincode', userData.pincode || '');
                    sessionStorage.setItem('address', userData.address || '');
                    sessionStorage.setItem('dob', userData.dob || '');
                    sessionStorage.setItem('is_prime', userData.is_prime || '');
                    sessionStorage.setItem('registration_date', userData.registration_date || '');
                    sessionStorage.setItem('role_name', userData.role_name || '');

                    // Store menu if available
                    if (userData.employeeMenu) {
                        sessionStorage.setItem('menu', JSON.stringify(userData.employeeMenu));
                    }

                    // Show OTP dialog instead of redirecting immediately
                    setUserData({
                        mobile: userData.mobile || formData.mobileNumber,
                        token: token,
                        refreshToken: refreshToken
                    });
                    setShowOtpDialog(true);
                    setAlert({ open: true, type: true, message: 'Login successful! Please verify OTP.' });
                } else {
                    // If no user data structure, proceed directly
                    setAlert({ open: true, type: true, message: 'Login successful!' });
                    route.replace('/dashboard');
                }
                
            } else {
                setAlert({ open: true, type: false, message: response.data?.message || 'Login failed' });
            }
        } catch (error) {
            console.error("Login error:", error);
            
            // Handle different error response structures
            let errorMessage = 'An error occurred during login';
            
            if (error?.response?.status === 401) {
                try {
                    // Try to decrypt if encrypted
                    const decryptedError = DataDecrypt(error.response.data);
                    errorMessage = decryptedError.message || 'Invalid credentials';
                } catch (err) {
                    errorMessage = error.response.data?.message || error.response.data || 'Invalid credentials';
                }
            } else if (error?.response?.data) {
                errorMessage = error.response.data?.message || error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setAlert({ open: true, type: false, message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    // OTP Verification Handler
    const handleVerifyOtp = async (otp) => {
        setOtpLoading(true);
        try {
            console.log('Verifying OTP:', otp);
            console.log('Mobile:', userData?.mobile);
            
            // OTP verification API call
            const verifyResponse = await api.post('/api/verify-otp', {
                mobile: userData?.mobile,
                otp: otp,
                token: userData?.token
            }, {
                headers: {
                    'Authorization': `Bearer ${userData?.token}`
                }
            });

            if (verifyResponse.status === 200) {
                setAlert({ open: true, type: true, message: 'OTP verified successfully! Redirecting to dashboard...' });
                setShowOtpDialog(false);
                
                // Store OTP verification status
                sessionStorage.setItem('otp_verified', 'true');
                Cookies.set('otp_verified', 'true', { expires: 1 });
                
                // Redirect to dashboard after successful OTP verification
                setTimeout(() => {
                    route.replace('/dashboard');
                }, 1500);
            } else {
                                    route.replace('/dashboard');

                throw new Error(verifyResponse.data?.message || 'OTP verification failed');
            }
            
        } catch (error) {
                                route.replace('/dashboard');

            console.error('OTP verification error:', error);
            const errorMsg = error.response?.data?.message || 'OTP verification failed. Please try again.';
            setAlert({ open: true, type: false, message: errorMsg });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleCloseOtp = () => {
        console.log('OTP dialog closed');
        setShowOtpDialog(false);
        // Clear sensitive data if user cancels OTP verification
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
    };

    const handleChangeNumber = () => {
        console.log('Change number requested');
        setShowOtpDialog(false);
        setUserData(null);
        // Clear authentication data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        // Clear form and let user enter different credentials
        setFormData({
            mobileNumber: "",
            password: ""
        });
        setAlert({ open: true, type: true, message: 'Please enter your credentials again.' });
    };

    const handleResendOtp = async () => {
        try {
            console.log('Resending OTP to:', userData?.mobile);
            
            await api.post('/api/resend-otp', {
                mobile: userData?.mobile,
                token: userData?.token
            }, {
                headers: {
                    'Authorization': `Bearer ${userData?.token}`
                }
            });
            
            setAlert({ open: true, type: true, message: 'OTP sent successfully!' });
        } catch (error) {
            console.error('Resend OTP error:', error);
            setAlert({ open: true, type: false, message: 'Failed to resend OTP. Please try again.' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // For test numbers
    const testNumbers = ['9096608606', '1111111111', '9284277924', '8306667760', '9922337928'];
    const isTestNumber = userData ? testNumbers.includes(userData.mobile) : false;

    return (
        <>
            <form onSubmit={submitHandler}>
                <Grid container spacing={2} className={styles.formContainer}>
                    {/* Mobile Number Field */}
                    <Grid item xs={12}>
                        <Typography className={styles.inputLabel}>Mobile Number</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            value={formData.mobileNumber}
                            onChange={handleChange('mobileNumber')}
                            error={Boolean(errors.mobileNumber)}
                            helperText={errors.mobileNumber}
                            placeholder="Enter your mobile number"
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

                    {/* Password Field */}
                    <Grid item xs={12}>
                        <Typography className={styles.inputLabel}>Password</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange('password')}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            placeholder="Enter your password"
                            InputProps={{
                                className: styles.textInput,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock className={styles.inputIcon} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            className={styles.passwordToggle}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* CAPTCHA Field */}
                    <Grid item xs={12}>
                        <Box sx={{ transform: "scale(0.85)", transformOrigin: "0 0" }}>
                            <ReCAPTCHA
                                sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
                                onChange={handleCaptchaChange}
                            />
                        </Box>
                        {errors.captcha && (
                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                {errors.captcha}
                            </Typography>
                        )}
                    </Grid>

                    {/* Login Button */}
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            endIcon={
                                <Box className={styles.arrowIconWrapper}>
                                    <ArrowForward className={styles.arrowIcon} />
                                </Box>
                            }
                            className={styles.loginButton}
                            sx={{
                                minWidth: '120px',
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                }
                            }}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </Grid>

                    {/* Additional Links */}
                    <Grid item xs={12}>
                        <Box className={styles.linksContainer}>
                            <Typography
                                className={styles.forgotPassword}
                                onClick={onForgotPassword}
                                sx={{ cursor: 'pointer' }}
                            >
                                Forgot Password?
                            </Typography>
                            <Typography className={styles.linkText}>
                                Unblock Me
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Don't have an account? Sign Up */}
                    <Grid item xs={12}>
                        <Typography variant="body2" className={styles.subText} sx={{ textAlign: "center" }}>
                            Dont have an account?{" "}
                            <span
                                style={{ color: "#2198F3", cursor: "pointer", fontWeight: "bold" }}
                                onClick={handleSignUpClick}
                            >
                                Sign Up
                            </span>
                        </Typography>
                    </Grid>
                </Grid>
            </form>

            {/* OTP Verification Dialog - Shows after successful login */}
            <VerifyOtp
                isOpen={showOtpDialog}
                onClose={handleCloseOtp}
                onVerify={handleVerifyOtp}
                onChangeNumber={handleChangeNumber}
                onResendOtp={handleResendOtp}
                phoneNumber={userData?.mobile || ""}
                isLoading={otpLoading}
                isTestNumber={isTestNumber}
            />

            {/* Alert Snackbar */}
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={alert.type ? 'success' : 'error'}
                    variant="filled"
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserName;