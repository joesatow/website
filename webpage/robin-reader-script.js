async function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    console.log("No file selected.");
    return;
  }
  const fileName = file.name;

  // Request a pre-signed URL from your API
  try {
    const response = await fetch(`https://enho5x52t2.execute-api.us-east-2.amazonaws.com/upload?file_name=${fileName}`, {
      method: "POST",
      redirect: "follow"
    });
    const result = await response.text();
    const presignedUrl = result; // Ensure this variable correctly extracts the URL from the response

    // Use the pre-signed URL to upload the file
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file, // Directly put the file object here
      headers: {
        'Content-Type': 'binary/octet-stream' // Adjust this if your S3 bucket expects a specific content type
      }
    });

    if (uploadResponse.ok) {
      console.log('File uploaded successfully.');
    } else {
      console.error('Failed to upload file.');
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // // create xlsx
  // try {
  //   const body = JSON.stringify({
  //     "csv_file": fileName
  //   });

  //   const response = await fetch("https://3xqg7t9luh.execute-api.us-east-2.amazonaws.com/create", {
  //     method: "POST",
  //     body: body, // Directly put the file object here
  //     headers: {
  //       'Content-Type': 'application/json' // Adjust this if your S3 bucket expects a specific content type
  //     },
  //     redirect: 'follow'
  //   });
  //   const result = await response.text();
  //   console.log(result)
  // } catch (error) {
  //   console.error('Error:', error);
  // }
}
