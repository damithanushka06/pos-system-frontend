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

const ManageItems = () => {
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemQty, setItemQty] = useState("");
    const [itemCategoryId, setItemCategoryId] = useState("");
    const [items, setItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get("http://localhost:8080/get_all_item");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items", error);
        }
    };

    const handleCreateItem = async () => {
        try {
            const newItem = {
                name: itemName,
                price: itemPrice,
                qty: itemQty,
                categoryId: itemCategoryId,
            };

            await axios.post("http://localhost:8080/create_item", newItem);
            setItemName("");
            setItemPrice("");
            setItemQty("");
            setItemCategoryId("");
            fetchItems(); // Refresh the list after creating a new item
        } catch (error) {
            console.error("Error creating item", error);
        }
    };

    const handleUpdateItem = async () => {
        try {
            const updatedItem = {
                name: itemName,
                price: itemPrice,
                qty: itemQty,
                categoryId: itemCategoryId,
            };

            await axios.put(`http://localhost:8080/update_item/${selectedItemId}`, updatedItem);
            setItemName("");
            setItemPrice("");
            setItemQty("");
            setItemCategoryId("");
            fetchItems(); // Refresh the list after updating an item
            setSelectedItemId(null);
        } catch (error) {
            console.error("Error updating item", error);
        }
    };

    const handleDeleteItem = async () => {
        try {
            await axios.delete(`http://localhost:8080/delete_item/${selectedItemId}`);
            setIsDeleteDialogOpen(false);
            fetchItems(); // Refresh the list after deleting an item
            setSelectedItemId(null);
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    const handleEditClick = (item) => {
        setItemName(item.name);
        setItemPrice(item.price);
        setItemQty(item.qty);
        setItemCategoryId(item.itemCategory.id);
        setSelectedItemId(item.id);
    };

    const handleDeleteClick = (item) => {
        setSelectedItemId(item.id);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <Card style={{ marginBottom: 20 }}>
                <CardContent>
                    <Typography variant="h4">Create/Update Item</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                variant="outlined"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Price"
                                variant="outlined"
                                value={itemPrice}
                                onChange={(e) => setItemPrice(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Quantity"
                                variant="outlined"
                                value={itemQty}
                                onChange={(e) => setItemQty(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Category ID"
                                variant="outlined"
                                value={itemCategoryId}
                                onChange={(e) => setItemCategoryId(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {selectedItemId ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateItem}
                                >
                                    Update Item
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCreateItem}
                                >
                                    Create Item
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h4">Item List</Typography>
                    <List>
                        {items.map((item) => (
                            <ListItem key={item.id}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Price: ${item.price}, Quantity: ${item.qty}, Category ID: ${item.itemCategory.id}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteClick(item)}
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
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this item?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDeleteItem} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageItems;
