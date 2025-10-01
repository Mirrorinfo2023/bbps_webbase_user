// components/UserName.jsx
import { Grid, TextField, Button, Typography, InputAdornment, IconButton, Box, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff, Person, Lock, ArrowForward } from "@mui/icons-material";
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import api from "../../../utils/api";
import styles from "./Login.module.css";

const UserName = ({ onForgotPassword ,onUnblock }) => {
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
            const reqData = {
                username: formData.mobileNumber,
                password: formData.password,
                is_admin: 1,
                captchaToken
            };

            const response = await api.post('/api/users/admin_login', reqData);

            console.log("response is", response);

            if (response.status === 200) {
                setAlert({ open: true, type: true, message: 'SignIn successfully!' });

                const responseData = response.data.data; // user info
                const token = response.data.token;       // token from top-level

                // Store data in localStorage
                localStorage.setItem('role', 'user');
                localStorage.setItem('uid', responseData.id);
                localStorage.setItem('email', responseData.email);
                localStorage.setItem('token', token);
                localStorage.setItem('name', `${responseData.first_name} ${responseData.last_name}`);
                localStorage.setItem('mobile', responseData.mobile);
                localStorage.setItem('employee_role', responseData.role_name);
                localStorage.setItem('menu', JSON.stringify(response.data.employeeMenu));

                // Store data in cookies
                Cookies.set('role', 'user', { expires: 1 });
                Cookies.set('uid', responseData.id, { expires: 1 });
                Cookies.set('name', `${responseData.first_name} ${responseData.last_name}`);
                Cookies.set('mobile', responseData.mobile);
                Cookies.set('employee_role', responseData.role_name, { expires: 1 });
                Cookies.set('token', token, { expires: 1 });

                // Redirect to dashboard
                route.replace('/dashboard');
            } else {
                setAlert({ open: true, type: false, message: response.data.message });
            }
        } catch (error) {
            // Handle backend error
            if (error?.response?.status === 401) {
                setAlert({ open: true, type: false, message: error.response.data.message });
            } else {
                setAlert({ open: true, type: false, message: error.message });
            }
        } finally {
            setLoading(false);
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
                            Don't have an account?{" "}
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