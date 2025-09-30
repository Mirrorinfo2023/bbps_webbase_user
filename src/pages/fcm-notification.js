"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import NotificationTransactions from "@/components/Notification/Notification";
import {
  Grid,
  Button,
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
  fontSize: 12,
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

const FilterRow = styled(Box)(({ theme }) => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "flex-start",
}));

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

function Notification(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setmasterReport] = useState({});

  const handleSearch = (text) => {
    setSearchTerm(text);
  };
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();

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
          "api/notification/get-notification",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.notificationResult);
          setmasterReport(response.data.report);
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

  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>{masterReport.totalCount ?? 0}</StatValue>
                <StatLabel>Total Count</StatLabel>
              </StatContent>
              <StatIcon>
                <LeaderboardIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{masterReport.totalSuccessFcm ?? 0}</StatValue>
                <StatLabel>Total Success</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FilterRow>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
              style={{ width: "50%", verticalAlign: "center" }}
            >
              <Typography variant="h5" sx={{ padding: 2 }}>
                Notification
              </Typography>
            </Box>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mt={3}
              mb={1}
              sx={{ width: "20%", verticalAlign: "top" }}
            >
              <TextField
                id="standard-basic"
                placeholder="Search"
                variant="standard"
                size="small"
                style={{ width: "100%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                sx={{ minWidth: 140, background: "#fff", borderRadius: 1 }}
                format="DD-MM-YYYY"
                onChange={handleFromDateChange}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                sx={{ minWidth: 140, background: "#fff", borderRadius: 1 }}
                format="DD-MM-YYYY"
                onChange={handleToDateChange}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              href={`/add-new-notification/`}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 16,
                px: 4,
                py: 1.2,
                background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
            >
              Add New
            </Button>
          </FilterRow>
        </Grid>
      </Grid>
      <NotificationTransactions showServiceTrans={showServiceTrans} />
    </Layout>
  );
}
export default withAuth(Notification);
