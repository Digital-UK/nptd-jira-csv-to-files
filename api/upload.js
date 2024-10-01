import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to create feature files from CSV buffer
const createFeatureFiles = (buffer) => {
    return new Promise((resolve, reject) => {
        const features = [];

        // Create a readable stream from the buffer
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null); // End the stream

        stream
            .pipe(csv())
            .on('data', (row) => {
                const filenameValue = row.File_Name; // Use File_Name from your CSV
                const gherkinContent = row['Gherkin definition']; // Use Gherkin definition from your CSV

                // Prepare the feature file content
                features.push({
                    filename: `${filenameValue}.feature`,
                    content: gherkinContent
                });
            })
            .on('end', () => {
                resolve(features); // Resolve with generated feature files data
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Main handler for the upload route
export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log('Handling POST request');

        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const csvData = req.file.buffer; // Get the uploaded file buffer

        try {
            const features = await createFeatureFiles(csvData); // Process the CSV buffer
            const downloadLinks = features.map(feature => ({
                name: feature.filename,
                content: feature.content,
            }));

            res.json({ message: 'Feature files generated successfully!', files: downloadLinks });
        } catch (error) {
            console.error(`Error creating feature files: ${error}`);
            res.status(500).json({ message: 'Error creating feature files.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
