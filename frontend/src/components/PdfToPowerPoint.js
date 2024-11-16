import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './PdfToPowerPoint.css';
//import '../App.css';
const PdfToPowerPoint = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setErrorMessage('');
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setErrorMessage('');
        } else {
            setErrorMessage('Please upload a valid PDF file.');
        }
    };

    const handlePdfToPptConversion = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a file to convert.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:3001/convert/pdf-to-ppt', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'converted.pptx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                throw new Error('Failed to convert PDF to PowerPoint');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Error during conversion: ' + error.message);
        }
    };

    return (
        <Container className="mt-5 container">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow-lg cardd">
                        <Card.Body>
                            <h1 className="text-center mb-4">PDF to PowerPoint Converter</h1>

                            {/* Drag and Drop Container */}
                            <div
                                className={`dropzone ${dragActive ? 'active' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {selectedFile ? (
                                    <p className="file-name">{selectedFile.name}</p>
                                ) : (
                                    <p>Drag & drop your PDF file here</p>
                                )}
                            </div>

                            {/* Traditional File Picker */}
                            <div className="file-picker">
                                {/* <p className="text-center mt-2">Or</p> */}
                                <Form.Group className="mb-3">
                                    {/* <Form.Label>Select a file from your device</Form.Label> */}
                                    <Form.Control
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                    />
                                </Form.Group>
                            </div>

                            {/* Convert Button */}
                            <Button
                                variant="success"
                                onClick={handlePdfToPptConversion}
                                disabled={!selectedFile}
                                className="w-100 mt-3"
                            >
                                Convert to PowerPoint
                            </Button>

                            {/* Error Message */}
                            {errorMessage && (
                                <Alert variant="danger" className="mt-3 text-center">
                                    {errorMessage}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PdfToPowerPoint;
