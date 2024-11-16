import React from 'react';
import './Footer.css';

import instagramIcon from '../images/instagram-icon.png';
import facebookIcon from '../images/facebook-icon.png';
import twitterIcon from '../images/twitter-icon.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section product">
                    <h3>Product</h3>
                    <ul>
                        <li><a href="/features">Features</a></li>
                        <li><a href="/pricing">Pricing</a></li>
                        <li><a href="/download">Download</a></li>
                    </ul>
                </div>

                <div className="footer-section solution">
                    <h3>Solution</h3>
                    <ul>
                        <li><a href="/business">Business</a></li>
                        <li><a href="/education">Education</a></li>
                        <li><a href="/enterprise">Enterprise</a></li>
                    </ul>
                </div>

                <div className="footer-section company">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>Email: <a href="mailto:support@pdfconverter.com">support@pdfconverter.com</a></p>
                    <div className="social-icons">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src={instagramIcon} alt="Instagram" />
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src={facebookIcon} alt="Facebook" />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src={twitterIcon} alt="Twitter" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 Free PDF Converter. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
