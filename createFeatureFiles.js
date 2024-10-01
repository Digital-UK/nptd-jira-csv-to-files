const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const createFeatureFiles = (inputCsvFile) => {
    return new Promise((resolve, reject) => {
        const features = [];

        fs.createReadStream(inputCsvFile)
            .pipe(csv())
            .on('data', (row) => {
                const pathValue = row.path; // Change as per your actual CSV column names
                const filenameValue = row.filename;
                const gherkinContent = row.gherkin_definition;

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

module.exports = createFeatureFiles; // Export the function
