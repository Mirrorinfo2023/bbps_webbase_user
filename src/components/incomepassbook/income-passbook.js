import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Divider,
    Container,
    Paper,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    useMediaQuery,
    useTheme,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    FilterList,
    Download,
    Search,
    AccountBalanceWallet,
    TrendingUp,
    Receipt
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, startOfMonth } from 'date-fns';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import API from "../../../utils/api"
import { DataDecrypt, DataEncrypt } from "../../../utils/encryption"
import axios from 'axios';
import { parse } from 'date-fns';
// API Base URL
const API_BASE_URL = 'http://localhost:4223/api';

// Summary Cards Component - Reduced Height by 20%
const SummaryCards = ({ totalAmount }) => {
    const totalCredit = parseFloat(totalAmount?.totalCredit || 0);
    const totalDebit = parseFloat(totalAmount?.totalDebit || 0);
    const totalBalance = (totalCredit - totalDebit).toFixed(2);

    const cards = [
        {
            title: 'Total Credit',
            amount: totalCredit,
            icon: <AccountBalanceWallet sx={{ fontSize: 22, opacity: 0.9 }} />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textColor: 'white'
        },
        {
            title: 'Total Debit',
            amount: totalDebit,
            icon: <TrendingUp sx={{ fontSize: 22, opacity: 0.9 }} />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            textColor: 'white'
        },
        {
            title: 'Available Balance',
            amount: parseFloat(totalBalance),
            icon: <Receipt sx={{ fontSize: 22, opacity: 0.9 }} />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            textColor: 'white'
        }
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{
                        background: card.gradient,
                        color: card.textColor,
                        height: 80,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)'
                        }
                    }}>
                        <CardContent sx={{
                            textAlign: 'center',
                            py: 1.5,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            {/* Icon and Title Row */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                mb: 0.5
                            }}>
                                {card.icon}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.9,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {card.title}
                                </Typography>
                            </Box>

                            {/* Amount */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    lineHeight: 1.2,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            >
                                ₹{card.amount.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Typography>

                            {/* Status Indicator */}


                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

// Combined Filter Component - All filters in one row
const CombinedFilters = ({
    filter,
    onFilterChange,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    searchTerm,
    onSearchChange,
    onExport
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const filters = [
        { value: 'all', label: 'All Transactions', shortLabel: 'All' },
        { value: 'Daily Bonus Income', label: 'Daily Self Bonus', shortLabel: 'Self' },
        { value: 'Daily Repurchase Bonus', label: 'Daily Profit Bonus', shortLabel: 'Profit' },
        { value: 'Bonus', label: 'Referral Bonus', shortLabel: 'Referral' }
    ];

    return (
        <Card sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)'
        }}>
            <Grid container spacing={2} alignItems="center">
                {/* Search Field */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        placeholder="Search by order ID, description..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                width: "100%"
                            }
                        }}
                    />
                </Grid>

                {/* Date Filters */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={fromDate}
                                    onChange={onFromDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={toDate}
                                    onChange={onToDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Type Filters */}
                <Grid item xs={12} md={4}>
                    <FormControl
                        size="small"
                        sx={{
                            width: "auto", // set the width
                        }}
                    >
                        <InputLabel id="filter-select-label">Filter</InputLabel>
                        <Select
                            labelId="filter-select-label"
                            value={filter || (filters.length > 0 ? filters[0].value : '')} // default to first
                            label="Filter"
                            onChange={onFilterChange}
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                            }}
                        >
                            {filters.map((filterOption) => (
                                <MenuItem key={filterOption.value} value={filterOption.value}>
                                    {isMobile ? filterOption.shortLabel : filterOption.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>





                {/* Export Button */}
                <Grid item xs={12} md={1}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Download fontSize="small" />}
                        size="small"
                        onClick={onExport}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    >
                        {isMobile ? 'Export' : 'Export'}
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

// Transaction Card for Mobile with better text management
const TransactionCard = ({ transaction }) => {
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Daily Bonus Income': return '#4CAF50';
            case 'Daily Repurchase Bonus': return '#2196F3';
            case 'Bonus': return '#FF9800';
            default: return '#9C27B0';
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'Daily Bonus Income': return 'Self Bonus';
            case 'Daily Repurchase Bonus': return 'Profit Bonus';
            case 'Bonus': return 'Referral Bonus';
            default: return 'Other Income';
        }
    };

    const getTypeLabel = (type) => {
        return type === 'Credit' ? 'Credit' : 'Debit';
    };

    const getTypeColor = (type) => {
        return type === 'Credit' ? 'success' : 'error';
    };

    return (
        <Card sx={{
            mb: 1.5,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'divider'
        }}>
            <CardContent sx={{ p: 2 }}>
                {/* Header Row */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1.5
                }}>
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                color: 'text.secondary'
                            }}
                        >
                            Order #{transaction.transactionId}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.7rem' }}
                        >
                            {format(parseISO(transaction.incomeDate), 'MMM dd, yyyy • hh:mm a')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Chip
                            label={getTypeLabel(transaction.type)}
                            color={getTypeColor(transaction.type)}
                            size="small"
                            sx={{
                                fontSize: '0.65rem',
                                height: '20px',
                                fontWeight: 600
                            }}
                        />
                        <Chip
                            label={getCategoryLabel(transaction.details)}
                            size="small"
                            sx={{
                                backgroundColor: getCategoryColor(transaction.details),
                                color: 'white',
                                fontSize: '0.6rem',
                                height: '18px',
                                fontWeight: 600
                            }}
                        />
                    </Box>
                </Box>

                {/* Description */}
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        lineHeight: 1.3,
                        mb: 1
                    }}
                >
                    {transaction.details}
                </Typography>

                <Divider sx={{ my: 1 }} />

                {/* Amount and Balance Row */}
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                        >
                            Transaction Amount:
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                color: transaction.type === 'Credit' ? 'success.main' : 'error.main',
                                fontSize: '0.85rem'
                            }}
                        >
                            ₹{(transaction.type === 'Credit' ? transaction.credit : transaction.debit).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                        >
                            Closing Balance:
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: 'primary.main'
                            }}
                        >
                            ₹{parseFloat(transaction.closingBalance).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// Transaction Table for Desktop
const TransactionTable = ({ transactions }) => {
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Daily Bonus Income': return '#4CAF50';
            case 'Daily Repurchase Bonus': return '#2196F3';
            case 'Bonus': return '#FF9800';
            default: return '#9C27B0';
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'Daily Bonus Income': return 'Self Bonus';
            case 'Daily Repurchase Bonus': return 'Profit Bonus';
            case 'Bonus': return 'Referral Bonus';
            default: return 'Other Income';
        }
    };

    const getTypeColor = (type) => {
        return type === 'Credit' ? 'success' : 'error';
    };

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)' }}>
            <Table size="small">
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1 }}>Order No</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1 }}>Date & Time</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1 }}>Category</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1 }}>Description</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1 }}>Amount</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1 }}>Closing Balance</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', py: 1 }}>
                                #{transaction.transactionId}
                            </TableCell>
                            {/* Date & Time */}
                            <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>
                                {format(parse(transaction.incomeDate, 'dd-MM-yyyy HH:mm:ss', new Date()), 'dd MMM yyyy')}
                                <br />
                                <Typography variant="caption" color="text.secondary">
                                    {format(parse(transaction.incomeDate, 'dd-MM-yyyy HH:mm:ss', new Date()), 'hh:mm a')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ py: 1 }}>
                                <Chip
                                    label={getCategoryLabel(transaction.details)}
                                    size="small"
                                    sx={{
                                        backgroundColor: getCategoryColor(transaction.details),
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        height: '24px'
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{transaction.details}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <Chip
                                    label={`₹${(transaction.type === 'Credit' ? transaction.credit : transaction.debit).toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}`}
                                    color={getTypeColor(transaction.type)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', py: 1 }}>
                                ₹{parseFloat(transaction.closingBalance).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// Main Income Passbook Component
const IncomePassbook = ({ userId = '34' }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State variables
    const [fromDate, setFromDate] = useState(startOfMonth(new Date()));
    const [toDate, setToDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [transactions, setTransactions] = useState([]);
    const [totalAmount, setTotalAmount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // API Call Function
    const fetchIncomePassbook = async (pageNum = 1, shouldReset = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            setError('');

            const payload = {
                user_id: userId,
                page: pageNum,
                startdate: fromDate ? format(fromDate, 'yyyy-MM-dd') : null,
                enddate: toDate ? format(toDate, 'yyyy-MM-dd') : null,
                filter: filter && filter !== 'all' ? [filter] : null,
            };

            console.log('Raw Request Payload:', payload);

            const encReq = DataEncrypt(JSON.stringify(payload));

            const response = await axios.post(
                `https://api.mayway.in/api/report/dbafcc3a978c44e1e6255bfda23d108c5463cf16`,
                { encReq },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const encryptedRes = response.data;
            const data = DataDecrypt(encryptedRes); // ✅ Already an object
            console.log('Decrypted Response:', data);

            if (data.status === 200 && data.message !== 'Data Not Found') {
                // Map API response to your state structure
                const mappedTransactions = (data.data || []).map(tx => ({
                    id: tx.transaction_id,
                    transactionId: tx.transaction_id,
                    type: tx.type,
                    details: tx.details,
                    credit: tx.credit,
                    debit: tx.debit,
                    closingBalance: tx.closing_balance,
                    incomeDate: tx.income_date,
                }));

                if (shouldReset || pageNum === 1) {
                    setTransactions(mappedTransactions);
                } else {
                    setTransactions(prev => [...prev, ...mappedTransactions]);
                }

                setTotalAmount({
                    totalCredit: data.totalAmount?.total_credit || "0",
                    totalDebit: data.totalAmount?.total_debit || "0",
                    openingBalance: data.totalAmount?.opening_balance || "0",
                    closingBalance: data.totalAmount?.closing_balance || "0",
                });

                setHasMore(mappedTransactions.length >= 10);

                if (pageNum === 1 && mappedTransactions.length > 0) {
                    setSuccess(`Loaded ${mappedTransactions.length} transactions`);
                }
            } else {
                if (shouldReset || pageNum === 1) setTransactions([]);
                setTotalAmount({ totalCredit: "0", totalDebit: "0" });
                setHasMore(false);

                if (pageNum === 1) setSuccess('No transactions found for the selected criteria');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError('Failed to load transactions. Please check your connection and try again.');

            if (pageNum === 1) {
                setTransactions([]);
                setTotalAmount({ totalCredit: "0", totalDebit: "0" });
            }
        } finally {
            setLoading(false);
        }
    };



    // Load transactions
    const loadTransactions = (pageNum = 1, shouldReset = false) => {
        fetchIncomePassbook(pageNum, shouldReset);
        setPage(pageNum);
    };

    // Load more transactions
    const loadMoreTransactions = () => {
        loadTransactions(page + 1, false);
    };

    // Initial load
    useEffect(() => {
        loadTransactions(1, true);
    }, []);

    // Reload when filters change
    useEffect(() => {
        loadTransactions(1, true);
    }, [filter, fromDate, toDate]);

    // Filter transactions based on search term
    const filteredTransactions = React.useMemo(() => {
        if (!searchTerm) return transactions;

        return transactions.filter(transaction =>
            transaction.transactionId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.type?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transactions, searchTerm]);

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
        }
    };

    // Export functionality
    const handleExport = () => {
        const dataStr = JSON.stringify({
            transactions: filteredTransactions,
            totalAmount: totalAmount,
            generatedAt: new Date().toISOString()
        }, null, 2);

        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `income-passbook-${format(new Date(), 'yyyy-MM-dd')}.json`;
        link.click();
        URL.revokeObjectURL(url);

        setSuccess('Data exported successfully!');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh', py: 2 }}>
                <Container maxWidth="xl">
                    {/* Summary Cards - Reduced Height */}
                    <SummaryCards totalAmount={totalAmount} />

                    {/* Combined Filters - All in one row */}
                    <CombinedFilters
                        filter={filter}
                        onFilterChange={handleFilterChange}
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onExport={handleExport}
                    />

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Transactions Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            Transactions ({filteredTransactions.length})
                        </Typography>
                        {loading && <CircularProgress size={20} />}
                    </Box>

                    {/* Transactions List */}
                    {loading && transactions.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredTransactions.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                No transactions found
                            </Typography>
                        </Paper>
                    ) : isMobile ? (
                        // Mobile View - Cards
                        <Box>
                            {filteredTransactions.map((transaction, index) => (
                                <TransactionCard
                                    key={transaction.id || index}
                                    transaction={transaction}
                                />
                            ))}
                        </Box>
                    ) : (
                        // Desktop View - Table
                        <TransactionTable transactions={filteredTransactions} />
                    )}

                    {/* Load More Button */}
                    {hasMore && transactions.length > 0 && !loading && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={loadMoreTransactions}
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Load More Transactions
                            </Button>
                        </Box>
                    )}

                    {/* Success Snackbar */}
                    <Snackbar
                        open={!!success}
                        autoHideDuration={3000}
                        onClose={() => setSuccess('')}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={() => setSuccess('')} severity="success">
                            {success}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default IncomePassbook;