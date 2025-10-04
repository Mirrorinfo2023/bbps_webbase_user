import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalanceWallet,
  Receipt,
  CalendarToday,
  Visibility,
  ArrowForward,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useRouter } from 'next/router';
import axios from 'axios';
import { mt } from 'date-fns/locale';
import API from "../../../utils/api"

// Summary Cards Component
const SummaryCards = ({ incomeStats }) => {
  const cards = [
    {
      title: 'Total Transactions',
      value: incomeStats?.totalTransactions || 0,
      amount: incomeStats?.totalAmount || 0,
      icon: <Receipt sx={{ fontSize: 20 }} />,
      color: '#2196f3'
    },
    {
      title: 'This Month',
      value: incomeStats?.monthTransactions || 0,
      amount: incomeStats?.monthAmount || 0,
      icon: <CalendarToday sx={{ fontSize: 20 }} />,
      color: '#4caf50'
    },
    {
      title: 'This Week',
      value: incomeStats?.weekTransactions || 0,
      amount: incomeStats?.weekAmount || 0,
      icon: <TrendingUp sx={{ fontSize: 20 }} />,
      color: '#ff9800'
    },
    {
      title: 'Today',
      value: incomeStats?.todayTransactions || 0,
      amount: incomeStats?.todayAmount || 0,
      icon: <AccountBalanceWallet sx={{ fontSize: 20 }} />,
      color: '#f44336'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{
            background: `linear-gradient(135deg, ${card.color}20, ${card.color}40)`,
            border: `1px solid ${card.color}30`,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s ease-in-out',
            height: 100, // Reduced height
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}>
            <CardContent sx={{ p: 2, height: '100%', '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: card.color, fontSize: '1rem', mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.2rem', lineHeight: 1.2 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    ₹{card.amount.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box sx={{
                  backgroundColor: `${card.color}15`,
                  borderRadius: '50%',
                  p: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 40,
                  height: 40
                }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Income Report Section
// Income Report Section
const IncomeReportSection = ({ incomeStats, incomePassbook, loading }) => {
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/income-passbook');
  };

  // Prepare chart data from incomeStats for the graph
  const incomeChartData = [
    {
      name: 'Total',
      transactions: incomeStats?.totalTransactions || 0,
      amount: incomeStats?.totalAmount || 0
    },
    {
      name: 'Month',
      transactions: incomeStats?.monthTransactions || 0,
      amount: incomeStats?.monthAmount || 0
    },
    {
      name: 'Week',
      transactions: incomeStats?.weekTransactions || 0,
      amount: incomeStats?.weekAmount || 0
    },
    {
      name: 'Today',
      transactions: incomeStats?.todayTransactions || 0,
      amount: incomeStats?.todayAmount || 0
    }
  ];

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            {/* <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Income Report
            </Typography> */}
          </Box>

          <Grid container spacing={3}>
            {/* Left Side - Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}
                >
                  Transaction Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incomeChartData} barCategoryGap="50%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, (dataMax) => dataMax * 1.3]} /> {/* adds 30% headroom */}
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'Transactions') return [value, 'Transactions'];
                        if (name === 'Amount') return [`₹${value.toLocaleString('en-IN')}`, 'Amount'];
                        return [value, name];
                      }}
                    />
                    <Legend />

                    {/* Transactions Bar */}
                    <Bar
                      dataKey="transactions"
                      name="Transactions"
                      fill="#2196f3"
                      radius={[4, 4, 0, 0]}
                      barSize={40}  // ✅ smaller width
                    >
                      <LabelList
                        dataKey="transactions"
                        position="top"
                        formatter={(value) => value}
                        fontSize={12}
                        fontWeight={600}
                        fill="#2196f3"
                      />
                    </Bar>

                    {/* Amount Bar */}
                    <Bar
                      dataKey="amount"
                      name="Amount"
                      fill="#4caf50"
                      radius={[4, 4, 0, 0]}
                      barSize={50}  // ✅ smaller width
                    >
                      <LabelList
                        dataKey="amount"
                        position="top"
                        formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                        fontSize={12}
                        fontWeight={600}
                        fill="#4caf50"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>


            {/* Right Side - Recent Transactions Table */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Transactions
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    endIcon={<ArrowForward />}
                    onClick={handleViewAll}
                    sx={{ borderRadius: 2 }}
                  >
                    View All Passbook
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : incomePassbook?.report?.length > 0 ? (
                  <TableContainer sx={{ maxHeight: 320 }}>
                    <Table size="medium">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Date & Time</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Operator</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {incomePassbook.report.slice(0, 6).map((transaction, index) => (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              {transaction.date}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              {transaction.operator}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'success.main' }}>
                              ₹{transaction.amount}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={transaction.status}
                                color={transaction.status === 'pending' ? 'warning' : 'success'}
                                size="small"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No transactions found
                  </Typography>
                )}


              </Paper>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};


// Redeem Report Section
const RedeemReportSection = ({ redeemReport, loading }) => {
  // Prepare chart data for redeem status with amounts and percentages
  const prepareRedeemData = () => {
    const success = redeemReport?.chart?.success || 0;
    const failed = redeemReport?.chart?.failed || 0;
    const pending = redeemReport?.chart?.pending || 0;

    const total = success + failed + pending;

    // Calculate percentages
    const successPercentage = total > 0 ? (success / total) * 100 : 0;
    const failedPercentage = total > 0 ? (failed / total) * 100 : 0;
    const pendingPercentage = total > 0 ? (pending / total) * 100 : 0;

    return [
      {
        name: 'Success',
        value: success,
        amount: redeemReport?.redeemAmountStats?.successAmount || 0,
        percentage: successPercentage,
        color: '#4caf50'
      },
      {
        name: 'Failed',
        value: failed,
        amount: redeemReport?.redeemAmountStats?.failedAmount || 0,
        percentage: failedPercentage,
        color: '#f44336'
      },
      {
        name: 'Pending',
        value: pending,
        amount: redeemReport?.redeemAmountStats?.pendingAmount || 0,
        percentage: pendingPercentage,
        color: '#ff9800'
      },
    ];
  };

  const redeemChartData = prepareRedeemData();

  const amountChartData = [
    {
      name: 'Success',
      amount: redeemReport?.redeemAmountStats?.successAmount || 0,
      color: '#4caf50'
    },
    {
      name: 'Failed',
      amount: redeemReport?.redeemAmountStats?.failedAmount || 0,
      color: '#f44336'
    },
    {
      name: 'Pending',
      amount: redeemReport?.redeemAmountStats?.pendingAmount || 0,
      color: '#ff9800'
    },
  ];

  // Custom label for pie chart to show percentages
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Side - Big Pie Chart with Percentages */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Transaction Status (Percentage)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={redeemChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {redeemChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>

                    {/* ✅ Tooltip override */}
                    <Tooltip
                      formatter={(value, name, props) => {
                        return [
                          `${props.payload.percentage.toFixed(1)}% (₹${props.payload.amount.toLocaleString('en-IN')})`,
                          props.payload.name
                        ];
                      }}
                    />

                    {/* ✅ Legend override */}
                    {/* <Legend
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, fontWeight: 600 }}>
                          {value} - {entry.payload.percentage.toFixed(1)}%
                        </span>
                      )}
                    /> */}
                  </PieChart>

                </ResponsiveContainer>
                {/* Additional Percentage Stats */}
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Status Breakdown:
                  </Typography>
                  <Grid container spacing={1}>
                    {redeemChartData.map((item, index) => (
                      <Grid item xs={4} key={index}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: item.color }}>
                            {item.name}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: item.color }}>
                            {item.percentage.toFixed(1)}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ({item.value} transactions)
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Right Side - Amount Bar Chart with Labels */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Transaction Analysis
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={amountChartData} barCategoryGap="50%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />

                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={50}>
                      {amountChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="amount"
                        position="top"
                        formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                        fontSize={12}
                        fontWeight={600}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>


                {/* Amount Summary */}
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Amount Summary:
                  </Typography>
                  <Grid container spacing={1}>
                    {amountChartData.map((item, index) => (
                      <Grid item xs={4} key={index}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: item.color }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: item.color, fontSize: '0.9rem' }}>
                            ₹{item.amount.toLocaleString('en-IN')}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

// Wallet Report Section
// Wallet Report Section
const WalletReportSection = ({ walletReport, redeemReport, loading }) => {
  // Process wallet data to show last 10 date-wise transactions
  const processWalletData = () => {
    if (!walletReport?.report || walletReport.report.length === 0) {
      return [];
    }

    // Sort by date descending and take last 10 entries
    const sortedData = [...walletReport.report]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map(transaction => ({
        date: new Date(transaction.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        amount: transaction.amount || 0
      }));

    return sortedData;
  };

  // Prepare redeem transaction data for bar chart (last 10 transactions)
  const prepareRedeemBarChartData = () => {
    if (!redeemReport?.report || redeemReport.report.length === 0) {
      return [];
    }

    // Sort by date descending and take last 10 entries
    const sortedData = [...redeemReport.report]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map(transaction => ({
        date: new Date(transaction.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        amount: transaction.amount || 0,
        status: transaction.status === 1 ? 'Success' : transaction.status === 0 ? 'Failed' : 'Pending',
        color: transaction.status === 1 ? '#4caf50' : transaction.status === 0 ? '#f44336' : '#ff9800'
      }));

    return sortedData;
  };

  const walletChartData = processWalletData();
  const redeemBarChartData = prepareRedeemBarChartData();

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Side - Wallet Bar Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                  Wallet Transactions
                </Typography>

                {walletChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={walletChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        name="Wallet Amount"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList
                          dataKey="amount"
                          position="top"
                          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                          fontSize={11}
                          fontWeight={600}
                          fill="#333"
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Typography variant="body2" color="text.secondary">
                      No wallet transactions available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Right Side - Redeem Transactions Bar Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                  Recent Redeem Transactions
                </Typography>

                {redeemBarChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={redeemBarChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        name="Redeem Amount"
                        radius={[4, 4, 0, 0]}
                      >
                        {redeemBarChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList
                          dataKey="amount"
                          position="top"
                          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                          fontSize={11}
                          fontWeight={600}
                          fill="#333"
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Typography variant="body2" color="text.secondary">
                      No redeem transactions available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      // Get user_id from sessionStorage
      const userId = sessionStorage.getItem("id");

      if (!userId) {
        console.error('❌ No user_id found in sessionStorage');
        return null;
      }

      const payload = { user_id: Number(userId) };

      const response = await API.post('/api/report/get-bbps-dashbaord-rep', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;

      if (data.status === 200) {
        console.log('✅ Dashboard Data:', data.data);
        return data.data;
      } else {
        console.error('❌ Failed to load dashboard data:', data.message || 'Unknown error');
        return null;
      }

    } catch (err) {
      if (err.response) {
        console.error('❌ Dashboard API Error:', err.response.data || err.response.statusText);
      } else if (err.request) {
        console.error('❌ No response from server:', err.request);
      } else {
        console.error('❌ Error:', err.message);
      }
      return null;
    }
  };



  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const data = await fetchDashboardData();
      if (data) setDashboardData(data);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <SummaryCards incomeStats={dashboardData?.incomeStats} />

        {/* Income Report Section */}
        <IncomeReportSection
          incomeStats={dashboardData?.incomeStats}
          incomePassbook={dashboardData?.incomePassbook}
          loading={loading}
        />

        {/* Redeem Report Section */}
        <RedeemReportSection
          redeemReport={dashboardData?.redeemReport}
          loading={loading}
        />

        {/* Wallet Report Section */}

        <WalletReportSection
          walletReport={dashboardData?.walletReport}
          redeemReport={dashboardData?.redeemReport}
          loading={loading}
        />

      </Container>
    </Box>
  );
};

export default Dashboard;