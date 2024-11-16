import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./PdfGenerator.css";

const socket = io("http://localhost:3001");

const PdfGenerator = () => {
  const [url, setUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Listen for the response from the server
    socket.on("pdf_generated", (data) => {
      setPdfUrl(data.pdfUrl);
      setStatus("PDF Generated Successfully!");
    });

    socket.on("error", (data) => {
      setStatus(data.message);
    });

    return () => {
      socket.off("pdf_generated");
      socket.off("error");
    };
  }, []);

  const handleGeneratePdf = () => {
    if (url) {
      setStatus("Generating PDF...");
      // Send the URL to the server
      socket.emit("generate_pdf", { url });
    } else {
      setStatus("Please enter a valid URL.");
    }
  };

  return (
    <div className="pdf-generator-container">
      <div className="pdf-generator-content">
        <h1>Web Page to PDF Generator</h1>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the URL of the website"
          className="input-field"
        />
        <button onClick={handleGeneratePdf} className="generate-btn">
          Generate PDF
        </button>
        <p className={`status-message ${status.includes("Successfully") ? "success" : "error"}`}>
          {status}
        </p>
        {pdfUrl && (
          <div className="pdf-link">
            <p>
              Your PDF is ready:{" "}
              <a
                href={`http://localhost:3000${pdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="download-link"
              >
                Download PDF
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfGenerator;
