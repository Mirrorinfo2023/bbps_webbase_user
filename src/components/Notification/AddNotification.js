import { Box, Button, TextField, InputLabel, Select, MenuItem, Grid, Paper, TableContainer, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minHeight: '56px',
  padding: '12px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  fontSize: '16px',
  fontFamily: 'inherit',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
  },
}));

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

const AddNotificationTransactions = () => {

    const [title, setTitle] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [appType, setAppType] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const [appCategories, setAppCategories] = useState([]);
  
    const [showPicker, setShowPicker] = useState(false);
    const [message, setMessage] = useState('');
    const onEmojiClick = (event, emojiObject) => {
    
      setMessage((prevInput) => 
      
      prevInput + emojiObject.emoji);

      // setMessage((prevInput) => prevInput + emojiObject.emoji, () => {
        
      //   console.log('Updated message:', emojiObject.emoji);
      // });
      
      setShowPicker(false);
    };

    const [selectedColor, setSelectedColor] = useState('#000000'); // Initial color

    const handleColorChange = (color) => {
      
      setSelectedColor(color);
    

    };
  
    const handleApplyColor = () => {
     
      setMessage((prevInput) =>
      
      `<html><body><font color=: ${selectedColor}">${prevInput}</font></body></html>`);
      // setSelectedColor('#000000');


      // let message1='';
      // message1=`<html><body><font color:"${selectedColor}">${message}</font></body></html>`;
      
      // setMessage((prevInput) => prevInput + message1, () => {
      //   console.log(prevInput)
       
      // });
    
    };


  
    useEffect(() => {
      const getCategories = async () => {
        try {
          const response = await api.get("/api/notification/get-notification-category");
          // console.log(response);
          if (response.status === 200) {
            setCategories(response.data.data.NotificationCategory);
            setAppCategories(response.data.data.notificationApp);
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

    const handleChange1 = (event) => {
      setAppType(event.target.value);
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };
    
    const handleCancel = async () => {
      window.history.back();
    };
  
   


    
       
      const handleSubmit = async () => {
       
        
          const formData ={
            'image': selectedFile,
            'title':title,
            'type_id':transactionType,
            'body':message,
            'app_id':appType
          }

        try {

         
          const response = await api.post('/api/notification/add-notification', formData,{

            headers:{'content-type': 'multipart/form-data'}
          
          
          });
        
          if (response) {
            window.history.back();
            alert('Notification Saved  successfully');
          } else {
            console.error('Failed to save');
          }

        } catch (error) {
          console.error('Error uploading file:', error);
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
                                Add New Notification
                            </Typography>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Title"
                                        variant="outlined"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
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

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="notification-type-label">Notification Type</InputLabel>
                                        <Select
                                            labelId="notification-type-label"
                                            id="notification-type"
                                            value={transactionType}
                                            label="Notification Type"
                                            onChange={handleChange}
                                            sx={{
                                                height: '56px',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="">Please Select</MenuItem>
                                            {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.notification_type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="app-type-label">App Type</InputLabel>
                                        <Select
                                            labelId="app-type-label"
                                            id="app-type"
                                            value={appType}
                                            label="App Type"
                                            onChange={handleChange1}
                                            sx={{
                                                height: '56px',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="">Please Select</MenuItem>
                                            {appCategories.map((appType) => (
                                                <MenuItem key={appType.id} value={appType.id}>
                                                    {appType.app_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, color: '#666' }}>
                                        Message
                                    </Typography>
                                    <StyledTextarea
                                        placeholder="Enter your notification message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            sx={{
                                                backgroundColor: '#f5f5f5',
                                                color: 'text.primary',
                                                '&:hover': {
                                                    backgroundColor: '#e0e0e0',
                                                },
                                            }}
                                        >
                                            Upload Image
                                            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                        </Button>
                                        {selectedFile && (
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                Selected: {selectedFile.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="large"
                                            onClick={handleSubmit}
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
                                            }}
                                        >
                                            Submit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={handleCancel}
                                            sx={{
                                                ml: 2,
                                                px: 4,
                                                py: 1,
                                                borderRadius: '6px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>
        </main>
    )
}
export default AddNotificationTransactions;