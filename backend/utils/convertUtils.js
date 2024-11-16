// Provide both option Like images and ZIP file

import fs from 'fs';
import path from 'path';
import pdfPoppler from 'pdf-poppler';
import archiver from 'archiver';

// Convert PDF to JPEG and create ZIP (Option 1: ZIP)
export const convertPdfToJpegAndZip = async (pdfPath) => {
    const outputDir = path.join('uploads', 'converted_images');
    
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // PDF to JPEG conversion options
    const popplerOptions = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: 'page',
        page: null,
    };

    try {
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF file not found at path: ${pdfPath}`);
        }

        // Convert PDF to JPEG
        await pdfPoppler.convert(pdfPath, popplerOptions);  

        // Collect generated JPEG files
        const jpegFiles = fs.readdirSync(outputDir)
            .filter(file => file.endsWith('.jpeg') || file.endsWith('.jpg'))
            .map(file => path.join(outputDir, file)); // Include full paths

        if (jpegFiles.length === 0) {
            throw new Error('No JPEG files generated from the PDF.');
        }

        // Create a ZIP file of all JPEGs
        const zipPath = path.join('uploads', `${Date.now()}-converted_images.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Handle archive completion and errors
        return new Promise((resolve, reject) => {
            output.on('close', () => {
                console.log(`ZIP file created successfully: ${zipPath}`);
                resolve({ zipPath, jpegFiles });
            });

            archive.on('error', (err) => {
                console.error('Error during archiving:', err);
                reject(new Error('Failed to create ZIP file.'));
            });

            // Add JPEG files to the archive
            archive.pipe(output);
            jpegFiles.forEach(jpegFile => {
                archive.file(jpegFile, { name: path.basename(jpegFile) });
            });

            archive.finalize();  // Finalize the ZIP creation
        });

    } catch (error) {
        console.error('Error during conversion:', error);
        throw new Error('JPEG conversion failed.');
    }
};

export const convertPdfToPngAndZip = async (pdfPath) => {
  const outputDir = path.join('uploads', 'converted_images');

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
  }

  // PDF to PNG conversion options
  const popplerOptions = {
      format: 'png',
      out_dir: outputDir,
      out_prefix: 'page',
      page: null,
  };

  try {
      if (!fs.existsSync(pdfPath)) {
          throw new Error(`PDF file not found at path: ${pdfPath}`);
      }

      // Convert PDF to PNG
      await pdfPoppler.convert(pdfPath, popplerOptions);

      // Collect generated PNG files
      const pngFiles = fs.readdirSync(outputDir)
          .filter(file => file.endsWith('.png'))
          .map(file => path.join(outputDir, file)); // Include full paths

      if (pngFiles.length === 0) {
          throw new Error('No PNG files generated from the PDF.');
      }

      // Create a ZIP file of all PNGs
      const zipPath = path.join('uploads', `${Date.now()}-converted_images.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Handle archive completion and errors
      return new Promise((resolve, reject) => {
          output.on('close', () => {
              console.log(`ZIP file created successfully: ${zipPath}`);
              resolve({ zipPath, pngFiles });
          });

          archive.on('error', (err) => {
              console.error('Error during archiving:', err);
              reject(new Error('Failed to create ZIP file.'));
          });

          // Add PNG files to the archive
          archive.pipe(output);
          pngFiles.forEach(pngFile => {
              archive.file(pngFile, { name: path.basename(pngFile) });
          });

          archive.finalize();  // Finalize the ZIP creation
      });

  } catch (error) {
      console.error('Error during conversion:', error);
      throw new Error('PNG conversion failed.');
  }
};













// const mammoth = require('mammoth');
// const puppeteer = require('puppeteer');

// // Function to convert files
// async function convertFile(file) {
//     const { originalname, buffer } = file;

//     // Determine file type based on the extension
//     const ext = originalname.split('.').pop().toLowerCase();
    
//     switch (ext) {
//         case 'docx':
//             return await convertWordToPDF(buffer);
//         default:
//             throw new Error('Unsupported file format');
//     }
// }

// // Function to convert Word to PDF
// async function convertWordToPDF(buffer) {
//     try {
//         // Convert DOCX to HTML
//         const { value: html } = await mammoth.convertToHtml({ buffer });

//         // Use Puppeteer to create a PDF from the HTML
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Set the content of the page to the HTML
//         await page.setContent(html);

//         // Generate the PDF
//         const pdfBuffer = await page.pdf({ format: 'A4' });

//         await browser.close();
//         return pdfBuffer; // Return the PDF buffer
//     } catch (error) {
//         throw new Error('Word to PDF conversion failed: ' + error.message);
//     }
// }

// module.exports = { convertFile, convertWordToPDF };












// import fs from 'fs';
// import path from 'path';
// import pdfPoppler from 'pdf-poppler';
// import archiver from 'archiver';

// // Convert PDF to JPEG and create ZIP
// export const convertPdfToJpegAndZip = async (pdfPath) => {
//     const outputDir = path.join('uploads', 'converted_images');
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true });
//     }

//     // PDF to JPEG conversion options
//     const popplerOptions = {
//         format: 'jpeg',
//         out_dir: outputDir,
//         out_prefix: 'page',
//         page: null, 
//     };

//     try {
//         if (!fs.existsSync(pdfPath)) {
//             throw new Error(`PDF file not found at path: ${pdfPath}`);
//         }

//         await pdfPoppler.convert(pdfPath, popplerOptions);  

//         const jpegFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.jpeg') || file.endsWith('.jpg'));

//         if (jpegFiles.length === 0) {
//             throw new Error('No JPEG files generated from the PDF.');
//         }

        
//         const zipPath = path.join('uploads', 'converted_images.zip');
//         const output = fs.createWriteStream(zipPath);
//         const archive = archiver('zip', { zlib: { level: 9 } });

//         archive.pipe(output);
//         jpegFiles.forEach(jpegFile => {
//             const filePath = path.join(outputDir, jpegFile);
//             archive.file(filePath, { name: jpegFile });
//         });

//         await archive.finalize();  
//         return zipPath;  

//     } catch (error) {
//         console.error('Error during conversion:', error);
//         throw new Error('JPEG conversion failed.');
//     }
// };

// // Convert PDF to PNG and create ZIP
// export const convertPdfToPngAndZip = async (pdfPath) => {
//     const outputDir = path.join('uploads', 'converted_images');
    
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true });
//     }

//     const popplerOptions = {
//         format: 'png',
//         out_dir: outputDir,
//         out_prefix: 'page',
//         page: null,  
//     };

//     console.log('Converting PDF to PNG with options:', popplerOptions);

//     try {
//         if (!fs.existsSync(pdfPath)) {
//             throw new Error(`PDF file not found at path: ${pdfPath}`);
//         }

//         await pdfPoppler.convert(pdfPath, popplerOptions);

//         const pngFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.png'));

//         if (pngFiles.length === 0) {
//             throw new Error('No PNG files generated from the PDF.');
//         }

        
//         const zipPath = path.join('uploads', 'converted_images.zip');
//         const output = fs.createWriteStream(zipPath);
//         const archive = archiver('zip', { zlib: { level: 9 } });

//         archive.pipe(output);
//         pngFiles.forEach(pngFile => {
//             const filePath = path.join(outputDir, pngFile);
//             archive.file(filePath, { name: pngFile });
//         });

//         await archive.finalize();  
//         return zipPath;  

//     } catch (error) {
//         console.error('Error during conversion:', error.message);
//         throw new Error('PNG conversion failed.');
//     }
// };
