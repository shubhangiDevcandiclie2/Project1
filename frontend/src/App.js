import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home"; 
import PdfConverter from "./components/PdfConverter";
import ProgressPage from "./components/ProgressPage";
import PdfGenerator from "./components/PdfGenerator";
import WordToPdfConverter from "./components/WordToPdfConverter";
import PdfToWordConverter from "./components/PdfToWordConverter";
import PdfToJpegConverter from "./components/PdfToJpegConverter";
import PdfToPngConverter from "./components/PdfToPngConverter";
import PdfCompress from "./components/PdfCompress";
import PdfToPowerPoint from "./components/PdfToPowerPoint";
import PdfEditor from "./components/PdfEditor";
import Navbar from "./components/Navbar"; 
import "./App.css";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pdf-converter" element={<PdfConverter />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/html_to_pdf" element={<PdfGenerator />} /> 
                    <Route path="/word_to_pdf" element={<WordToPdfConverter />} /> 
                    <Route path="/pdf_to_word" element={<PdfToWordConverter />} /> 
                    <Route path="/pdf_to_jpeg" element={<PdfToJpegConverter />} /> 
                    <Route path="/pdf_to_png" element={<PdfToPngConverter />} />
                    <Route path="/pdf_compress" element={<PdfCompress />} />
                    <Route path="/pdf_to_power_point" element={<PdfToPowerPoint />} />
                    <Route path="/pdf_editor" element={<PdfEditor />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
