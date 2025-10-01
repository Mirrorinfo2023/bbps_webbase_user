"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import API from "../../../utils/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import WithdrawalSection from "./WithdrawalSection";
import ProfitReturnSection from "./ProfitReturnSection";
import TopEarnersReport from "./TopEarnersReport"
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StatSummary({ stats, type = "user" }) {
  const statItems =
    type === "user"
      ? [
        { label: "Total Users", value: stats.total_users },
        { label: "Today's Users", value: stats.today_joined },
        { label: "This Week", value: stats.week_joined },
        { label: "This Month", value: stats.month_joined },
        { label: "Active", value: stats.active_users },
        { label: "Inactive", value: stats.inactive_users },
        { label: "On Hold", value: stats.hold_users },
      ]
      : [
        { label: "5th Cycle", value: stats.cycle5 },
        { label: "15th Cycle", value: stats.cycle15 },
        { label: "25th Cycle", value: stats.cycle25 },
        { label: "Total Investors", value: stats.total_investors },
        {
          label: "Total Investment",
          value: `₹${(stats.total_investment || 0).toLocaleString()}`,
        },
        {
          label: "Total Return",
          value: `₹${(stats.total_return || 0).toLocaleString()}`,
        },
      ];

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
      {statItems.map((item, index) => (
        <Paper
          key={index}
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
            {item.value ?? 0}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {item.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({
    stats: {},
    latestUsers: [],
    withdrawalPanel: {},
    profitReturn: {},
  });
  const [primeStats, setPrimeStats] = useState({});
  const [primeRows, setPrimeRows] = useState([]);

  const toLocalDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr);
  };

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/api/admin/dashboardData");
        if (res.data.success) setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  // ✅ Fetch Prime User Data (No calculations, use backend data)
  useEffect(() => {
    const fetchPrimeData = async () => {
      try {
        const res = await API.get("/api/admin/profitreturnreport");
        if (res.status === 200 && res.data) {
          // Save report & topEarners in state
          setData((prev) => ({
            ...prev,
            profitReturn: {
              report: res.data.report || [],
              topEarners: res.data.topEarners || [],
            },
          }));

          // Optionally, save summary stats if needed
          const summary = {
            today_earning: res.data.report?.reduce((sum, r) => sum + (r.today_earning || 0), 0),
            this_month_return: res.data.report?.reduce((sum, r) => sum + (r.this_month_return || 0), 0),
            total_return: res.data.report?.reduce((sum, r) => sum + (r.total_return || 0), 0),
          };
          setPrimeStats(summary);
          setPrimeRows(res.data.report || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrimeData();
  }, []);


  // ✅ User Chart
  const userChartData = useMemo(() => {
    const statLabels = [
      "Total Users",
      "Today's Users",
      "This Week",
      "This Month",
      "Active",
      "Inactive",
      "On Hold",
    ];
    const statValues = [
      Number(data.stats.total_users || 0),
      Number(data.stats.today_joined || 0),
      Number(data.stats.week_joined || 0),
      Number(data.stats.month_joined || 0),
      Number(data.stats.active_users || 0),
      Number(data.stats.inactive_users || 0),
      Number(data.stats.hold_users || 0),
    ];

    return {
      labels: statLabels,
      datasets: [
        {
          label: "User Stats",
          data: statValues,
          backgroundColor: [
            "rgba(59, 130, 246, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(245, 158, 11, 0.7)",
            "rgba(239, 68, 68, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(16, 103, 245, 0.7)",
            "rgba(34, 197, 94, 0.7)",
          ],
          borderColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(239, 68, 68, 1)",
            "rgba(139, 92, 246, 1)",
            "rgba(16, 103, 245, 1)",
            "rgba(34, 197, 94, 1)",
          ],
          borderWidth: 2,
          borderRadius: 6,
          maxBarThickness: 40,
        },
      ],
    };
  }, [data.stats]);

  const userChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "User Stats Overview" },
    },
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#f7f9fb" }}>
      {/* === USER DASHBOARD === */}
      <StatSummary stats={data.stats} type="user" />

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 5 }}>
        <Paper sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 300, height: 400 }}>
          <Bar data={userChartData} options={userChartOptions} />
        </Paper>

        <Paper
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            minWidth: 300,
            height: 400,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            Latest Users
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F0F3FF" }}>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Name</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Mobile</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Circle</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Refer By</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.latestUsers.map((u, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{u.name}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{u.mobile}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{u.circle}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{u.refer_by}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {toLocalDate(u.date)?.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* === PRIME DASHBOARD === */}
      <ProfitReturnSection
        summary={primeStats}
        report={primeRows}
      />

      {/* Top Earners Table */}
      {data.profitReturn?.topEarners && (
        <TopEarnersReport topEarners={data.profitReturn.topEarners} />
      )}

      {/* === WITHDRAWAL SECTION === */}
      <WithdrawalSection
        summary={data.withdrawalPanel?.summary}
        report={data.withdrawalPanel?.report}
      />
    </Box>
  );
}
