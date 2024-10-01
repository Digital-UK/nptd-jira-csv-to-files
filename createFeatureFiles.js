const fs = require('fs');
const csv = require('csv-parser');
const { Readable } = require('stream');

const createFeatureFiles = (buffer) => {
    return new Promise((resolve, reject) => {
        const features = [];

        // Create a readable stream from the buffer
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null); // Signal the end of the stream

        stream
            .pipe(csv())
            .on('data', (row) => {
                console.log('Processing row:', row); // Log the current row for debugging

                const pathValue = 'default/path'; // Set a default path
                const filenameValue = row.File_Name; // Use provided filename
                const gherkinContent = row['Gherkin definition']; // Use provided Gherkin content

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
                console.log('Completed processing CSV.'); // Log when processing is finished
                resolve(features); // Resolve with generated feature files data
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
};

module.exports = createFeatureFiles; // Export the function
