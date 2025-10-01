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

const steps = ['Amount', 'Method', 'Details', 'Confirm', 'Success'];

const mockRequestHistory = [
  {
    id: 1,
    orderId: 'ORD000001',
    amount: 1000,
    status: 'completed',
    date: '2024-01-15',
    time: '14:30:45',
    utr: 'UTR123456789',
    method: 'UPI Transfer',
    timestamp: '2024-01-15T14:30:45Z'
  },
  {
    id: 2,
    orderId: 'ORD000002',
    amount: 2500,
    status: 'pending',
    date: '2024-01-14',
    time: '11:20:15',
    utr: 'UTR987654321',
    method: 'Bank Transfer',
    timestamp: '2024-01-14T11:20:15Z'
  },
  {
    id: 3,
    orderId: 'ORD000003',
    amount: 500,
    status: 'Rejected',
    date: '2024-01-13',
    time: '09:45:30',
    utr: 'UTR456789123',
    method: 'UPI Transfer',
    timestamp: '2024-01-13T09:45:30Z'
  },
  {
    id: 4,
    orderId: 'ORD000004',
    amount: 5000,
    status: 'Approved',
    date: '2024-01-12',
    time: '16:15:20',
    utr: 'UTR789123456',
    method: 'Bank Transfer',
    timestamp: '2024-01-12T16:15:20Z'
  },
  {
    id: 5,
    orderId: 'ORD000005',
    amount: 1500,
    status: 'pending',
    date: '2024-01-11',
    time: '10:10:10',
    utr: 'UTR159753468',
    method: 'UPI Transfer',
    timestamp: '2024-01-11T10:10:10Z'
  }
];

export default function AddMoneyRequestHistory() {
    const [activeTab, setActiveTab] = useState(0);
    const [step, setStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [amount, setAmount] = useState('');
    const [utr, setUtr] = useState('');
    const [paymentMode, setPaymentMode] = useState('UPI');
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);

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

    /** 🚀 API call for submitting add money request */
    const handleSubmitRequest = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('utr', utr);
            formData.append('paymentMode', paymentMode);
            formData.append('method', selectedMethod);
            formData.append('proof', proof);

            const res = await fetch('/api/add-money', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Request failed');
            goNext();
        } catch (err) {
            alert(err.message || 'Something went wrong!');
        } finally {
            setLoading(false);
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
                                padding: '16px 32px',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1.1rem',
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
                                    padding: '18px 36px',
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
                                    padding: '18px 36px',
                                    fontSize: '1.2rem',
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
                                                        height: isDesktop ? '60px' : '56px'
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
                                                        <MenuItem value="IMPS">IMPS</MenuItem>
                                                        <MenuItem value="NEFT">NEFT</MenuItem>
                                                        <MenuItem value="RTGS">RTGS</MenuItem>
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

    {mockRequestHistory.length === 0 ? (
      <Box className={styles.emptyState}>
        <HistoryIcon className={styles.emptyIcon} />
        <Typography variant="h5" className={styles.emptyTitle}>
          No Requests Found
        </Typography>
        <Typography variant="h6" color="text.secondary" className={styles.emptyMessage}>
          You haven't made any add money requests yet.
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
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow className={styles.tableHeaderRow}>
              <TableCell className={styles.tableHeaderCell}>
                <Typography variant="h6" className={styles.columnTitle}>
                  Order ID
                </Typography>
              </TableCell>
              <TableCell className={styles.tableHeaderCell}>
                <Typography variant="h6" className={styles.columnTitle}>
                  Date & Time
                </Typography>
              </TableCell>
              <TableCell className={styles.tableHeaderCell}>
                <Typography variant="h6" className={styles.columnTitle}>
                  UTR No
                </Typography>
              </TableCell>
              <TableCell className={styles.tableHeaderCell}>
                <Typography variant="h6" className={styles.columnTitle}>
                  Amount
                </Typography>
              </TableCell>
              <TableCell className={styles.tableHeaderCell}>
                <Typography variant="h6" className={styles.columnTitle}>
                  Status
                </Typography>
              </TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {mockRequestHistory.map((request) => (
              <TableRow key={request.id} hover className={styles.tableRow}>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.orderIdContainer}>
                    <Typography variant="body1" className={styles.orderId}>
                      #{request.id.toString().padStart(6, '0')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.datetimeContainer}>
                    <Typography variant="body1" className={styles.date}>
                      {request.date}
                    </Typography>
                    <Typography variant="body2" className={styles.time}>
                      14:30:45
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.utrContainer}>
                    <Typography variant="body2" className={styles.utrText}>
                      {request.utr}
                    </Typography>
                    <Button 
                      size="small" 
                      className={styles.copyButton}
                      onClick={() => navigator.clipboard.writeText(request.utr)}
                    >
                      Copy
                    </Button>
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Typography variant="h6" className={styles.amount}>
                    ₹{request.amount.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.statusContainer}>
                    {getStatusChip(request.status)}
                    {request.status === 'pending' && (
                      <Typography variant="caption" className={styles.pendingTime}>
                        Processing...
                      </Typography>
                    )}
                  </Box>
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