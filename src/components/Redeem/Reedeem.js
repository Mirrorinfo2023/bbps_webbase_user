'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  History as HistoryIcon,
  AccountBalanceWallet as WalletIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// API Service
const redeemApi = {
  getBonusPoints: async () => {
    // Mock data for demonstration
    return {
      daily: [
        { id: 1, amount: 150.50, label: 'Daily Login Bonus' },
        { id: 2, amount: 75.25, label: 'Daily Task Completion' },
        { id: 3, amount: 200.00, label: 'Referral Bonus' },
      ],
      other: [
        { id: 4, amount: 500.75, label: 'Welcome Bonus' },
        { id: 5, amount: 300.50, label: 'Seasonal Promotion' },
        { id: 6, amount: 150.00, label: 'Survey Completion' },
      ]
    };
  },

  getRedeemHistory: async () => {
    // Mock data for demonstration
    return [
      {
        id: 1,
        date: '2024-01-15 14:30',
        amount: '250.00',
        status: 'Completed',
        message: 'Points transferred to your account successfully'
      },
      {
        id: 2,
        date: '2024-01-10 09:15',
        amount: '150.00',
        status: 'Completed',
        message: 'Points redeemed for cash reward'
      },
      {
        id: 3,
        date: '2024-01-05 16:45',
        amount: '500.00',
        status: 'Processing',
        message: 'Your redemption request is being processed'
      },
      {
        id: 4,
        date: '2024-01-01 11:20',
        amount: '100.00',
        status: 'Completed',
        message: 'Points converted to gift card'
      }
    ];
  },

  redeemPoints: async (amount, type = 'total') => {
    // Mock API call
    return { message: `Successfully redeemed ${amount} points from ${type}` };
  },
};

const RedeemPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [showAllHistory, setShowAllHistory] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    daily: true,
    other: true,
    history: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, amount: 0, type: '' });

  // State for API data
  const [bonusData, setBonusData] = useState({
    daily: [],
    other: []
  });
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [redeeming, setRedeeming] = useState(false);

  // Calculate total points
  const totalPoints = bonusData.daily.reduce((sum, item) => sum + (item.amount || 0), 0) +
    bonusData.other.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch bonus points and redeem history concurrently
      const [bonusResponse, historyResponse] = await Promise.all([
        redeemApi.getBonusPoints(),
        redeemApi.getRedeemHistory()
      ]);

      setBonusData(bonusResponse);
      setRedeemHistory(historyResponse);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
    } else {
      setError(message);
    }
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  const handleIndividualRedeem = (amount, type) => {
    setConfirmDialog({
      open: true,
      amount,
      type: `individual-${type}`,
      message: `Are you sure you want to redeem ${amount.toFixed(2)} points from ${type}?`
    });
  };

  const handleTotalRedeem = () => {
    if (totalPoints <= 0) {
      showAlert('No points available to redeem', 'error');
      return;
    }

    setConfirmDialog({
      open: true,
      amount: totalPoints,
      type: 'total',
      message: `Are you sure you want to redeem all ${totalPoints.toFixed(2)} points?`
    });
  };

  const confirmRedeem = async () => {
    try {
      setRedeeming(true);
      setConfirmDialog(prev => ({ ...prev, open: false }));

      const response = await redeemApi.redeemPoints(confirmDialog.amount, confirmDialog.type);

      showAlert(response.message || 'Points redeemed successfully!');

      // Refresh data
      await fetchData();
    } catch (err) {
      showAlert(err.message || 'Failed to redeem points', 'error');
    } finally {
      setRedeeming(false);
    }
  };

  const cancelRedeem = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const displayedHistory = showAllHistory ? redeemHistory : redeemHistory.slice(0, 3);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={40} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pb: { xs: 1, sm: 2 },
        pt: { xs: 0, sm: 0 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'white',
          boxShadow: theme.shadows[3],
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={2}>

              <Typography
                variant={isMobile ? "h6" : "h5"}
                component="h1"
                fontWeight="bold"
                sx={{ flex: 1 }}
              >
                My Redeem
              </Typography>
              <Box sx={{ width: 40 }} /> {/* Spacer for alignment */}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {/* Total Points Card */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            mb: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: theme.shadows[4],
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              alignItems={isMobile ? 'stretch' : 'center'}
              spacing={isMobile ? 2 : 0}
            >
              <Box sx={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  sx={{
                    opacity: 0.9,
                    mb: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Total Available Points
                </Typography>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight="bold"
                  sx={{
                    fontSize: {
                      xs: '2rem',
                      sm: '2.5rem',
                      md: '3rem'
                    }
                  }}
                >
                  {totalPoints.toFixed(2)}
                </Typography>
              </Box>

            </Stack>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Bonus Points Section */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: theme.shadows[3],
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Daily Bonus Points */}
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleSection('daily')}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      Daily Bonus Points
                    </Typography>
                    <IconButton size="small">
                      {expandedSections.daily ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  {expandedSections.daily && (
                    <Stack spacing={1.5}>
                      {bonusData.daily.map((item) => (
                        <Paper
                          key={item.id}
                          elevation={1}
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1.5, sm: 2 },
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                              transform: 'translateY(-1px)',
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        >
                          <EmailIcon
                            color="primary"
                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary"
                              fontWeight="bold"
                              sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
                            >
                              {item.amount?.toFixed(2) || '0.00'}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size={isMobile ? "small" : "medium"}
                            onClick={() => handleIndividualRedeem(item.amount, item.label)}
                            disabled={!item.amount || item.amount <= 0 || redeeming}
                            sx={{
                              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                              borderRadius: 1.5,
                              fontWeight: 'bold',
                              minWidth: { xs: 90, sm: 100 },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              '&:hover': {
                                background: 'linear-gradient(135deg, #45a049, #3d8b40)',
                                boxShadow: theme.shadows[2],
                              },
                            }}
                          >
                            Redeem
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Box>

                <Divider />

                {/* Other Bonus Points */}
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleSection('other')}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      Other Bonus Points
                    </Typography>
                    <IconButton size="small">
                      {expandedSections.other ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  {expandedSections.other && (
                    <Stack spacing={1.5}>
                      {bonusData.other.map((item) => (
                        <Paper
                          key={item.id}
                          elevation={1}
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1.5, sm: 2 },
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                              transform: 'translateY(-1px)',
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        >
                          <EmailIcon
                            color="secondary"
                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="secondary"
                              fontWeight="bold"
                              sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
                            >
                              {item.amount?.toFixed(2) || '0.00'}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size={isMobile ? "small" : "medium"}
                            onClick={() => handleIndividualRedeem(item.amount, item.label)}
                            disabled={!item.amount || item.amount <= 0 || redeeming}
                            sx={{
                              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                              borderRadius: 1.5,
                              fontWeight: 'bold',
                              minWidth: { xs: 90, sm: 100 },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              '&:hover': {
                                background: 'linear-gradient(135deg, #45a049, #3d8b40)',
                                boxShadow: theme.shadows[2],
                              },
                            }}
                          >
                            Redeem
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Redeem History Section */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: theme.shadows[3],
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleSection('history')}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <HistoryIcon fontSize={isMobile ? "small" : "medium"} />
                      Redeem History
                    </Typography>
                    <IconButton size="small">
                      {expandedSections.history ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  {expandedSections.history && (
                    <Stack spacing={2}>
                      {displayedHistory.map((item, index) => (
                        <Box
                          key={item.id}
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            backgroundColor: 'background.default',
                          }}
                        >
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              {item.date}
                            </Typography>
                          </Box>

                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <MessageIcon fontSize="small" color="action" />
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            >
                              {item.amount} points
                            </Typography>
                          </Stack>

                          {item.status && (
                            <Box sx={{ mb: 1 }}>
                              <Chip
                                label={item.status}
                                size="small"
                                color={item.status === 'Completed' ? 'success' : 'warning'}
                                sx={{
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  height: { xs: 20, sm: 24 }
                                }}
                              />
                            </Box>
                          )}

                          {item.message && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                lineHeight: 1.4
                              }}
                            >
                              {item.message}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  )}

                  {/* Show More/Less Button */}
                  {redeemHistory.length > 3 && expandedSections.history && (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setShowAllHistory(!showAllHistory)}
                      sx={{
                        mt: 2,
                        borderStyle: 'dashed',
                        color: 'text.secondary',
                        py: 1,
                        '&:hover': {
                          borderColor: 'text.secondary',
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      {showAllHistory ? 'Show Less' : `Show More (${redeemHistory.length - 3})`}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={cancelRedeem}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            m: { xs: 1, sm: 2 }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WalletIcon color="primary" />
            <Typography variant="h6">Confirm Redeem</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
          <Button
            onClick={cancelRedeem}
            disabled={redeeming}
            size={isMobile ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRedeem}
            variant="contained"
            disabled={redeeming}
            startIcon={redeeming ? <CircularProgress size={16} /> : null}
            size={isMobile ? "small" : "medium"}
          >
            {redeeming ? 'Processing...' : 'Confirm Redeem'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          bottom: { xs: 70, sm: 80 }
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          bottom: { xs: 70, sm: 80 }
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RedeemPage;