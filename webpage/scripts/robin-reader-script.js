const test = true
let uplpoadUrl = '';
let createUrl = '';
if (test) {
  uploadUrl = 'http://127.0.0.1:3000/upload';
  createUrl = 'http://127.0.0.1:3000/create';
} else {
  uploadUrl = '';
  createUrl = '';
}

function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}

function start() {
  showSpinner()
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    console.log("No file selected.");
    return;
  }
  const fileName = file.name;

  upload(file, fileName)
  create_xlsx(fileName)  

  hideSpinner()
}

async function upload(file, fileName){
  
  // Request a pre-signed URL from your API
  try {
    const body = {
      csv_file_name: fileName
    }
    const response = await fetch(`${uploadUrl}`, {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify(body)
    });
    
    const result = await response.text();
    const presignedUrl = JSON.parse(result); // Ensure this variable correctly extracts the URL from the response

    url = presignedUrl.url
    fields = presignedUrl.fields

    const formData = new FormData();

    for (const key in fields) {
      formData.append(key, fields[key]);
    }

    // Append file to formData - assuming 'file' is the key for your file
    formData.append('file', file);

    // Use the pre-signed URL to upload the file
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData
    });

    if (uploadResponse.ok) {
      console.log('File uploaded successfully.');
    } else {
      console.error('Failed to upload file.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function create_xlsx(fileName){
  try {
    const body = JSON.stringify({
      "csv_file_name": fileName
    });

    const response = await fetch(`${createUrl}`, {
      method: "POST",
      body: body, // Directly put the file object here
      headers: {
        'Content-Type': 'application/json' // Adjust this if your S3 bucket expects a specific content type
      },
      redirect: 'follow'
    });
    const result = await response.text();
    console.log(result)
  } catch (error) {
    console.error('Error:', error);
  }
}