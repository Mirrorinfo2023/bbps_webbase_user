'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Alert,
  LinearProgress,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  InputAdornment,
  FormControl,
  FormLabel,
  FormHelperText,
  Avatar,
  Grid,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CloudUpload as UploadIcon,
  Security as SecurityIcon,
  CreditCard as CreditCardIcon,
  Comment as CommentIcon,
  Tag as TagIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components for FULL SCREEN optimization
const FullScreenContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: 0,
  margin: 0,
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  position: 'relative',
  overflow: 'hidden',
}));

const FullScreenCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: 0,
  width: '100vw',
  height: '100vh',
  boxShadow: 'none',
  position: 'relative',
  zIndex: 2,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
  color: 'white',
  padding: theme.spacing(4),
  position: 'relative',
  flexShrink: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'m0 60l60-60h-60v60zm60 0v-60h-60l60 60z\'/%3E%3C/g%3E%3C/svg%3E")',
  },
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
  gap: theme.spacing(4),
}));

const IconWrapper = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  background: 'rgba(255, 255, 255, 0.25)',
  borderRadius: theme.spacing(2),
  fontSize: 28,
  backdropFilter: 'blur(15px)',
}));

const BadgePulse = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
});

const StyledBadge = styled(Chip)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.25)',
  color: 'white',
  backdropFilter: 'blur(15px)',
  position: 'relative',
  overflow: 'hidden',
  fontWeight: 700,
  fontSize: '0.9rem',
  padding: theme.spacing(1, 2),
  height: 'auto',
  borderRadius: theme.spacing(2),
}));

const FormSection = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
});

const FileUploadArea = styled(Paper)(({ theme, error }) => ({
  border: `2px dashed ${error ? theme.palette.error.main : theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.default,
  minHeight: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const PreviewImage = styled(Box)({
  position: 'relative',
  width: 80,
  height: 80,
  borderRadius: 8,
  overflow: 'hidden',
  flexShrink: 0,
  '&:hover .preview-overlay': {
    opacity: 1,
  },
});

const PreviewOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  fontSize: 12,
});

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
  color: 'white',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2, 4),
  fontSize: '1rem',
  fontWeight: 700,
  position: 'relative',
  overflow: 'hidden',
  height: 56,
  minWidth: 200,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(67, 97, 238, 0.4)',
    background: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
  },
  '&.success': {
    background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
    animation: 'successPulse 0.6s ease',
  },
  '@keyframes successPulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.02)' },
    '100%': { transform: 'scale(1)' },
  },
}));

// Floating animations
const FloatingAnimation = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  animation: 'float 8s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
    '50%': { transform: 'translateY(-20px) rotate(180deg) scale(1.05)' },
  },
});

const Circle1 = styled(FloatingAnimation)({
  width: 400,
  height: 400,
  top: '10%',
  left: '5%',
  animationDelay: '0s',
});

const Circle2 = styled(FloatingAnimation)({
  width: 300,
  height: 300,
  top: '60%',
  right: '5%',
  animationDelay: '2s',
});

const Circle3 = styled(FloatingAnimation)({
  width: 200,
  height: 200,
  bottom: '10%',
  left: '20%',
  animationDelay: '4s',
});

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-domain.com/api';

// API Service Functions
const apiService = {
  // Submit ID Activation Request
  submitIdActivation: async (formData, token) => {
    const formDataToSend = new FormData();

    // Append form fields
    formDataToSend.append('amount', formData.amount);
    formDataToSend.append('remarks', formData.remarks);

    // Append UTR numbers (filter out empty ones)
    formData.utrNumbers.filter(utr => utr.trim() !== '').forEach((utr, index) => {
      formDataToSend.append(`utrNumbers[${index}]`, utr);
    });

    // Append receipt file
    if (formData.receipt) {
      formDataToSend.append('receipt', formData.receipt);
    }

    const response = await fetch(`${API_BASE_URL}/id-activation`, {
      method: 'POST',
      headers: {
        'Authorization': Bearer`${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get activation status
  getActivationStatus: async (activationId, token) => {
    const response = await fetch(`${API_BASE_URL}/id-activation/${activationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

const IdActivation = () => {
  const [formData, setFormData] = useState({
    amount: '',
    remarks: '',
    utrNumbers: [''],
    receipt: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showError, setShowError] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get token from storage (adjust based on your auth setup)
  const getToken = () => {
    return sessionStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleUtrChange = (index, value) => {
    const newUtrNumbers = [...formData.utrNumbers];
    newUtrNumbers[index] = value;
    setFormData(prev => ({
      ...prev,
      utrNumbers: newUtrNumbers
    }));
  };

  const addUtrField = () => {
    setFormData(prev => ({
      ...prev,
      utrNumbers: [...prev.utrNumbers, '']
    }));
  };

  const removeUtrField = (index) => {
    if (formData.utrNumbers.length > 1) {
      const newUtrNumbers = formData.utrNumbers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        utrNumbers: newUtrNumbers
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image/jpeg')) {
        setErrors(prev => ({
          ...prev,
          receipt: 'Please upload only JPG images'
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          receipt: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        receipt: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.receipt) {
        setErrors(prev => ({
          ...prev,
          receipt: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.remarks.trim()) {
      newErrors.remarks = 'Remarks are required';
    }

    const validUtrs = formData.utrNumbers.filter(utr => utr.trim() !== '');
    if (validUtrs.length === 0) {
      newErrors.utrNumbers = 'At least one UTR number is required';
    }

    if (!formData.receipt) {
      newErrors.receipt = 'Please attach a receipt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ open: true, message, type });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('Please fix the form errors before submitting.', 'error');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      showAlert('Please login to submit activation request.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API
      console.log("hello",formData)
      const response = await apiService.submitIdActivation(formData, token);

      console.log('API Response:', response);

      // Handle success response
      if (response.success) {
        setSubmitSuccess(true);
        showAlert(response.message || 'ID Activation request submitted successfully!', 'success');

        // Reset form
        setFormData({
          amount: '',
          remarks: '',
          utrNumbers: [''],
          receipt: null
        });
        setPreviewImage(null);

        // Reset success state after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);

      } else {
        throw new Error(response.message || 'Failed to submit activation request');
      }

    } catch (error) {
      console.error('Submission error:', error);

      // Handle different error types
      let errorMessage = 'Error submitting request. Please try again.';

      if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.message.includes('413')) {
        errorMessage = 'File size too large. Please upload a smaller file.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      showAlert(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullScreenContainer>
      {/* Animated Background */}
      <Circle1 />
      <Circle2 />
      <Circle3 />

      <FullScreenCard>
        {/* Header Section */}
        <HeaderSection>
          <HeaderContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
              <IconWrapper>
                <CreditCardIcon />
              </IconWrapper>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  ID Activation
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ opacity: 0.9, fontWeight: 400 }}
                >
                  Complete your activation request securely
                </Typography>
              </Box>
            </Box>
            <StyledBadge
              label="My Request"
              icon={<BadgePulse />}
            />
          </HeaderContent>
        </HeaderSection>

        {/* Main Form Section - Full Screen Height */}
        <FormSection>
          <CardContent sx={{
            p: 0,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}>
            {showError && (
              <Alert
                severity="warning"
                sx={{
                  background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
                  borderLeft: '4px solid #e17055',
                  borderRadius: 0,
                  alignItems: 'flex-start',
                  m: 0,
                }}
                action={
                  <IconButton
                    size="small"
                    onClick={() => setShowError(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Typography fontWeight="bold" color="#d63031">
                  Connection Error
                </Typography>
                <Typography variant="body2" color="#2d3436">
                  The connection errored: No route to host. This indicates an error which most likely cannot be solved by the library.
                </Typography>
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 6,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto'
              }}
            >
              <Grid container spacing={4} sx={{ flex: 1 }}>
                {/* Amount Field */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.amount}>
                    <FormLabel sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
                      Amount
                    </FormLabel>
                    <TextField
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      error={!!errors.amount}
                      helperText={errors.amount}
                      placeholder="Enter amount"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCardIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography color="textSecondary" fontWeight="600" fontSize="1.1rem">
                              ₹
                            </Typography>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          fontSize: '1.1rem',
                          height: 56
                        }
                      }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>

                {/* Remarks Field */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.remarks}>
                    <FormLabel sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
                      Remarks
                    </FormLabel>
                    <TextField
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      error={!!errors.remarks}
                      helperText={errors.remarks}
                      placeholder="Enter remarks"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CommentIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          fontSize: '1.1rem',
                          height: 56
                        }
                      }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>

                {/* UTR Numbers - Full Width */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.utrNumbers}>
                    <FormLabel sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
                      UTR Numbers
                    </FormLabel>
                    <Stack spacing={2}>
                      {formData.utrNumbers.map((utr, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <TextField
                            value={utr}
                            onChange={(e) => handleUtrChange(index, e.target.value)}
                            placeholder="Enter UTR number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <TagIcon color="action" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                flex: 1
                              }
                            }}
                            sx={{ flex: 1 }}
                            fullWidth
                          />
                          {formData.utrNumbers.length > 1 && (
                            <IconButton
                              onClick={() => removeUtrField(index)}
                              color="error"
                              size="large"
                              title="Remove UTR"
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addUtrField}
                        variant="outlined"
                        color="primary"
                        sx={{
                          alignSelf: 'flex-start',
                          borderStyle: 'dashed',
                          background: 'rgba(67, 97, 238, 0.08)',
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        Add Another UTR
                      </Button>
                    </Stack>
                    {errors.utrNumbers && (
                      <FormHelperText error sx={{ fontSize: '1rem', mt: 1 }}>
                        <WarningIcon sx={{ fontSize: 20, mr: 1 }} />
                        {errors.utrNumbers}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* File Upload - Full Width */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.receipt}>
                    <FormLabel sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
                      Attach Receipt
                      <Typography component="span" variant="caption" color="textSecondary" sx={{ ml: 1, fontSize: '1rem' }}>
                        (Only JPG images accepted • Max 5MB)
                      </Typography>
                    </FormLabel>

                    <input
                      type="file"
                      id="receipt"
                      accept=".jpg,.jpeg"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    <label htmlFor="receipt" style={{ width: '100%' }}>
                      <FileUploadArea error={!!errors.receipt}>
                        {previewImage ? (
                          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', width: '100%' }}>
                            <PreviewImage>
                              <img
                                src={previewImage}
                                alt="Receipt preview"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                              <PreviewOverlay className="preview-overlay">
                                <SyncIcon fontSize="small" />
                                <Typography variant="caption" sx={{ mt: 0.5 }}>
                                  Change Image
                                </Typography>
                              </PreviewOverlay>
                            </PreviewImage>
                            <Box sx={{ textAlign: 'left', flex: 1 }}>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {formData.receipt?.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Size: {(formData.receipt?.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', width: '100%' }}>
                            <UploadIcon
                              sx={{
                                fontSize: 56,
                                color: 'text.secondary',
                                mb: 2
                              }}
                            />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                              Click to upload receipt
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              JPG format only • Maximum 5MB file size
                            </Typography>
                          </Box>
                        )}
                      </FileUploadArea>
                    </label>

                    {errors.receipt && (
                      <FormHelperText error sx={{ fontSize: '1rem', mt: 1 }}>
                        <WarningIcon sx={{ fontSize: 20, mr: 1 }} />
                        {errors.receipt}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ mt: 'auto' }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    pt: 4
                  }}>
                    <SubmitButton
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      className={submitSuccess ? 'success' : ''}
                      sx={{
                        minWidth: 280,
                        fontSize: '1.1rem'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <SyncIcon sx={{
                            animation: 'spin 1.5s linear infinite',
                            mr: 2,
                            fontSize: 24
                          }} />
                          Processing Your Request...
                        </>
                      ) : submitSuccess ? (
                        <>
                          <CheckCircleIcon sx={{ mr: 2, fontSize: 24 }} />
                          Request Submitted Successfully!
                        </>
                      ) : (
                        <>
                          <SendIcon sx={{ mr: 2, fontSize: 24 }} />
                          Process Activation
                        </>
                      )}
                      {isSubmitting && (
                        <LinearProgress
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'transparent',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            }
                          }}
                        />
                      )}
                    </SubmitButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>


          </CardContent>
        </FormSection>
      </FullScreenCard>

      {/* Global Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </FullScreenContainer>
  );
};

export default IdActivation;