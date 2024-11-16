import React, { useState } from 'react';
import './PdfToPngConverter.css';

const PdfToPngConverter = () => {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [downloadOption, setDownloadOption] = useState('images'); 
    const [loading, setLoading] = useState(false); // Define the loading state

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage('');
        setSuccessMessage('');
        setImageUrls([]); 
    };

    // Handle the conversion
    const handleConvert = async () => {
        if (!file) {
            setErrorMessage('Please select a PDF file.');
            return;
        }

        setLoading(true); // Set loading state to true when conversion starts

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:3001/api/convert-pdf-to-png?zip=${downloadOption === 'zip'}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Conversion failed.');
            }

            const data = await response.json();

            if (downloadOption === 'images') {
                // Display image URLs
                setImageUrls(data.imageUrls);
                setSuccessMessage('Conversion successful! You can download the images below.');
            } else if (downloadOption === 'zip') {
                // Trigger ZIP download
                const downloadUrl = `http://localhost:3001${data.downloadUrl}`;
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink.download = 'converted_images.zip';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                setSuccessMessage('Conversion successful! ZIP file is downloading.');
            }
        } catch (error) {
            setErrorMessage('Conversion failed. Please try again.');
        } finally {
            setLoading(false); // Reset loading state after conversion
        }
    };

    // Handle convert button click
    const handleConvertClick = () => {
        if (!loading) {
            handleConvert(); // Call the conversion function when button is clicked
        }
    };

    // Function to download individual images
    const handleDownloadImage = async (url, index) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Download failed.');
            }
            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = `converted-image-${index + 1}.png`; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            setErrorMessage('Failed to download image. Please try again.');
        }
    };

    return (
        <div className="pdf-converter-container">
            <h1>Convert PDF to PNG</h1>
            <input type="file" onChange={handleFileChange} accept="application/pdf" />
            
            <div>
                <label>
                    <input 
                        type="radio" 
                        name="downloadOption" 
                        value="images" 
                        checked={downloadOption === 'images'} 
                        onChange={() => setDownloadOption('images')} 
                    />
                    Download individual images
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="downloadOption" 
                        value="zip" 
                        checked={downloadOption === 'zip'} 
                        onChange={() => setDownloadOption('zip')} 
                    />
                    Download ZIP file
                </label>
            </div>

            <button
                className={`convert-button ${loading ? "disabled" : ""}`}
                onClick={handleConvertClick} // Use handleConvertClick
                disabled={loading} // Disable button during conversion
            >
                {loading ? "Converting..." : "Convert to PNG"}
            </button>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {imageUrls.length > 0 && (
                <div className="download-section">
                    <h2>Download Converted Images:</h2>
                    {imageUrls.map((url, index) => (
                        <div key={index}>
                            <span>Image {index + 1}: </span>
                            <button onClick={() => handleDownloadImage(url, index)}>Download</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PdfToPngConverter;







//Individual file

// import React, { useState } from 'react';
// import './PdfToPngConverter.css';

// const PdfToPngConverter = () => {
//     const [file, setFile] = useState(null);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [imageUrls, setImageUrls] = useState([]);

    
//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//         setErrorMessage('');
//         setSuccessMessage('');
//     };

    
//     const handleConvert = async () => {
//         if (!file) {
//             setErrorMessage('Please select a PDF file.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             const response = await fetch('http://localhost:3001/api/convert-pdf-to-png', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error('Conversion failed.');
//             }

//             const data = await response.json();
//             console.log('Conversion response:', data); 
//             setImageUrls(data.imageUrls);  
//             if (data.imageUrls && data.imageUrls.length > 0) {
//                 setSuccessMessage('Conversion successful! You can download the images below.');
//             } else {
//                 setSuccessMessage('Conversion successful, but no images were generated.');
//             }
//         } catch (error) {
//             setErrorMessage('Conversion failed. Please try again.');
//         }
//     };

    
//     const handleDownload = async (url, index) => {
//         try {
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error('Download failed.');
//             }
//             const blob = await response.blob();
//             const downloadLink = document.createElement('a');
//             downloadLink.href = window.URL.createObjectURL(blob);
//             downloadLink.download = `converted-image-${index + 1}.png`; 
//             document.body.appendChild(downloadLink);
//             downloadLink.click();
//             document.body.removeChild(downloadLink);
//         } catch (error) {
//             setErrorMessage('Failed to download image. Please try again.');
//         }
//     };

//     return (
//         <div className="pdf-converter-container">
//             <h1>Convert PDF to PNG</h1>
//             <input type="file" onChange={handleFileChange} accept="application/pdf" />
//             <button onClick={handleConvert}>Convert to PNG</button>

//             {successMessage && <p className="success-message">{successMessage}</p>}
//             {errorMessage && <p className="error-message">{errorMessage}</p>}

//             {imageUrls.length > 0 && (
//                 <div className="download-section">
//                     <h2>Download Converted Images:</h2>
//                     {imageUrls.map((url, index) => (
//                         <div key={index}>
//                             <span>Image {index + 1}: </span>
//                             <button onClick={() => handleDownload(url, index)}>Download</button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PdfToPngConverter;



/// ZIP file Code


// import React, { useState } from 'react';
// import './PdfToPngConverter.css';  

// const PdfToPngConverter = () => {
//     const [file, setFile] = useState(null);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     // Handle file selection
//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//         setErrorMessage('');
//         setSuccessMessage('');
//     };

//     // Handle the conversion and download
//     const handleConvert = async () => {
//       if (!file) {
//           setErrorMessage('Please select a PDF file.');
//           return;
//       }

//       const formData = new FormData();
//       formData.append('file', file);

//       try {
//           const response = await fetch('http://localhost:3001/api/convert-pdf-to-png', {
//               method: 'POST',
//               body: formData
//           });

//           if (!response.ok) {
//               throw new Error('Conversion failed.');
//           }

//           const data = await response.json();
//           const downloadUrl = `http://localhost:3001${data.downloadUrl}`;

//           // Trigger download
//           const downloadLink = document.createElement('a');
//           downloadLink.href = downloadUrl;
//           downloadLink.download = 'converted_images.zip';  
//           document.body.appendChild(downloadLink);
//           downloadLink.click();
//           document.body.removeChild(downloadLink);

//           setSuccessMessage('Conversion successful! ZIP file is downloading.');
//       } catch (error) {
//           setErrorMessage('Conversion failed. Please try again.');
//       }
//   };

//     return (
//         <div className="pdf-converter-container">
//             <h1>Convert PDF to PNG</h1>
//             <input type="file" onChange={handleFileChange} accept="application/pdf" />
//             <button onClick={handleConvert}>Convert to PNG & Download ZIP</button>

//             {successMessage && <p className="success-message">{successMessage}</p>}
//             {errorMessage && <p className="error-message">{errorMessage}</p>}
//         </div>
//     );
// };

// export default PdfToPngConverter;
