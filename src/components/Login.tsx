import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {login, toSetError, selectAuthingStatus} from "../slices/authSlice";
import {useEffect, useState} from "react";
import { backendUrl } from "../config";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';

import twoCircles from "../images/two-circles.png";
import sideGradients from "../images/side-gradients.png";
import logo from "../images/logo.png";
import Header from "./Header";



function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
            {'Copyright © '}
            <Link color="inherit" href="/user">
                Minimis
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export function AuthBackground () {
    return (
        <div className="background-container">
            <div className="two-circles">
                <img src={twoCircles} alt="two circles" />
            </div>
            <div className="side-gradients">
                <img src={sideGradients} alt="side gradients" />
            </div>
        </div>
    )
}

export default function Login() {
    const dispatch = useAppDispatch();
    const error = useAppSelector(state => state.auth.error);
    const status = useAppSelector(selectAuthingStatus);
    const backendServer = backendUrl || "http://localhost:13000";

    if(status && status === "succeeded") {
        window.location.href = "/user";
    }

    const handleGoogleRedirect = () => {
        const { search } = window.location;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        const user = params.get('user');
        
        if (token && user) {
            localStorage.setItem('token', token);
            window.location.href = "/user";
        } else {
            dispatch(toSetError(('Failed to authenticate with Google')));
        }
    };
    
    useEffect(() => {
    handleGoogleRedirect();
    }, []);

    type UserLoginData = {
        username: string,
        password: string
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userLoginData: UserLoginData = {
            username,
            password
        };
        dispatch(login(userLoginData));
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const validateUsername = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value: string) => {
        const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@*#!&$])[A-Za-z\d@*#!&$]{8,16}/;
        return passwordRegex.test(value);
    };


    useEffect(() => {
        const debounce =setTimeout(() => {
            setIsFormValid(validateUsername(username) && validatePassword(password));
        }, 500);
        return () =>{
            clearTimeout(debounce);
            setIsFormValid(false);
        } 
    }, [username, password]);



    return (
        <ThemeProvider theme={theme}>
            <Header />
            <AuthBackground />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img src={logo} className="logo-image" alt="logo"/>
                    </Container>
                    <p style={{color: "red"}}>{error && error.errorMessage}</p>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Email Address"
                            name="username"
                            autoComplete="email"
                            autoFocus
                            value={username}
                            onChange={handleUsernameChange}
                            onBlur={() => setIsUsernameValid(validateUsername(username))}
                            onFocus={() => setIsUsernameValid(true)}
                            error={!isUsernameValid}
                            helperText={!isUsernameValid && "Please enter a valid email address"}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => setIsPasswordValid(validatePassword(password))}
                            onFocus={() => setIsPasswordValid(true)}
                            error={!isPasswordValid}
                            helperText={!isPasswordValid && "A valid password is 8-16 characters long, contains at least one uppercase letter, one lowercase letter, one number and one special character including @, *, #, !, &, $"}
                        />
                        <Button
                            disabled={!isFormValid}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container spacing={2}>
                            <Grid item className="sign-item">
                                <Link href="/register" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                            <Grid item className="sign-item">
                                {/* Google oauth done in the backend need to be in browser context rather than making ajax request*/}
                                <Link href={backendServer + "/auth/google"} variant="body2">
                                    <GoogleIcon />Sign in with Google
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright />
            </Container>
        </ThemeProvider>
    );
}