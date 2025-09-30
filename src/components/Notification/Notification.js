import {
  Box,
  Button,
  Divider,
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
import {  useState } from "react";
import * as React from "react";
import Link from "next/link";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";


const NotificationTransactions = ({ showServiceTrans }) => {
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter(row => {
    return (
      (row.app_name && row.app_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.notification_type && row.notification_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.body && row.body.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.created_on && row.created_on.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
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
      "&:last-child": {
        borderRight: "1px solid #e3e3e3",
      },
    },
    "&:first-of-type": {
      borderTopLeftRadius: 6,
    },
    "&:last-of-type": {
      borderTopRightRadius: 6,
      borderRight: "1px solid #e3e3e3",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: "8px 8px",
      borderRight: "1px solid #e3e3e3",
      "&:last-child": {
        borderRight: "1px solid #e3e3e3",
      },
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const handleLinkClick = (img) => {
    window.open(img, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          <Grid>
            {/* <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'left'}  mb={1} style={{width: '10%', float:'right'}} >
                            <Button variant="contained" href={`/add-new-notification/`}>
                               Add New
                            </Button>
                    </Box> */}
          </Grid>
          <TableContainer component={Paper} exportButton={true}>
            <Divider />
            <Table
              aria-label="User Transaction Summary Table"
              exportButton={true}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    SI No.
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    App Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Notification Type
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Title
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Body
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Image
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Date
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Status
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  (rowsPerPage > 0
                    ? filteredRows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : filteredRows
                  ).map((row, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell>
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell>{row.app_name}</StyledTableCell>
                      <StyledTableCell>{row.notification_type}</StyledTableCell>

                      <StyledTableCell>{row.title}</StyledTableCell>
                      <StyledTableCell>{row.body}</StyledTableCell>
                      {/* <StyledTableCell>{row.image}</StyledTableCell> */}
                      <StyledTableCell>
                        <Link
                          href="#"
                          onClick={() => handleLinkClick(row.image)}
                        >
                          View Image
                        </Link>
                      </StyledTableCell>

                      <StyledTableCell>{row.created_on}</StyledTableCell>

                      <StyledTableCell
                        style={{ color: row.status === 0 ? "Blue" : "Green" }}
                      >
                        {" "}
                        {row.status === 0 ? "Pending" : "SUccess"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ "& button": { m: 1 } }}>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          onClick={() => handleOpenModal1(row.id, 1)}
                        >
                          Reshoot
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                       <TableCell
                      colSpan={17}
                      align="center"
                      style={{
                        height: 120,
                        width: "100%",
                        background: "#fff",
                        border: "none",
                      }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <InfoOutlinedIcon
                          sx={{ color: "#F44336", fontSize: 36, mb: 1 }}
                        />
                        <Typography
                          color="#F44336"
                          fontWeight="bold"
                          fontSize={18}
                        >
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
              marginTop: "32px",
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
              "& .MuiTablePagination-spacer": {
                flex: "none",
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
export default NotificationTransactions;
