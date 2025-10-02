import { Grid, TextField, Button, Typography, InputAdornment, IconButton, Box, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff, Person, Lock, ArrowForward } from "@mui/icons-material";
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';

import styles from "./Login.module.css";
import VerifyOtp from "@/components/Otp/VerifyOtp"; // Import OTP component

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
                //  "app_key": "com.mirrorinfo",
                captchaToken
            };

            const response = await api.post('/api/users/admin_login', reqData);

            console.log("response is", response);

            if (response.status === 200) {
                setAlert({ open: true, type: true, message: 'SignIn successfully!' });

                const responseData = response.data.data; // user info
                const token = response.data.token;       // token from top-level

                // Store top-level items
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('refreshToken', refreshToken);
                sessionStorage.setItem('role', 'user');
                sessionStorage.setItem('menu', JSON.stringify(decryptedResponse.employeeMenu || []));

                // Store each field from backend separately
                sessionStorage.setItem('id', userData.id);
                sessionStorage.setItem('mlm_id', userData.mlm_id);
                sessionStorage.setItem('first_name', userData.first_name);
                sessionStorage.setItem('last_name', userData.last_name);
                sessionStorage.setItem('username', userData.username);
                sessionStorage.setItem('email', userData.email);
                sessionStorage.setItem('mobile', userData.mobile);
                sessionStorage.setItem('refered_by', userData.refered_by);
                sessionStorage.setItem('country', userData.country);
                sessionStorage.setItem('state', userData.state);
                sessionStorage.setItem('circle', userData.circle);
                sessionStorage.setItem('district', userData.district);
                sessionStorage.setItem('division', userData.division);
                sessionStorage.setItem('region', userData.region);
                sessionStorage.setItem('block', userData.block);
                sessionStorage.setItem('pincode', userData.pincode);
                sessionStorage.setItem('address', userData.address);
                sessionStorage.setItem('dob', userData.dob);
                sessionStorage.setItem('is_prime', userData.is_prime);
                sessionStorage.setItem('registration_date', userData.registration_date);
                sessionStorage.setItem('role_name', userData.role_name || '');

                // Show success message
                setAlert({ open: true, type: true, message: 'Login successful! Please verify OTP.' });

                // Show OTP dialog instead of redirecting
                setUserData({
                    mobile: responseData.mobile,
                    token: token
                });
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

    // OTP Dialog Handlers
    const handleVerifyOtp = async (otp) => {
        setOtpLoading(true);
        try {
            console.log('Verifying OTP:', otp);
            console.log('Mobile:', userData.mobile);
            
            // Add your OTP verification API call here
            // Example:
            // const verifyResponse = await api.post('/api/verify-otp', {
            //     mobile: userData.mobile,
            //     otp: otp,
            //     token: userData.token
            // });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo - assume OTP is correct
            setAlert({ open: true, type: true, message: 'OTP verified successfully! Redirecting to dashboard...' });
            setShowOtpDialog(false);
            
            // Store OTP verification status
            localStorage.setItem('otp_verified', 'true');
            Cookies.set('otp_verified', 'true', { expires: 1 });
            
            // Redirect to dashboard after successful OTP verification
            setTimeout(() => {
                route.replace('/dashboard');
            }, 1500);
            
        } catch (error) {
            setAlert({ open: true, type: false, message: 'OTP verification failed. Please try again.' });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleCloseOtp = () => {
        console.log('OTP dialog closed');
        setShowOtpDialog(false);
        // User stays on login page
    };

    const handleChangeNumber = () => {
        console.log('Change number requested');
        setShowOtpDialog(false);
        setUserData(null);
        // Clear form and let user enter different credentials
        setFormData({
            mobileNumber: "",
            password: ""
        });
        setAlert({ open: true, type: true, message: 'Please enter your credentials again.' });
    };

    const handleResendOtp = async () => {
        try {
            console.log('Resending OTP to:', userData.mobile);
            // Add your resend OTP API call here
            // await api.post('/api/resend-otp', {
            //     mobile: userData.mobile,
            //     token: userData.token
            // });
            
            setAlert({ open: true, type: true, message: 'OTP sent successfully!' });
        } catch (error) {
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