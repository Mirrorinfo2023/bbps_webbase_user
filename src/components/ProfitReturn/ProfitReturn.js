import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Link from "next/link";
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from "./ProfitReturn.module.css";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px 0 rgba(33,150,243,0.08)',
    marginTop: 16,
    marginBottom: 16,
    overflow: 'hidden',
}));

const ThemedTableHeadCell = styled(TableCell)(({ theme }) => ({
    background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    padding: 10,
    borderRight: '1px solid #e3e3e3',
    letterSpacing: 1,
    textTransform: 'uppercase',
}));

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        background: '#f5faff',
    },
}));

const NoRecordsBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f44336',
    fontWeight: 600,
    fontSize: 18,
    padding: '32px 0',
    width: '100%',
    gap: 8,
});

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    '.MuiTablePagination-select': {
        color: '#2196f3',
        fontWeight: 600,
        paddingRight: '24px',
    },
    '.MuiTablePagination-selectLabel': {
        color: '#666',
        fontWeight: 500,
    },
    '.MuiTablePagination-displayedRows': {
        color: '#666',
        fontWeight: 500,
    },
    '.MuiTablePagination-actions': {
        '.MuiIconButton-root': {
            color: '#2196f3',
            '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
            },
            '&.Mui-disabled': {
                color: '#ccc',
            },
        },
    },
    '.MuiTablePagination-selectIcon': {
        color: '#2196f3',
    },
    '.MuiTablePagination-menuItem': {
        padding: '4px 16px',
    },
    '.MuiTablePagination-selectRoot': {
        marginRight: '32px',
    },
    '.MuiTablePagination-toolbar': {
        minHeight: '52px',
        padding: '0 16px',
        flexWrap: 'wrap',
        gap: '4px',
    },
    '.MuiTablePagination-spacer': {
        flex: 'none',
    },
}));

const ProfitTransactions = ({ showServiceTrans }) => {

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
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    const rowsPerPageOptions = [5, 10, 25];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#ccc',
            color: theme.palette.common.black,
            fontSize: 12,
            linHeight: 15,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            linHeight: 15,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
    }));


    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
    const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));


    const [formattedDate, setFormattedDate] = useState('');


    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [openModal3, setOpenModal3] = React.useState(false);
    const [Id, setId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    // const [rejectionReason, setRejectionReason] = useState(null);

    const handleOpenModal1 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal1(true);
    };

    const handleOpenModal3 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal3(true);
    };

    const handleCloseModal1 = () => {
        setId(null);
        setStatus(null);
        setOpenModal1(false);
    };

    const handleOpenModal2 = (Id, status) => {
        setId(Id);

        setStatus(status);
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
    };

    const handleCloseModal3 = () => {
        setOpenModal3(false);
    };

    const handleOKButtonClick = async () => {
        // alert(status);
        if (!Id) {
            console.error('Id is missing.');
            return;
        }
        let note = '';
        let action = '';
        if (status === 0) {
            action = 'Delete';

        } else if (status === 1) {

            action = 'Active';
        }
        else {
            action = 'Inactive';
        }

        const requestData = {
            status: status,
            id: Id,
            action: action
        };

        try {

            const response = await api.post("/api/banner/update-banner-status", requestData);

            if (response.data.status === 200) {
                alert(response.data.message);
                location.reload();

            } else {
                alert('Failed to update');
                console.log('Failed to update status.');

            }
        } catch (error) {
            console.error("Error:", error);

        }

        handleCloseModal1();
        handleCloseModal2();
        handleCloseModal3();
    };

    const handleLinkClick = (img) => {

        window.open(img, '_blank', 'noopener,noreferrer');
    };

    return (

        <main className="p-6 space-y-6">
            <Grid container spacing={4} className={styles.container}>
                <Grid item xs={12}>
                    <TableContainer className={styles.tableContainer}>
                        <Table aria-label="Banners Report" className={styles.table}>
                            <TableHead>
                                <TableRow className={styles.tableHeadRow}>
                                    <TableCell>Sl No.</TableCell>
                                    <TableCell>App Name</TableCell>
                                    <TableCell>Banner Category</TableCell>
                                    <TableCell>Banner Used For</TableCell>
                                    <TableCell>Banners Title</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.length > 0 ? (
                                    (rowsPerPage > 0
                                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : rows
                                    ).map((row, index) => (
                                        <TableRow key={index} className={styles.tableRow}>
                                            <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                            <TableCell>{row.app_name || "-"}</TableCell>
                                            <TableCell>{row.category}</TableCell>
                                            <TableCell>{row.banner_for}</TableCell>
                                            <TableCell>{row.title}</TableCell>
                                            <TableCell>
                                                <Link href="#" onClick={() => handleLinkClick(row.img)}>
                                                    View Image
                                                </Link>
                                            </TableCell>
                                            <TableCell>{row.created_on}</TableCell>
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
                                                    ? "Active"
                                                    : row.status === 2
                                                        ? "Inactive"
                                                        : "Deleted"}
                                            </TableCell>
                                            <TableCell className={styles.actionButtons}>
                                                {/* Add action buttons here */}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <div className={styles.noRecordsBox}>
                                                <InfoOutlinedIcon color="error" sx={{ fontSize: 28 }} />
                                                <div className={styles.noRecordsText}>
                                                    No Records Found.
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className={styles.tablePagination}
                    />
                </Grid>
            </Grid>
        </main>
    )
}
export default ProfitTransactions;