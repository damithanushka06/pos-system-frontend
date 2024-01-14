import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, Grid, TextField, Typography } from "@mui/material";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        const data = {
            username: username,
            password: password,
            email: email,
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/auth/register",
                data
            );

            if (response.status === 200) {
                navigate("/login");
            } else {
                console.log("Error");
            }
        } catch (error) {
            console.error("Error during registration", error);
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
                User Register
            </Typography>
            <form onSubmit={handleRegister}>
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
                        <TextField
                            style={{ width: "100%", marginBottom: 10 }}
                            id="outlined-basic"
                            onChange={handleEmail}
                            label="Email Address"
                            type="email"
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
                            Register
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" style={{ marginTop: 10 }}>
                            Already have an account? <Link to="/login">Login here</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
};

export default Register;
