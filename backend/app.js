import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';
import puppeteer from 'puppeteer';
import pdfPoppler from 'pdf-poppler';
//import { PDFDocument } from 'pdf-lib';
//import mammoth from 'mammoth';
import PptxGenJS from 'pptxgenjs';
//import pdfParse from "pdf-parse";
//import htmlToDocx from "html-to-docx";
import { spawn } from 'child_process';
import { exec } from 'child_process';
// import { PythonShell } from 'python-shell';
import multer from 'multer';  
//import convertRoutes from './routes/convert.js';  // Import the routes
import { convertPdfToJpegAndZip, convertPdfToPngAndZip} from './utils/convertUtils.js'; // Import your conversion utility
import { fileURLToPath } from 'url';  // Import for defining __dirname

// Create an Express application
const app = express();
const PORT = 3001; 

// Create an HTTP server for socket.io
const server = http.createServer(app);

// Create a new instance of socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the "uploads" directory exists for file uploads
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); // Create the directory if it doesn't exist
}

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

// Middleware
app.use(cors(corsOptions)); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadsDir));

// // Routes uncomment the PDF To Image
// app.use('/api', convertRoutes);

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/'}); 


// PDF to DOCX conversion route // swan fizt
app.post('/api/convert-pdf', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const outputPath = `${uploadsDir}/${Date.now()}_output.docx`;

    const process = spawn('python', ['convert.py', req.file.path, outputPath]);

    process.stdout.on('data', (data) => {
        console.log(`Conversion Output: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        if (code === 0) {
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Error during file download:', err);
                    res.status(500).send('Failed to download the file.');
                }
            });
        } else {
            res.status(500).send('Conversion failed.');
        }
    });
});

// WebSocket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listen for a request from the client
    socket.on("generate_pdf", async (data) => {
        const { url } = data;

        try {
            // Launch Puppeteer to get the HTML and render it as a PDF
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('http://example.com', { waitUntil: 'networkidle2', timeout: 60000, waitForNavigation: { timeout: 60000 } });


            // Generate the PDF
            const pdfPath = path.join(__dirname, `pdfs/${socket.id}.pdf`);
            await page.pdf({
                path: pdfPath,
                format: "A4",
                printBackground: true,
            });

            await browser.close();

            // Send back the URL of the generated PDF
            socket.emit("pdf_generated", { pdfUrl: `/pdfs/${socket.id}.pdf` });
        } catch (err) {
            console.error("Error generating PDF:", err);
            socket.emit("error", { message: "Failed to generate PDF" });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Give both options file and ZIP
app.post('/api/convert-pdf-to-jpeg', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const pdfFilePath = req.file.path;
    const outputDir = path.dirname(pdfFilePath);
    const imageUrls = [];
    const outputFileName = `${Date.now()}-converted`;

    const popplerOptions = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: outputFileName,
        page: null,
    };

    try {
        // Convert PDF to individual JPEG images
        await pdfPoppler.convert(pdfFilePath, popplerOptions);

        // Collect URLs for individual images
        let page = 1;
        while (fs.existsSync(path.join(outputDir, `${outputFileName}-${page}.jpg`))) {
            const convertedFilePath = `/uploads/${outputFileName}-${page}.jpg`;
            imageUrls.push(`http://localhost:3001${convertedFilePath}`); // Adjust for your server URL
            page++;
        }

        // If the request is for ZIP file download
        if (req.query.zip === 'true') {
            const { zipPath } = await convertPdfToJpegAndZip(pdfFilePath);
            return res.json({ downloadUrl: `/uploads/${path.basename(zipPath)}` });
        }

        // Otherwise, return the individual image URLs
        if (imageUrls.length === 0) {
            return res.status(500).send('No images were generated.');
        }

        res.json({ imageUrls });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).send('Error converting PDF to JPEG.');
    }
});


// Give both options file and ZIP
app.post('/api/convert-pdf-to-png', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const pdfFilePath = req.file.path;
    const outputDir = path.dirname(pdfFilePath);
    const imageUrls = [];
    const outputFileName = `${Date.now()}-converted`;

    const popplerOptions = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: outputFileName,
        page: null,
    };

    try {
        // Convert PDF to individual PNG images
        await pdfPoppler.convert(pdfFilePath, popplerOptions);

        // Collect URLs for individual images
        let page = 1;
        while (fs.existsSync(path.join(outputDir, `${outputFileName}-${page}.png`))) {
            const convertedFilePath = `/uploads/${outputFileName}-${page}.png`;
            imageUrls.push(`http://localhost:3001${convertedFilePath}`); // Adjust for your server URL
            page++;
        }

        // If the request is for ZIP file download
        if (req.query.zip === 'true') {
            const { zipPath } = await convertPdfToPngAndZip(pdfFilePath);
            return res.json({ downloadUrl: `/uploads/${path.basename(zipPath)}` });
        }

        // Otherwise, return the individual image URLs
        if (imageUrls.length === 0) {
            return res.status(500).send('No images were generated.');
        }

        res.json({ imageUrls });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).send('Error converting PDF to PNG.');
    }
});

// Compress PDF using Ghostscript
app.post('/api/compress', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const inputFilePath = req.file.path; // Path of the uploaded file
    const outputFilePath = path.join('uploads', `compressed-${req.file.originalname}`); // Path for the compressed file

    // Define the Ghostscript command with the correct path
    const gsCommand = `"D:\\Softwares\\gs10.04.0\\bin\\gswin64c.exe" -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -dPDFSETTINGS=/printer -dDownsampleColorImages=true -dColorImageResolution=150 -dDownsampleGrayImages=true -dGrayImageResolution=150 -dDownsampleMonoImages=true -dMonoImageResolution=150 -sOutputFile="${outputFilePath}" "${inputFilePath}"`;

    // Execute the Ghostscript command
    exec(gsCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Error compressing PDF:', stderr);
            return res.status(500).send(`Failed to compress PDF: ${stderr}`);
        }

        // Send the compressed PDF file for download
        res.download(outputFilePath, 'compressed.pdf', (err) => {
            if (err) {
                console.error('Error downloading compressed PDF:', err);
                return res.status(500).send('Error downloading compressed PDF.');
            }
        });
    });
});


// PDFgen

// Function to convert PDF pages to images using pdf-poppler
// Function to convert PDF pages to high-quality images using pdf-poppler
// Function to convert PDF pages to images
const convertPdfToImages = async (pdfPath, outputDir) => {
    const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null // Convert all pages
    };

    try {
        await pdfPoppler.convert(pdfPath, options);
        console.log("PDF successfully converted to images.");
    } catch (error) {
        console.error("Error converting PDF to images:", error);
        throw new Error("PDF to image conversion failed.");
    }
};

// Function to create PPTX from images
const createPptxFromImages = async (outputDir, pptxFile) => {
    const pptx = new PptxGenJS();

    // Read image files from outputDir
    const imageFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.png'));

    if (imageFiles.length === 0) {
        throw new Error("No images found to create PowerPoint.");
    }

    // Loop over each image and add it to a new slide
    imageFiles.forEach((imageFile, index) => {
        const slide = pptx.addSlide();
        const imagePath = path.join(outputDir, imageFile);

        // Add image to the slide
        slide.addImage({
            path: imagePath,
            x: 0, // Position image at the top-left corner
            y: 0,
            w: '100%', // Make the image fill the entire slide
            h: '100%'
        });

        console.log(`Added slide for image ${index + 1}`);
    });

    // Save the PPTX file
    try {
        await pptx.writeFile({ fileName: pptxFile });
        console.log("PowerPoint file saved successfully.");
    } catch (error) {
        console.error("Error saving PowerPoint file:", error);
        throw new Error("Failed to save PowerPoint.");
    }
};

// Main function to handle the PDF to PowerPoint conversion
const main = async (pdfPath, outputDir, pptxFile) => {
    try {
        await convertPdfToImages(pdfPath, outputDir);
        await createPptxFromImages(outputDir, pptxFile);
    } catch (error) {
        console.error("Error during conversion:", error);
    }
};

// API route to handle PDF to PPTX conversion
app.post("/convert/pdf-to-ppt", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const pdfFilePath = req.file.path;
    const outputDir = path.join(process.cwd(), "output_images");  // Updated path to use process.cwd()
    const pptxFilePath = path.join(process.cwd(), "uploads", `converted-${Date.now()}.pptx`);

    try {
        await main(pdfFilePath, outputDir, pptxFilePath);

        // Send the generated PowerPoint file to the user for download
        res.download(pptxFilePath, "converted.pptx", (err) => {
            if (err) {
                console.error("Error downloading PowerPoint:", err);
                return res.status(500).send("Error downloading PowerPoint.");
            }

            // Clean up uploaded PDF, images, and PPTX file after download
            fs.unlink(pdfFilePath, () => {});
            fs.unlink(pptxFilePath, () => {});
            fs.rmdirSync(outputDir, { recursive: true }); // Delete all images in the output folder
        });
    } catch (error) {
        console.error("Error during conversion:", error);
        res.status(500).send("Failed to convert PDF to PowerPoint.");
    }
});


// // Word To PDF
// // Word To PDF
app.post('/convert', upload.single('file'), (req, res) => {
    const inputFilePath = req.file.path;
    const outputFilePath = `${inputFilePath}.pdf`;

    // Use LibreOffice to convert Word to PDF
    exec(`libreoffice --headless --convert-to pdf ${inputFilePath} --outdir uploads/`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Conversion error: ${error.message}`);
            return res.status(500).send('Conversion failed.');
        }

        // Send back the converted PDF
        res.download(outputFilePath, 'converted.pdf', (err) => {
            if (err) {
                console.error(`File download error: ${err.message}`);
            }
            // Cleanup the uploaded file and the generated PDF
            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
        });
    });
});



// Start the HTTP server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



