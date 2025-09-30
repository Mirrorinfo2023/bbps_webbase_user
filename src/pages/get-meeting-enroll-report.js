"use client"
import React, { useContext, useEffect, useState } from "react";

import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import MeetingDetailsTransactions from "@/components/Meeting/MeetingDetailsReport";

import { Grid,Button, styled, Paper, Typography, Divider, Box, TextField, Select, MenuItem, FormControl,InputLabel } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';



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



function MeetingDetailsReport(props) {

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const handleSearch = (text) => {
        setSearchTerm(text);
        if (showServiceTrans && showServiceTrans.length > 0) {
            const filtered = showServiceTrans.filter(item => 
                item.name?.toLowerCase().includes(text.toLowerCase()) ||
                item.description?.toLowerCase().includes(text.toLowerCase()) ||
                item.first_name?.toLowerCase().includes(text.toLowerCase()) ||
                item.last_name?.toLowerCase().includes(text.toLowerCase()) ||
                item.mlm_id?.toLowerCase().includes(text.toLowerCase()) ||
                item.mobile?.toLowerCase().includes(text.toLowerCase()) ||
                item.email?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleGenerateReport = async () => {
        const reqData = {
            from_date: fromDate.toISOString().split('T')[0],
            to_date: toDate.toISOString().split('T')[0],
        }

        try {
            const response = await api.post("/api/meeting/meeting-user-enrollment-details", reqData);

            if (response.status === 200) {
                setShowServiceTrans(response.data.data);
                setFilteredData(response.data.data);
            }
        } catch (error) {
            if (error?.response?.data?.error) {
                dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
            } else {
                dispatch(callAlert({ message: error.message, type: 'FAILED' }))
            }
        }
    };

    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));
    
    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split('T')[0],
                to_date: toDate.toISOString().split('T')[0],
            }

            try {

                const response = await api.post("/api/meeting/meeting-user-enrollment-details", reqData);

                if (response.status === 200) {
                    setShowServiceTrans(response.data.data)
                }

            } catch (error) {

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }

            }
        }

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

      const [selectedValue, setSelectedValue] = useState('');

        const handleChange = (event) => {
            setSelectedValue(event.target.value);
        };
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

    return (
        
        <Layout>
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item={true} xs={12}>
                    <FilterRow component={Paper}>
                        {/* First Row */}
                        <Box sx={{ width: "50%" }} >
                            <Typography variant="h5" whiteSpace={"nowrap"}>
                                Meeting Enroll Report
                            </Typography>
                        </Box>
                        {/* Second Row */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                            <Box sx={{ width: "30%" }}>
                                <TextField
                                    id="standard-basic"
                                    placeholder="Search"
                                    variant="standard"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon />,
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box style={{ display: 'flex', gap: 2 }}>
                                        <DatePicker
                                            label="From Date"
                                            value={fromDate}
                                            sx={{
                                                margin: 1,
                                                lineHeight: 20,
                                                minWidth: 140,
                                                maxWidth: 170,
                                                background:"#fff"
                                              }}
                                            format="DD-MM-YYYY"
                                            onChange={handleFromDateChange}
                                        />
                                        <DatePicker
                                            label="To Date"
                                            value={toDate}
                                            sx={{
                                                margin: 1,
                                                lineHeight: 20,
                                                minWidth: 140,
                                                maxWidth: 170,
                                                 background:"#fff"
                                              }}
                                            format="DD-MM-YYYY"
                                            onChange={handleToDateChange}
                                        />
                                    </Box>
                                </LocalizationProvider>
                                
                            </Box>
                            <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={handleGenerateReport}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: 16,
                                        px: 3,
                                        py: 1,
                                        background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                        boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                        textTransform: "none",
                                        whiteSpace: "nowrap",
                                      }}
                                >
                                    Generate Report
                                </Button>
                        </Box>
                    </FilterRow>
                </Grid>
            </Grid>
            <MeetingDetailsTransactions showServiceTrans={searchTerm ? filteredData : showServiceTrans} />
        </Layout>

    );
}
export default withAuth(MeetingDetailsReport);

