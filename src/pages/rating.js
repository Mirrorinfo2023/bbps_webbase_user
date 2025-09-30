"use client";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import RatingTransactions from "@/components/Rating/Rating";
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

function RateReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setmasterReport] = useState({});
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

  console.log(rows);
  const handleSearch = (text) => {
    setSearchTerm(text);
  };
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
        const response = await api.post("/api/rating/get-rating", reqData);
        console.log(response.data.data);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
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
  let filteredRows;

  //   if(selectedValue != ''){
  //       filteredRows = rows.filter(row => {
  //           return (
  //             (row.sub_type && row.sub_type.toLowerCase().includes(selectedValue.toLowerCase()))
  //           );
  //       });
  //   }else{
  filteredRows = rows.filter((row) => {
    return (
      (row.service &&
        row.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.fisrt_name && row.fisrt_name.includes(searchTerm)) ||
      (row.last_name && row.last_name.includes(searchTerm))
    );
  });
  //   }

  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Box display="flex" flexWrap="nowrap" justifyContent="center" overflow="auto" sx={{ mb: 1 }}>
            <StatCard bgcolor="#2196F3">
              <StatContent>
                <StatValue>{masterReport.totalCount ?? 0}</StatValue>
                <StatLabel>Total User Rating</StatLabel>
              </StatContent>
              <StatIcon>
                <LeaderboardIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#4CAF50">
              <StatContent>
                <StatValue>{masterReport.totalAvg ?? 0}</StatValue>
                <StatLabel>Average Rating</StatLabel>
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
                Rating
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
                sx={{
                  minWidth: 140,
                  maxWidth: 170,
                  background: "#fff",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e3e3e3",
                    },
                    "&:hover fieldset": {
                      borderColor: "#2196F3",
                    },
                  },
                }}
                format="DD-MM-YYYY"
                onChange={handleFromDateChange}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                sx={{
                  minWidth: 140,
                  maxWidth: 170,
                  background: "#fff",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e3e3e3",
                    },
                    "&:hover fieldset": {
                      borderColor: "#2196F3",
                    },
                  },
                }}
                format="DD-MM-YYYY"
                onChange={handleToDateChange}
              />
            </LocalizationProvider>
          </FilterRow>
        </Grid>
      </Grid>
      <RatingTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(RateReport);
