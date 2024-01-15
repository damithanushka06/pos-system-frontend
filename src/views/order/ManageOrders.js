import React, {useEffect, useState} from "react";
import axios from "axios";
import format from 'date-fns/format';
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {Delete, ViewAgenda} from "@mui/icons-material";

const ManageOrders = () => {
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false);
    const [isFromEditAction, setIsFromEditAction] = useState(false);

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
                window.alert(response.data.errorMessage);
                // show error message
            }
        } catch (error) {
            console.error("Error completing order", error);
        }
    };

    const handleOrderDetailsClick = (order) => {
        setSelectedOrder(order);
        setIsOrderDetailsDialogOpen(true);
    };

    const handleCloseOrderDetailsDialog = () => {
        setSelectedOrder(null);
        setIsOrderDetailsDialogOpen(false);
    };

   async function  getUpdatedOrderList():any{
        const updatedOrders = await axios.get("http://localhost:8080/get_all_orders");
        setOrders(updatedOrders.data);
        setIsOrderDetailsDialogOpen(false);
    }

    const handleUpdateOrder = async (order) => {
        try {
            const response = await axios.post("http://localhost:8080/update_order", order);
            if (response.status === 200) {
                window.alert("Order Updated Successfully");
                getUpdatedOrderList();

            } else {
                window.alert(response.data)
            }
        } catch (error) {
            console.error("Error completing order", error);
        }
    };

    const handleDeleteOrder = async (order) => {
       const response = await axios.delete("http://localhost:8080/delete_order", {params: {id: order.id}});
       if(response.status === 200){
           window.alert("Order Deleted Successfully");
           getUpdatedOrderList();
       } else {
           window.alert(response.data);
       }
    };

    const handleUpdateQuantity = (item, newQuantity) => {
        // Find the index of the item in the array
        const itemIndex = selectedOrder.items.findIndex((i) => i.id === item.id);

        // Create a copy of the item with updated quantity
        const updatedItem = {...selectedOrder.items[itemIndex], qty: newQuantity};

        // Create a new array with the updated item
        const updatedItems = [
            ...selectedOrder.items.slice(0, itemIndex),
            updatedItem,
            ...selectedOrder.items.slice(itemIndex + 1),
        ];

        // Update the selectedOrder with the new items array
        setSelectedOrder((prevOrder) => ({
            ...prevOrder,
            items: updatedItems,
        }));
    };


    return (
        <div style={{padding: 20}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card style={{minHeight: 281, maxHeight: 281, overflow: 'auto'}}>
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
                    <Card style={{minHeight: 281, maxHeight: 281, overflow: 'auto'}}>
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
                                            <TableCell>Tax Amount</TableCell>
                                            <TableCell>Created On</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell>{order.tax}</TableCell>
                                                <TableCell>{format(order.orderTime, 'yyyy-MM-dd')}</TableCell>
                                                <TableCell>{order.status}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="View Item(s)">
                                                        <Fab sx={{marginRight: 2}}
                                                             size="small"
                                                             color="secondary"
                                                             onClick={() => handleOrderDetailsClick(order, setIsFromEditAction(false))}
                                                        >
                                                            <ViewAgenda/>
                                                        </Fab>
                                                    </Tooltip>
                                                    {order.status === "Pending" && (
                                                        <>
                                                            <Tooltip title="Delete">
                                                                <Fab
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteOrder(order)}
                                                                >
                                                                    <Delete/>
                                                                </Fab>
                                                            </Tooltip>
                                                        </>
                                                    )}
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
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography paragraph style={{display: 'flex', alignItems: 'center'}}>
                                        <span style={{
                                            color: 'black',
                                            fontWeight: 'bold',
                                            marginRight: '8px'
                                        }}>Order ID:</span> {selectedOrder.id}
                                        <span style={{color: 'black', fontWeight: 'bold', margin: '0 8px'}}>Total Amount:</span> {selectedOrder.total}
                                        <span style={{color: 'black', fontWeight: 'bold', marginLeft: '8px'}}>Created On:</span> {format(selectedOrder.orderTime, 'yyyy-MM-dd')}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="h6">Order Items:</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Quantity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.price}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        value={item.qty}
                                                        onChange={(e) => handleUpdateQuantity(item, e.target.value)}
                                                        style={{width: '100px'}}
                                                    />
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleUpdateOrder(selectedOrder)}
                    >
                        Update Order
                    </Button>
                    <Button
                        className="btn btn-sm btn-outline"
                        onClick={handleCloseOrderDetailsDialog}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ManageOrders;
