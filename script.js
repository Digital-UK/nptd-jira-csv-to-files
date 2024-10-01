document.getElementById('uploadBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a CSV file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const results = processCSV(csvData);
        displayOutput(results);
    };

    reader.readAsText(file);
});

function processCSV(data) {
    const rows = Papa.parse(data, { header: true }).data; // Parse CSV using Papa Parse
    const output = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        const path = row['Issue Key'];
        const filename = row['Issue ID'];
        const content = row['Description'];

        if (path && filename) {
            output.push({
                filename: `${path}: ${filename}`,
                content: `Path: ${path}\n\nFilename: ${filename}.feature\n\nContent: ${content}` 
            });
        }
    }

    console.log('Total feature files generated:', output.length); // Log total generated files
    console.log('Output:', output); // Log output for debugging
    return output;
}

function displayOutput(results) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; 
    generatedFiles = [];

    if (results.length === 0) {
        outputDiv.innerHTML = '<div>No valid feature files generated.</div>';
        return;
    }

    results.forEach(result => {
        // Create a downloadable link for each generated feature file
        const div = document.createElement('div');
        const a = document.createElement('a');
        const blob = new Blob([result.content], { type: 'text/plain' }); 
        const url = URL.createObjectURL(blob); 

        a.href = url; // Set the link href
        a.download = result.filename; // Set the filename for download
        a.innerText = `${result.filename}`; // Link text

        div.appendChild(a);
        outputDiv.appendChild(div); 

        generatedFiles.push({ filename: result.filename, content: result.content }); // Removed .feature here
    });
    document.getElementById('downloadAllBtn').style.display = 'block';
}

// Download all feature files as a single zip file
document.getElementById('downloadAllBtn').addEventListener('click', () => {
    const zip = new JSZip(); // Create a new JSZip instance
    
    generatedFiles.forEach(file => {
        zip.file(`${file.filename}.feature`, file.content); // Ensure .feature extension is added here
    });

    // Generate zip and trigger download
    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'feature_files.zip'; // Zip file name
        link.click(); // Trigger the download
    });
});
