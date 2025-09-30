import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, TextField, Button
} from "@mui/material";
// import { LocalizationProvider, DatePicker, TimePicker, AdapterDayjs } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import api from "../../utils/api";

export default function CreateMeetingDialog({ open, onClose, refresh }) {
    const [meeting_name, setMeetingName] = useState("");
    const [meeting_link, setMeetingLink] = useState("");
    const [description, setDescription] = useState("");
    const [meeting_date, setMeetingDate] = useState(dayjs());
    const [meeting_time, setMeetingTime] = useState(dayjs());
    const [image, setImage] = useState(null);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("meeting_name", meeting_name);
        formData.append("meeting_link", meeting_link);
        formData.append("description", description);
        formData.append("meeting_date", meeting_date.format("YYYY-MM-DD"));
        formData.append("meeting_time", meeting_time.format("HH:mm:ss"));
        if (image) formData.append("image", image);

        try {
            const res = await api.post("/api/meeting/5cf462f2376d2a717f10a3eb66bf6294d01825b9", formData, { headers: { "Content-Type": "multipart/form-data" } });
            if (res.data.status === 201) {
                alert("Meeting created!");
                onClose();
                refresh();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create meeting");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Meeting</DialogTitle>
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
                <Button variant="contained" color="primary" onClick={handleSave}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}
