import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Typography,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Stack,
    Avatar,
    List,
    ListItem,
    ListItemText,
    Divider,
    useTheme
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import API from "../../../utils/api"
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4223';
import { useRouter } from 'next/router'; // at the top of your file


const IdActivationHistoryScreen = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const theme = useTheme();

    useEffect(() => {
        fetchPrimeRequests();
    }, []);
    const router = useRouter(); // initialize router

    const fetchPrimeRequests = async () => {
        try {
            setLoading(true);

            // Get userId from sessionStorage
            const userId = sessionStorage.getItem("id");
            if (!userId) {
                console.error('User ID not found in sessionStorage');
                setRequests([]);
                setLoading(false);
                return;
            }

            // Call API with userId
            const response = await API.get(`/api/userrequest/${userId}`);

            console.log("response ", response)
            setRequests(response.data.data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };


    const formatToIndianTime = (utcString) => {
        if (!utcString) return '-';
        try {
            const utcDateTime = new Date(utcString);
            const istDateTime = new Date(utcDateTime.getTime() + (5 * 60 + 30) * 60000);

            return istDateTime.toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return utcString;
        }
    };

    const getStatusInfo = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'approved':
                return {
                    color: theme.palette.success.main,
                    icon: <CheckCircleIcon />,
                    bgcolor: theme.palette.success.light,
                    text: 'Approved'
                };
            case 'rejected':
                return {
                    color: theme.palette.error.main,
                    icon: <CancelIcon />,
                    bgcolor: theme.palette.error.light,
                    text: 'Rejected'
                };
            default:
                return {
                    color: theme.palette.warning.main,
                    icon: <PendingIcon />,
                    bgcolor: theme.palette.warning.light,
                    text: 'Pending'
                };
        }
    };

    const handleShowDetails = (request) => {
        setSelectedRequest(request);
        setDetailDialogOpen(true);
    };

    const handleShowImage = (imageUrl) => {
        setSelectedImage(`${BASE_URL}${imageUrl}`);
        setImageDialogOpen(true);
    };

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
            >
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                    Loading your requests...
                </Typography>
            </Box>
        );
    }

    if (requests.length === 0) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
            >
                <ImageIcon sx={{ fontSize: 80, color: 'grey.300' }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600, color: 'grey.600' }}>
                    No requests found
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.500' }}>
                    You havent made any prime requests yet
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
            {/* Header */}
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    boxShadow: 1,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)'
                }}
            >
                <Typography
                    variant="h5"
                    align="center"
                    sx={{ fontWeight: 600, color: 'white' }} // use white text on gradient
                >
                    My Prime Requests
                </Typography>
            </Box>


            {/* Refresh Button */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {/* Back Button */}
                <Button
                    variant="outlined"
                    onClick={() => router.push('/id-activation')} // navigate to ID Activation page
                >
                    Back
                </Button>

                {/* Refresh Button */}
                <Button
                    startIcon={<RefreshIcon />}
                    onClick={fetchPrimeRequests}
                    variant="outlined"
                >
                    Refresh
                </Button>
            </Box>


            {/* Requests List */}
            <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                    {requests.map((request, index) => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            index={index}
                            onShowDetails={handleShowDetails}
                            onShowImage={handleShowImage}
                            formatToIndianTime={formatToIndianTime}
                            getStatusInfo={getStatusInfo}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Details Dialog */}
            <DetailsDialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                request={selectedRequest}
                formatToIndianTime={formatToIndianTime}
            />

            {/* Image Dialog */}
            <ImageDialog
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                imageUrl={selectedImage}
            />
        </Box>
    );
};

// Request Card Component
const RequestCard = ({ request, onShowImage, formatToIndianTime, getStatusInfo }) => {
    const statusInfo = getStatusInfo(request.status);

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'grey.200',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                },
                bgcolor: "#f2e0c74d" // background color based on status
            }}
            onClick={() => { }}
        >
            <Box sx={{ display: 'flex', p: 2, gap: 2, flexWrap: 'wrap' }}>
                {/* Left Block: Info */}
                <Box sx={{ flex: 1, minWidth: 250 }}>
                    <Stack spacing={1.5}>
                        <DetailRow label="Activation ID" value={request.id} />
                        <DetailRow label="Status" value={
                            <Typography component="span" sx={{ fontWeight: 600, color: statusInfo.color }}>
                                {statusInfo.text}
                            </Typography>
                        } />
                        <DetailRow label="Date" value={formatToIndianTime(request.createdAt)} />
                        <DetailRow label="Amount" value={`₹${request.amount || '-'}`} />
                        <DetailRow label="Remark" value={request.remark || '-'} multiline />
                        {request.reason && (
                            <DetailRow label="Reason" value={
                                <Typography component="span" sx={{ color: 'error.main' }}>
                                    {request.reason}
                                </Typography>
                            } />
                        )}
                        {request.utrId && request.utrId.length > 0 && (
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'grey.700', mb: 1 }}>
                                    UTR IDs:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {request.utrId.map((utr, idx) => (
                                        <Chip key={idx} label={utr} size="small" />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Stack>
                </Box>

                {/* Right Block: Attachments */}
                {request.images && request.images.length > 0 && (
                    <Box sx={{ minWidth: 150, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'grey.700' }}>
                            Attachments:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {request.images.map((img, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'grey.300',
                                        overflow: 'hidden',
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShowImage(img);
                                    }}
                                >
                                    <img
                                        src={`${BASE_URL}${img}`}
                                        alt={`Attachment ${idx + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Card>
    );
};


// Detail Row Component
// Detail Row Component
const DetailRow = ({ label, value, multiline = false }) => (
    <Box display="flex" alignItems={multiline ? 'flex-start' : 'center'}>
        <Typography
            variant="body2"
            sx={{
                color: '#333',        // changed label color to black
                fontWeight: 400,
                minWidth: 80
            }}
        >
            {label}:
        </Typography>
        <Typography
            variant="body2"
            sx={{
                color: 'grey.800',
                fontWeight: 600,
                ml: 2,
                flex: 1,
                ...(multiline && { wordBreak: 'break-word' })
            }}
        >
            {value}
        </Typography>
    </Box>
);

// Details Dialog Component
const DetailsDialog = ({ open, onClose, request, formatToIndianTime }) => {
    if (!request) return null;

    const statusInfo = {
        approved: { color: 'success.main', text: 'Approved' },
        rejected: { color: 'error.main', text: 'Rejected' },
        pending: { color: 'warning.main', text: 'Pending' }
    }[request.status?.toLowerCase()] || { color: 'warning.main', text: 'Pending' };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Request Details - ID: {request.id}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <DetailRow label="Status" value={
                        <Typography component="span" sx={{ color: statusInfo.color, fontWeight: 600 }}>
                            {statusInfo.text}
                        </Typography>
                    } />
                    <DetailRow label="Amount" value={`₹${request.amount || '-'}`} />
                    <DetailRow label="Date" value={formatToIndianTime(request.createdAt)} />
                    <DetailRow label="Remark" value={request.remark || '-'} />

                    {request.reason && (
                        <DetailRow
                            label="Reason"
                            value={
                                <Typography component="span" sx={{ color: 'error.main' }}>
                                    {request.reason}
                                </Typography>
                            }
                        />
                    )}

                    {request.utrId && request.utrId.length > 0 && (
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'grey.700', mb: 1 }}>
                                UTR IDs:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {request.utrId.map((utr, idx) => (
                                    <Chip key={idx} label={utr} size="small" />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

// Image Dialog Component
const ImageDialog = ({ open, onClose, imageUrl }) => (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        objectFit: 'contain'
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            ) : (
                <Box textAlign="center" p={4}>
                    <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                    <Typography variant="h6" sx={{ mt: 2, color: 'grey.600' }}>
                        Failed to load image
                    </Typography>
                </Box>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

export default IdActivationHistoryScreen;