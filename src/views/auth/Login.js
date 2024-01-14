import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, Grid, TextField, Typography } from "@mui/material";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    /**
     * login to the system
     * @param event to click event
     * @returns {Promise<void>}
     */
    const handleLogin = async (event) => {
        event.preventDefault();

        const data = {
            username: username,
            password: password,
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/auth/login",
                data
            );

            if (response.status === 200) {
                localStorage.setItem("token", response.data);
                axios.defaults.headers.common[
                    "Authorization"
                    ] = `Bearer ${response.data}`;
                navigate("/home");
            } else {
                console.log("Login error");
            }
        } catch (error) {
            console.error("Login error", error);
        }
    };

    return (
        <Card
            style={{
                maxWidth: 400,
                margin: "auto",
                marginTop: 40,
                padding: 20,
                textAlign: "center",
            }}
            variant="outlined"
        >
            <Typography variant="h4" style={{ marginBottom: 20 }}>
                User Login
            </Typography>
            <form onSubmit={handleLogin}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            style={{ width: "100%", marginBottom: 10 }}
                            id="outlined-basic"
                            onChange={handleUsername}
                            label="User Name"
                            variant="outlined"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            style={{ width: "100%", marginBottom: 10 }}
                            id="outlined-basic"
                            onChange={handlePassword}
                            label="Password"
                            type="password"
                            variant="outlined"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            style={{ width: "100%", marginTop: 10 }}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" style={{ marginTop: 10 }}>
                            Don't have an account?{" "}
                            <Link to="/register">Register here</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
};

export default Login;
