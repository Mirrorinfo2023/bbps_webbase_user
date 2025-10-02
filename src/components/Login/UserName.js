// components/UserName.jsx
import { Grid, TextField, Button, Typography, InputAdornment, IconButton, Box, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff, Person, Lock, ArrowForward } from "@mui/icons-material";
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';
import VerifyOtp from "@/components/Otp/VerifyOtp";

import styles from "./Login.module.css";

const UserName = ({ onForgotPassword, onUnblock }) => {
    const route = useRouter();

    const [formData, setFormData] = useState({
        mobileNumber: "",
        password: ""
    });
    // OTP Dialog State
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [userData, setUserData] = useState(null);
    const [otpLoading, setOtpLoading] = useState(false);
    // For test numbers
    const testNumbers = ['9096608606', '1111111111', '9284277924', '8306667760', '9922337928'];
    const isTestNumber = userData ? testNumbers.includes(userData.mobile) : false;

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const [alert, setAlert] = useState({ open: false, type: false, message: null });
    const [loading, setLoading] = useState(false);

    const handleSignUpClick = () => {
        route.push('/sign-up'); // This will navigate to your existing sign-up.js page
    };

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
        // Clear captcha error
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

    // New: Request OTP API call (called after successful login)
    const handleRequestOtp = async () => {
        try {
            console.log('Requesting OTP to:', userData?.mobile);

            // Prepare required data for backend (all keys: mode, type, category, mobile, email, name)
            const reqData = {
                mode: 'API',  // Adjust if backend expects different (e.g., 'email', 'both')
                type: 'Mobile',  // Adjust if needed (e.g., 'login')
                category: 'Login',  // Fits login flow; backend won't reject
                mobile: sessionStorage.getItem('mobile') || '',
                email: sessionStorage.getItem('email') || '',  // From login response
                name: `${sessionStorage.getItem('first_name') || ''} ${sessionStorage.getItem('last_name') || ''}`.trim()  // From login response
            };

            console.log("reqData ", reqData)
            // Validate required fields (prevent backend 400)
            const requiredKeys = ['mode', 'type', 'category', 'mobile', 'email', 'name'];
            if (!requiredKeys.every(key => reqData[key] !== undefined && reqData[key] !== null)) {
                throw new Error('Missing required OTP request data');
            }

            // Encrypt request (matching backend expectation)
            const encReq = DataEncrypt(JSON.stringify(reqData));

            // Send encrypted request
            const response = await api.post('/api/otp/8930cae4a942a0286226f1651dfbff89216174c8', { encReq }, {
                headers: {
                    'Authorization': `Bearer ${userData?.token}`
                }
            });

            // Decrypt and check response (optional, but good for error handling)
            const decryptedResponse = DataDecrypt(response.data);
            console.log('OTP request response:', decryptedResponse);

            if (decryptedResponse.status === 200) {
                console.log('OTP requested successfully');
            } else {
                throw new Error(decryptedResponse.message || 'OTP request failed');
            }

        } catch (error) {
            console.error('Request OTP error:', error);

            let errorMsg = 'Failed to send OTP. Please try again.';
            if (error?.response?.status === 400) {
                // Handle missing keys or validation
                try {
                    const decryptedError = DataDecrypt(error.response.data);
                    errorMsg = decryptedError.message || errorMsg;
                } catch (decryptErr) {
                    errorMsg = error.response.data || errorMsg;
                }
            } else if (error?.response?.status === 500) {
                // Handle DB/SMS errors
                try {
                    const decryptedError = DataDecrypt(error.response.data);
                    errorMsg = decryptedError.message || 'Server error while sending OTP';
                } catch (decryptErr) {
                    errorMsg = error.response.data || errorMsg;
                }
            }

            // Show error alert
            setAlert({ open: true, type: false, message: errorMsg });

            // Clear user data to prevent dialog from opening
            setUserData(null);
            sessionStorage.clear();  // Optional: Clear all stored data on failure

            throw error; // Re-throw to prevent dialog from showing in submitHandler
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        const newErrors = {
            mobileNumber: !formData.mobileNumber.trim() ? "Mobile number is required." : "",
            password: !formData.password ? "Password is required." : "",
            captcha: !captchaToken ? "Please complete the CAPTCHA." : ""
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(msg => msg !== "")) {
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

            // Encrypt request
            const encReq = DataEncrypt(JSON.stringify(reqData));

            // Send encrypted request
            const response = await api.post('/api/users/2736fab291f04e69b62d490c3c09361f5b82461a', { encReq });

            // Decrypt response
            const decryptedResponse = DataDecrypt(response.data);

            console.log("decryptedResponse are: ", decryptedResponse);
            if (decryptedResponse.status === 200) {
                const userDataFromApi = decryptedResponse.data; // user info
                const token = decryptedResponse.token;   // token from top-level
                const refreshToken = decryptedResponse.refreshToken;   // token from top-level

                // Store top-level items
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('refreshToken', refreshToken);
                sessionStorage.setItem('role', 'user');
                sessionStorage.setItem('menu', JSON.stringify(decryptedResponse.employeeMenu || []));

                // Store each field from backend separately
                sessionStorage.setItem('id', userDataFromApi.id);
                sessionStorage.setItem('mlm_id', userDataFromApi.mlm_id);
                sessionStorage.setItem('first_name', userDataFromApi.first_name);
                sessionStorage.setItem('last_name', userDataFromApi.last_name);
                sessionStorage.setItem('username', userDataFromApi.username);
                sessionStorage.setItem('email', userDataFromApi.email);
                sessionStorage.setItem('mobile', userDataFromApi.mobile);
                sessionStorage.setItem('refered_by', userDataFromApi.refered_by);
                sessionStorage.setItem('country', userDataFromApi.country);
                sessionStorage.setItem('state', userDataFromApi.state);
                sessionStorage.setItem('circle', userDataFromApi.circle);
                sessionStorage.setItem('district', userDataFromApi.district);
                sessionStorage.setItem('division', userDataFromApi.division);
                sessionStorage.setItem('region', userDataFromApi.region);
                sessionStorage.setItem('block', userDataFromApi.block);
                sessionStorage.setItem('pincode', userDataFromApi.pincode);
                sessionStorage.setItem('address', userDataFromApi.address);
                sessionStorage.setItem('dob', userDataFromApi.dob);
                sessionStorage.setItem('is_prime', userDataFromApi.is_prime);
                sessionStorage.setItem('registration_date', userDataFromApi.registration_date);
                sessionStorage.setItem('role_name', userDataFromApi.role_name || '');

                setUserData({
                    mobile: userDataFromApi.mobile || formData.mobileNumber,
                    token: token,
                    refreshToken: refreshToken
                });

                // Request OTP after successful login
                await handleRequestOtp();

                // Open OTP dialog (no success alert shown here)
                setShowOtpDialog(true);

            } else {
                setAlert({ open: true, type: false, message: decryptedResponse.message });
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                try {
                    const decryptedError = DataDecrypt(error.response.data);
                    setAlert({ open: true, type: false, message: decryptedError.message });
                } catch (err) {
                    setAlert({ open: true, type: false, message: error.response.data });
                }
            } else {
                setAlert({ open: true, type: false, message: error.message });
            }
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

            const reqData = {
                otp,
                mode: 'API',
                type: 'Mobile',
                category: 'Login',
                mobile: sessionStorage.getItem('mobile') || ''
            };

            const encReq = DataEncrypt(JSON.stringify(reqData));

            const response = await api.post(
                '/api/otp/3ae2750febeb3583bec28c67c42063120cb72963',
                { encReq },
                { headers: { 'Authorization': `Bearer ${userData?.token}` } }
            );

            const decryptedResponse = DataDecrypt(response.data);
            console.log('OTP verification response:', decryptedResponse);

            if (decryptedResponse.status === 200) {
                setAlert({ open: true, type: true, message: 'OTP verified successfully!' });
                setShowOtpDialog(false);

                sessionStorage.setItem('otp_verified', 'true');
                Cookies.set('otp_verified', 'true', { expires: 1 });

                setTimeout(() => route.replace('/dashboard'), 3000);
            } else {
                const errorMsg = decryptedResponse.message || 'OTP verification failed';
                setAlert({ open: true, type: false, message: errorMsg });
            }

        } catch (error) {
            console.error('OTP verification error:', error);
            const errorMsg = error.response?.data?.message || 'OTP verification failed';
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
                                backgroundColor: '#1976d2', // Fresh blue color
                                '&:hover': {
                                    backgroundColor: '#1565c0', // Darker blue on hover
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

                            <Typography className={styles.linkText}
                                onClick={onUnblock}
                                sx={{ cursor: 'pointer' }}
                            >
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
                                onClick={handleSignUpClick} // Use the navigation function
                            >
                                Sign Up
                            </span>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
            {/* OTP Verification Dialog - Shows after successful login and req-otp */}
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
            {/* Alert Snackbar */}

        </>
    );
};

export default UserName;