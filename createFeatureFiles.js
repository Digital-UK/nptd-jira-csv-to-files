const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Specify the input CSV file path
const inputCsvFile = 'input.csv'; // Change this to your CSV file path
// Specify the columns (0-indexed)
const pathColumnIndex = 0; // Change this to the index of the column for paths
const filenameColumnIndex = 1; // Change this to the index of the column for filenames
const gherkinColumnIndex = 2; // Change this to the index of the column for Gherkin definitions

const createFeatureFiles = () => {
    fs.createReadStream(inputCsvFile)
        .pipe(csv())
        .on('data', (row) => {
            const pathValue = row[Object.keys(row)[pathColumnIndex]];
            const filenameValue = row[Object.keys(row)[filenameColumnIndex]];
            const gherkinContent = row[Object.keys(row)[gherkinColumnIndex]];

            // Create the directory if it doesn't exist
            const dirPath = path.resolve(__dirname, pathValue);
            fs.mkdirSync(dirPath, { recursive: true });

            // Define the full file path
            const featureFilePath = path.join(dirPath, `${filenameValue}.feature`);

            // Write the Gherkin content to the feature file
            fs.writeFileSync(featureFilePath, gherkinContent);
            console.log(`Created: ${featureFilePath}`);
        })
        .on('end', () => {
            console.log('CSV file processed successfully.');
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
};

createFeatureFiles();
