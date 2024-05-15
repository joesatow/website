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


// document.getElementById('grid-container').style.display = 'grid';
// showSpinner(1)
// showSpinner(2)
// //showCheckmark(1)

function showSpinner(id) {
  const spinner_id = id === 1 ? 'spinner1' : 'spinner2';
  document.getElementById(spinner_id).style.display = 'block';
}

function hideSpinner(id) {
  const spinner_id = id === 1 ? 'spinner1' : 'spinner2';
  document.getElementById(spinner_id).style.display = 'none';
}

function showCheckmark(id) {
  const checkmark_id = id === 1 ? 'statusBox1' : 'statusBox2';
  document.getElementById(checkmark_id).innerHTML = `<div id="spinner${id}-success" class="checkmark" style="display: block;">✔️</div>`
}

function showGrid() {
  document.getElementById('grid-container').style.display = 'grid';
}

async function start() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    console.log("No file selected.");
    return;
  }
  const fileName = file.name;

  showGrid()
  await upload(file, fileName)
  await create_xlsx(fileName) 
}

async function upload(file, fileName){
  showSpinner(1)
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
      showCheckmark(1);
      console.log('File uploaded successfully.');
    } else {
      console.error('Failed to upload file.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  //hideSpinner(1)
}

async function create_xlsx(fileName){
  showSpinner(2)
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
    showCheckmark(2);
    console.log(result)
    download_link = JSON.parse(result).download_url
    document.getElementById('robinreader-actionbox').innerHTML += `<a href="${download_link}"id="download-link">Download</a>`;
  } catch (error) {
    console.error('Error:', error);
  }
  // hideSpinner(2)
}