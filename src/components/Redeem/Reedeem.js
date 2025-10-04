import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  Grid,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import API from '../../../utils/api';
import { DataDecrypt, DataEncrypt } from '../../../utils/encryption';

// API Service (replace with your actual API base URL)
const API_BASE_URL = 'https://api.mayway.in/api';

const BonusService = {
  fetchBonusRaw: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referral/plan/get-referral-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Bonus Raw API Response:', data);

      return {
        dailyBonusMap: data.getDailyBonusBalance || {},
        referralBonusMap: data.getBonusBalance || {},
        profitBonusMap: data.getReferralBonusBalance || {},
      };
    } catch (error) {
      console.error('Error fetching bonus data:', error);
      throw error;
    }
  },
};

const RedeemService = {
  requestRedeem: async (userId, amount, walletType, remark, bonusId) => {
    try {
      const reqData = {
        user_id: userId,
        amount,
        wallet_type: walletType,
        remarks: remark,
        plan_id: bonusId,
      };

      const encReq = DataEncrypt(JSON.stringify(reqData));
      const response = await API.post(
        `/api/referral/plan/1b11b22949aff1244922265015f806637a523f04`,
        { encReq },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const decryptedResponse = DataDecrypt(response.data);
      console.log('Redeem API Response:', decryptedResponse);
      return decryptedResponse;
    } catch (error) {
      console.error('Error processing redeem:', error);
      throw error;
    }
  },
};

const RedeemHistoryService = {
  fetchRedeemHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/report/get-redeem-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, page: 1 }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Redeem History API Response:', data);

      return data.status === 200 && data.data ? data.data : [];
    } catch (error) {
      console.error('Error fetching redeem history:', error);
      return [];
    }
  },
};

const RedeemScreen = ({ isFromEwallet = false }) => {
  const router = useRouter();
  const theme = useTheme();

  const [amountController, setAmountController] = useState('');
  const [noteController, setNoteController] = useState('');
  const [dailyBonusMap, setDailyBonusMap] = useState({});
  const [referralBonusMap, setReferralBonusMap] = useState({});
  const [profitBonusMapRaw, setProfitBonusMapRaw] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [currentRedeemType, setCurrentRedeemType] = useState('');
  const [currentBonusId, setCurrentBonusId] = useState(null);
  const [currentBonusAmount, setCurrentBonusAmount] = useState(0);
  const [isButtonTap, setIsButtonTap] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('id');
    if (storedUser) setUserId(storedUser);
  }, []);

  useEffect(() => {
    if (userId) {
      loadBonus();
      fetchRedeemHistory();
    }
  }, [userId]);

  const loadBonus = async () => {
    try {
      setLoading(true);
      const result = await BonusService.fetchBonusRaw(userId);
      setDailyBonusMap(result.dailyBonusMap || {});
      setReferralBonusMap(result.referralBonusMap || {});
      setProfitBonusMapRaw(result.profitBonusMap || {});
    } catch {
      setError('Failed to load bonus data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRedeemHistory = async () => {
    try {
      const history = await RedeemHistoryService.fetchRedeemHistory(userId);
      setHistoryData(history);
    } catch {
      setHistoryData([]);
    }
  };

  const openRedeemDialog = (type, bonusId, amount) => {
    setCurrentRedeemType(type);
    setCurrentBonusId(bonusId);
    setCurrentBonusAmount(amount);
    setAmountController('');
    setNoteController('');
    setRedeemDialogOpen(true);
  };

  const handleRedeem = async () => {
    if (isButtonTap) return;

    try {
      setIsButtonTap(true);
      const amount = parseFloat(amountController);

      if (amount < 250) {
        setError('Minimum amount is 250');
        setIsButtonTap(false);
        return;
      }
      if (amount > currentBonusAmount) {
        setError('Insufficient balance');
        setIsButtonTap(false);
        return;
      }

      let walletType = 1;
      if (currentRedeemType === 'profit') walletType = 2;
      if (currentRedeemType === 'referral') walletType = 3;

      const successRes = await RedeemService.requestRedeem(
        userId,
        amount,
        walletType,
        noteController,
        currentBonusId
      );

      if (successRes) {
        setSuccess('Redeem request successful');
        if (currentRedeemType === 'daily') {
          setDailyBonusMap((prev) => ({ ...prev, [currentBonusId]: prev[currentBonusId] - amount }));
        }
        if (currentRedeemType === 'profit') {
          setProfitBonusMapRaw((prev) => ({ ...prev, [currentBonusId]: prev[currentBonusId] - amount }));
        }
        if (currentRedeemType === 'referral') {
          setReferralBonusMap((prev) => ({ ...prev, [currentBonusId]: prev[currentBonusId] - amount }));
        }
        setRedeemDialogOpen(false);
        fetchRedeemHistory();
      } else {
        setError('Redeem request failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsButtonTap(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toString()) {
      case '1':
        return { color: theme.palette.success.main, icon: <CheckCircleIcon />, text: 'Success' };
      case '2':
        return { color: theme.palette.error.main, icon: <CancelIcon />, text: 'Failed' };
      default:
        return { color: theme.palette.warning.main, icon: <PendingIcon />, text: 'In Process' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Header */}

      <Container sx={{ py: 2 }}>
        <Grid container spacing={3} sx={{ display: "flex", alignItems: "stretch" }}>
          {/* Left: Redeem Section */}
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
            {/* Daily Bonus */}
            {/* <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Daily Bonus Points
              </Typography>
              {Object.entries(dailyBonusMap).length === 0 ? (
                <Typography>₹0.00</Typography>
              ) : (
                Object.entries(dailyBonusMap).map(([key, value]) => {
                  const canRedeem = value > 250;
                  return (
                    <Box key={key} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography>₹{value.toFixed(2)}</Typography>
                      <Button
                        variant="contained"
                        disabled={!canRedeem}
                        onClick={() => openRedeemDialog("daily", key, value)}
                      >
                        Redeem Now
                      </Button>
                    </Box>
                  );
                })
              )}
            </Card> */}

            {/* Profit Bonus */}
            {/* <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Daily Profit Bonus Points
              </Typography>
              {Object.entries(profitBonusMapRaw).length === 0 ? (
                <Typography>₹0.00</Typography>
              ) : (
                Object.entries(profitBonusMapRaw).map(([key, value]) => {
                  const canRedeem = value > 250;
                  return (
                    <Box key={key} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography>₹{value.toFixed(2)}</Typography>
                      <Button
                        variant="contained"
                        disabled={!canRedeem}
                        onClick={() => openRedeemDialog("profit", key, value)}
                      >
                        Redeem Now
                      </Button>
                    </Box>
                  );
                })
              )}
            </Card> */}

            {/* Referral Bonus */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Referral Bonus Points
              </Typography>
              {Object.entries(referralBonusMap).length === 0 ? (
                <Typography>₹0.00</Typography>
              ) : (
                Object.entries(referralBonusMap).map(([key, value]) => {
                  const canRedeem = value > 250;
                  return (
                    <Box key={key} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography>₹{value.toFixed(2)}</Typography>
                      <Button
                        variant="contained"
                        disabled={!canRedeem}
                        onClick={() => openRedeemDialog("referral", key, value)}
                      >
                        Redeem Now
                      </Button>
                    </Box>
                  );
                })
              )}
            </Card>
          </Grid>

          {/* Right: History Section */}
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                flex: 1, // take full height of left panel automatically
                overflowY: "auto",
                pr: 1, // scrollbar space
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                {isFromEwallet ? "Activation History" : "Redeem History"}
              </Typography>
              <Stack spacing={2}>
                {historyData.length > 0 ? (
                  historyData.map((item, index) => {
                    const statusInfo = getStatusInfo(item.status);
                    return (
                      <Paper key={index} sx={{ p: 2, backgroundColor: "#EBF4FB", flexShrink: 0 }}>
                        {item.redeemDate && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Date {formatDate(item.redeemDate)}
                          </Typography>
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Redeem Amount ₹{item.amount}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                            Status:
                          </Typography>
                          <Chip
                            icon={statusInfo.icon}
                            label={statusInfo.text}
                            size="small"
                            sx={{
                              color: statusInfo.color,
                              backgroundColor: `${statusInfo.color}20`,
                            }}
                          />
                        </Box>
                        <Typography variant="body2">
                          {item.status === 1
                            ? "Your Amount is credited Successfully"
                            : item.status === 0
                              ? "It Will be credited in next 24 hours"
                              : item.status === 2
                                ? "Redeem request failed"
                                : "Processing your request"}
                        </Typography>
                        {item.trans_no && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                            Transaction #: {item.trans_no}
                          </Typography>
                        )}
                      </Paper>
                    );
                  })
                ) : (
                  <Typography>No redeem history found</Typography>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>

      </Container>

      {/* Redeem Dialog */}
      <Dialog
        open={redeemDialogOpen}
        onClose={() => !isButtonTap && setRedeemDialogOpen(false)}
        maxWidth="sm"  // smaller width
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden', // to ensure header bg doesn't overflow
          },
        }}
      >
        {/* Header with background color */}
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'white',
            backgroundColor: 'primary.main',
            py: 1.5, // reduce height slightly
          }}
        >
          Redeem Points
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="subtitle2">My Redeem Points</Typography>
            <Typography
              variant="h5"
              sx={{
                mt: 0.5,
                color: 'primary.main',
                fontWeight: 700,
              }}
            >
              ₹{currentBonusAmount.toFixed(2)}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amountController}
            onChange={(e) => setAmountController(e.target.value)}
            margin="dense"
            InputProps={{
              sx: {
                borderRadius: 1.5,
                backgroundColor: '#f5f5f5',
              },
            }}
            helperText="Enter amount to redeem (minimum ₹250)"
          />

          <TextField
            fullWidth
            label="Note"
            value={noteController}
            onChange={(e) => setNoteController(e.target.value)}
            margin="dense"
            multiline
            rows={2}
            placeholder="Add any remarks"
            InputProps={{
              sx: {
                borderRadius: 1.5,
                backgroundColor: '#f5f5f5',
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            onClick={() => setRedeemDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.primary',
              borderColor: 'grey.400',
              fontSize: '0.875rem',
              '&:hover': { borderColor: 'grey.600' },
            }}
            disabled={isButtonTap}
          >
            Cancel
          </Button>

          <Button
            onClick={handleRedeem}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              fontSize: '0.875rem',
            }}
            disabled={isButtonTap}
          >
            {isButtonTap ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Redeem Now'}
          </Button>
        </DialogActions>
      </Dialog>


      {/* Snackbars */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default RedeemScreen;
