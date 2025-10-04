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
import { format, parseISO, startOfMonth, endOfDay } from 'date-fns';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
// Export functionality
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { DataDecrypt, DataEncrypt } from "../../../utils/encryption"
import axios from 'axios';
import API from "../../../utils/api"
// Summary Cards Component - Simple and Attractive Design
const SummaryCards = ({ totalAmount }) => {
    const totalCredit = parseFloat(totalAmount?.totalCredit || 0);
    const totalDebit = parseFloat(totalAmount?.totalDebit || 0);
    const totalBalance = (totalCredit - totalDebit).toFixed(2);

    const cards = [
        {
            title: 'Total Credit',
            amount: totalCredit,
            icon: <AccountBalanceWallet sx={{ fontSize: 22 }} />,
            bgColor: '#e8f5e9', // Light green
            textColor: '#2e7d32'
        },
        {
            title: 'Total Debit',
            amount: totalDebit,
            icon: <TrendingUp sx={{ fontSize: 22 }} />,
            bgColor: '#ffebee', // Light red
            textColor: '#c62828'
        },
        {
            title: 'Available Balance',
            amount: parseFloat(totalBalance),
            icon: <Receipt sx={{ fontSize: 22 }} />,
            bgColor: '#e3f2fd', // Light blue
            textColor: '#1565c0'
        }
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{
                        backgroundColor: card.bgColor,
                        color: card.textColor,
                        height: 100,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        }
                    }}>
                        <CardContent sx={{
                            textAlign: 'center',
                            py: 2,
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
                                mb: 1
                            }}>
                                {card.icon}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
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
                                    fontSize: '1.3rem',
                                }}
                            >
                                ₹{card.amount.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

// Combined Filter Component
const CombinedFilters = ({
    filter,
    onFilterChange,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    searchTerm,
    onSearchChange,
    onExport,
    loading
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const filters = [
        { value: 'all', label: 'All Transactions' },
        { value: 'Daily Bonus Income', label: 'Daily Self Bonus' },
        { value: 'Daily Repurchase Bonus', label: 'Daily Profit Bonus' },
        { value: 'Bonus', label: 'Referral Bonus' }
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
                        placeholder="Search transactions..."
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="filter-select-label">Filter Type</InputLabel>
                        <Select
                            labelId="filter-select-label"
                            value={filter}
                            label="Filter Type"
                            onChange={onFilterChange}
                            disabled={loading}
                            sx={{ borderRadius: 2 }}
                        >
                            {filters.map((filterOption) => (
                                <MenuItem key={filterOption.value} value={filterOption.value}>
                                    {filterOption.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Export Button */}
                <Grid item xs={12} md={2}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Download fontSize="small" />}
                        size="small"
                        onClick={onExport}
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Export
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

// Transaction Card for Mobile
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
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                            Order #{transaction.transactionId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {format(parseISO(transaction.incomeDate), 'MMM dd, yyyy • hh:mm a')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Chip
                            label={transaction.type}
                            color={getTypeColor(transaction.type)}
                            size="small"
                            sx={{ fontSize: '0.65rem', height: '20px' }}
                        />
                        <Chip
                            label={getCategoryLabel(transaction.details)}
                            size="small"
                            sx={{
                                backgroundColor: getCategoryColor(transaction.details),
                                color: 'white',
                                fontSize: '0.6rem',
                                height: '18px'
                            }}
                        />
                    </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" sx={{ mb: 1 }}>
                    {transaction.details}
                </Typography>

                <Divider sx={{ my: 1 }} />

                {/* Amount and Balance */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Amount:
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontWeight: 700,
                            color: transaction.type === 'Credit' ? 'success.main' : 'error.main'
                        }}>
                            ₹{(transaction.type === 'Credit' ? transaction.credit : transaction.debit).toLocaleString('en-IN')}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                            Balance:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            ₹{parseFloat(transaction.closingBalance).toLocaleString('en-IN')}
                        </Typography>
                    </Box>
                </Box>
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

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)' }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Order No</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>Closing Balance</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id} hover>
                            <TableCell sx={{ fontWeight: 600, whitespace: "nowrap" }}>
                                #{transaction.transactionId}
                            </TableCell>
                            <TableCell>
                                {(transaction.incomeDate)}

                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getCategoryLabel(transaction.details)}
                                    size="small"
                                    sx={{
                                        backgroundColor: getCategoryColor(transaction.details),
                                        color: 'white',
                                        fontWeight: 600, whitespace: "nowrap"
                                    }}
                                />
                            </TableCell>
                            <TableCell>{transaction.details}</TableCell>
                            <TableCell>
                                <Chip
                                    label={transaction.type}
                                    color={transaction.type === 'Credit' ? 'success' : 'error'}
                                    size="small"
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, whitespace: "nowrap" }}>
                                ₹{(transaction.type === 'Credit' ? transaction.credit : transaction.debit).toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, whitespace: "nowrap" }}>
                                ₹{parseFloat(transaction.closingBalance).toLocaleString('en-IN')}
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // API Call Function
    const fetchIncomePassbook = async () => {
        try {
            setLoading(true);
            setError('');

            const payload = {
                user_id: userId,
                page: 1,
                startdate: fromDate ? format(fromDate, 'yyyy-MM-dd') : null,
                enddate: toDate ? format(toDate, 'yyyy-MM-dd') : null,
                filter: filter && filter !== 'all' ? [filter] : null,
            };

            console.log('API Request Payload:', payload);

            const encReq = DataEncrypt(JSON.stringify(payload));

            const response = await API.post(
                `https://api.mayway.in/api/report/dbafcc3a978c44e1e6255bfda23d108c5463cf16`,
                { encReq },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000
                }
            );

            const encryptedRes = response.data;
            const data = DataDecrypt(encryptedRes);
            console.log('API Response:', data);

            if (data.status === 200 && data.message !== 'Data Not Found') {
                const mappedTransactions = (data.data || []).map(tx => ({
                    id: tx.transaction_id,
                    transactionId: tx.transaction_id,
                    type: tx.type,
                    details: tx.details,
                    credit: parseFloat(tx.credit || 0),
                    debit: parseFloat(tx.debit || 0),
                    closingBalance: parseFloat(tx.closing_balance || 0),
                    incomeDate: tx.income_date,
                }));

                setTransactions(mappedTransactions);

                setTotalAmount({
                    totalCredit: data.totalAmount?.total_credit || "0",
                    totalDebit: data.totalAmount?.total_debit || "0",
                    openingBalance: data.totalAmount?.opening_balance || "0",
                    closingBalance: data.totalAmount?.closing_balance || "0",
                });

                setSuccess(`Loaded ${mappedTransactions.length} transactions`);
            } else {
                setTransactions([]);
                setTotalAmount({
                    totalCredit: "0",
                    totalDebit: "0",
                    openingBalance: "0",
                    closingBalance: "0"
                });
                setSuccess('No transactions found for the selected criteria');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError('Failed to load transactions. Please try again.');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Load transactions when component mounts
    useEffect(() => {
        fetchIncomePassbook();
    }, []);

    // Reload when filters or dates change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchIncomePassbook();
        }); // Debounce to avoid too many API calls

        return () => clearTimeout(timer);
    }, [filter, fromDate, toDate]);

    // Handle filter change
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Handle date changes
    const handleFromDateChange = (newDate) => {
        setFromDate(newDate);
    };

    const handleToDateChange = (newDate) => {
        setToDate(newDate);
    };

    // Filter transactions based on search term (client-side)
    const filteredTransactions = React.useMemo(() => {
        if (!searchTerm) return transactions;

        const searchLower = searchTerm.toLowerCase();
        return transactions.filter(transaction =>
            transaction.transactionId?.toString().toLowerCase().includes(searchLower) ||
            transaction.details?.toLowerCase().includes(searchLower) ||
            transaction.type?.toLowerCase().includes(searchLower)
        );
    }, [transactions, searchTerm]);


    const handleExport = () => {
        // 1. Convert transactions to JSON rows
        const worksheetData = filteredTransactions.map(txn => ({
            TransactionID: txn.transaction_id,
            Type: txn.type,
            SubType: txn.sub_type,
            Credit: txn.credit,
            Debit: txn.debit,
            Balance: txn.closing_balance,
            Date: txn.income_date,
            Status: txn.status,
            Details: txn.details,
            Plan: txn.plan_name,
            Mobile: txn.sender_mobile,
            MLM_ID: txn.sender_mlm_id,
        }));

        // 2. Create sheet
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        // 3. Find last row
        const lastRow = worksheetData.length + 1; // +1 for header row


        // 5. Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "IncomePassbook");

        // 6. Export as Excel
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `income-passbook-${format(new Date(), "yyyy-MM-dd")}.xlsx`);

        setSuccess("Data exported successfully!");
    };



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh', py: 2 }}>
                <Container maxWidth="xl">
                    {/* Summary Cards */}
                    <SummaryCards totalAmount={totalAmount} />

                    {/* Combined Filters */}
                    <CombinedFilters
                        filter={filter}
                        onFilterChange={handleFilterChange}
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={handleFromDateChange}
                        onToDateChange={handleToDateChange}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onExport={handleExport}
                        loading={loading}
                    />

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Transactions Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Transactions {filteredTransactions.length > 0 && `(${filteredTransactions.length})`}
                        </Typography>
                        {loading && <CircularProgress size={24} />}
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
                            {filteredTransactions.map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                            ))}
                        </Box>
                    ) : (
                        // Desktop View - Table
                        <TransactionTable transactions={filteredTransactions} />
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