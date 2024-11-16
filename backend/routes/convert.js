// const express = require('express');
// const multer = require('multer');
// const { convertFile } = require('../utils/convertUtils');

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for uploads

// // Endpoint to handle file conversion
// router.post('/', upload.single('file'), async (req, res) => {
//     try {
//         const pdfBuffer = await convertFile(req.file);
//         res.set({
//             'Content-Type': 'application/pdf',
//             'Content-Disposition': `attachment; filename=${req.file.originalname.replace('.docx', '.pdf')}`,
//             'Content-Length': pdfBuffer.length,
//         });
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Conversion error:', error);
//         res.status(500).json({ message: 'Conversion failed', error: error.message });
//     }
// });

// module.exports = router;
