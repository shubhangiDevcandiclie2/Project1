import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS for styling
import Footer from './Footer'; // Import Footer component

import jpgIcon from '../images/jpg-icon1.png';
import pngIcon from '../images/png-icon1.png';
import WordIcon from '../images/word-icon1.png';
//import wordIcon from '../images/pdf-to-word-icon.png';
import compressIcon from '../images/compress-pdf-icon.png';
import powerPointIcon from '../images/powerPointIcon1.png';
import pdfEditorIcon from '../images/editor-icon.png';
import htmlIcon from '../images/html-icon1 (2).png';
import htmlIcon1 from '../images/pdf2.png';


const HomePage = () => {
    const navigate = useNavigate();

    // Handler for navigation based on conversion format
    const handleConversionClick = (route, format) => {
        navigate(route, { state: { conversionFormat: format } });
    };

    return (
        <div className="home-page-container">
            <h1>Welcome to the Free PDF Converter</h1>
            <p>Select a format to convert your files:</p>

            {/* Conversion Tools Grid */}
            <div className="conversion-grid">
                {/* First Row */}
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf-converter", "jpeg")}>
                    <div className="image-container">
                            <img src={jpgIcon} alt="JPEG to PDF" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={htmlIcon1} alt="JPEG to PDF" className="image-icon" />
                    </div>
                    <div className='heading'> JPEG to PDF</div>
                    </button>
                </div>
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf-converter", "png")}>
                    <div className="image-container">
                            <img src={pngIcon} alt="PNG to PDF" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={htmlIcon1} alt="PNG to PDF" className="image-icon" />
                    </div>
                    <div className='heading'> PNG to PDF</div>
                    </button>
                </div>
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf-converter", "word")}>
                    <div className="image-container">
                            <img src={WordIcon} alt="WORD to PDF" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={htmlIcon1} alt="WORD to PDF" className="image-icon" />
                    </div>
                    <div className='heading'> WORD to PDF</div>
                    </button>
                </div>

                {/* Second Row */}
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/html_to_pdf", "html")}>
                        <div className="image-container">
                            <img src={htmlIcon} alt="HTML to PDF" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={htmlIcon1} alt="HTML to PDF" className="image-icon" />
                        </div>
                       <div className='heading'> HTML to PDF</div>
                    </button>
                </div>
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf_to_word", "pdf")}>
                    <div className="image-container">
                            <img src={htmlIcon1} alt="PDF to WORD" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={WordIcon} alt="PDF to WORD" className="image-icon" />
                    </div>
                    <div className='heading'>PDF to Word</div>
                    </button>
                </div>
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf_to_png", "pdf")}>
                    <div className="image-container">
                            <img src={htmlIcon1} alt="PDF to PNG" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={pngIcon} alt="PDF to PNG" className="image-icon" />
                    </div>
                    <div className='heading'>PDF to PNG</div>
                    </button>
                </div>

                {/* Third Row */}
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf_to_jpeg", "pdf")}>
                    <div className="image-container">
                            <img src={htmlIcon1} alt="PDF to JPEG" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={jpgIcon} alt="PDF to JPEG" className="image-icon" />
                    </div>
                    <div className='heading'>PDF to JPEG</div>
                    </button>
                </div>
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf_compress", "pdf")}>
                    <div className="image-container">
                            <img src={htmlIcon1} alt="PDF to Compress" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={compressIcon} alt="PDF to Compress" className="image-icon" />
                    </div>  
                    <div className='heading'>PDF Compress</div>
                    </button>
                </div>
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf_to_power_point", "pdf")}>
                    <div className="image-container">
                            <img src={htmlIcon1} alt="PDF to PowerPoint" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={powerPointIcon} alt="PDF to PowerPoint" className="image-icon" />
                    </div>  
                    <div className='heading'>PDF to PowerPoint</div>
                    </button>
                </div>

                {/* Fourth Row */}
                <div className="conversion-card">
                    <button onClick={() => handleConversionClick("/pdf_editor", "pdf")}>
                    <div className="image-container">
                            <img src={htmlIcon1} alt="PDF to PowerPoint" className="image-icon" />
                            <span className="arrow">→</span>
                            <img id="img2" src={pdfEditorIcon} alt="PDF to PowerPoint" className="image-icon" />
                    </div>
                    <div className='heading'>PDF Editor</div>
                    </button>
                </div>
            </div>

            {/* Footer */}
         <Footer />

        </div>

    );
};

export default HomePage;




//Same PDF

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import "./Home.css";

// const HomePage = () => {
//     const navigate = useNavigate();

//     // Handler for navigation based on conversion format
//     const handleConversionClick = (route, format) => {
//         navigate(route, { state: { conversionFormat: format } });
//     };

//     return (
//         <div className="home-page-container">
//             <h1>Welcome to the Free PDF Converter</h1>
//             <p>Select a format to convert your files:</p>
//             <div className="conversion-buttons">
//                 <button onClick={() => handleConversionClick("/pdf-converter", "jpeg")}>JPEG to PDF</button>
//                 <button onClick={() => handleConversionClick("/pdf-converter", "png")}>PNG to PDF</button>
//                 <button onClick={() => handleConversionClick("/pdf-converter", "word")}>Word to PDF</button>
//             </div>
//             <div className="conversion-buttons">
//                 <button onClick={() => handleConversionClick("/html_to_pdf", "html")}>HTML to PDF</button>
//                 <button onClick={() => handleConversionClick("/pdf_to_word", "pdf")}>PDF to Word</button>
//                 <button onClick={() => handleConversionClick("/pdf_to_png", "pdf")}>PDF to PNG</button>
//             </div>
//             <div className="conversion-buttons">
//                 <button onClick={() => handleConversionClick("/pdf_to_jpeg", "pdf")}>PDF to JPEG</button>
//                 <button onClick={() => handleConversionClick("/pdf_compress", "pdf")}>PDF Compress</button>
//                 <button onClick={() => handleConversionClick("/pdf_to_power_point", "pdf")}>PDF to PowerPoint</button>
//             </div>
//             <div className="conversion-buttons">
//             <button onClick={() => handleConversionClick("/pdf_editor", "pdf")}>PDF Editor</button>
//             </div>
//         </div>
//     );
// };

// export default HomePage;

