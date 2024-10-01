import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createFeatureFiles = (inputCsvFile) => {
    return new Promise((resolve, reject) => {
        const features = [];

        const stream = Readable.from(inputCsvFile); // Use stream instead of fs
        stream
            .pipe(csv())
            .on('data', (row) => {
                const filenameValue = row.filename; // Adjust as needed
                const gherkinContent = row.gherkin_definition; // Adjust as needed

                // Prepare the feature file content
                features.push({
                    filename: `${filenameValue}.feature`,
                    content: `Feature: ${gherkinContent}`
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
        // Process the file upload
        const csvData = req.body.file;

        try {
            const features = await createFeatureFiles(csvData); // Process CSV
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
