import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UrlModal = ({ show, handleClose, handleUrlSubmit }) => {
    const [url, setUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(true);

    const validateUrl = (urlString) => {
        const urlPattern = new RegExp('^(https?:\\/\\/)?'+ 
            '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|'+ 
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
            '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*'+ 
            '(\\?[;&a-zA-Z\\d%_.~+=-]*)?'+ 
            '(\\#[-a-zA-Z\\d_]*)?$','i');
        return !!urlPattern.test(urlString);
    };

    const handleSubmit = () => {
        if (validateUrl(url)) {
            setIsValidUrl(true);
            handleUrlSubmit(url); 
            handleClose(); 
        } else {
            setIsValidUrl(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add HTML to convert from</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicUrl">
                        <Form.Label>Write the website URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter URL" 
                            value={url} 
                            onChange={(e) => setUrl(e.target.value)} 
                            isInvalid={!isValidUrl}
                        />
                        {!isValidUrl && <Form.Control.Feedback type="invalid">
                            Invalid URL format
                        </Form.Control.Feedback>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UrlModal;
