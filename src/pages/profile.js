// pages/profile.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Tabs,
    Tab,
    Container,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    InputAdornment
} from '@mui/material';
import {
    Loyalty,
    MonetizationOn,
    Share,
    AccountCircle,
    Edit,
    Receipt,
    Help,
    Settings,
    ExitToApp,
    LocationOn,
    CalendarToday,
    Person
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import AppLogo from '../../public/mirror_logo.png'
import Cookies from "js-cookie";
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '@/components/Dashboard/layout';
import api from "../../utils/api"
import { DataEncrypt, DataDecrypt } from "../../utils/encryption"
import DeactivateAccount from "./DeactivateAccount"
// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
}

export default function Profile() {
    const [userData, setUserData] = useState({});
    const [balance, setBalance] = useState({
        wallet: 0,
        cashback: 0,
        totalCashback: 0,
        referralPoints: 0
    });
    const [anchorEl, setAnchorEl] = React.useState(null);

    const router = useRouter();


    const [tabValue, setTabValue] = useState(0);
    const [pincodeData, setPincodeData] = useState({ state: '', city: '' });
    const genders = ['Male', 'Female', 'Other'];
    // Update Profile Form State
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        pincode: '',
        state: '',        // could store state_id if available
        city: '',
        postOfficeName: '',
        circle: '',
        district: '',
        division: '',
        region: '',
        birthDate: null,
        gender: '',
        address: '',
        aniversary_date: null
    });


    const handleTabChange = (event, newValue) => setTabValue(newValue);
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const id = sessionStorage.getItem('id');
        setUserId(id);
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userId = sessionStorage.getItem('id');
                if (!userId) return;

                // ----------------- Fetch Profile -----------------
                const encProfileReq = DataEncrypt(JSON.stringify({ id: userId }));
                const profileRes = await api.post(
                    '/api/users/63c6ad33e3395d611c35ed9ef749fd8fe4ae2bb4',
                    { encReq: encProfileReq }
                );
                let profileDataDecrypted = DataDecrypt(profileRes.data);
                if (typeof profileDataDecrypted === 'string') profileDataDecrypted = JSON.parse(profileDataDecrypted);

                if (!(profileDataDecrypted.status === 200 && profileDataDecrypted.data?.length > 0)) {
                    console.error('Profile not found:', profileDataDecrypted.message);
                    return;
                }

                const user = profileDataDecrypted.data[0];

                console.log("user ", user)
                // ----------------- Fetch Wallet -----------------
                const encWalletReq = DataEncrypt(JSON.stringify({ user_id: userId }));
                const walletRes = await api.post(
                    `/api/wallet/e1af0d84d643e7c955bee1ee6d03a8b9a88a07fd`,
                    { encReq: encWalletReq },
                    { headers: { "Content-Type": "application/json" } }
                );
                let walletDecrypted = DataDecrypt(walletRes.data);
                console.log("walletDecrypted ", walletDecrypted)
                if (typeof walletDecrypted === "string") walletDecrypted = JSON.parse(walletDecrypted);

                // ----------------- Set User State -----------------
                setUserData({
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    mlm_id: user.mlm_id || '',
                    mobile: user.mobile || '',
                    email: user.email || '',
                    refered_by: user.referred_by || '',
                    ref_last_name: user.ref_last_name || '',
                    ref_first_name: user.ref_first_name || '',
                    refered_mobile: user.ref_mobile || '',
                    rank: user.rank || '',
                    is_portfolio: user.is_portfolio || 0,
                    profile_pic: user.profile_pic || null
                });

                // ----------------- Set Profile Form State -----------------
                // After fetching user profile
                setProfileData({
                    firstName: user.first_name || '',
                    lastName: user.last_name || '',
                    pincode: user.pincode || '',
                    state: user.state || '',
                    city: user.city || '',
                    postOfficeName: user.postOfficeName || '',
                    circle: user.circle || '',
                    district: user.district || '',
                    division: user.division || '',
                    region: user.region || '',
                    address: user.address || '',
                    birthDate: user.dob ? new Date(user.dob) : null,
                    gender: user.gender || '',  // ⚡ important for Select
                    aniversary_date: user.aniversary_date ? new Date(user.aniversary_date) : null,
                    profile_pic_file: null,
                    profile_pic_preview: user.profile_pic || null
                });


                // ----------------- Set Balance State -----------------
                setBalance({
                    wallet: walletDecrypted.walletBalance || 0,
                    cashback: walletDecrypted.cashbackBalance || 0,
                    totalCashback: walletDecrypted.total_earning || 0,
                    referralPoints: walletDecrypted.affiliateBalance || 0,
                    affiliateBalance: walletDecrypted.affiliateBalance || 0,
                    affiliateIncome: walletDecrypted.affiliateIncome || 0,
                    todayIncome: walletDecrypted.today_income || 0,
                    primeBalance: walletDecrypted.primeBalance || 0,
                    epinWallet: walletDecrypted.epinWalletBalance || 0,
                    voucher: walletDecrypted.voucher || 0,
                    rank: walletDecrypted.rank || user.rank || '' // fallback to profile rank
                });
                // ----------------- Fetch Pincode Info if available -----------------
                if (user.pincode) {
                    const encReq = DataEncrypt(JSON.stringify({ pincode: user.pincode }));
                    const res = await api.post(
                        "/api/pincode/916e4eb592f2058c43a3face75b0f9d49ef2bd17",
                        { encReq },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    let decrypted = DataDecrypt(res.data);
                    if (typeof decrypted === 'string') decrypted = JSON.parse(decrypted);

                    if (decrypted.status === 200 && decrypted.data.length > 0) {
                        const pincodeInfo = decrypted.data[0];

                        const fullAddress = [
                            pincodeInfo.Office_name,
                            pincodeInfo.Division,
                            pincodeInfo.District,
                            pincodeInfo.State,
                            pincodeInfo.Pincode
                        ].filter(Boolean).join(', ');

                        setProfileData(prev => ({
                            ...prev,
                            state: pincodeInfo.State || '',
                            city: pincodeInfo.District || '',
                            circle: pincodeInfo.Circle || '',
                            division: pincodeInfo.Division || '',
                            postOfficeName: pincodeInfo.Office_name || '',
                            region: pincodeInfo.Region || '',
                            address: fullAddress || '',
                        }));
                    }
                }


                // ----------------- Update sessionStorage -----------------
                Object.entries(user).forEach(([key, value]) => {
                    sessionStorage.setItem(key, value ?? '');
                });

            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        }

        fetchUserData();
    }, []);


    // Add this inside the Profile component
    const handleProfilePicClick = () => {
        document.getElementById('profilePicInput').click();
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0]; // <-- get the first file
        if (file) {
            setProfileData(prev => ({
                ...prev,
                profile_pic_file: file,
                profile_pic_preview: URL.createObjectURL(file)
            }));
            console.log("Selected file:", file); // Check here
        } else {
            console.log("No file selected!");
        }
    };


    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            const userId = sessionStorage.getItem('id');
            if (!userId) return alert("User not found");

            const payload = {
                user_id: userId,
                pincode: profileData.pincode || '',
                postOfficeName: profileData.postOfficeName || '',
                circle: profileData.circle || '',
                district: profileData.district || '',
                division: profileData.division || '',
                region: profileData.region || '',
                dob: profileData.birthDate ? profileData.birthDate.toISOString().split('T')[0] : null,
                address: profileData.address || '',
                aniversary_date: profileData.aniversary_date || null,
                gender: profileData.gender || ''
            };

            if (!profileData.profile_pic_file) {
                // No file → send JSON
                console.log("Sending JSON payload:", payload);
                const res = await api.post(
                    '/api/users/978d91c8d62d882a00631e74fa6c6863616ebc13',
                    payload,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                const data = res.data;
                if (data.status === 200) {
                    alert("Profile updated successfully!");
                    Object.entries(payload).forEach(([key, value]) => sessionStorage.setItem(key, value));
                } else {
                    alert("Failed to update profile: " + (data.message || "Unknown error"));
                }
            } else {
                // File exists → send FormData
                const formData = new FormData();
                formData.append("img", profileData.profile_pic_file);  // 👈 must match backend

                Object.entries(payload).forEach(([key, value]) =>
                    formData.append(key, value ?? "")
                );

                // Debug log FormData
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }

                const res = await api.post(
                    '/api/users/978d91c8d62d882a00631e74fa6c6863616ebc13',
                    formData
                );
                const data = res.data;
                if (data.status === 200) {
                    alert("Profile updated successfully!");
                    Object.entries(payload).forEach(([key, value]) => sessionStorage.setItem(key, value));
                } else {
                    alert("Failed to update profile: " + (data.message || "Unknown error"));
                }
            }

        } catch (err) {
            console.error(err);
            alert("Something went wrong while updating profile.");
        }
    };

    const handleInputChange = (field) => (event) => {
        setProfileData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleDateChange = (date) => {
        setProfileData(prev => ({
            ...prev,
            birthDate: date
        }));
    };
    // Handle pincode change and API call
    const handlePincodeChange = async (e) => {
        const value = e.target.value;
        setProfileData(prev => ({ ...prev, pincode: value }));

        if (value.length === 6) { // Assuming 6-digit pincodes
            try {
                // Encrypt request
                const encReq = DataEncrypt(JSON.stringify({ pincode: value }));

                // Call API with encrypted payload
                const res = await api.post(
                    "/api/pincode/916e4eb592f2058c43a3face75b0f9d49ef2bd17",
                    { encReq },
                    { headers: { "Content-Type": "application/json" } }
                );

                // Decrypt response
                let decrypted = DataDecrypt(res.data);
                if (typeof decrypted === 'string') decrypted = JSON.parse(decrypted);

                console.log("decrypted ", decrypted);
                if (decrypted.status === 200 && decrypted.data.length > 0) {
                    const pincodeInfo = decrypted.data[0]; // first item in array

                    // Build full address string
                    const fullAddress = [
                        pincodeInfo.Office_name,
                        pincodeInfo.Division,
                        pincodeInfo.District,
                        pincodeInfo.State,
                        pincodeInfo.Pincode
                    ].filter(Boolean).join(', ');

                    setProfileData(prev => ({
                        ...prev,
                        pincode: pincodeInfo.Pincode || prev.pincode,
                        state: pincodeInfo.State || '',
                        city: pincodeInfo.District || '',
                        circle: pincodeInfo.Circle || '',
                        division: pincodeInfo.Division || '',
                        office_name: pincodeInfo.Office_name || '',
                        region: pincodeInfo.Region || '',
                        address: fullAddress
                    }));
                } else {
                    console.error("Pincode API returned error:", decrypted.message);
                }
            } catch (err) {
                console.error("Pincode API error:", err);
            }
        }
    };

    console.log("profileData.state ", profileData.state)

    const handleLogout = () => {
        setAnchorEl(null);

        // Remove cookies
        Cookies.remove('department');
        Cookies.remove('uid');
        const role = Cookies.get('role');
        Cookies.remove('role');

        // Clear sessionStorage and localStorage
        sessionStorage.clear();
        localStorage.clear();

        router.push('/login');

    };

    return (
        <Layout>
            <Box sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', py: 2, px: 1, minHeight: '100vh' }}>
                <Container maxWidth="xl">
                    {/* Profile Header */}
                    <Card
                        sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            mb: 2,
                            background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)',
                            color: 'white',
                            p: 2
                        }}
                    >
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={3}
                        >
                            {/* Left: Profile Info */}
                            <Grid item xs={12} md={6}>
                                <Grid
                                    container
                                    alignItems="center"
                                    spacing={2}
                                    justifyContent={{ xs: 'center' }} // Center on mobile, left on desktop
                                >
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={handleProfilePicClick}
                                            src={profileData.profile_pic_preview || userData.profile_pic || undefined}
                                        >
                                            <Loyalty sx={{ fontSize: 40 }} />
                                        </Avatar>

                                        {/* Hidden file input */}
                                        <input
                                            type="file"
                                            id="profilePicInput"
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={handleProfilePicChange}
                                        />

                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5" fontWeight="bold">
                                            {userData.first_name} {userData.last_name}
                                        </Typography>
                                        <Typography variant="body2">MLM ID: {userData.mlm_id}</Typography>
                                        <Typography variant="body2">Mobile: {userData.mobile}</Typography>
                                        <Typography variant="body2">Email: {userData.email}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Right: Referred Info */}
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: { xs: 'center' }, // Center on mobile, right on desktop
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography variant="body2">Referred By: {userData.ref_first_name}{" "}{userData.ref_last_name}</Typography>
                                <Typography variant="body2">Mobile:  {userData.refered_mobile}</Typography>

                            </Grid>
                        </Grid>
                    </Card>


                    {/* Wallet/Points Overview */}


                    {/* Tabs Section */}
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                                <Tab icon={<AccountCircle />} label="Overview" />
                                <Tab icon={<Edit />} label="Update Profile" />
                                <Tab icon={<Receipt />} label="Terms & Conditions" />
                                <Tab icon={<Help />} label="About Us" />
                                <Tab icon={<Settings />} label="Settings" />
                                <Tab icon={<ExitToApp />} label="Logout" />
                            </Tabs>
                        </Box>

                        {/* Overview Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={2} sx={{ mb: 1, padding: "25px" }}>
                                {[
                                    { label: 'Wallet Balance', value: balance.wallet, icon: <Loyalty sx={{ fontSize: 24, color: '#757575' }} />, bg: '#f0f4c3', color: 'text.primary' },
                                    { label: 'Cashback', value: balance.cashback, icon: <MonetizationOn sx={{ fontSize: 24, color: '#2e7d32' }} />, bg: '#e1f5fe', color: 'success.main' },
                                    { label: 'Total Earned', value: balance.totalCashback, icon: <MonetizationOn sx={{ fontSize: 24, color: '#ff9800' }} />, bg: '#fff3e0', color: 'warning.main' },
                                    { label: 'Refer & Earn', value: balance.referralPoints, icon: <Share sx={{ fontSize: 24, color: '#1976d2' }} />, bg: '#e8f5e9', color: 'primary.main' }
                                ].map((card, index) => (
                                    <Grid
                                        item
                                        xs={12}   // 1 per row on very small screens
                                        sm={6}    // 2 per row on small screens
                                        md={3}    // 4 per row on medium+ screens
                                        key={index}
                                    >
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: 2,
                                                minHeight: 80,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: card.bg,
                                                py: 1
                                            }}
                                        >
                                            {card.icon}
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                                {card.label}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight="bold" color={card.color}>
                                                ₹ {card.value}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>



                        {/* Update Profile Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <Box component="form" onSubmit={handleProfileUpdate}>
                                {/* Personal Information Section */}
                                <Card sx={{ mb: 1, borderRadius: 2, boxShadow: 4, border: '1px solid #e0e0e0', m: 2, backgroundColor: '#FEF7FF' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#1976d2' }}
                                        >
                                            <Person /> Personal Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {/* First Name */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="First Name"
                                                    size="small"
                                                    fullWidth
                                                    value={profileData.firstName}
                                                    onChange={handleInputChange('firstName')}
                                                    placeholder="Enter first name"
                                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                                                />
                                            </Grid>

                                            {/* Last Name */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Last Name"
                                                    size="small"
                                                    fullWidth
                                                    value={profileData.lastName}
                                                    onChange={handleInputChange('lastName')}
                                                    placeholder="Enter last name"
                                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                                                />
                                            </Grid>

                                            {/* Birth Date */}
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}> 
                                                    <DatePicker
                                                        label="Birth Date"
                                                        value={profileData.birthDate}
                                                        onChange={handleDateChange}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="medium"
                                                                fullWidth  // make sure this is here
                                                                sx={{ backgroundColor: '#f9f9f9', borderRadius: 1,}}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <CalendarToday color="action" />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>


                                            {/* Gender */}
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth size="small" sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select
                                                        value={profileData.gender || ''}
                                                        onChange={handleInputChange('gender')}
                                                        label="Gender"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select Gender</em>
                                                        </MenuItem>
                                                        {genders.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                                                    </Select>
                                                </FormControl>

                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Address Information Section */}
                                <Card sx={{ m: 2, borderRadius: 2, boxShadow: 4, border: '1px solid #e0e0e0', backgroundColor: '#FEF7FF', }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#1976d2' }}
                                        >
                                            <LocationOn /> Address Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {/* Pincode */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    label="Pincode"
                                                    size="small"
                                                    fullWidth
                                                    value={profileData.pincode}
                                                    onChange={handlePincodeChange}
                                                    placeholder="Enter pincode"
                                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>

                                            {/* State */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    label="State"
                                                    size="small"
                                                    fullWidth
                                                    value={profileData.state || ''}
                                                    InputProps={{
                                                        readOnly: true,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                                                />
                                            </Grid>

                                            {/* City */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    label="City"
                                                    size="small"
                                                    fullWidth
                                                    value={profileData.city || ''}
                                                    InputProps={{
                                                        readOnly: true,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                                                />
                                            </Grid>


                                            {/* Address Line */}
                                            {/* <Grid item xs={12}>
                                                <TextField
                                                    label="Address"
                                                    size="small"
                                                    fullWidth
                                                    value={profileData.address || ''}
                                                    onChange={handleInputChange('address')}
                                                    placeholder="Enter your address"
                                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                                                />
                                            </Grid> */}
                                        </Grid>

                                        {/* Update Button */}
                                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    background: 'linear-gradient(135deg,#1976d2 0%,#7b1fa2 100%)',
                                                    py: 1,
                                                    px: 4,
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                                                    '&:hover': { boxShadow: '0 5px 10px rgba(0,0,0,0.3)' }
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </TabPanel>


                        <TabPanel value={tabValue} index={2}>
                            <Typography variant="h6" gutterBottom>Terms & Conditions</Typography>
                            <Typography variant="body2">
                                {/* Add your terms and conditions content here */}
                            </Typography>
                        </TabPanel>

                        <TabPanel value={tabValue} index={3}>
                            <Typography variant="h6" gutterBottom>About Us</Typography>
                            <Typography variant="body2">
                                {/* Add your about us content here */}
                            </Typography>
                        </TabPanel>

                        <TabPanel value={tabValue} index={4}>
                            {userId && <DeactivateAccount userId={userId} />}
                        </TabPanel>


                        <TabPanel value={tabValue} index={5}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleLogout}
                                    sx={{ px: 4, py: 1, fontWeight: 'bold' }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </TabPanel>

                    </Card>
                </Container>
            </Box>
        </Layout>
    );
}