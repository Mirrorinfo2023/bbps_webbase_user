import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import dayjs from "dayjs";
import Modal from "@mui/material/Modal";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const GradientTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase",
    padding: "8px 8px",
    borderRight: "1px solid #e3e3e3",
    whiteSpace: "nowrap",
    letterSpacing: 1,
  },
  "&:first-of-type": {
    borderTopLeftRadius: 6,
  },
  "&:last-of-type": {
    borderTopRightRadius: 6,
    borderRight: "none",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: "8px 8px",
  },
}));
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  ".MuiTablePagination-select": {
    color: "#2196f3",
    fontWeight: 600,
    paddingRight: "24px",
  },
  ".MuiTablePagination-selectLabel": {
    color: "#666",
    fontWeight: 500,
  },
  ".MuiTablePagination-displayedRows": {
    color: "#666",
    fontWeight: 500,
  },
  ".MuiTablePagination-actions": {
    ".MuiIconButton-root": {
      color: "#2196f3",
      "&:hover": {
        backgroundColor: "rgba(33, 150, 243, 0.08)",
      },
      "&.Mui-disabled": {
        color: "#ccc",
      },
    },
  },
  ".MuiTablePagination-selectIcon": {
    color: "#2196f3",
  },
  ".MuiTablePagination-menuItem": {
    padding: "4px 16px",
  },
  ".MuiTablePagination-selectRoot": {
    marginRight: "32px",
  },
  ".MuiTablePagination-toolbar": {
    minHeight: "52px",
    padding: "0 16px",
    flexWrap: "wrap",
    gap: "4px",
  },
  ".MuiTablePagination-spacer": {
    flex: "none",
  },
}));
import styles from "./OtpReportTable.module.css";

const IncomeTransactions = ({ showServiceTrans }) => {

  console.log("showServiceTrans are: ", showServiceTrans)

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
    const from_date = `01-${month}-${year}`;
    const to_date = `${day}-${month}-${year}`;
    return formattedDateTime;
  };

  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
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
  const rowsPerPageOptions = [5, 10, 25, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#ccc",
      color: theme.palette.common.black,
      fontSize: 12,
      linHeight: 15,
      padding: 7,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      borderBottom: 0,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      linHeight: 15,
      padding: 7,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));

  const [formattedDate, setFormattedDate] = useState("");

  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [UserId, setUserId] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [TransNo, setTransNo] = React.useState(null);

  const [rejectionReason, setRejectionReason] = useState(null);

  const handleOpenModal1 = (status, user_id, amount, trans_no) => {
    setUserId(user_id);
    setStatus(status);
    setAmount(amount);
    setTransNo(trans_no);
    setOpenModal1(true);
  };

  const handleCloseModal1 = () => {
    setUserId(null);
    setStatus(null);
    setAmount(null);
    setTransNo(null);
    setOpenModal1(false);
  };

  const handleTextareaChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const handleOpenModal2 = (status, user_id, amount, trans_no) => {
    setUserId(user_id);
    setStatus(status);
    setAmount(amount);
    setTransNo(trans_no);
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  const handleOKButtonClick = async () => {
    if (!UserId) {
      console.error("UserId is missing.");
      return;
    }
    let remark = "";

    let action = "";
    if (status === 1) {
      remark = "Approve";
      action = "Approve";
    } else if (status === 2) {
      remark = rejectionReason;
      action = "Reject";
    } else {
      remark = "";
      action = "Pending";
    }

    const requestData = {
      user_id: UserId,
      sender_user_id: 2,
      amount: amount,
      trans_no: TransNo,
      remarks: remark,
      status: status,
    };

    try {
      let response = [];

      response = await api.post(
        "/api/referral/plan/reject-redeem",
        requestData
      );

      if (response.data.status === 200) {
        alert(response.data.message);
        location.reload();
      } else {
        alert("Failed to update status.");
        console.log("Failed to update status.");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    handleCloseModal1();
    handleCloseModal2();
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table aria-label="Otp Report" className={styles.table}>
              <TableHead>
                <TableRow className={styles.tableHeadRow}>
                  <TableCell>Sr No.</TableCell>
                  <TableCell>Redeem Type</TableCell>
                  <TableCell>created date</TableCell>

                  <TableCell>User Name</TableCell>
                  <TableCell>User Id</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Amt</TableCell>
                  <TableCell>Credited Amt[90%]</TableCell>
                  <TableCell>Deducted Amt[10%]</TableCell>
                  <TableCell>Transaction No</TableCell>
                  <TableCell>Payout Type</TableCell>
                  <TableCell>Account No.</TableCell>
                  <TableCell>Account holder name</TableCell>
                  <TableCell>Bank name</TableCell>
                  <TableCell>IFSC Code</TableCell>
                  <TableCell>Remarks</TableCell>

                  <TableCell>Approval Remarks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {showServiceTrans.length > 0 ? (
                  (rowsPerPage > 0
                    ? filteredRows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : filteredRows
                  ).map((row, index) => (
                    <TableRow key={index} className={styles.tableRow}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{row.category}</TableCell>
                        <TableCell className={styles.redeemDate}>
                        {row.redeem_date}
                      </TableCell>


                      <TableCell>{row.first_name + " " + row.last_name}</TableCell>

                      <TableCell className={styles.userIdCell}>{row.mlm_id}</TableCell>

                      <TableCell>{row.mobile}</TableCell>
                      <TableCell className={styles.amountCell}>{row.amount}</TableCell>
                      <TableCell>{(row.amount * 0.9).toFixed(2)}</TableCell>
                      <TableCell>{(row.amount * 0.1).toFixed(2)}</TableCell>
                      <TableCell>{row.trans_no}</TableCell>
                      <TableCell>{row.payout_type}</TableCell>
                      <TableCell>{row.account_number}</TableCell>
                      <TableCell>{row.account_holder}</TableCell>
                      <TableCell>{row.bank_name}</TableCell>
                      <TableCell>{row.ifsc_code}</TableCell>
                      <TableCell>{row.remarks}</TableCell>
                      <TableCell>{row.rejection_reason}</TableCell>
                    
                      <TableCell
                        className={
                          row.status === 1
                            ? styles.statusApproved
                            : row.status === 2
                              ? styles.statusRejected
                              : styles.statusPending
                        }
                      >
                        {row.status === 1
                          ? "Approved"
                          : row.status === 2
                            ? "Rejected"
                            : "Pending"}
                      </TableCell>
                      <TableCell>
                        <StyledTableCell className={styles.actionButtons}>
                          {row.status === 0 ? (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleOpenModal1(
                                    1,
                                    row.user_id,
                                    row.amount,
                                    row.trans_no
                                  )
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                color="warning"
                                onClick={() =>
                                  handleOpenModal2(
                                    2,
                                    row.user_id,
                                    row.amount,
                                    row.trans_no
                                  )
                                }
                              >
                                Reject
                              </Button>
                            </Box>
                          ) : null}

                          <Modal open={openModal1} onClose={handleCloseModal1}>
                            <Box className={styles.modalBox}>
                              <HelpOutlineOutlinedIcon
                                className={styles.modalIcon}
                                color="warning"
                              />
                              <Typography variant="h6">
                                Are you sure to approve the Redeem request?
                              </Typography>
                              <Typography>
                                <Button
                                  variant="contained"
                                  size="large"
                                  color="success"
                                  onClick={handleOKButtonClick}
                                  className={styles.modalOkButton}
                                >
                                  OK
                                </Button>
                              </Typography>
                            </Box>
                          </Modal>

                          <Modal open={openModal2} onClose={handleCloseModal2}>
                            <Box className={styles.modalBox}>
                              <HelpOutlineOutlinedIcon
                                className={styles.modalIcon}
                                color="warning"
                              />
                              <Typography variant="h6">
                                Are you sure to Reject the Redeem Request?
                              </Typography>
                              <TextareaAutosize
                                minRows={10}
                                placeholder="Enter Rejection Reason"
                                style={{ width: 400 }}
                                value={rejectionReason}
                                onBlur={handleTextareaChange}
                              />
                              <Typography>
                                <Button
                                  variant="contained"
                                  size="large"
                                  color="success"
                                  onClick={handleOKButtonClick}
                                  className={styles.modalOkButton}
                                >
                                  OK
                                </Button>
                              </Typography>
                            </Box>
                          </Modal>
                        </StyledTableCell>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={18} align="center">
                      <Box className={styles.noRecordsBox}>
                        <InfoOutlinedIcon className={styles.noRecordsIcon} />
                        <Typography className={styles.noRecordsText}>
                          No Records Found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <StyledTablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid #e0e0e0",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "0 0 16px 16px",
              "& .MuiTablePagination-select": {
                minWidth: "80px",
              },
              "& .MuiTablePagination-menu": {
                "& .MuiPaper-root": {
                  maxHeight: "200px",
                },
              },
              "& .MuiTablePagination-selectRoot": {
                marginRight: "32px",
              },
              "& .MuiTablePagination-toolbar": {
                minHeight: "52px",
              },
            }}
          />
        </Grid>

        <Grid
          container
        // sx={{ background: "#FFF" }}
        ></Grid>
      </Grid>
    </main>
  );
};
export default IncomeTransactions;
