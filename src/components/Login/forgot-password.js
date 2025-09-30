// components/forgot-password.jsx
import { Grid, TextField, Button, Typography, InputAdornment, Box } from "@mui/material";
import { useState } from "react";
import { Person, ArrowForward } from "@mui/icons-material";
import styles from "./Login.module.css";

const ForgotPassword = ({ onBack }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    // Handle forgot password logic here
    console.log("Reset password for:", username);
    
    // Show success message or redirect
    alert("Password reset instructions sent to your registered mobile number");
    onBack();
  };

  const handleChange = (value) => {
    setUsername(value);
    if (error) setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} className={styles.formContainer}>
        <Grid item xs={12}>
          <Typography className={styles.inputLabel}>Username</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => handleChange(e.target.value)}
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
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            endIcon={
              <Box className={styles.arrowIcon}>
                <ArrowForward />
              </Box>
            }
            className={styles.loginButton}
          >
            Send Reset Link
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography 
            className={styles.backLink} 
            onClick={onBack}
          >
            ← Back to Login
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};

export default ForgotPassword;