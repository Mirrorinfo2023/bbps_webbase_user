// pages/LoginPage.jsx
import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import UserName from "./UserName";
import ForgotPassword from "./forgot-password";
import AppLogo from "../../../public/mirror_logo.png";
import styles from "./Login.module.css";

const LoginPage = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    return (
        <Box className={styles.root}>
            {/* Main Container */}
            <Grid container className={styles.mainContainer}>
                {/* Left Section - Brand */}
                <Grid item xs={12} md={6} className={styles.leftSection}>
                    <Box className={styles.brandContainer}>
                        <Box className={styles.logoWrapper}>
                            {/* Option 3: If PNG with transparency, add shadow */}
                            <Image
                                src={AppLogo}
                                alt="Mirror Logo"
                                width={200}
                                height={60}
                                style={{
                                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h3"
                            className={styles.tagline}
                            sx={{
                                cursor: 'default',
                                userSelect: 'none',
                                WebkitUserSelect: 'none'
                            }}
                        >
                            Clarity is Purity...
                        </Typography>

                        <Typography
                            variant="h1"
                            className={styles.welcomeText}
                            sx={{
                                cursor: 'default',
                                userSelect: 'none',
                                WebkitUserSelect: 'none'
                            }}
                        >
                            Welcome back to Mirror Hub
                        </Typography>
                    </Box>
                </Grid>

                {/* Right Section - Login Form */}
                <Grid item xs={12} md={6} className={styles.rightSection}>
                    <Box className={styles.formWrapper}>
                        <Box className={styles.formCard}>
                            {/* Header */}
                            <Typography
                                variant="h4"
                                className={`${styles.formTitle} ${styles.mobileCenter}`}
                                  sx={{
                                cursor: 'default',
                                userSelect: 'none',
                                WebkitUserSelect: 'none'
                            }}
                            >
                                {showForgotPassword ? "Forgot Password" : "Mirror Hub Login"}
                            </Typography>

                            <Typography
                                variant="body1"
                                className={`${styles.formSubtitle} ${styles.mobileCenter}`}
                                  sx={{
                                cursor: 'default',
                                userSelect: 'none',
                                WebkitUserSelect: 'none'
                            }}
                            >
                                {showForgotPassword
                                    ? "Enter your credentials to reset password"
                                    : "Please enter your credentials to login"
                                }
                            </Typography>

                            {/* Form */}
                            {showForgotPassword ? (
                                <ForgotPassword onBack={() => setShowForgotPassword(false)} />
                            ) : (
                                <UserName onForgotPassword={() => setShowForgotPassword(true)} />
                            )}

                            {/* Footer Links */}
                            <Box className={styles.footerLinks}>
                                {/* {!showForgotPassword && (
                  <Typography variant="body2" className={styles.signupLink}>
                    Don't have an account? <span>Sign up</span>
                  </Typography>
                )} */}
                                <Typography variant="body2" className={styles.communityLink}>
                                    Follow mirror hub Community
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginPage;