import { Readable } from 'stream';
import csv from 'csv-parser';

const createFeatureFiles = (buffer) => {
    return new Promise((resolve, reject) => {
        const features = [];
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null); // End the stream

        stream
            .pipe(csv())
            .on('data', (row) => {
                console.log('Processing row:', row); // Log the current row for debugging

                const filenameValue = row.File_Name; // Use File_Name from your CSV
                const gherkinContent = row['Gherkin definition']; // Use Gherkin definition from your CSV

                if (!filenameValue || !gherkinContent) {
                    console.log(`Skipping row due to missing filename or Gherkin content.`);
                    return;
                }

                // Prepare the feature file content
                features.push({
                    filename: `${filenameValue}.feature`,
                    content: gherkinContent
                });
            })
            .on('end', () => {
                console.log('Completed processing CSV. Generated features:', features); // Log generated features
                resolve(features); // Resolve with generated feature files data
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
};

export default createFeatureFiles; // Export the function
