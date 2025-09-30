"use client";

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
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddBannersTransactions = () => {
  const [title, setTitle] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [appCategories, setAppCategories] = useState([]);
  const [appType, setAppType] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/banner/get-banner-category");
        if (response.status === 200) {
          setAppCategories(response.data.data.notificationApp || []);
          setCategories(response.data.data.bannersCategory || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async () => {
    if (!title || !transactionType || !appType || !selectedFile) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("img", selectedFile); // ✅ must match multer field ("img")
    formData.append("title", title);
    formData.append("categoryId", transactionType.toString());
    formData.append("app_id", appType);

    try {
      setLoading(true);
      const response = await api.post(
        "/api/banner/add-new-banner",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        alert("Banner uploaded successfully ✅");
        // reset form
        setTitle("");
        setTransactionType("");
        setAppType("");
        setSelectedFile(null);
        window.history.back();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: "8px", overflow: "hidden" }}
          >
            <Box
              sx={{
                padding: "24px",
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#1a1a1a" }}
              >
                Add New Banner
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "56px",
                      },
                    }}
                  />
                </Grid>

                {/* App Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="app-type-label">App Type</InputLabel>
                    <Select
                      labelId="app-type-label"
                      id="app-type"
                      value={appType}
                      label="App Type"
                      onChange={(e) => setAppType(e.target.value)}
                      sx={{ height: "56px" }}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      {appCategories.map((app) => (
                        <MenuItem key={app.id} value={app.id}>
                          {app.app_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Banner Category */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="banner-category-label">
                      Banner Category
                    </InputLabel>
                    <Select
                      labelId="banner-category-label"
                      id="banner-category"
                      value={transactionType}
                      label="Banner Category"
                      onChange={(e) => setTransactionType(e.target.value)}
                      sx={{ height: "56px" }}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* File Upload */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        color: "text.primary",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                    >
                      Upload Image
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </Button>
                    {selectedFile && (
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Selected: {selectedFile.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: "6px",
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        "&:hover": {
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Submit"}
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

export default AddBannersTransactions;