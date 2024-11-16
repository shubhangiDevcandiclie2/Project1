import React, { useState } from 'react';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';
import './WordToPdfConverter.css';

const WordToPdfConverter = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setErrorMessage('');
        setPdfUrl(null); // Reset any previous PDF URL
    };

    const convertWordToPdf = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a Word file to convert.');
            return;
        }

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target.result;

            try {
                const result = await mammoth.convertToHtml({ arrayBuffer });
                const htmlContent = result.value;

                const pdfContainer = document.createElement('div');
                pdfContainer.innerHTML = htmlContent;
                pdfContainer.style.fontFamily = 'Arial, sans-serif';
                pdfContainer.style.padding = '20px';
                pdfContainer.style.lineHeight = '1.6';

                const style = document.createElement('style');
                style.textContent = `
                    h1, h2, h3 { font-size: 1.2em; margin: 0.5em 0; }
                    p, li { font-size: 1em; margin: 0.4em 0; }
                    a { font-size: 1em; text-decoration: none; color: blue; }
                    img, svg { width: 1em; height: 1em; vertical-align: middle; }
                `;
                pdfContainer.prepend(style);

                html2pdf()
                    .from(pdfContainer)
                    .set({
                        filename: 'converted.pdf',
                        html2canvas: { scale: 2 },
                        jsPDF: { orientation: 'portrait', unit: 'in', format: 'letter', compressPDF: true },
                    })
                    .outputPdf('blob')
                    .then((pdfBlob) => {
                        const pdfUrl = URL.createObjectURL(pdfBlob);
                        setPdfUrl(pdfUrl);
                        setLoading(false);
                    })
                    .catch((error) => {
                        setErrorMessage(`Error creating PDF: ${error.message}`);
                        setLoading(false);
                    });
            } catch (error) {
                setErrorMessage(`Error processing file: ${error.message}`);
                setLoading(false);
            }
        };

        reader.onerror = () => {
            setErrorMessage('Failed to read the Word file.');
            setLoading(false);
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    return (
        <div className="converter-container custom-card shadow-sm">
            <h1 className="text-center mb-4">Word to PDF Converter</h1>

            <div className="file-upload" onClick={() => document.getElementById('file-input').click()}>
                <input
                    type="file"
                    id="file-input"
                    accept=".docx"
                    onChange={handleFileChange}
                />
                <p>Drag and drop your Word file here, or click to select files</p>
            </div>

            {selectedFile && <p className="selected-file">Selected File: {selectedFile.name}</p>}

            <button onClick={convertWordToPdf} disabled={loading} className="convert-button">
                {loading ? 'Converting...' : 'Convert to PDF'}
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {pdfUrl && (
                <div>
                    <a href={pdfUrl} download="converted.pdf" className="download-link">Download PDF</a>
                </div>
            )}
        </div>
    );
};

export default WordToPdfConverter;
