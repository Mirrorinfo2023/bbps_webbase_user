"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Settings/whatsappSetting";
import { Grid, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Typography, Box } from "@mui/material";

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
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");
  let rows;
  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  const FilterRow = styled(Box)(({ theme }) => ({
    background: '#f5faff',
    borderRadius: 12,
    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
}));
  useEffect(() => {
    const getTnx = async () => {
      const reqData = {};
      try {
        const response = await api.post(
          "/api/setting/get-whatsapp-setting",
          reqData
        );
        // console.log(response.data.data);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
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
  }, [uid, dispatch]);

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} xs={12}>
          <FilterRow component={Paper}>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
              mt={1}
              mb={1}
              style={{ width: "40%", verticalAlign: "top" }}
            >
              <Typography variant="h5">
                Whatsapp Setting
              </Typography>
            </Box>
          </FilterRow>
        </Grid>
      </Grid>

      <Transactions showServiceTrans={showServiceTrans} />
    </Layout>
  );
}
export default withAuth(TransactionHistory);
