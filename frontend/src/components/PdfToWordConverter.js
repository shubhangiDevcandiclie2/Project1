import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ClipLoader } from "react-spinners";
import { FaFilePdf, FaCloudDownloadAlt } from "react-icons/fa";
import Form from "react-bootstrap/Form"; // Import Form component
import "./PdfToWordConverter.css";

const PdfToWordConverter = () => {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setDownloadUrl(null); // Clear the download link if a new file is uploaded
      setNotification("");
    } else {
      setNotification("Please upload a valid PDF file.");
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setDownloadUrl(null); // Clear the download link if a new file is uploaded
      setNotification("");
    } else {
      setNotification("Please upload a valid PDF file.");
    }
  };

  const handleConvertClick = () => {
    if (!file) {
      setNotification("No file selected.");
      return;
    }

    setLoading(true);
    setNotification("Starting conversion...");

    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:3001/api/convert-pdf`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Server error: ${text}`);
          });
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setLoading(false);
        setNotification("Conversion successful! Click download to get your DOCX file.");
      })
      .catch((error) => {
        console.error("Error converting PDF:", error);
        setLoading(false);
        setNotification(`An error occurred during conversion: ${error.message}`);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
    multiple: false,
  });

  return (
    <div className="converter-container custom-card shadow-sm">
      <h1 className="text-center mb-4">PDF to Word Converter</h1>

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your PDF file here...</p>
        ) : (
          <p>
            <FaFilePdf /> Drag & Drop or Click to Upload a PDF File
          </p>
        )}
      </div>

      {/* File Input */}
      <Form.Group className="mt-3" controlId="formFile">
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="form-control custom-file-input"
        />
      </Form.Group>

      {file && <p className="file-name">Selected File: {file.name}</p>}

      <button
        className={`convert-button ${loading ? "disabled" : ""}`}
        onClick={handleConvertClick}
        disabled={loading}

      >
        {loading ? "Converting..." : "Convert to DOCX"}
      </button>

      {loading && (
        <div className="spinner">
          <ClipLoader size={50} color="#4CAF50" loading={loading} />
        </div>
      )}

      {notification && (
        <p className={`notification ${notification.includes("successful") ? "success" : ""}`}>
          {notification}
        </p>
      )}

      {downloadUrl && (
        <div className="download-section">
          <a href={downloadUrl} download="converted.docx" className="download-button">
            <FaCloudDownloadAlt /> Download DOCX
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfToWordConverter;
