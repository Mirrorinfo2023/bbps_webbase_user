"use client";
import React, { useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Divider,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Card Component
function StatCard({ label, value, index }) {
    return (
        <Paper
            sx={{
                flex: "1 1 120px",
                p: 2,
                borderRadius: 2,
                backgroundColor: index % 2 === 0 ? "#e0f2fe" : "#fef9c3",
                textAlign: "center",
                border: "1px solid #e5e7eb",
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {value ?? 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {label}
            </Typography>
        </Paper>
    );
}

export default function ProfitReturnSection({ summary = {}, report = [] }) {
    const chartData = useMemo(
        () => ({
            labels: ["Today's Earning", "This Month Return", "Total Return"],
            datasets: [
                {
                    label: "Profit / Return",
                    data: [
                        summary.today_earning || 0,
                        summary.this_month_return || 0,
                        summary.total_return || 0,
                    ],
                    backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderWidth: 2,
                    borderRadius: 5,
                    maxBarThickness: 80,
                },
            ],
        }),
        [summary]
    );

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Profit / Return Overview" },
            tooltip: {
                callbacks: {
                    label: (context) => `₹${context.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `₹${value.toLocaleString()}`,
                },
            },
        },
    };

    return (
        <Box sx={{ width: "100%", mt: 3 }}>
            {/* Cards */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <StatCard
                    label="Today's Earning"
                    value={`₹${(summary.today_earning || 0).toLocaleString()}`}
                    index={0}
                />
                <StatCard
                    label="This Month Return"
                    value={`₹${(summary.this_month_return || 0).toLocaleString()}`}
                    index={1}
                />
                <StatCard
                    label="Total Return"
                    value={`₹${(summary.total_return || 0).toLocaleString()}`}
                    index={2}
                />
            </Box>

            {/* Chart + Table */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Paper sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 300, height: 350 }}>
                    <Bar data={chartData} options={chartOptions} />
                </Paper>

                <Paper
                    sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 300, height: 350, overflowY: "auto" }}
                >
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                        Profit Return Report
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#F0F3FF" }}>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Sr.No.</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Name</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>MR ID</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Mobile</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Cycle</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Todays Earning</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>This Month Return</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Total Return</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.map((row, i) => (
                                <TableRow key={row.user_id} hover>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{i + 1}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.user_name}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.mr_id}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.mobile}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.payout_cycle}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.status}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>₹{row.today_earning.toLocaleString()}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>₹{row.this_month_return.toLocaleString()}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>₹{row.total_return.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Box>
    );
}
