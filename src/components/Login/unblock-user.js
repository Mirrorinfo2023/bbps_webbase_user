// components/UnblockUser.jsx
import { Grid, TextField, Button, Typography, InputAdornment, Box, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { Person, LockOpen } from "@mui/icons-material";
import api from "../../../utils/api";
import styles from "./Login.module.css";

const UnblockUser = ({ onBack }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ open: false, type: false, message: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setLoading(true);
    try {
      // your unblock API call here
      const response = await api.post('/api/users/unblock', { username });
      if (response.status === 200) {
        setAlert({ open: true, type: true, message: 'User unblocked successfully!' });
        onBack();
      } else {
        setAlert({ open: true, type: false, message: response.data.message });
      }
    } catch (err) {
      setAlert({ open: true, type: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} className={styles.formContainer}>
        <Grid item xs={12}>
          <Typography className={styles.inputLabel}>Username</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter username to unblock"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError("");
            }}
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
            endIcon={<Box className={styles.arrowIcon}><LockOpen /></Box>}
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Unblocking...' : 'Unblock User'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography className={styles.backLink} onClick={onBack}>
            ← Back to Login
          </Typography>
        </Grid>
      </Grid>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ open: false, type: false, message: null })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ open: false, type: false, message: null })}
          severity={alert.type ? 'success' : 'error'}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default UnblockUser;
