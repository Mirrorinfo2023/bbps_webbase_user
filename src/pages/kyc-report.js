"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import KycTransactions from "@/components/KycReport/KycReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";
import UploadKyc from "./UploadKyc";
import axios from "axios";

const drawWidth = 220;

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
  justifyContent: "space-between",
}));

const getDate = (timeZone) => {
  const dateObject = new Date(timeZone);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
};

function KycReport() {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const [openDialog, setOpenDialog] = useState(false);

  const handleSearch = (text) => setSearchTerm(text);

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };
      try {
        const response = await api.post("/api/users/get-kyc-report", reqData);
        console.log("response is: ",response)
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setMasterReport(response.data.report || {});
        }
      } catch (error) {
        dispatch(
          callAlert({
            message: error?.response?.data?.error || error.message,
            type: "FAILED",
          })
        );
      }
    };
    getTnx();
  }, [fromDate, toDate, dispatch]);


  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => setSelectedValue(event.target.value);

  const filteredRows = showServiceTrans.filter((row) => {
    const matchesSearch =
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.pan_number && row.pan_number.includes(searchTerm)) ||
      (row.ifsc_code && row.ifsc_code.includes(searchTerm)) ||
      (row.nominee_name && row.nominee_name.includes(searchTerm)) ||
      (row.nominee_relation &&
        row.nominee_relation.includes(searchTerm)) ||
      (row.account_number && row.account_number.includes(searchTerm));

    if (selectedValue !== "") {
      return row.status === parseInt(selectedValue) && matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
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
                <StatValue>{masterReport.totalKyc ?? 0}</StatValue>
                <StatLabel>Total KYC</StatLabel>
              </StatContent>
              <StatIcon>
                <PeopleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{masterReport.totalPendingKyc ?? 0}</StatValue>
                <StatLabel>Pending KYC</StatLabel>
              </StatContent>
              <StatIcon>
                <PersonOffIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>{masterReport.totalApprovedKyc ?? 0}</StatValue>
                <StatLabel>Approved KYC</StatLabel>
              </StatContent>
              <StatIcon>
                <VerifiedUserIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#EC407A">
              <StatContent>
                <StatValue>{masterReport.totalRejectedKyc ?? 0}</StatValue>
                <StatLabel>Rejected KYC</StatLabel>
              </StatContent>
              <StatIcon>
                <CancelIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FilterRow>
            <Typography variant="h5" sx={{ padding: 2 }}>
              KYC Report
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  mt: 2,
                  width: "20%",
                }}
              >
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  width: 170,
                  mt: 1,
                  verticalAlign: "top",
                  padding: 0,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedValue}
                    onChange={handleChange}
                    sx={{ fontSize: "13px" }}
                  >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="0">Pending</MenuItem>
                    <MenuItem value="1">Approved</MenuItem>
                    <MenuItem value="2">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ verticalAlign: "top", display: "flex", alignItems: "center" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={setFromDate}
                    format="DD-MM-YYYY"
                    sx={{
                      m: 1,
                      lineHeight: 20,
                      minWidth: 140,
                      maxWidth: 170,
                    }}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={setToDate}
                    format="DD-MM-YYYY"
                    sx={{
                      m: 1,
                      lineHeight: 20,
                      minWidth: 140,
                      maxWidth: 170,
                    }}
                  />
                </LocalizationProvider>

                {/* Upload KYC Button */}
                <Box sx={{ ml: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenDialog(true)} // ⬅️ open dialog
                    sx={{
                      borderRadius: 2,
                      width: "100%",
                      fontWeight: 700,
                      fontSize: 16,
                      px: 4,
                      py: 1.2,
                      background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                      boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      gap: .1,
                    }}

                  >
                    Upload KYC
                  </Button>
                </Box>
              </Box>
            </Box>
          </FilterRow>
        </Grid>
      </Grid>
      <KycTransactions showServiceTrans={filteredRows} />

      <UploadKyc open={openDialog} onClose={() => setOpenDialog(false)} />
    </Layout>
  );
}

export default withAuth(KycReport);
