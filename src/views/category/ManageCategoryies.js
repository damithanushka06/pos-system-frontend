import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const ManageCategories = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8080/get_category_list");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleCreateCategory = async () => {
        try {
            const newCategory = {
                name: categoryName,
            };

            await axios.post("http://localhost:8080/create_category", newCategory);
            setCategoryName("");
            fetchCategories(); // Refresh the list after creating a new category
        } catch (error) {
            console.error("Error creating category", error);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const itemCategory = {
                name: categoryName,
            };

            await axios.put(`http://localhost:8080/update_category/${selectedCategoryId}`, itemCategory);
            setCategoryName("");
            fetchCategories(); // Refresh the list after updating a category
            setSelectedCategoryId(null);
        } catch (error) {
            console.error("Error updating category", error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`http://localhost:8080/delete_category/${selectedCategoryId}`);
            setIsDeleteDialogOpen(false);
            fetchCategories(); // Refresh the list after deleting a category
            setSelectedCategoryId(null);
        } catch (error) {
            console.error("Error deleting category", error);
        }
    };

    const handleEditClick = (category) => {
        setCategoryName(category.name);
        setSelectedCategoryId(category.id);
    };

    const handleDeleteClick = (category) => {
        setSelectedCategoryId(category.id);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <Card style={{ marginBottom: 20 }}>
                <CardContent>
                    <Typography variant="h4" pb={2}>Create/Update Category</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Category Name"
                                variant="outlined"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {selectedCategoryId ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateCategory}
                                >
                                    Update Category
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCreateCategory}
                                >
                                    Create Category
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h4">Category List</Typography>
                    <List>
                        {categories.map((category) => (
                            <ListItem key={category.id}>
                                <ListItemText primary={category.name} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleEditClick(category)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteClick(category)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this category?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDeleteCategory} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageCategories;
