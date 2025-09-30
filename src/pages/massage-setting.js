"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  tableCellClasses,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Template type options
const templateTypeOptions = [
  "login",
  "register",
  "kyc",
  "referral",
  "recharge_success",
  "recharge_failed",
  "addmoney_request_pending",
  "addmoney_request_approved",
  "addmoney_request_reject",
  "insurance_request",
  "send_money_user",
  "send_money_sender",
  "kyc_approved",
  "kyc_request",
  "kyc_reject",
  "addmoney",
  "addmoney_fail",
  "redeem_request",
  "redeem_reject",
  "redeem_approve",
  "feedback",
  "admin_incomecredit",
  "id_autoblock",
  "prime_purchase",
  "welcome",
  "password_reset",
  "order_confirmation",
  "payment_success",
  "payment_failure",
  "account_verification",
  "promotional",
  "otp",
  "slab1",
  "slab2",
  "slab3",
];

// Template variables mapping based on template type
const templateVariablesByType = {
  register: ["first_name", "last_name", "mobile"],
  login: ["first_name", "last_name", "address", "mobile"],
  referral: ["referal_fname", "referal_lname", "user_fname", "user_lname", "mobile", "mlm_user_id"],
  password_reset: ["first_name", "last_name", "mobile"],
  recharge_success: ["first_name", "last_name", "mobile", "cbamount", "main_amount", "consumer_mobile", "transactionID"],
  recharge_failed: ["first_name", "last_name", "mobile", "main_amount", "consumer_mobile"],
  addmoney_request_pending: ["first_name", "last_name", "mobile", "amount"],
  addmoney_request_approved: ["first_name", "last_name", "mobile", "amount"],
  addmoney_request_reject: ["first_name", "last_name", "mobile", "amount", "rejection_reason"],
  insurance_request: ["first_name", "last_name", "mobile"],
  send_money_user: ["touserFirstName", "touserLastName", "to_mobile", "fromuserFirstName", "fromuserLastName", "amount"],
  send_money_sender: ["touserFirstName", "touserLastName", "to_mobile", "fromuserFirstName", "fromuserLastName", "amount"],
  kyc_approved: ["first_name", "last_name", "mobile"],
  kyc_request: ["first_name", "last_name", "mobile"],
  kyc_reject: ["first_name", "last_name", "mobile", "rejection_reason"],
  addmoney: ["first_name", "last_name", "mobile", "amount"],
  addmoney_fail: ["first_name", "last_name", "mobile", "amount"],
  redeem_request: ["first_name", "last_name", "mobile", "amount"],
  redeem_reject: ["first_name", "last_name", "mobile", "amount", "reason"],
  redeem_approve: ["first_name", "last_name", "mobile", "amount"],
  feedback: ["first_name", "last_name"],
  admin_incomecredit: ["first_name", "last_name", "amount", "wallet_type"],
  id_autoblock: ["first_name", "last_name"],
  prime_purchase: ["name", "plan_name"],
  // Default variables for any template type
  default: [
    "first_name",
    "last_name",
    "config.APP_NAME",
    "created_on",
    "referal_fname",
    "referal_lname",
    "user_fname",
    "user_lname",
    "mobile",
    "mlm_user_id",
    "config.SUPPORT_TEAM",
    "cbamount",
    "main_amount",
    "consumer_mobile",
    "amount",
    "touserFirstName",
    "touserLastName",
    "fromuserFirstName",
    "fromuserLastName",
    "rejection_reason",
    "reason",
    "wallet_type",
    "name",
    "address",
    "otp",
  ],
};

// Function to fill template with values
const fillTemplate = (template, values) => {
  if (!template) return "";
  return template.replace(/\$\{(.*?)\}/g, (_, key) => {
    const trimmedKey = key.trim();
    return values[trimmedKey] ?? `\${${trimmedKey}}`;
  });
};

function MessageSetting() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newSlab, setNewSlab] = useState("");
  const [openSlabDialog, setOpenSlabDialog] = useState(false);
  const [intervalDays, setIntervalDays] = useState(7);
  const [availableVariables, setAvailableVariables] = useState(templateVariablesByType.default);

  const [currentMessage, setCurrentMessage] = useState({
    id: "",
    title: "",
    type: "",
    templateType: "",
    body: "",
  });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleAddSlab = async () => {
    if (newSlab.trim() === "") {
      setError("Slab name is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Adding new slab:", { name: newSlab.trim(), interval_days: intervalDays });

      // API call using fetch
      const response = await fetch(`${API_BASE}api/slab/add-slab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSlab.trim(),
          interval_days: intervalDays,
        }),
      });

      console.log("API response status:", response.status);

      const responseData = await response.json();
      console.log("API response data:", responseData);

      if (response.ok) {
        console.log("Slab added successfully");

        // Update template type options
        templateTypeOptions.push(newSlab.trim());
        setNewSlab("");
        setIntervalDays(7);
        setOpenSlabDialog(false);
        setSuccess("Slab type added successfully");

        console.log("Template type options updated with new slab:", newSlab);
      } else {
        console.error("API error:", responseData);
        setError(responseData.message || "Failed to add slab type");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error: Failed to connect to server");
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);


const fetchMessages = async () => {
  setLoading(true);
  setError("");
  try {
    const response = await axios.get(`${API_BASE}api/marketing/all`);

    if (response.data.success) {
      setMessages(response.data.data);
    } else {
      setError("Failed to fetch messages");
    }
  } catch (error) {
    if (error.response) {
      // Server responded with status code not in range 2xx
      setError(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // Request was made but no response received
      setError("No response from server");
    } else {
      // Something else happened
      setError("Failed to connect to server");
    }
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (value) => setSearchTerm(value);

  const handleViewOpen = (message) => {
    setSelectedMessage(message);
    setOpenViewDialog(true);
  };
  const handleViewClose = () => setOpenViewDialog(false);

  const handleEditOpen = (message) => {
    setCurrentMessage(message);
    setAvailableVariables(
      templateVariablesByType[message.templateType] || templateVariablesByType.default
    );
    setOpenEditDialog(true);
  };
  const handleEditClose = () => setOpenEditDialog(false);

  const handleAddOpen = () => {
    setCurrentMessage({
      id: "",
      title: "",
      type: "",
      templateType: "",
      body: "",
    });
    setAvailableVariables(templateVariablesByType.default);
    setOpenAddDialog(true);
  };
  const handleAddClose = () => setOpenAddDialog(false);

  const handleTemplateTypeChange = (templateType) => {
    setCurrentMessage({ ...currentMessage, templateType });
    setAvailableVariables(
      templateVariablesByType[templateType] || templateVariablesByType.default
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}api/marketing/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentMessage.title,
          body: currentMessage.body,
          type: currentMessage.type,
          templateType: currentMessage.templateType,
          created_by: 1
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Message created successfully');
        // Refresh the messages list
        fetchMessages();
        handleAddClose();
      } else {
        setError(data.message || 'Failed to create message');
      }
    } catch (error) {
      setError('Network error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      setSuccess('Message updated successfully (simulated)');
      handleEditClose();

      const response = await fetch(`${API_BASE}api/marketing/update/${currentMessage.id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentMessage),
      });
      fetchMessages();

    } catch (error) {
      setError('Failed to update message');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setLoading(true);
    try {
      setMessages(messages.filter((msg) => msg.id !== id));
      setSuccess('Message deleted successfully (simulated)');
      if (openEditDialog) handleEditClose();

      const response = await fetch(`${API_BASE}api/marketing/delete/${id}`, {
        method: 'post'
      });
      fetchMessages();
    } catch (error) {
      setError('Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase();
    const contentToSearch = `${message.title} ${message.body}`.toLowerCase();

    const matchesNormal = contentToSearch.includes(searchLower);
    const matchesTemplate = availableVariables.some((keyword) =>
      contentToSearch.includes(`\${${keyword}}`)
    );

    return matchesNormal || (searchTerm && matchesTemplate);
  });

  const insertTemplateVariable = (variable) => {
    setCurrentMessage({
      ...currentMessage,
      body: currentMessage.body + `\${${variable}}`
    });
  };

  return (
    <Layout>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Alert severity="success" onClose={() => setSuccess("")}>
              {success}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={3}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={2}>
              <Typography variant="h5" color="primary">
                Message Settings
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddOpen}
                  startIcon={<AddIcon />}
                >
                  Add New Message
                </Button>
              </Box>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SR No.</StyledTableCell>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Template Type</StyledTableCell>
                    <StyledTableCell>Content Preview</StyledTableCell>
                    <StyledTableCell>Date & Time</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center">
                        {messages.length === 0 ? "No messages found" : "No matching messages found"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    filteredMessages.map((message, index) => (
                      <StyledTableRow key={message.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{message.title}</StyledTableCell>
                        <StyledTableCell>{message.type}</StyledTableCell>
                        <StyledTableCell>{message.templateType}</StyledTableCell>
                        <StyledTableCell>
                          {message.body && message.body.length > 50
                            ? `${message.body.substring(0, 50)}...`
                            : message.body || "—"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {message.created_on ? new Date(message.created_on).toLocaleString() : "—"}
                        </StyledTableCell>
                        <StyledTableCell>
                          <IconButton onClick={() => handleViewOpen(message)} color="primary" title="View">
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEditOpen(message)} color="secondary" title="Edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(message.id)} color="error" title="Delete">
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>
      </Grid>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Message Details
          <IconButton onClick={handleViewClose} sx={{ position: "absolute", right: 8, top: 8, color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {selectedMessage && (
            <Box>
              <Typography variant="h6" gutterBottom>
                <strong>Title:</strong> {selectedMessage.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Type:</strong> {selectedMessage.type}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Template Type:</strong> {selectedMessage.templateType}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>Content:</strong>
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, whiteSpace: 'pre-wrap' }}>
                {fillTemplate(selectedMessage.body, {
                  first_name: "user_name",
                  last_name: "Last_Name",
                  otp: "******",
                  config: { APP_NAME: "MyApp", SUPPORT_TEAM: "Support Team" },
                  created_on: new Date().toLocaleString(),
                  mobile: "1234567890",
                })}
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>Raw Content with Template Variables:</strong>
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, fontFamily: 'monospace' }}>
                {selectedMessage.body}
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>Available Variables for this Template Type:</strong>
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, fontFamily: 'monospace' }}>
                {availableVariables.map((variable, index) => (
                  <Typography key={index} variant="body2">
                    {`\${${variable}}`}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Slab Dialog */}
      <Dialog open={openSlabDialog} onClose={() => !loading && setOpenSlabDialog(false)}>
        <DialogTitle>Add New Slab Type</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Slab Name"
            fullWidth
            value={newSlab}
            onChange={(e) => setNewSlab(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Interval Days"
            type="number"
            fullWidth
            value={intervalDays}
            onChange={(e) => setIntervalDays(parseInt(e.target.value) || 7)}
            inputProps={{ min: 1 }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSlabDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSlab}
            variant="contained"
            color="primary"
            disabled={loading || !newSlab.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openEditDialog || openAddDialog}
        onClose={() => {
          if (currentMessage && currentMessage.id) handleEditClose();
          else handleAddClose();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {currentMessage.id ? "Edit Message" : "Add New Message"}
          <IconButton
            onClick={() => {
              if (currentMessage && currentMessage.id) handleEditClose();
              else handleAddClose();
            }}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={currentMessage.title || ""}
                onChange={(e) => setCurrentMessage({ ...currentMessage, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="type-select">Type</InputLabel>
                <Select
                  labelId="type-select"
                  label="Type"
                  value={currentMessage.type || ""}
                  onChange={(e) => setCurrentMessage({ ...currentMessage, type: e.target.value })}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <FormControl fullWidth>
                  <InputLabel id="template-type-select">Template Type</InputLabel>
                  <Select
                    labelId="template-type-select"
                    label="Template Type"
                    value={currentMessage.templateType || ""}
                    onChange={(e) => handleTemplateTypeChange(e.target.value)}
                  >
                    {templateTypeOptions.map((type, idx) => (
                      <MenuItem key={idx} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton color="primary" onClick={() => setOpenSlabDialog(true)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Content"
                value={currentMessage.body || ""}
                onChange={(e) => setCurrentMessage({ ...currentMessage, body: e.target.value })}
                helperText="Use ${variable_name} for template variables"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Insert Template Variable</InputLabel>
                <Select
                  value=""
                  label="Insert Template Variable"
                  onChange={(e) => insertTemplateVariable(e.target.value)}
                >
                  {availableVariables.map((keyword) => (
                    <MenuItem key={keyword} value={keyword}>
                      {`\${${keyword}}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {currentMessage.id && (
            <Button
              color="error"
              onClick={() => { handleDelete(currentMessage.id); }}
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={() => {
              if (currentMessage && currentMessage.id) handleEditClose();
              else handleAddClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={currentMessage.id ? handleUpdate : handleSubmit}
            disabled={loading || !currentMessage.title || !currentMessage.type || !currentMessage.templateType || !currentMessage.body}
          >
            {loading ? <CircularProgress size={24} /> : (currentMessage.id ? "Update" : "Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default MessageSetting;