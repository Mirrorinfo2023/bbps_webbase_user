"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";
import { useRouter } from 'next/router';


function TransactionHistory(props) {
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { whatsapp_id } = router.query;

    const [instance_id, setInstanceId] = useState('');
    const [access_token, setAccessToken] = useState('');

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    useEffect(() => {
        const getTnx = async () => {
          const reqData = {
            whatsapp_id:whatsapp_id
          };

          // const originalString = 'Hello, World!';
          // const encryptedData = DataEncrypt(JSON.stringify(originalString));
          // console.log(encryptedData);
          // const decryptedObject = DataDecrypt(encryptedData);
          // console.log(decryptedObject);
          try {
            const response = await api.post('/api/setting/get-whatsapp-details', reqData);
           
            if (response.status === 200) {
            
              setInstanceId(response.data.data.instance_id);
              setAccessToken(response.data.data.access_token);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (whatsapp_id) {
          getTnx();
        }
      }, [whatsapp_id, dispatch]);

        const handleSubmit = async () => {
         
              const formData ={
                'access_token': access_token,
                'instance_id': instance_id,
                'whatsapp_id': whatsapp_id
              }
    
            try {
                const response = await api.post("/api/setting/get-whatsapp-setting", formData);
                
              if (response) {
                window.history.back();
    
                alert('Updated successfully');
              } 
    
            } catch (error) {
              console.error('Error updating :', error);
            }
            
          };
    

    return (

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
        
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '40%', verticalAlign: 'top'}} >
                            <Typography variant="h5"  sx={{ padding: 2 }}>Whatsapp Setting [Update]</Typography>
                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            <TextField required  fullWidth label="Instance Id" variant="outlined" display={'inline-block'}
                            value={instance_id} onChange={(e) => setInstanceId(e.target.value)}  />
                        </Box>

                        
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            <TextField required  fullWidth label="Access Token" variant="outlined" display={'inline-block'}
                            value={access_token} onChange={(e) => setAccessToken(e.target.value)}  />
                        </Box>
                        <br /><br />
                        <Grid item>
                            <Box display="flex" justifyContent="flex-first" mr={2}  mt={1} ml={2} mb={1} >
                            <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                                Update
                            </Button>
                            </Box>   
                        </Grid>
                        <br /><br /><br /><br /><br />
                    </TableContainer>
                </Grid>
            </Grid>
        </Layout>


    );
}
export default withAuth(TransactionHistory);

