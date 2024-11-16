import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import mammoth from "mammoth"; 
import "./ProgressPage.css";

const ProgressPage = () => {
    const location = useLocation();
    const { files, conversionType } = location.state || {};
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(""); 

    useEffect(() => {
        if (files && files.length > 0) {
            const progressInterval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prevProgress + 20;
                });
            }, 500);

            setTimeout(() => {
                const pdf = new jsPDF();
                let promises = [];

                files.forEach((file, index) => {
                    if (file.type.startsWith("image/")) {
                        
                        const img = new Image();
                        const promise = new Promise((resolve, reject) => {
                            img.src = URL.createObjectURL(file);
                            img.onload = () => {
                                const imgWidth = 210;
                                const pageHeight = 297;
                                const imgHeight = (img.height * imgWidth) / img.width;
                                let xOffset = (imgWidth - img.width * (imgWidth / img.width)) / 2;
                                let yOffset = (pageHeight - imgHeight) / 2;

                                if (imgHeight > pageHeight) {
                                    pdf.addImage(img, "JPEG", 0, 0, imgWidth, pageHeight);
                                } else {
                                    pdf.addImage(img, "JPEG", xOffset, yOffset, imgWidth, imgHeight);
                                }

                                if (index < files.length - 1) {
                                    pdf.addPage();
                                }
                                resolve();
                            };
                            img.onerror = () => reject("Failed to load image for PDF conversion");
                        });

                        promises.push(promise);
                    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                        
                        const promise = new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = function(event) {
                                const arrayBuffer = event.target.result;
                                mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                                    .then((result) => {
                                        const html = result.value;
                                        pdf.text(html, 10, 10); 
                                        if (index < files.length - 1) {
                                            pdf.addPage();
                                        }
                                        resolve();
                                    })
                                    .catch((error) => {
                                        reject("Error converting Word to PDF");
                                    });
                            };
                            reader.readAsArrayBuffer(file);
                        });

                        promises.push(promise);
                    } else if (file.type === "application/pdf") {
                        
                        const promise = new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = function(event) {
                                const pdfData = new Uint8Array(event.target.result);
                                const pdfDoc = new jsPDF();
                                pdfDoc.addPage();
                                pdfDoc.addImage(pdfData, 'PDF', 0, 0); 
                                if (index < files.length - 1) {
                                    pdfDoc.addPage();
                                }
                                resolve();
                            };
                            reader.onerror = () => reject("Failed to load PDF for conversion");
                            reader.readAsArrayBuffer(file);
                        });

                        promises.push(promise);
                    } else if (file.type === "text/html") {
                        
                        const promise = new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = function(event) {
                                const htmlContent = event.target.result;
                                pdf.text(htmlContent, 10, 10); 
                                if (index < files.length - 1) {
                                    pdf.addPage();
                                }
                                resolve();
                            };
                            reader.onerror = () => reject("Error reading HTML file");
                            reader.readAsText(file);
                        });

                        promises.push(promise);
                    }
                });

                Promise.all(promises)
                    .then(() => {
                        const pdfBlob = pdf.output("blob");
                        const pdfUrl = URL.createObjectURL(pdfBlob);
                        setDownloadUrl(pdfUrl);
                        setLoading(false);
                    })
                    .catch((error) => {
                        setErrorMessage(error); 
                        setLoading(false);
                    });
            }, 3000);
        }
    }, [files, conversionType]); 

    return (
        <div className="progress-page">
            <h1>Converting Your Files...</h1>

            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }} 
                >
                    {progress}%
                </div>
            </div>

            {errorMessage && (
                <div className="error-section">
                    <h3>Error: {errorMessage}</h3>
                </div>
            )}

            {!loading && downloadUrl && (
                <div className="download-section">
                    <h3>Conversion Complete</h3>
                    <a
                        href={downloadUrl}
                        download={`converted_${conversionType}.pdf`} file name
                        className="download-button"
                    >
                        Download PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export default ProgressPage;
