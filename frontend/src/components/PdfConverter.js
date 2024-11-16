import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import mammoth from "mammoth";
import "./PdfConverter.css";

const PdfConverter = () => {
    const [files, setFiles] = useState([]);
    const [conversionType, setConversionType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state
    const location = useLocation();
    const navigate = useNavigate();

    const { conversionFormat } = location.state || {};

    useEffect(() => {
        setConversionType(conversionFormat);
    }, [conversionFormat]);

    const isFileValid = useCallback((file) => {
        if (conversionType === "jpeg" && file.type !== "image/jpeg") return false;
        if (conversionType === "png" && file.type !== "image/png") return false;
        if (conversionType === "word" && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return false;
        if (conversionType === "html" && file.type !== "text/html") return false;
        return true;
    }, [conversionType]);

    const onDrop = useCallback((acceptedFiles) => {
        const invalidFiles = acceptedFiles.filter(file => !isFileValid(file));

        if (invalidFiles.length > 0) {
            alert(`Invalid file format. Please upload only ${conversionType.toUpperCase()} file(s).`);
            return;
        }

        setFiles(acceptedFiles);
        setErrorMessage("");
    }, [conversionType, isFileValid]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const invalidFiles = selectedFiles.filter(file => !isFileValid(file));

        if (invalidFiles.length > 0) {
            alert(`Invalid file format. Please upload only ${conversionType.toUpperCase()} file(s).`);
            return;
        }

        setFiles(selectedFiles);
        setErrorMessage("");
    };

    const handleConvertClick = async () => {
        if (files.length === 0) return;

        setLoading(true); // Start loading when conversion begins

        if (conversionType === "word") {
            try {
                for (const file of files) {
                    const arrayBuffer = await file.arrayBuffer();
                    const { value: htmlContent } = await mammoth.convertToHtml({ arrayBuffer });

                    const printWindow = window.open("", "_blank");
                    printWindow.document.write(`
                        <html>
                            <head><title>Converted PDF</title></head>
                            <body>${htmlContent}</body>
                        </html>
                    `);
                    printWindow.document.close();
                    printWindow.onload = () => printWindow.print();
                }
            } catch (error) {
                console.error("Conversion error:", error);
                setErrorMessage("Error converting the files.");
            } finally {
                setLoading(false); // Stop loading when the conversion is done
            }
        } else {
            navigate("/progress", { state: { files, conversionType } });
            setLoading(false); // Stop loading after navigating
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: conversionType === "jpeg" || conversionType === "png" || conversionType === "word",
        accept: conversionType === "jpeg" ? "image/jpeg" :
               conversionType === "png" ? "image/png" :
               conversionType === "word" ? ".docx" : "",
    });

    return (
        <div className="pdf-converter-container">
            <h1>{conversionType === "word" ? "WORD to PDF Converter" : conversionType.toUpperCase() + " to PDF Converter"}</h1>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div {...getRootProps({ className: "dropzone enhanced-dropzone" })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="drag-active-text">Drop the files here...</p>
                ) : (
                    <p className="drag-inactive-text">Drag and drop your {conversionType === "word" ? "Word" : conversionType.toUpperCase()} file(s) here, or click to select files</p>
                )}
            </div>

            <div className="file-input">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept={conversionType === "jpeg" ? "image/jpeg" :
                            conversionType === "png" ? "image/png" :
                            conversionType === "word" ? ".docx" : ""}
                    multiple={conversionType === "jpeg" || conversionType === "png" || conversionType === "word"}
                />
            </div>

            {files.length > 0 && (
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            )}

            <button
                className={`convert-button ${loading ? "disabled" : ""}`}
                onClick={handleConvertClick}
                disabled={loading} // Disable button when loading
            >
                {loading ? "Converting..." : "Convert to PDF"}
            </button>
        </div>
    );
};

export default PdfConverter;
