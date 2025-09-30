import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button, Typography,Divider,Box,TextField } from "@mui/material";
import Cookies from "js-cookie";


function TransactionHistory(props) {
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    //const router = useRouter();
    const uid = Cookies.get('uid');
    const mobile = Cookies.get('mobile');
    // const {uid, mobileno} = [];
    const [mobile_no, setmobile_no] = useState('');
    const [old_password, setold_password] = useState('');
    const [new_password, setnew_password] = useState('');

    

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
            if(mobile){
                setmobile_no(mobile);
            }
          const reqData = {
            
          };

          // const originalString = 'Hello, World!';
          // const encryptedData = DataEncrypt(JSON.stringify(originalString));
          // console.log(encryptedData);
          // const decryptedObject = DataDecrypt(encryptedData);
          // console.log(decryptedObject);
          try {
            const response = await api.post('/api/setting/get-panel', reqData);
            if (response.status === 200) {
                setservice_name(response.data.data.service_name);
                setservice_short_name(response.data.data.short_name);
                setpriority(response.data.data.priority);
                setstatus(response.data.data.status);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (uid) {
          getTnx();
        }
      }, [uid,mobile, dispatch]);

    const handleSubmit = async () => {

        const formData ={
            'userid': uid,
            'oldpassword': old_password,
            'password': new_password
        }

        try {
            const response = await api.post("/api/users/admin-reset-password", formData);
            
            if (response) {
                if(response.status === 200)
                {
                    alert('Reset password successfully');
                    Cookies.remove('uid');
                    Cookies.remove('role');
                }else{
                    dispatch(callAlert({ message: response.data.error, type: 'FAILED' }));
                }
                
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
                    <Typography variant="h5"  sx={{ padding: 2 }}>Reset Password</Typography>
                </Box>
                </TableContainer>
            </Grid>
            
            
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Mobile No" variant="outlined" display={'inline-block'}
                            value={mobile_no}  InputProps={{ readOnly: true }} />
                        </Box>
                        <br />
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Old Password" variant="outlined" display={'inline-block'}
                            onChange={(e) => setold_password(e.target.value)} type='password'
                              />
                        </Box>
                        <br />
                        
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="New Password" variant="outlined" display={'inline-block'}
                            onChange={(e) => setnew_password(e.target.value)} type='password'
                             />
                        </Box>

                        <br /><br />
                        <Grid item>
                            <Box display="flex" justifyContent="flex-first" mr={2}  mt={1} ml={2} mb={1} >
                            <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                                Change Password
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

