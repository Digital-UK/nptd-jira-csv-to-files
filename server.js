const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './'); // Store in the root directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Function to recursively find feature files in directories
const findFeatureFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFeatureFiles(filePath)); // Recurse into subdirectory
        } else if (file.endsWith('.feature')) {
            results.push(filePath); // Add file path to results
        }
    });
    return results;
};

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    const csvFilePath = path.resolve(__dirname, req.file.originalname);

    // Execute the createFeatureFiles.js script
    exec(`node createFeatureFiles.js`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ message: 'Error creating feature files.' });
        }

        console.log(stdout);

        // List the generated feature files
        const generatedFiles = findFeatureFiles(__dirname).map(file => ({
            name: path.basename(file), // Get just the file name
            url: `/download/${path.relative(__dirname, file)}` // URL based on the relative path
        }));

        res.json({ message: 'Feature files created successfully!', files: generatedFiles });
    });
});

// Endpoint to download feature files
app.get('/download/*', (req, res) => {
    const filePath = path.join(__dirname, req.params[0]); // Use the full path from the URL
    console.log(`Attempting to download file from: ${filePath}`); // Log the file path
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(404).send('File not found.');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
