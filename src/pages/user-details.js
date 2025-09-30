"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/details";
import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Typography, Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonIcon from "@mui/icons-material/Person";
import AddNewUser from "./AddUserDialog"
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt"; // 👈 add new user icon

const drawWidth = 220;
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
function TransactionHistory(props) {
  const [openDialog, setOpenDialog] = useState(false);

  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [masterReport, setmasterReport] = useState({});
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");
  const router = useRouter();
  let rows;
  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());
  const currentDate = new Date();
  const [fromDate, setFromDate] = React.useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = React.useState(dayjs(getDate.dateObject));
  const [totalPageCount, setTotalPageCount] = React.useState(0);
  //const [page, setPage] = React.useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);
  //console.log(router.query);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    // if(router.query)
    // {
    //   setPage(parseInt(router.query['page']));
    // }
    // if(searchTerm!=null){
    //   setPage(1);
    // }
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      // const originalString = 'Hello, World!';
      // const encryptedData = DataEncrypt(JSON.stringify(originalString));
      // console.log(encryptedData);
      // const decryptedObject = DataDecrypt(encryptedData);
      console.log("reqData is:", reqData);
      try {
        const response = await api.post("/api/report/user-details", reqData);
        console.log("response is: ", response)
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setTotalPageCount(response.data.totalPageCount);
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

    if (uid) {
      getTnx();
    }
  }, [uid, fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handleOKButtonClick = async () => {
    setLoading(true);
    const requestData = {
      filter: selectedValue,
      searchTerm: searchTerm,
    };

    try {
      const response = await api.post("/api/report/user-details", requestData);

      if (response.data.status === 200) {
        setLoading(false);
        setShowServiceTrans(response.data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
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

  const filteredRows = rows.filter(row => {
    const term = searchTerm.toLowerCase();

    if (selectedValue) {
      // if a filter is selected, check only that field
      return row[selectedValue] && String(row[selectedValue]).toLowerCase().includes(term);
    } else {
      // otherwise search in multiple fields
      return (
        (row.first_name && row.first_name.toLowerCase().includes(term)) ||
        (row.last_name && row.last_name.toLowerCase().includes(term)) ||
        (row.mlm_id && row.mlm_id.includes(term)) ||
        (row.mobile && row.mobile.includes(term)) ||
        (row.email && row.email.toLowerCase().includes(term))
      );
    }
  });

  const dateFilteredRows = filteredRows.filter(row => {
    const created = new Date(row.created_on);
    return (!fromDate || created >= new Date(fromDate)) &&
      (!toDate || created <= new Date(toDate));
  });

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} xs={12} justifyContent="center">
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
                <StatValue> {masterReport.totalActiveusers ?? 0}</StatValue>
                <StatLabel> Active Users</StatLabel>
              </StatContent>
              <StatIcon>
                <PeopleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{masterReport.totalInactiveusers ?? 0}</StatValue>
                <StatLabel> Inactive Users</StatLabel>
              </StatContent>
              <StatIcon>
                <PersonOffIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>{masterReport.totalPrimeusers ?? 0}</StatValue>
                <StatLabel> Prime Users</StatLabel>
              </StatContent>
              <StatIcon>
                <VerifiedUserIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#EC407A">
              <StatContent>
                <StatValue>{masterReport.totalNonprimeusers ?? 0}</StatValue>
                <StatLabel> Non-Prime Users</StatLabel>
              </StatContent>
              <StatIcon>
                <PersonIcon sx={{ fontSize: 64, color: "#fff" }} />
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
                User Details
              </Typography>
            </Box>
            <TextField
              placeholder="Search"
              variant="standard"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 140, marginTop: "15px" }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
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
            <FormControl
              sx={{ minWidth: 140, background: "#fff", borderRadius: 1 }}
            >
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedValue}
                label="Transaction Type"
                onChange={handleChange}
                sx={{
                  minWidth: 140,
                  maxWidth: 170,
                  fontSize: "13px",
                }}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="mlm_id">User Id</MenuItem>
                <MenuItem value="first_name">Name</MenuItem>
                <MenuItem value="mobile">Mobile</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="ref_mlm_id">Referral User Id</MenuItem>
                <MenuItem value="ref_first_name">Referral Name</MenuItem>
                <MenuItem value="wallet_balance">Wallet Balance</MenuItem>
                <MenuItem value="cashback_balance">Cashback</MenuItem>
                <MenuItem value="city">City</MenuItem>
                <MenuItem value="state">State</MenuItem>
                <MenuItem value="pincode">Pincode</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleOKButtonClick}
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
                gap: .1, // spacing between icon & text
              }}
            >
              Search
            </Button>

            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)} // ⬅️ open dialog
              sx={{
                borderRadius: 2,
                width: "30%",
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
              startIcon={<PersonAddAltIcon />} // 👈 user add icon
            >
              Add New User
            </Button>
          </FilterRow>
        </Grid>
      </Grid>
      <Transactions showServiceTrans={filteredRows} />

      <AddNewUser open={openDialog} onClose={() => setOpenDialog(false)} />

    </Layout>
  );
}
export default withAuth(TransactionHistory);
