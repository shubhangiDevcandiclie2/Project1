import React from "react";
import "./Navbar.css";

import logoIcon from '../images/logo.png';

const Navbar = () => {
    return (
        <div className="navbar-container">
            <nav className="navbar">
                <ul className="breadcrumb">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>PDF Converter</li>
                </ul>
                <div className="logo">
                    <img src={logoIcon} alt="Logo" />
                    <a href="/">Free PDF Converter</a>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
