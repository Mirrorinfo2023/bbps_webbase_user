"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    DialogContentText,
} from "@mui/material";
import { Add, Edit, Delete, VisibilityOff, Visibility } from "@mui/icons-material";
import Layout from "@/components/Dashboard/layout";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import { InputAdornment, } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const CourseReportTable = () => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categoryImage, setCategoryImage] = useState(null);

    // categories from API
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [newCategoryParent, setNewCategoryParent] = useState(null);
    const [selectedCategoryFile, setSelectedCategoryFile] = useState(null);
    const [categoryErrors, setCategoryErrors] = useState({});

    const [formData, setFormData] = useState({
        category: "",
        name: "",
        link: "",
    });
    const [errors, setErrors] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [rows, setRows] = useState([]); // start empty

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString("en-US");
        return `${day}/${month}/${year}, ${time}`;
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.post("/api/courses_video/getAllcategory");
                console.log("res is: ", res);

                if (res.data?.status === 200) {
                    // Create a dictionary of category_id to category_name
                    const categoryDict = res.data.data.reduce((acc, cat) => {
                        acc[cat.id] = cat.title;

                        return acc;
                    }, {});
                    setCategories(categoryDict);


                } else {
                    console.error("Failed to fetch categories:", res.data?.message);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);


    // 🔹 Fetch course videos from API
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.post("/api/courses_video/get-videos");
                console.log("res from get video course is: ", res);

                if (res.data?.status === 200) {
                    const videos = res.data.data;

                    // If backend sends a single object, normalize it into an array
                    const videoArray = Array.isArray(videos) ? videos : [videos];

                    setRows(
                        videoArray.map((vid) => ({
                            id: vid.id,
                            date: formatDate(vid.created_on),
                            category: categories[vid.category_id] || "N/A",
                            name: vid.title,
                            link: vid.video_link,
                            status: vid.status, // ✅ keep original status from backend
                        }))
                    );

                } else {
                    console.error("Failed to fetch videos:", res.data?.message);
                }
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchVideos();
    }, [categories]);



    // Dialog controls
    const handleOpen = () => {
        setFormData({ category: "", name: "", link: "" });
        setErrors({});
        setIsEditing(false);
        setEditId(null);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    // Validation function
    const validateForm = () => {
        let tempErrors = {};
        if (!formData.category) tempErrors.category = "Category is required";
        if (!formData.name) tempErrors.name = "Course name is required";
        if (!formData.link) {
            tempErrors.link = "Course link is required";
        } else if (!/^https?:\/\/.+/.test(formData.link)) {
            tempErrors.link = "Enter a valid URL (https://...)";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Add video
    // Inside handleSubmit
    // Edit
    const handleEdit = (row) => {
        setFormData({
            category: Object.keys(categories).find(
                (id) => categories[id] === row.category
            ) || "", // store category_id instead of name
            name: row.name,
            link: row.link,
        });
        setIsEditing(true);
        setEditId(row.id);
        setErrors({});
        setOpen(true);
    };

    // Submit (Add/Update)
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                title: formData.name,
                video_link: formData.link,
                category_id: formData.category,
                status: 1, // always active
            };

            if (isEditing && editId) {
                payload.video_id = editId;

                const res = await api.post("/api/courses_video/update-video", payload, {
                    headers: { "Content-Type": "application/json" }
                });

                if (res.data.status === 200) {
                    alert("Video updated successfully!");
                    setRows(rows.map(r =>
                        r.id === editId
                            ? {
                                ...r,
                                category: categories[payload.category_id] || "N/A",
                                name: payload.title,
                                link: payload.video_link,
                                status: 1,
                            }
                            : r
                    ));
                    handleClose();
                } else {
                    alert(res.data.message || "Failed to update video");
                }
            } else {
                // 🔹 Add new video
                const res = await api.post("/api/courses_video/add-video", payload, {
                    headers: { "Content-Type": "application/json" }
                });

                if (res.data.status === 200 || res.data.status === 201) {
                    alert("Video added successfully!");
                    setRows([
                        ...rows,
                        {
                            id: res.data.data.insertId || rows.length + 1,
                            category: categories[payload.category_id] || "N/A",
                            name: payload.title,
                            link: payload.video_link,
                            status: 1,
                            date: new Date().toLocaleString(),
                        }
                    ]);
                    handleClose();
                } else {
                    alert(res.data.message || "Failed to add video");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };



    const handleAddCategorySubmit = async () => {
        if (!newCategoryName.trim()) {
            setCategoryErrors({ name: "Category name is required" });
            return;
        }
        setCategoryErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("category_name", newCategoryName);
            formDataToSend.append("description", newCategoryDescription);
            if (categoryImage) formDataToSend.append("image", categoryImage);
            formDataToSend.append("user_id", formData.user_id || 1); // fallback if user_id missing

            const res = await api.post("/api/courses_video/addcategory", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("res is: ", res)
            if (res.data.status === 201) {
                alert(res.data.message || "Category added successfully!");
                const newCategory = res.data.data;
                setCategories({
                    ...categories,
                    [newCategory.id]: newCategory.category_name,
                });
                setCategoryOpen(false);
                setNewCategoryName("");
                setNewCategoryDescription("");
                setCategoryImage(null);
            } else {
                alert(res.data.error || "Something went wrong");
            }
        } catch (err) {
            console.error("Failed to add category:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Something went wrong");
        }
    };

    // Confirm dialog handler
    const confirmActionHandler = () => {
        if (confirmAction) confirmAction();
        setConfirmOpen(false);
    };

    // Hide/Unhide
    const handleToggleHide = async (id) => {
        try {
            const res = await api.post("/api/courses_video/hide-video", { video_id: id });

            if (res.data.status === 200) {
                // Update local state
                setRows(rows.map(r =>
                    r.id === id ? { ...r, status: res.data.newStatus } : r
                ));
            } else {
                alert(res.data.message || "Failed to update video status");
            }
        } catch (err) {
            console.error("Toggle hide error:", err);
            alert("Something went wrong");
        }
    };


    // Edit
    // const handleEdit = (row) => {
    //     setFormData({ category: row.category, name: row.name, link: row.link });
    //     setIsEditing(true);
    //     setEditId(row.id);
    //     setErrors({});
    //     setOpen(true);
    // };

    // Delete
    const handleDelete = (id) => {
        setConfirmAction(() => async () => {
            try {
                // console.log("video id is: ", id)

                const res = await api.post("/api/courses_video/delete-video-course", { video_id: id });
                console.log("res is: ", res)
                if (res.data.status === 200) {
                    alert("Video deleted successfully!");
                    setRows(rows.filter((row) => row.id !== id));
                } else {
                    alert(res.data.message || "Failed to delete video");
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Something went wrong");
            }
        });
        setConfirmOpen(true);
    };


    // Filter rows
    const filteredRows = rows.filter(
        (row) =>
            row.status === 1 && // ✅ only show if status=1
            (row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.category.toLowerCase().includes(search.toLowerCase()))
    );

    console.log("rows: ", rows)
    console.log("filteredRows: ", filteredRows)
    return (
        <Layout>
            <Box p={3}>
                {/* Header Section */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    p={2}
                    sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Course Report
                    </Typography>

                    <Box display="flex" gap={2}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleOpen}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: 16,
                                px: 4,
                                py: 1.2,
                                background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                textTransform: "none",
                            }}
                        >
                            Add new video
                        </Button>
                    </Box>
                </Box>

                {/* Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                    "& th": { color: "#fff", fontWeight: 600, fontSize: "14px" },
                                }}
                            >
                                <TableCell>S.R</TableCell>
                                <TableCell>Added Date & Time</TableCell>
                                <TableCell>Course Category</TableCell>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Course Link</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.length > 0 ? (
                                filteredRows.map((row, index) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>
                                            <a href={row.link} target="_blank" rel="noopener noreferrer">
                                                {row.link}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color={row.hidden ? "success" : "warning"}
                                                size="small"
                                                onClick={() => handleToggleHide(row.id)}
                                            >
                                                {row.hidden ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            <IconButton color="primary" size="small" onClick={() => handleEdit(row)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No matching records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit Dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle
                        sx={{
                            background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                            color: "#fff",
                        }}
                    >
                        {isEditing ? "Edit Video" : "Add New Video"}
                    </DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        {/* Category with add option */}
                        <Box display="flex" gap={1} alignItems="center">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    displayEmpty
                                    error={!!errors.category}
                                    sx={{ minWidth: 400 }} // set fixed or min width
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    {Object.entries(categories).map(([id, title]) => (
                                        <MenuItem key={id} value={id}>
                                            {title}
                                        </MenuItem>
                                    ))}
                                </Select>


                                <Typography
                                    variant="body2"
                                    color="primary"
                                    sx={{
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                    }}
                                    onClick={() => setCategoryOpen(true)}
                                >
                                    Add Category
                                </Typography>
                            </Box>


                            <Dialog open={categoryOpen} onClose={() => setCategoryOpen(false)} fullWidth maxWidth="sm">
                                <DialogTitle
                                    sx={{
                                        background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                        color: "#fff", mb: 2
                                    }}
                                >
                                    Add New Category
                                </DialogTitle>
                                <DialogContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    {/* Category Name */}
                                    <TextField
                                        label="Category Name *"
                                        fullWidth
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        error={!!categoryErrors.name}
                                        helperText={categoryErrors.name}
                                    />

                                    {/* Description */}
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={newCategoryDescription}
                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        value={categoryImage ? categoryImage.name : ""}
                                        placeholder="Upload Category Image"
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ImageIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton component="label">
                                                        <UploadFileIcon />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={(e) => setCategoryImage(e.target.files[0])}
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />


                                    {/* Preview (optional) */}
                                    {/* {categoryImage && (
                                        <Box mt={1}>
                                            <img
                                                src={URL.createObjectURL(categoryImage)}
                                                alt="Category Preview"
                                                style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 8 }}
                                            />
                                        </Box>
                                    )} */}
                                </DialogContent>

                                <DialogActions>
                                    <Button onClick={() => setCategoryOpen(false)} color="secondary">
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddCategorySubmit}
                                    >
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </Box>
                        {errors.category && <Typography color="error">{errors.category}</Typography>}

                        <TextField
                            label="Course Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Course Link"
                            fullWidth
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            error={!!errors.link}
                            helperText={errors.link}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {isEditing ? "Update" : "Submit"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this course?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={confirmActionHandler} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default CourseReportTable;
