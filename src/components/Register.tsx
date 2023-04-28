import React, {useState, useEffect} from "react";

import { useAppDispatch, useAppSelector } from "../hooks";
import {register, selectAuthingStatus} from "../slices/authSlice";
import Header from "./Header";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from "../images/logo.png";
import {AuthBackground} from "./Login";


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

export default function Register() {
    const dispatch = useAppDispatch();
    const error = useAppSelector(state => state.auth.error);
    const status = useAppSelector(selectAuthingStatus);

    if(status && status === "succeeded") {
        window.location.href = "/user";
    }

    type UserRegisterData = {
        username: string,
        password: string,
        firstName: string,
        lastName: string,
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userRegisterData: UserRegisterData = {
            username,
            password,
            firstName,
            lastName,
        };
        dispatch(register(userRegisterData));
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    };

    const validateUsername = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value: string) => {
        const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@*#!&$])[A-Za-z\d@*#!&$]{8,16}/;
        return passwordRegex.test(value);
    };

    const validateFirstName = (value: string) => {
        const passwordRegex = /^[a-zA-Z]{1,20}$/;
        return passwordRegex.test(value);
    };

    const validateLastName = (value: string) => {
        const passwordRegex = /^[a-zA-Z]{1,20}$/;
        return passwordRegex.test(value);
    };

    useEffect(() => {
        const debounce =setTimeout(() => {
            setIsFormValid(validateUsername(username) && validatePassword(password) && validateFirstName(firstName) && validateLastName(lastName));
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
                    {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar> */}
                    <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img src={logo} className="logo-image" alt="logo"/>
                    </Container>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <p style={{color: "red"}}>{error && error.errorMessage}</p>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                    onBlur={() => setIsFirstNameValid(validateFirstName(firstName))}
                                    onFocus={() => setIsFirstNameValid(true)}
                                    error={!isFirstNameValid}
                                    helperText={!isFirstNameValid && "Please enter a valid first name"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                    onBlur={() => setIsLastNameValid(validateLastName(lastName))}
                                    onFocus={() => setIsLastNameValid(true)}
                                    error={!isLastNameValid}
                                    helperText={!isLastNameValid && "Please enter a valid last name"}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Email Address"
                                    name="username"
                                    autoComplete="email"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    onBlur={() => setIsUsernameValid(validateUsername(username))}
                                    onFocus={() => setIsUsernameValid(true)}
                                    error={!isUsernameValid}
                                    helperText={!isUsernameValid && "Please enter a valid email address"}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => setIsPasswordValid(validatePassword(password))}
                                    onFocus={() => setIsPasswordValid(true)}
                                    error={!isPasswordValid}
                                    helperText={!isPasswordValid && "A valid password is 8-16 characters long, contains at least one uppercase letter, one lowercase letter, one number and one special character including @, *, #, !, &, $"}
                                />
                            </Grid>
                            {/*<Grid item xs={12}>*/}
                            {/*    <FormControlLabel*/}
                            {/*        control={<Checkbox value="allowExtraEmails" color="primary" />}*/}
                            {/*        label="I want to receive inspiration, marketing promotions and updates via email."*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!isFormValid}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
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

