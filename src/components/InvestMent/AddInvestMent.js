import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  TableContainer,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as React from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 10,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 10,
});

const AddInvestMentTransactions = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [appCategories, setAppCategories] = useState([]);
  const [appType, setAppType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy user data for demonstration
  const dummyUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1234567891' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '+1234567892' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', phone: '+1234567893' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', phone: '+1234567894' },
    { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1234567895' },
    { id: 7, name: 'Robert Miller', email: 'robert.miller@example.com', phone: '+1234567896' },
    { id: 8, name: 'Lisa Garcia', email: 'lisa.garcia@example.com', phone: '+1234567897' },
  ];

  // Filter users based on search query
  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/banner/get-banner-category");
        if (response.status === 200) {
          setAppCategories(response.data.data.notificationApp);
          setCategories(response.data.data.sCategory);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleChange1 = (event) => {
    setAppType(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      alert('Please select a user first');
      return;
    }

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const payload = {
      plan_id: 3,
      user_id: selectedUser.id,
      amount: parseFloat(amount),
      wallet: "Main", // Hardcoded
      sender_user_id: 1 // Hardcoded
    };

    console.log('Investment Payload:', payload);
    console.log('Selected User:', selectedUser);

    try {
      const response = await api.post('/api/referral/plan/d376ca2995b3d140552f1bf6bc31c2eda6c9cfc8', payload);
      if (response) {
        window.history.back();
        alert(`Prime added successfully for ${selectedUser.name}`);
      }
    } catch (error) {
      console.error('Error adding investment:', error);
      alert('Error adding prime. Please try again.');
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                padding: '24px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1a1a1a'
                }}
              >
                Add New Prime
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* User Search Selector */}
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={filteredUsers}
                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                    value={selectedUser}
                    onChange={(event, newValue) => {
                      setSelectedUser(newValue);
                      setUserId(newValue ? newValue.id : '');
                    }}
                    onInputChange={(event, newInputValue) => {
                      setSearchQuery(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        label="Search and Select User"
                        variant="outlined"
                        placeholder="Search by name, email, or phone..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '56px',
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {option.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.email} • {option.phone}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    noOptionsText="No users found"
                    loading={false}
                  />
                </Grid>

                {/* Selected User Display */}
                {selectedUser && (
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Selected User:
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedUser.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {selectedUser.id} • {selectedUser.email}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Amount Input */}
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Amount"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    disabled={!selectedUser}
                    helperText={!selectedUser ? "Please select a user first" : ""}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleSubmit}
                      disabled={!selectedUser || !amount || amount <= 0}
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                        },
                        '&:disabled': {
                          backgroundColor: '#ccc',
                          color: '#666',
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
    </main>
  );
};

export default AddInvestMentTransactions;