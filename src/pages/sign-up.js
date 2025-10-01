import React, { useState } from "react";
import {
    Grid,
    TextField,
    Button,
    Typography,
    MenuItem,
    InputAdornment,
    Box,
    Container,
    Alert,
    Snackbar,
    Autocomplete,
    Card,
    useTheme,
    useMediaQuery,
    CircularProgress
} from "@mui/material";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import axios from "axios";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import TagIcon from "@mui/icons-material/Tag";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function SignUpPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState({
        referred_by: "",
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        mobile: "",
        password: "",
        pincode: "",
        postOfficeName: "",
        circle: "",
        district: "",
        division: "",
        region: "",
        dob: "",
        state: "",
        city: "",
        address: ""
    });
    const [postOffices, setPostOffices] = useState([]);
    const [errors, setErrors] = useState({});
    const [referralStatus, setReferralStatus] = useState(null);
    const [loadingReferral, setLoadingReferral] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "referred_by") setReferralStatus(null);

        if (name === "pincode" && value.length === 6) {
            handleFetchAddress(value);
        }
    };

    const validateForm = () => {
        let tempErrors = {};

        if (!formData.first_name.trim()) tempErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) tempErrors.last_name = "Last name is required";
        if (!formData.username.trim()) tempErrors.username = "Username is required";

        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Enter a valid email";
        }

        if (!formData.mobile) {
            tempErrors.mobile = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
            tempErrors.mobile = "Enter a valid 10-digit mobile number";
        }

        if (!formData.password) {
            tempErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.pincode) {
            tempErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
            tempErrors.pincode = "Enter a valid 6-digit pincode";
        }

        if (!formData.state) tempErrors.state = "State is required";
        if (!formData.city) tempErrors.city = "City is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!formData.dob.trim()) tempErrors.dob = "Date of Birth is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleFetchAddress = async (pincode) => {
        if (!pincode || pincode.trim() === "") {
            showSnackbar("Please enter a valid pincode", "error");
            return;
        }

        try {
            const encReq = DataEncrypt(JSON.stringify({ pincode }));
            const res = await api.post(
                "/api/pincode/916e4eb592f2058c43a3face75b0f9d49ef2bd17",
                { encReq },
                { headers: { "Content-Type": "application/json" } }
            );

            const pincodeData = DataDecrypt(res.data);
            console.log("pincodeData is ", pincodeData);

            if (pincodeData?.status === 200 && pincodeData?.data?.length > 0) {
                const officeList = pincodeData.data;
                const firstOffice = officeList[0];

                const fullAddress = `${firstOffice.Office_name || ""}, ${firstOffice.District || ""}, ${firstOffice.State || ""} - ${firstOffice.Pincode || ""}`;

                setFormData((prev) => ({
                    ...prev,
                    postOfficeName: firstOffice.Office_name?.trim() || "",
                    circle: firstOffice.Circle?.trim() || "",
                    district: firstOffice.District?.trim() || "",
                    division: firstOffice.Division?.trim() || "",
                    region: firstOffice.Region?.trim() || "",
                    state: firstOffice.State?.trim() || "",
                    city: firstOffice.District?.trim() || "",
                    address: fullAddress.trim(),
                }));

                setPostOffices(officeList);
                showSnackbar("Address fetched successfully!", "success");
            } else {
                showSnackbar("No address found for this pincode", "error");
            }

        } catch (error) {
            console.error("Failed to fetch address:", error);
            showSnackbar("Failed to fetch address. Please try again.", "error");
        }
    };

    const handleVerifyReferral = async () => {
        if (!formData.referred_by) {
            setErrors((prev) => ({ ...prev, referred_by: "Referral ID is required" }));
            return;
        }
        setLoadingReferral(true);
        try {
            const encReferral = DataEncrypt(
                JSON.stringify({ mlm_id: formData.referred_by })
            );

            const response = await api.post(
                "/api/users/9a82bc2234a56504434ce88e3ab2a11f34b0dcc8",
                { encReq: encReferral },
                { headers: { "Content-Type": "application/json" } }
            );

            const decrypted = DataDecrypt(response.data);
            console.log("Referral verified:", decrypted);

            if (decrypted.status === 200 && decrypted.data?.name) {
                setReferralStatus({ success: true, name: decrypted.data.name });
                setErrors((prev) => ({ ...prev, referred_by: "" }));
                showSnackbar("Referral verified successfully!", "success");
            } else {
                setReferralStatus({ success: false, message: decrypted.message || "Invalid referral ID" });
                showSnackbar("Invalid referral ID", "error");
            }
        } catch (error) {
            console.error("Referral verification failed:", error);
            setReferralStatus({ success: false, message: "Verification failed. Try again." });
            showSnackbar("Referral verification failed", "error");
        } finally {
            setLoadingReferral(false);
        }
    };

    const handleCreateUser = async () => {
        if (!validateForm()) return;

        if (!referralStatus?.success) {
            showSnackbar("Please verify a valid referral ID before registering.", "error");
            return;
        }

        setLoadingSubmit(true);
        try {
            const payload = { ...formData };
            const encReq = DataEncrypt(JSON.stringify(payload));

            const response = await api.post(
                "/api/users/13a2828b3adecc1c32ea3888d08afa51e147b3f3",
                { encReq },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ Registration Success:", response.message);
            showSnackbar("User registered successfully!", "success");

            // Reset form
            setFormData({
                referred_by: "",
                first_name: "",
                last_name: "",
                username: "",
                email: "",
                mobile: "",
                password: "",
                pincode: "",
                postOfficeName: "",
                circle: "",
                district: "",
                division: "",
                region: "",
                dob: "",
                state: "",
                city: "",
                address: ""
            });
            setErrors({});
            setReferralStatus(null);
            setPostOffices([]);

        } catch (error) {
            let decryptedError = error.response?.data;
            try {
                decryptedError = DataDecrypt(error.response.data);
            } catch (e) {
                console.warn("⚠️ Could not decrypt error response:", e);
            }
            console.error("❌ Registration Failed:", decryptedError);
            showSnackbar(
                `Registration failed: ${decryptedError?.message || error.message}`,
                "error"
            );
        } finally {
            setLoadingSubmit(false);
        }
    };

    const setOfficeData = (office) => {
        if (!office) return;

        const fullAddress = `${office.Office_name}, ${office.District}, ${office.State} - ${office.Pincode}`;

        setFormData((prev) => ({
            ...prev,
            postOfficeName: office.Office_name,
            circle: office.Circle?.trim() || prev.circle,
            district: office.District?.trim() || prev.district,
            division: office.Division?.trim() || prev.division,
            region: office.Region?.trim() || prev.region,
            state: office.State?.trim() || prev.state,
            city: office.District?.trim() || prev.city,
            address: fullAddress,
        }));
    };

    const handleSelectPostOffice = (name) => {
        const office = postOffices.find((o) => o.Office_name === name);
        setOfficeData(office);
    };

    const handleSelectAddress = (address) => {
        const office = postOffices.find(
            (o) =>
                `${o.Office_name}, ${o.District}, ${o.State} - ${o.Pincode}` === address
        );
        if (office) {
            setOfficeData(office);
        } else {
            setFormData((prev) => ({ ...prev, address }));
        }
    };

    const smallInputProps = (icon) => ({
        size: "small",
        InputProps: {
            startAdornment: (
                <InputAdornment position="start">
                    {React.cloneElement(icon, {
                        fontSize: "small",
                        sx: {
                            fontSize: 18,
                            color: theme.palette.primary.main
                        }
                    })}
                </InputAdornment>
            ),
        },
        sx: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                },
            }
        }
    });

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: isMobile ? 2 : 4,
            px: isMobile ? 1 : 0,
            display: 'flex',
            alignItems: 'center'
        }}>
            <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 2 }}>
                <Card sx={{
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.95)'
                }}>
                    {/* Header */}
                    <Box sx={{
                        background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                        color: 'white',
                        py: isMobile ? 2 : 3,
                        px: isMobile ? 2 : 4,
                        textAlign: 'center'
                    }}>
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                fontSize: isMobile ? '1.5rem' : '2rem'
                            }}
                        >
                            Create New Account
                        </Typography>
                        <Typography
                            variant={isMobile ? "body1" : "h6"}
                            sx={{
                                opacity: 0.9,
                                fontWeight: 300,
                                fontSize: isMobile ? '0.9rem' : '1.1rem'
                            }}
                        >
                            Join Mirror Hub Community
                        </Typography>
                    </Box>

                    {/* Form Content */}
                    <Box sx={{
                        p: isMobile ? 2 : 4,
                        maxHeight: isMobile ? '70vh' : 'none',
                        overflowY: isMobile ? 'auto' : 'visible'
                    }}>
                        <Grid container spacing={isMobile ? 2 : 3}>
                            {/* First Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="first_name"
                                    label="First Name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    {...smallInputProps(<PersonIcon />)}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name}
                                />
                            </Grid>

                            {/* Last Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="last_name"
                                    label="Last Name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    {...smallInputProps(<PersonIcon />)}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name}
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    {...smallInputProps(<EmailIcon />)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>

                            {/* Password */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    {...smallInputProps(<LockIcon />)}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                            </Grid>

                            {/* Username */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="username"
                                    label="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    {...smallInputProps(<AccountCircleIcon />)}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                />
                            </Grid>

                            {/* Mobile */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="mobile"
                                    label="Mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    {...smallInputProps(<PhoneIcon />)}
                                    error={!!errors.mobile}
                                    helperText={errors.mobile}
                                />
                            </Grid>

                            {/* Date of Birth */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="dob"
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    {...smallInputProps(<CalendarTodayIcon />)}
                                    error={!!errors.dob}
                                    helperText={errors.dob}
                                />
                            </Grid>

                            {/* Referral ID + Verify button */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="referred_by"
                                    label="Referral ID"
                                    value={formData.referred_by}
                                    onChange={handleInputChange}
                                    size="small"
                                    error={!!errors.referred_by}
                                    helperText={errors.referred_by}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TagIcon fontSize="small" sx={{
                                                    fontSize: 18,
                                                    color: theme.palette.primary.main
                                                }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={handleVerifyReferral}
                                                    disabled={loadingReferral}
                                                    sx={{
                                                        height: "30px",
                                                        minWidth: isMobile ? "70px" : "80px",
                                                        backgroundColor:
                                                            referralStatus?.success
                                                                ? "#4caf50"
                                                                : referralStatus?.success === false
                                                                    ? "#f44336"
                                                                    : "#2196f3",
                                                        color: "#fff",
                                                        fontSize: isMobile ? "0.7rem" : "0.75rem",
                                                        textTransform: "none",
                                                        borderRadius: 1,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                referralStatus?.success
                                                                    ? "#45a049"
                                                                    : referralStatus?.success === false
                                                                        ? "#da190b"
                                                                        : "#1976d2",
                                                        }
                                                    }}
                                                >
                                                    {loadingReferral ?
                                                        <CircularProgress size={16} color="inherit" />
                                                        : "Verify"
                                                    }
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {referralStatus?.success && (
                                    <Typography sx={{
                                        color: "green",
                                        mt: 0.5,
                                        fontSize: "0.75rem",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                         Valid: {referralStatus.name}
                                    </Typography>
                                )}
                                {referralStatus?.success === false && (
                                    <Typography sx={{
                                        color: "red",
                                        mt: 0.5,
                                        fontSize: "0.75rem",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                         {referralStatus.message || "Invalid referral ID"}
                                    </Typography>
                                )}
                            </Grid>

                            {/* Pincode */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="pincode"
                                    label="Pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    {...smallInputProps(<LocationOnIcon />)}
                                    error={!!errors.pincode}
                                    helperText={errors.pincode}
                                />
                            </Grid>

                            {/* State */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="state"
                                    label="State"
                                    value={formData.state}
                                    InputProps={{ readOnly: true }}
                                    {...smallInputProps(<PublicIcon />)}
                                    error={!!errors.state}
                                    helperText={errors.state}
                                />
                            </Grid>

                            {/* Post Office Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Post Office Name"
                                    value={formData.postOfficeName || ""}
                                    onChange={(e) => handleSelectPostOffice(e.target.value)}
                                    {...smallInputProps(<HomeIcon />)}
                                    error={!!errors.postOfficeName}
                                    helperText={errors.postOfficeName}
                                >
                                    {postOffices.map((office, index) => (
                                        <MenuItem key={index} value={office.Office_name}>
                                            {office.Office_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* City */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="city"
                                    label="City"
                                    value={formData.city}
                                    InputProps={{ readOnly: true }}
                                    {...smallInputProps(<LocationCityIcon />)}
                                    error={!!errors.city}
                                    helperText={errors.city}
                                />
                            </Grid>

                            {/* Address */}
                            <Grid item xs={12}>
                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    options={postOffices.map(
                                        (o) => `${o.Office_name}, ${o.District}, ${o.State} - ${o.Pincode}`
                                    )}
                                    value={formData.address || ""}
                                    onChange={(e, newValue) => handleSelectAddress(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Address"
                                            multiline
                                            minRows={2}
                                            maxRows={5}
                                            error={!!errors.address}
                                            helperText={errors.address}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <HomeIcon fontSize="small" sx={{
                                                            fontSize: 18,
                                                            color: theme.palette.primary.main
                                                        }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    justifyContent: 'center',
                                    flexDirection: isMobile ? 'column' : 'row'
                                }}>
                                    <Button
                                        variant="outlined"
                                        size={isMobile ? "medium" : "large"}
                                        onClick={() => window.history.back()}
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            fontSize: isMobile ? 14 : 16,
                                            px: isMobile ? 3 : 4,
                                            py: isMobile ? 1 : 1.5,
                                            textTransform: "none",
                                            borderColor: theme.palette.grey[400],
                                            color: theme.palette.grey[700],
                                            width: isMobile ? '100%' : 'auto',
                                            '&:hover': {
                                                borderColor: theme.palette.grey[600],
                                                backgroundColor: theme.palette.grey[50],
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        size={isMobile ? "medium" : "large"}
                                        onClick={handleCreateUser}
                                        disabled={loadingSubmit}
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            fontSize: isMobile ? 14 : 16,
                                            px: isMobile ? 3 : 4,
                                            py: isMobile ? 1 : 1.5,
                                            background: "linear-gradient(90deg, #4caf50 0%, #81c784 100%)",
                                            textTransform: "none",
                                            boxShadow: "0px 4px 15px rgba(76, 175, 80, 0.3)",
                                            width: isMobile ? '100%' : 'auto',
                                            "&:hover": {
                                                background: "linear-gradient(90deg, #43a047 0%, #66bb6a 100%)",
                                                boxShadow: "0px 6px 20px rgba(76, 175, 80, 0.4)",
                                            },
                                            "&:disabled": {
                                                background: theme.palette.grey[300],
                                                color: theme.palette.grey[500],
                                            }
                                        }}
                                    >
                                        {loadingSubmit ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={20} color="inherit" />
                                                Creating Account...
                                            </Box>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    mt: isMobile ? 7 : 8
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{
                        borderRadius: 2,
                        fontSize: isMobile ? '0.9rem' : '1rem'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}