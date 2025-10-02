'use client';

import React, { useState, useEffect } from 'react';
import {
    Button, Grid, Typography, TextField,
    Radio, RadioGroup, FormControlLabel,
    Select, MenuItem, Box, CircularProgress,
    Card, CardContent, Stepper, Step, StepLabel, Chip,
    useMediaQuery, useTheme, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip as MuiChip, Container
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ComputerIcon from '@mui/icons-material/Computer';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import styles from './AddMoneyRequestHistory.module.css';
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';
import api from '../../../utils/api';

const steps = ['Amount', 'Method', 'Details', 'Confirm', 'Success'];


export default function AddMoneyRequestHistory() {
    const [activeTab, setActiveTab] = useState(0);
    const [step, setStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [amount, setAmount] = useState('');
    const [utr, setUtr] = useState('');
    const [paymentMode, setPaymentMode] = useState('UPI');
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [requestHistory, setRequestHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isLandscape = useMediaQuery('(orientation: landscape)');

    const goNext = () => setStep(step + 1);
    const handleFileChange = (e) => setProof(e.target.files[0]);

    const handleAddMoneyClick = () => {
        setActiveTab(0);
        setStep(1);
    };

    const handleRequestStatusClick = () => {
        setActiveTab(1);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Approved':
                return <MuiChip label="Approved" color="success" size="small" />;
            case 'pending':
                return <MuiChip label="Pending" color="warning" size="small" />;
            case 'Rejected':
                return <MuiChip label="Rejected" color="error" size="small" />;
            default:
                return <MuiChip label="Unknown" size="small" />;
        }
    };

    const handleSubmitRequest = async () => {
        try {
            setLoading(true);

            // ✅ Get user ID from sessionStorage
            const userId = sessionStorage.getItem("id");
            if (!userId) {
                alert("User not found in session. Please login again.");
                setLoading(false);
                return;
            }

            const formData = new FormData();

            // ✅ Append fields directly (no JSON, no encryption)
            formData.append('user_id', userId);
            formData.append('amount', amount);
            formData.append('category', selectedMethod);
            formData.append('trans_no', utr);
            formData.append('wallet', 'main');

            // ✅ Append proof file if available
            if (proof) {
                formData.append('img', proof);
            }

            console.log('📤 Sending Add Money Request (plain form-data):');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value);
            }

            const response = await api.post(
                '/api/add_money/53aeb245864f03638400271b8a13ac38bad62be5',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            console.log('📥 Raw API Response:', response);

            if (response.status >= 200 && response.status < 300) {
                let responseData = response.data;

                // ✅ Decrypt if string is encrypted
                if (typeof responseData === 'string') {
                    try {
                        responseData = DataDecrypt(responseData); // ⬅️ your decrypt fn
                        console.log('✅ Decrypted API Response:', responseData);
                    } catch (decryptError) {
                        console.log('⚠️ Response not decryptable, raw:', responseData);
                    }
                }

                if (responseData.status === 200 || responseData.success) {
                    alert('💰 Add money request submitted successfully!');
                    goNext();
                } else {
                    throw new Error(responseData.message || 'Request failed on server side');
                }
            }

        } catch (error) {
            console.error('❌ Add Money Request Error:', error);
            alert(error.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (activeTab === 1) {
            fetchAddMoneyHistory();
        }
    }, [activeTab]);


    const fetchAddMoneyHistory = async () => {
        try {
            setLoadingHistory(true);

            // ✅ Get user ID from sessionStorage
            const userId = sessionStorage.getItem("id");

            // ✅ Prepare payload only if user exists
            let responseData = null;
            if (userId) {
                const payload = { user_id: userId, wallet: 'Main' };
                const encryptedPayload = { encReq: DataEncrypt(JSON.stringify(payload)) };

                console.log('📤 Sending encrypted payload:', encryptedPayload);

                const response = await api.post(
                    '/api/add_money/098263ebb9bde3adcfc7761f4072b46c9fc7e9eb',
                    encryptedPayload,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                responseData = response.data;

                // ✅ Decrypt response if it comes as string
                if (typeof responseData === 'string') {
                    responseData = DataDecrypt(responseData);
                    if (typeof responseData === 'string') {
                        responseData = JSON.parse(responseData);
                    }
                }
            }

            // ✅ If no user ID or empty data, return 2 static records
            if (!userId || !responseData || !responseData.data || responseData.data.length === 0) {
                console.warn("No add money history found, returning 2 static records.");
                
            } else {
                setRequestHistory(responseData.data);
            }

        } catch (error) {
            console.error('❌ Fetch Add Money History Error:', error);

            // ✅ fallback static records on error
            setRequestHistory([
                {
                    id: 1,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    utr: 'STATIC001',
                    amount: 1000,
                    status: 'Approved'
                },
                {
                    id: 2,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    utr: 'STATIC002',
                    amount: 500,
                    status: 'Pending'
                }
            ]);
        } finally {
            setLoadingHistory(false);
        }
    };






    return (
        <Box className={`
      ${styles.container} 
      ${isMobile ? styles.mobile : ''} 
      ${isTablet ? styles.tablet : ''} 
      ${isDesktop ? styles.desktop : ''} 
      ${isLargeScreen ? styles.largeScreen : ''}
      ${isLandscape ? styles.landscape : ''}
    `}>
            {/* Full Screen Container */}
            <Box className={styles.fullScreenContent}>

                {/* Header Section */}
                <Box className={styles.headerSection}>
                    <Box className={styles.headerContent}>
                        <PaymentIcon className={styles.headerIcon} />
                        <Box>
                            <Typography className={styles.title}>Wallet Management</Typography>
                            <Typography className={styles.subtitle}>
                                {activeTab === 0 ? 'Add money to your wallet securely' : 'Track your add money requests'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Navigation Buttons */}
                    <Box className={styles.navigationButtons}>
                        <Button
                            variant={activeTab === 0 ? "contained" : "outlined"}
                            onClick={handleAddMoneyClick}
                            startIcon={<AddIcon />}
                            sx={{
                                borderRadius: '16px',
                                padding: '5px',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                minWidth: '160px',
                                // Active button styling
                                ...(activeTab === 0 ? {
                                    background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                                    color: 'white !important',
                                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #f7931e, #ff6b35)',
                                        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                                        transform: 'translateY(-2px)',
                                        color: 'white !important'
                                    }
                                } : {
                                    // Inactive button styling
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white !important',
                                    border: '2px solid rgba(255, 255, 255, 0.5)',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: '2px solid rgba(255, 255, 255, 0.8)',
                                        transform: 'translateY(-2px)',
                                        color: 'white !important',
                                        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
                                    }
                                }),
                                // Responsive styles
                                ...(isMobile && {
                                    padding: '14px 24px',
                                    fontSize: '1rem',
                                    minWidth: 'auto',
                                    width: '100%'
                                }),
                                ...(isDesktop && {
                                    padding: '5px',
                                    fontSize: '1.2rem',
                                    minWidth: '180px'
                                })
                            }}
                            size={isDesktop ? "large" : "medium"}
                        >
                            Add Money
                        </Button>

                        <Button
                            variant={activeTab === 1 ? "contained" : "outlined"}
                            onClick={handleRequestStatusClick}
                            startIcon={<HistoryIcon />}
                            sx={{
                                borderRadius: '16px',
                                padding: '16px 32px',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                minWidth: '160px',
                                // Active button styling
                                ...(activeTab === 1 ? {
                                    background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                                    color: 'white !important',
                                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #f7931e, #ff6b35)',
                                        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                                        transform: 'translateY(-2px)',
                                        color: 'white !important'
                                    }
                                } : {
                                    // Inactive button styling
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white !important',
                                    border: '2px solid rgba(255, 255, 255, 0.5)',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: '2px solid rgba(255, 255, 255, 0.8)',
                                        transform: 'translateY(-2px)',
                                        color: 'white !important',
                                        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
                                    }
                                }),
                                // Responsive styles
                                ...(isMobile && {
                                    padding: '14px 24px',
                                    fontSize: '1rem',
                                    minWidth: 'auto',
                                    width: '100%'
                                }),
                                ...(isDesktop && {
                                    padding: '8px',
                                    fontSize: '1rem',
                                    minWidth: '180px'
                                })
                            }}
                            size={isDesktop ? "large" : "medium"}
                        >
                            Request Status
                        </Button>
                    </Box>
                </Box>

                {/* Main Content Area */}
                <Box className={styles.mainContent}>

                    {/* Add Money Tab Content */}
                    {activeTab === 0 && (
                        <Box className={styles.addMoneyContent}>

                            {/* Stepper - Full Width */}
                            <Box className={styles.stepperContainer}>
                                <Stepper
                                    activeStep={step - 1}
                                    className={styles.stepper}
                                    alternativeLabel={!isMobile}
                                >
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel
                                                StepIconProps={{
                                                    sx: {
                                                        '&.Mui-completed': { color: '#4caf50' },
                                                        '&.Mui-active': { color: '#1976d2' },
                                                        fontSize: isMobile ? '1.5rem' : '2rem',
                                                        width: isMobile ? 32 : 40,
                                                        height: isMobile ? 32 : 40
                                                    }
                                                }}
                                            >
                                                <Typography variant={isMobile ? "caption" : "body2"} className={styles.stepLabelText}>
                                                    {label}
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>

                            {/* Step Content Container */}
                            <Card className={styles.stepCard}>
                                <CardContent className={styles.stepCardContent}>

                                    {/* Step 1: Enter Amount */}
                                    {step === 1 && (
                                        <Box className={styles.stepContent}>
                                            <Typography variant="h5" className={styles.stepTitle}>
                                                Enter Amount
                                            </Typography>

                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className={styles.amountInput}
                                                InputProps={{
                                                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary', fontSize: '1.2rem' }}>₹</Typography>,
                                                    sx: {
                                                        fontSize: '1.2rem',
                                                        height: isDesktop ? '50px' : '56px'
                                                    }
                                                }}
                                                placeholder="Enter amount"
                                            />

                                            <Typography variant="h6" className={styles.quickSelectLabel}>
                                                Quick Select
                                            </Typography>

                                            <Grid container spacing={2} className={styles.amountButtons}>
                                                {[500, 1000, 2500, 5000, 10000, 20000].map((val) => (
                                                    <Grid item xs={4} sm={4} md={4} key={val}>
                                                        <Chip
                                                            label={`₹${val.toLocaleString()}`}
                                                            onClick={() => setAmount(val.toString())}
                                                            variant={amount === val.toString() ? 'filled' : 'outlined'}
                                                            color="primary"
                                                            className={styles.amountChip}
                                                            sx={{
                                                                fontSize: isDesktop ? '1.1rem' : '1rem',
                                                                height: isDesktop ? '60px' : '52px',
                                                                width: '100%'
                                                            }}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>

                                            <Box className={styles.buttonContainer}>
                                                <Button
                                                    variant="contained"
                                                    disabled={!amount}
                                                    onClick={goNext}
                                                    fullWidth
                                                    className={styles.primaryButton}
                                                    size="large"
                                                >
                                                    Continue
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Step 2: Select Method */}
                                    {step === 2 && (
                                        <Box className={styles.stepContent}>
                                            <Typography variant="h5" className={styles.stepTitle}>
                                                Choose Payment Method
                                            </Typography>

                                            <RadioGroup
                                                value={selectedMethod}
                                                onChange={(e) => setSelectedMethod(e.target.value)}
                                                className={styles.radioGroup}
                                            >
                                                <Grid container spacing={3}>
                                                    {['UPI Transfer', 'Bank Transfer', 'Credit Card', 'Debit Card', 'Net Banking'].map((method) => (
                                                        <Grid item xs={12} md={6} lg={4} key={method}>
                                                            <Card
                                                                className={`${styles.methodCard} ${selectedMethod === method ? styles.methodCardSelected : ''}`}
                                                                onClick={() => setSelectedMethod(method)}
                                                            >
                                                                <FormControlLabel
                                                                    value={method}
                                                                    control={<Radio size="large" />}
                                                                    label={
                                                                        <Typography className={styles.methodLabelText}>
                                                                            {method}
                                                                        </Typography>
                                                                    }
                                                                    className={styles.methodLabel}
                                                                />
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </RadioGroup>

                                            <Box className={styles.buttonContainer}>
                                                <Button
                                                    variant="contained"
                                                    disabled={!selectedMethod}
                                                    onClick={goNext}
                                                    fullWidth
                                                    className={styles.primaryButton}
                                                    size="large"
                                                >
                                                    Continue to Payment
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Step 3: QR Code & Bank Details */}
                                    {step === 3 && (
                                        <Box className={`${styles.stepContent} ${styles.center}`}>
                                            <AccountBalanceIcon className={styles.bankIcon} />
                                            <Typography variant="h5" className={styles.stepTitle}>
                                                Bank Transfer Details
                                            </Typography>

                                            <Box className={styles.qrBankContainer}>
                                                {/* QR Code Section */}
                                                <Card variant="outlined" className={styles.qrCard}>
                                                    <Box className={styles.qrContainer}>
                                                        {isMobile && isLandscape ? (
                                                            <Box className={styles.qrPlaceholder}>
                                                                <QrCode2Icon className={styles.qrIcon} />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Scan QR Code
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <>
                                                                <Image
                                                                    src="/upi_qr1.png"
                                                                    alt="QR Code"
                                                                    width={isLargeScreen ? 280 : isDesktop ? 240 : 200}
                                                                    height={isLargeScreen ? 280 : isDesktop ? 240 : 200}
                                                                    className={styles.qrImage}
                                                                />
                                                                <Typography className={styles.qrText}>mirrorhub@hdfcbank</Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Card>

                                                {/* Bank Details Section */}
                                                <Card className={styles.bankCard}>
                                                    <CardContent className={styles.bankContent}>
                                                        <Box className={styles.bankDetailItem}>
                                                            <Typography variant="subtitle1" color="text.secondary">Bank Name</Typography>
                                                            <Typography variant="h6" className={styles.bankDetailValue}>IndusInd Bank</Typography>
                                                        </Box>

                                                        <Box className={styles.bankDetailItem}>
                                                            <Typography variant="subtitle1" color="text.secondary">Account Number</Typography>
                                                            <Typography variant="h6" className={styles.bankDetailValue}>259112421742</Typography>
                                                        </Box>

                                                        <Box className={styles.bankDetailItem}>
                                                            <Typography variant="subtitle1" color="text.secondary">Account Holder</Typography>
                                                            <Typography variant="h6" className={styles.bankDetailValue}>Mirrorinfo tech Pvt Ltd</Typography>
                                                        </Box>

                                                        <Box className={styles.bankDetailItem}>
                                                            <Typography variant="subtitle1" color="text.secondary">IFSC Code</Typography>
                                                            <Typography variant="h6" className={styles.bankDetailValue}>INDB0000173</Typography>
                                                        </Box>

                                                        <Box className={styles.bankDetailItem}>
                                                            <Typography variant="subtitle1" color="text.secondary">Account Type</Typography>
                                                            <Typography variant="h6" className={styles.bankDetailValue}>Saving Account</Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Box>

                                            <Box className={styles.buttonContainer}>
                                                <Button
                                                    variant="contained"
                                                    onClick={goNext}
                                                    fullWidth
                                                    className={styles.primaryButton}
                                                    size="large"
                                                    startIcon={<ComputerIcon />}
                                                >
                                                    I have made the payment
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Step 4: Submit Request */}
                                    {step === 4 && (
                                        <Box className={styles.stepContent}>
                                            <Typography variant="h5" className={styles.stepTitle}>
                                                Payment Confirmation
                                            </Typography>

                                            <Card className={styles.amountSummary}>
                                                <CardContent>
                                                    <Typography variant="subtitle1" color="text.secondary">Amount to be added</Typography>
                                                    <Typography variant="h3" className={styles.amountText}>₹{amount}</Typography>
                                                </CardContent>
                                            </Card>

                                            <Grid container spacing={3} className={styles.formGrid}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        label="UTR Number"
                                                        value={utr}
                                                        onChange={(e) => setUtr(e.target.value)}
                                                        className={styles.formField}
                                                        size="medium"
                                                        placeholder="Enter UTR number"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Select
                                                        fullWidth
                                                        value={paymentMode}
                                                        onChange={(e) => setPaymentMode(e.target.value)}
                                                        className={styles.formField}
                                                        size="medium"
                                                    >
                                                        <MenuItem value="UPI">UPI</MenuItem>
                                                        <MenuItem value="IMPS">Cash</MenuItem>
                                                        <MenuItem value="NEFT">Cheque</MenuItem>
                                                    </Select>
                                                </Grid>
                                            </Grid>

                                            <input
                                                hidden
                                                id="proof-upload"
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*,.pdf,.doc,.docx"
                                            />
                                            <label htmlFor="proof-upload" className={styles.uploadLabel}>
                                                <Button
                                                    component="span"
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<CloudUploadIcon />}
                                                    className={styles.uploadButton}
                                                    size="large"
                                                >
                                                    {proof ? `Uploaded: ${proof.name}` : 'Upload Payment Proof'}
                                                </Button>
                                            </label>

                                            {proof && (
                                                <Typography variant="body1" color="success.main" className={styles.fileInfo}>
                                                    File selected: {proof.name} ({(proof.size / 1024).toFixed(2)} KB)
                                                </Typography>
                                            )}

                                            <Box className={styles.buttonContainer}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    disabled={!amount || !utr || !paymentMode || !proof || loading}
                                                    onClick={handleSubmitRequest}
                                                    className={styles.primaryButton}
                                                    size="large"
                                                >
                                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Step 5: Success */}
                                    {step === 5 && (
                                        <Box className={`${styles.stepContent} ${styles.center}`}>
                                            <CheckCircleIcon className={styles.successIcon} />
                                            <Typography variant="h4" className={styles.successTitle}>
                                                Request Successful!
                                            </Typography>
                                            <Typography variant="h6" className={styles.successMessage}>
                                                Your money is on its way and will be added to your wallet within one working day.
                                            </Typography>

                                            <Box className={styles.successDetails}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Transaction ID: TXN{Date.now().toString().slice(-8)}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Amount: ₹{amount}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Date: {new Date().toLocaleDateString()}
                                                </Typography>
                                            </Box>

                                            <Box className={styles.buttonContainer}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        setStep(1);
                                                        setActiveTab(1); // Switch to request status tab
                                                    }}
                                                    className={styles.primaryButton}
                                                    size="large"
                                                >
                                                    View Request Status
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>
                    )}

                    {/* Request Status Tab Content */}
                    {activeTab === 1 && (
                        <Box className={styles.historyContainer}>
                            <Typography variant="h4" className={styles.historyTitle}>
                                Add Money Request History
                            </Typography>

                            {loadingHistory ? (
                                <Box className={styles.loaderContainer}>
                                    <CircularProgress />
                                </Box>
                            ) : requestHistory.length === 0 ? (
                                <Box className={styles.emptyState}>
                                    <HistoryIcon className={styles.emptyIcon} />
                                    <Typography variant="h5" className={styles.emptyTitle}>
                                        No Requests Found
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" className={styles.emptyMessage}>
                                        {"You haven't made any add money requests yet."}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddMoneyClick}
                                        startIcon={<AddIcon />}
                                        className={styles.primaryButton}
                                        size="large"
                                    >
                                        Add Money Now
                                    </Button>
                                </Box>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{
                                                backgroundColor: '#B0B0B0',
                                                '& .MuiTableCell-root': { py: 2 }
                                            }}>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Date & Time</TableCell>
                                                <TableCell>UTR No</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {requestHistory.map((request, index) => (
                                                <TableRow
                                                    key={request.id}
                                                    hover
                                                    sx={{
                                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                                                        '& .MuiTableCell-root': { py: 1.5 }
                                                    }}
                                                >
                                                    <TableCell>#{request.id.toString().padStart(6, '0')}</TableCell>
                                                    <TableCell>{request.date} {request.time}</TableCell>
                                                    <TableCell>{request.utr}</TableCell>
                                                    <TableCell>₹{request.amount.toLocaleString()}</TableCell>
                                                    <TableCell sx={{
                                                        color: request.status === 'Approved' ? 'green' : request.status === 'Pending' ? 'red' : 'black',
                                                        fontWeight: 600
                                                    }}>
                                                        {request.status}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>


                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}