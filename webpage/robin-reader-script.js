function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}

async function uploadFile() {
  showSpinner()
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    console.log("No file selected.");
    return;
  }
  const fileName = file.name;

  // Request a pre-signed URL from your API
  try {
    const url_test = 'http://192.168.118.134:3000/upload'
    const url_prod = 'https://z3qah0v4y8.execute-api.us-east-2.amazonaws.com/upload'
    const body = {
      csv_file_name: fileName
    }
    const response = await fetch(`${url_prod}`, {
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

  // create xlsx
  try {
    const body = JSON.stringify({
      "csv_file_name": fileName
    });

    const response = await fetch("https://lulayd3e9i.execute-api.us-east-2.amazonaws.com/create", {
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
  hideSpinner()
}
