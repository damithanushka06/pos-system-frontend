import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

const ManageOrders = () => {
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false);

    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await axios.get("http://localhost:8080/get_all_item");
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items", error);
            }
        };

        const getOrders = async () => {
            try {
                const response = await axios.get("http://localhost:8080/get_all_orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders", error);
            }
        };

        getItems();
        getOrders();
    }, []);

    useEffect(() => {
        setTax((total / 100) * 15);
    }, [total]);

    const handleAddToOrder = (item) => {
        setOrderItems([...orderItems, item]);
        setTotal((prevTotal) => prevTotal + item.price);
    };

    const handleCompleteOrder = async () => {
        try {
            const itemIds = orderItems.map((obj) => obj.id);
            const data = {
                items: itemIds,
            };

            const response = await axios.post("http://localhost:8080/complete_order", data);
            if (response.status === 201) {
                setOrderItems([]);
                setTotal(0);
                setTax(0);
                // Refresh order list
                const updatedOrders = await axios.get("http://localhost:8080/get_all_orders");
                setOrders(updatedOrders.data);
            } else {
                // show error message
            }
        } catch (error) {
            console.error("Error completing order", error);
        }
    };

    const handleRemoveItemFromOrder = (itemToRemove) => {
        const updatedOrderItems = orderItems.filter(item => item.id !== itemToRemove.id);
        setOrderItems(updatedOrderItems);
        setTotal(prevTotal => prevTotal - itemToRemove.price);
    };

    const handleOrderDetailsClick = (order) => {
        setSelectedOrder(order);
        setIsOrderDetailsDialogOpen(true);
    };

    const handleCloseOrderDetailsDialog = () => {
        setSelectedOrder(null);
        setIsOrderDetailsDialogOpen(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4">Items</Typography>
                            {items.map((item) => (
                                <div key={item.id} className="item-box px-2 py-2">
                                    {item.name} - {item.price}
                                    <Button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleAddToOrder(item)}
                                    >
                                        Add to Order
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4">Order Summary</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item ID</TableCell>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.price}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={2}>Total</TableCell>
                                            <TableCell>{total}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Tax</TableCell>
                                            <TableCell>{tax}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button
                                className="btn btn-secondary"
                                onClick={handleCompleteOrder}
                            >
                                Complete Order
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4">Orders</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell>Total Amount</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.totalAmount}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleOrderDetailsClick(order)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog
                open={isOrderDetailsDialogOpen}
                onClose={handleCloseOrderDetailsDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography>Order ID: {selectedOrder.id}</Typography>
                            <Typography>Total Amount: {selectedOrder.totalAmount}</Typography>

                            {/* Display items in the order */}
                            <Typography variant="h6">Order Items:</Typography>
                            <ul>
                                {selectedOrder.items.map(item => (
                                    <li key={item.id}>{item.name} - {item.price}</li>
                                ))}
                            </ul>

                            {/* Button to remove items from the order */}
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleRemoveItemFromOrder(selectedOrder)}
                            >
                                Remove Items from Order
                            </Button>

                            {/* Add more details here based on your order structure */}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseOrderDetailsDialog}>Close</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ManageOrders;
