import React from "react";
import { Link } from "react-router-dom";
import { Card, Grid, Button, Typography } from "@mui/material";

const Home = () => {
    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" style={{ marginBottom: 20 }}>
                Home Page
            </Typography>
            <Grid container spacing={2}>
                {/* Item Management */}
                <Grid item xs={6} md={3}>
                    <Card style={{ padding: 20, textAlign: "center" }}>
                        <Typography variant="h6" style={{ marginBottom: 10 }}>
                            Item Management
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/item-management"
                        >
                            Go to Items
                        </Button>
                    </Card>
                </Grid>

                {/* Category Management */}
                <Grid item xs={6} md={3}>
                    <Card style={{ padding: 20, textAlign: "center" }}>
                        <Typography variant="h6" style={{ marginBottom: 10 }}>
                            Category Management
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/category-management"
                        >
                            Go to Categories
                        </Button>
                    </Card>
                </Grid>

                {/* Order Management */}
                <Grid item xs={6} md={3}>
                    <Card style={{ padding: 20, textAlign: "center" }}>
                        <Typography variant="h6" style={{ marginBottom: 10 }}>
                            Order Management
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/order-management"
                        >
                            Go to Orders
                        </Button>
                    </Card>
                </Grid>

                {/* User Management */}
                <Grid item xs={6} md={3}>
                    <Card style={{ padding: 20, textAlign: "center" }}>
                        <Typography variant="h6" style={{ marginBottom: 10 }}>
                            User Management
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/user-management"
                        >
                            Go to Users
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;
