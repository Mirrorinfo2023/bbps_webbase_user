"use client";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import RedeemTransactions from "@/components/RedeemReport/RedeemReport";
import {
  Grid,
  TableContainer,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StatCard = styled(Paper)(({ bgcolor }) => ({
  background: bgcolor,
  color: "#fff",
  borderRadius: 12,
  padding: "28px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 280,
  minHeight: 100,
  position: "relative",
  overflow: "hidden",
  marginRight: 24,
}));

const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const StatValue = styled("div")({
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: 4,
});

const StatLabel = styled("div")({
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.85,
  letterSpacing: 1,
  textTransform: "uppercase",
});

const StatIcon = styled("div")({
  position: "absolute",
  right: 24,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.18,
  fontSize: 64,
  zIndex: 1,
});

const getDate = (timeZone) => {
  const dateString = timeZone;
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");

  // Determine if it's AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

  return formattedDateTime;
};

function RedeemReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  const currentDate = new Date();
  const [fromDate, setFromDate] = React.useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = React.useState(dayjs(getDate.date));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/report/get-redeem-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setReport(response.data.report);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.last_name &&
        row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.category && row.category.includes(searchTerm))
    );
  });

  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 1,
            }}
          >
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>{report ? report.total_redeemcount : 0}</StatValue>
                <StatLabel>Total Redeem Count</StatLabel>
              </StatContent>
              <StatIcon>
                <LeaderboardIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{report ? report.total_rejectedCount : 0}</StatValue>
                <StatLabel>Reject Request Count</StatLabel>
              </StatContent>
              <StatIcon>
                <HighlightOffIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>{report ? report.total_pendingCount : 0}</StatValue>
                <StatLabel>Pending Request</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#EC407A">
              <StatContent>
                <StatValue>{report ? report.total_approveCount : 0}</StatValue>
                <StatLabel>Approve Request</StatLabel>
              </StatContent>
              <StatIcon>
                <DeleteForeverIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                gap: 2,
                flexWrap: "wrap",
                background: "#f5faff",
                borderRadius: 2,
                boxShadow: 0,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 500, minWidth: 250 }}>
                Redeem Report
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <TextField
                    id="standard-basic"
                    placeholder="Search"
                    variant="standard"
                    sx={{ width: "60%", minWidth: 200 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon />,
                    }}
                  />
                </Box>

                {/* Date Pickers */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      sx={{
                        margin: 1,
                        lineHeight: 20,
                        minWidth: 140,
                        maxWidth: 170,
                        background: "#fff"
                      }}
                      format="DD-MM-YYYY"
                      onChange={handleFromDateChange}


                    />
                    <DatePicker
                      value={toDate}
                      label="To Date"
                      sx={{
                        margin: 1,
                        lineHeight: 20,
                        minWidth: 140,
                        maxWidth: 170,
                        background: "#fff"
                      }}
                      format="DD-MM-YYYY"
                      onChange={handleToDateChange}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      <RedeemTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(RedeemReport);
