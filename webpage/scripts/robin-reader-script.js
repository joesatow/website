let uplpoadUrl = '';
let createUrl = '';
let prod_base_url = 'https://8yp72j081a.execute-api.us-east-2.amazonaws.com'

const test = true
if (test) {
  uploadUrl = 'http://127.0.0.1:3000/upload';
  createUrl = 'http://127.0.0.1:3000/create';
} else {
  uploadUrl = `${prod_base_url}/upload`;
  createUrl = `${prod_base_url}/create`;
}

function handleClick() {
  const button = document.getElementById('start-button');
  button.disabled = true;
  button.classList.add('disabled');
}

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
  document.getElementById(checkmark_id).innerHTML = `<div id="spinner${id}-success" class="checkmark">✔️</div>`
}

function showGrid() {
  document.getElementById('grid-container').style.display = 'grid';
}

document.getElementById("uploadForm").addEventListener("submit", start);
async function start(event) {
  event.preventDefault();

  const file_input = document.getElementById('fileInput');
  const file = file_input.files[0];
  const fileName = file.name;
  const allowedExtensions = /(\.csv)$/i;

  if (!allowedExtensions.exec(fileName)) {
      alert('Please upload a file with a .csv extension.');
      fileInput.value = '';
      return;
  }
  
  handleClick();
  showGrid();
  await upload(file, fileName);
  await create_xlsx(fileName);
}

async function upload(file, fileName) {
  showSpinner(1)

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
    
    url = presignedUrl.url;
    fields = presignedUrl.fields;

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
}

async function create_xlsx(fileName) {
  showSpinner(2);
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
    
    download_link = JSON.parse(result).download_url
    const html_download_link = document.getElementById('download-link');
    html_download_link.innerHTML = `<a href="${download_link}">Download</a>`;
    html_download_link.style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
  }
  // hideSpinner(2)
}