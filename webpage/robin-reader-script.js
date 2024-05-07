async function uploadFile() {
    const file = document.getElementById('fileInput').files[0];
    const fileName = file.name;

    // Fetch the pre-signed URL from your API
    const response = await fetch(`http://127.0.0.1:3000/upload?file_name=${fileName}`);
    const preSignedUrl = await response.text();

    // Use the pre-signed URL to upload the file
    const uploadResult = await fetch(preSignedUrl, {
        method: 'POST',
        body: file,
        headers: {
            'Content-Type': 'text/plain'
        }
    });

    if (uploadResult.ok) {
        console.log('File uploaded successfully!');
    } else {
        console.log('Failed to upload file.');
    }
}