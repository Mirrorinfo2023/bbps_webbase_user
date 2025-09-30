"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { ContentCopy, Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
// import { DatePicker, LocalizationProvider, AdapterDayjs } from "@mui/x-date-pickers";
import api from "../../utils/api";
import CreateMeetingDialog from "./CreateMeetingDialog";
import EditMeetingDialog from "./EditMeetingDialog";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

export default function ZohoMeetingPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs().endOf("month"));


  const [openCreate, setOpenCreate] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/meeting/6a6b430a42c06b39a979950519f8d6732aeba6ea", {
        from_date: fromDate.format("YYYY-MM-DD"),
        to_date: toDate.format("YYYY-MM-DD"),
      });
      if (res.data.status === 200) setMeetings(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      const res = await api.post("/api/meeting/delete-meeting", { meetingId: id });
      if (res.data.status === 200) {
        alert("Meeting deleted successfully!");
        fetchMeetings();
      } else alert(res.data.message || "Failed to delete meeting");
    } catch (err) {
      console.error(err);
      alert("Error deleting meeting");
    }
  };

  const handleEditOpen = (meeting) => setEditingMeeting(meeting);

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Typography variant="h6">Meeting Reports</Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="From Date" value={fromDate} onChange={setFromDate} />
                  <DatePicker label="To Date" value={toDate} onChange={setToDate} />
                </LocalizationProvider>
                <Button variant="contained" onClick={fetchMeetings}>Search</Button>
                <Button variant="contained" color="secondary" onClick={() => setOpenCreate(true)}>Create Meeting</Button>
              </Box>
            </Box>

            <TableContainer sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}> {/* light grey background */}
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Link</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
                  ) : meetings.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">No meetings found.</TableCell></TableRow>
                  ) : (
                    meetings.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell>{m.description}</TableCell>
                        <TableCell>{m.meeting_date}</TableCell>
                        <TableCell>{m.meeting_time}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography sx={{ wordBreak: "break-all" }} color="primary">{m.meeting_link}</Typography>
                            {m.meeting_link && <IconButton onClick={() => copyLink(m.meeting_link)}><ContentCopy fontSize="small" /></IconButton>}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEditOpen(m)}><Edit /></IconButton>
                          <IconButton color="error" onClick={() => handleDelete(m.id)}><Delete /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Create & Edit Dialogs */}
      <CreateMeetingDialog open={openCreate} onClose={() => setOpenCreate(false)} refresh={fetchMeetings} />
      {editingMeeting && (
        <EditMeetingDialog
          open={!!editingMeeting}
          onClose={() => setEditingMeeting(null)}
          meeting={editingMeeting}
          refresh={fetchMeetings}
        />
      )}
    </Layout>
  );
}
