const express = require('express');
const multer = require('multer');
const path = require('path');
const createFeatureFiles = require('./createFeatureFiles'); // Import the modified function

const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const storage = multer.memoryStorage(); // Use memory storage for Vercel compatibility
const upload = multer({ storage: storage });

app.use(express.static(__dirname));

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    console.log('Uploaded file:', req.file); // Log the uploaded file details

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const csvFilePath = req.file.originalname; // Using the original file name for processing

    try {
        const features = await createFeatureFiles(req.file.buffer); // Use the buffer directly for processing
        const downloadLinks = features.map(feature => ({
            name: feature.filename,
            content: feature.content,
        }));

        res.json({ message: 'Feature files generated successfully!', files: downloadLinks });
    } catch (error) {
        console.error(`Error creating feature files: ${error}`);
        res.status(500).json({ message: 'Error creating feature files.' });
    }
});

// Endpoint to download feature files as text
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const content = req.query.content; // Get content from query string
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(content); // Send the content back as a download
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
