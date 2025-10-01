import { useState } from 'react';
import {
    Box,
    Typography,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import api from '../../utils/api'; // your API util
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

export default function DeactivateAccount({ userId }) {
    const [deactivateSwitch, setDeactivateSwitch] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [reason, setReason] = useState('');

    const handleSwitchChange = (event) => {
        if (event.target.checked) {
            // Open modal when switching ON
            setOpenDialog(true);
        } else {
            // Optional: allow reactivation immediately
            setDeactivateSwitch(false);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setDeactivateSwitch(false); // Reset switch if dialog canceled
        setReason('');
    };

    const handleDeactivate = async () => {
        try {
            // Prepare payload
            const payload = {
                user_id: userId,
                status: 0,
                reason
            };

            console.log("payload ", payload)
            const encReq = DataEncrypt(JSON.stringify(payload));

            const res = await api.post('/api/users/2f1152a7869df19b1a583f4a971291ddcf413ce3', { encReq });

            let decrypted = DataDecrypt(res.data);
            if (typeof decrypted === 'string') decrypted = JSON.parse(decrypted);

            if (decrypted.status === 200) {
                alert('Account deactivated successfully!');
                setOpenDialog(false);
                setDeactivateSwitch(true);
            } else {
                alert('Failed to deactivate account: ' + decrypted.message);
            }
        } catch (err) {
            console.error('Error deactivating account:', err);
            alert('Something went wrong while deactivating account.');
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#FEF7FF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                // maxWidth: 500,
                width: "70%",
                mx: 'auto'
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: '#d32f2f',
                    mb: 3,
                    textAlign: 'center'
                }}
            >
                Deactivate Account
            </Typography>

            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={1}
                sx={{
                    border: '1px solid #f5c6cb',
                    borderRadius: 2,
                    backgroundColor: deactivateSwitch ? '#f8d7da' : '#e2f0d9'
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 500,
                        color: deactivateSwitch ? '#721c24' : '#155724'
                    }}
                >
                    {deactivateSwitch ? 'Account Deactivated' : 'Active Account'}
                </Typography>
                <Switch
                    checked={deactivateSwitch}
                    onChange={handleSwitchChange}
                    color="error"
                    sx={{
                        '& .MuiSwitch-thumb': {
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }
                    }}
                />
            </Box>

            {/* Dialog for reason */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Deactivate Account</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Please tell us the reason for deactivating your account:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason..."
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#f9f9f9'
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDialogClose} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeactivate}
                        variant="contained"
                        color="error"
                        disabled={!reason.trim()}
                        sx={{ fontWeight: 'bold' }}
                    >
                        Deactivate
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
}
