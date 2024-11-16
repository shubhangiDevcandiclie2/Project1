import React, { useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import './PdfEditor.css';

// Set the workerSrc for PDF.js using the CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js`;

const PdfEditor = () => {
  const [file, setFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const pdfRef = useRef(null);
  const canvasRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPageNumber(1);
      setAnnotations([]); // Reset annotations on file change
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setPageNumber(1);
      setAnnotations([]); // Reset annotations on file drop
    }
  };

  const onLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    pdfRef.current = pdf;
    renderPage(pageNumber);
  };

  const renderPage = async (pageNum) => {
    try {
      const page = await pdfRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      annotations.forEach((annotation) => {
        context.fillStyle = annotation.color || 'red';
        context.fillText(annotation.text, annotation.x, annotation.y);
      });
    } catch (error) {
      console.error("Error rendering page:", error);
    }
  };

  const handleLoadPdf = async () => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      const loadingTask = pdfjs.getDocument(typedArray);

      loadingTask.promise
        .then((pdf) => {
          onLoadSuccess(pdf);
        })
        .catch((error) => {
          console.error("Error loading PDF:", error);
        });
    };

    fileReader.readAsArrayBuffer(file);
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      const newPageNumber = pageNumber + 1;
      setPageNumber(newPageNumber);
      renderPage(newPageNumber);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      renderPage(newPageNumber);
    }
  };

  const addAnnotation = () => {
    const text = prompt("Enter text for annotation:");
    const x = parseInt(prompt("Enter x position:"));
    const y = parseInt(prompt("Enter y position:"));
    const color = prompt("Enter color for annotation:");

    if (text && !isNaN(x) && !isNaN(y) && color) {
      setAnnotations((prevAnnotations) => [
        ...prevAnnotations,
        { text, x, y, color },
      ]);
      renderPage(pageNumber); // Re-render to show the new annotation
    }
  };

  return (
    <div className="pdf-editor">
      <h2>PDF Editor</h2>

      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <label className="upload-label">
          Drag & Drop your file here or
          <input type="file" accept="application/pdf" onChange={onFileChange} />
          <button className="choose-file-btn">Choose File</button>
        </label>
      </div>

      <button onClick={handleLoadPdf} className="load-btn">Load PDF</button>

      {file && (
        <div>
          <div className="pdf-toolbar">
            <button onClick={addAnnotation}>Add Annotation</button>
            <button onClick={() => alert('Add Shape - Coming Soon!')}>Add Shape</button>
            <button onClick={() => alert('Add Image - Coming Soon!')}>Add Image</button>
            <button onClick={() => alert('Bold Text - Coming Soon!')}>Bold</button>
          </div>
          <canvas
            ref={canvasRef}
            className="pdf-canvas"
          ></canvas>
          <div className="navigation-btns">
            <button onClick={prevPage} disabled={pageNumber <= 1}>
              Previous
            </button>
            <button onClick={nextPage} disabled={pageNumber >= numPages}>
              Next
            </button>
          </div>
          <p className="page-info">
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </div>
  );
};

export default PdfEditor;
