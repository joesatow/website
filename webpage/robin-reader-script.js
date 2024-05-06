function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a CSV file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
   
    fetch('http://127.0.0.1:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('File uploaded successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error uploading file.');
    });

    // website front end 
    // upload csv file to s3
    // generate presigned url of s3 csv object to use the object in lambda function


    // execute logic on csv to create .xlsx file
    // upload xlsx to s3
    // return presigned url of new xlsx file for user to download
}