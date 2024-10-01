import multer from 'multer';
import createFeatureFiles from '../createFeatureFiles.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Main handler for the upload route
export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (!req.file) {
            console.log('No file uploaded'); // Log for debugging
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const csvData = req.file.buffer;

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
