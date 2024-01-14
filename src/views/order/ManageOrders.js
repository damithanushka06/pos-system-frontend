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
} from "@mui/material";

const ManageOrders = () => {
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [tax, setTax] = useState(0);

    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await axios.get("http://localhost:8081/items");
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items", error);
            }
        };

        getItems();
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

            const response = await axios.post("http://localhost:8081/orders", data);
            if (response.status === 201) {
                setOrderItems([]);
                setTotal(0);
                setTax(0);
            } else {
                // show error message
            }
        } catch (error) {
            console.error("Error completing order", error);
        }
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
            </Grid>
        </div>
    );
};

export default ManageOrders;
