import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, Alert, Spinner, Card } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import './PdfCompress.css';
//import './PdfConverter.css';

const PdfCompress = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setMessage('');
        setError('');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
        setError('');
    };

    const handleCompress = async () => {
        if (!file) {
            setError('Please upload a PDF file first.');
            return;
        }

        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3001/api/compress', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const compressedBlob = await response.blob();
                const url = window.URL.createObjectURL(compressedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'compressed.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                setMessage('PDF compressed successfully! Downloading...');
            } else {
                setError('Failed to compress PDF. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while compressing the PDF.');
            console.error('Compression error:', err); // Logging errors for debugging
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': [] }, // Accept only PDF files
    });

    return (
        <Container className="mt-5 cardd">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="custom-card shadow-sm">
                        <Card.Body>
                            <h1 className="text-center mb-4">PDF Compress</h1>

                            {/* Drag and Drop Area */}
                            <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''}` })}>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Drop the PDF file here...</p>
                                ) : (
                                    <p>Drag and drop your PDF file(s) here, or click to select files</p>
                                )}
                            </div>

                            {/* File Input */}
                            <Form.Group className="mt-3" controlId="formFile">
                                {/* <Form.Label className="form-label">Choose a PDF file</Form.Label> */}
                                <Form.Control
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="form-control custom-file-input"
                                />
                            </Form.Group>

                            <Button
                                variant="success"
                                onClick={handleCompress}
                                disabled={loading || !file}
                                className="w-100 mt-3 custom-btn"
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Compress PDF'}
                            </Button>

                            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PdfCompress;
