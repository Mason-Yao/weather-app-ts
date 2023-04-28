import React, {FC, useState} from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {Navbar, Form} from 'react-bootstrap';
import { FaBars } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import {setTheme, selectTheme} from "../slices/styleSlice";
import { selectUser } from "../slices/authSlice";

import logo from "../images/logo.png"

const Header: FC = () => {
    const dispatch = useAppDispatch();
    const [showUserInfo, setShowUserInfo] = useState(false);
    const user = useAppSelector(selectUser);
    const googleId = user?.googleId;
    const username = user?.username;
    const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest";
    const handleToggleUserInfo = () => {
        setShowUserInfo(!showUserInfo);
    };

    const handleSwitchMode = () => {
        dispatch(setTheme(mode === 'light' ? 'dark' : 'light'));
        window.localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        window.localStorage.setItem('token', "");
        window.location.href = "/login";
    };

    const mode = useAppSelector(selectTheme);
    return (
        <header>
            <Navbar bg={mode} variant={mode} expand className={`shadow-sm`} style={{height: "50px"}}>
                <Container fluid>
                    <div style={{zIndex:"2000", width:"30rem"}} >
                        <Button variant="outline-light" onClick={handleToggleUserInfo}>
                            <FaBars style={{fontSize: "20px", color:"#65647C"}}/>
                        </Button>
                        <a href="/user">
                            <img src={logo} className="logo-image-nav" alt="logo"/>
                        </a>
                    </div>
                    <div className="mx-auto">
                        <Navbar.Brand style={{fontSize: "20px"}} className="mx-auto">Today is {new Date().toLocaleDateString()}</Navbar.Brand>
                    </div>
                    <Form style={{fontSize:"20px"}} className="ms-auto">
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            className={`text-${mode === 'light' ? 'dark' : 'light'}`}
                            label={mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                            onChange={handleSwitchMode}
                        />
                    </Form>
                </Container>
            </Navbar>
            <div className={`user-info ${showUserInfo ? "user-info-show" : ""}`}>
                <div className="user-info-content">
                    <Container className="d-flex justify-content-center">
                        <h2>
                            Hello, {fullName}
                        </h2>
                    </Container>
                    <Container className="d-flex justify-content-center">
                        <h4>
                            {googleId ? "Google user " + username : username}
                        </h4>
                    </Container>
                    <div style={{height: "5rem"}}>&nbsp;</div>
                    {user &&                     
                    <Container className="d-flex justify-content-center">
                        <Button variant="outline-dark" onClick={handleLogout}>
                            LOG OUT
                        </Button>
                    </Container>}

                </div>
            </div>
            <div className={`user-info-overlay ${showUserInfo ? "user-info-overlay-show" : ""}`} />
        </header>
    );
}

export default Header;