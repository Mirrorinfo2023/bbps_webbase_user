import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, TextField, Button
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import api from "../../utils/api";

export default function EditMeetingDialog({ open, onClose, meeting, refresh }) {
    const [meeting_name, setMeetingName] = useState("");
    const [meeting_link, setMeetingLink] = useState("");
    const [description, setDescription] = useState("");
    const [meeting_date, setMeetingDate] = useState(dayjs());
    const [meeting_time, setMeetingTime] = useState(dayjs());
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (meeting) {
            setMeetingName(meeting.name);
            setMeetingLink(meeting.meeting_link);
            setDescription(meeting.description);
            setMeetingDate(dayjs(meeting.meeting_date, "YYYY-MM-DD"));
            setMeetingTime(dayjs(meeting.meeting_time, "HH:mm:ss"));
            setImage(null);
        }
    }, [meeting]);

    const handleUpdate = async () => {
        try {
            const res = await api.post("/api/meeting/update-meeting", {
                meetingId: meeting.id,
                meeting_name,
                meeting_link,
                description,
                meeting_date: meeting_date.format("YYYY-MM-DD"),
                meeting_time: meeting_time.format("HH:mm:ss")
            });

            if (res.data.status === 200) {
                alert("Meeting updated!");
                onClose();
                refresh();
            } else {
                alert(res.data.message || "Failed to update meeting");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update meeting");
        }
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" gap={2} mt={1}>
                    <TextField label="Meeting Name" fullWidth value={meeting_name} onChange={(e) => setMeetingName(e.target.value)} />
                    <TextField label="Meeting Link" fullWidth value={meeting_link} onChange={(e) => setMeetingLink(e.target.value)} />
                </Box>
                <Box display="flex" gap={2} mt={2}>
                    <TextField label="Description" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </Box>
                <Box display="flex" gap={2} mt={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Date" value={meeting_date} onChange={setMeetingDate} />
                        <TimePicker label="Time" value={meeting_time} onChange={setMeetingTime} />
                    </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}
