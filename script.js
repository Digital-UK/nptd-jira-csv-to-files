document.getElementById('uploadBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a CSV file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', { // Ensure this matches your route in upload.js
        method: 'POST',
        body: formData,
    })
        .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        const messageDiv = document.getElementById('message');
        messageDiv.innerText = data.message;

        // Create download links
        if (data.files && data.files.length > 0) {
            const downloadLinks = data.files.map(file => {
                return `<a href="/download/${file.name}?content=${encodeURIComponent(file.content)}" download>${file.name}</a>`;
            }).join('<br>');

            messageDiv.innerHTML += `<div>${downloadLinks}</div>`;
        } else {
            messageDiv.innerHTML += '<div>No feature files created.</div>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Error processing the file.';
    });
});
