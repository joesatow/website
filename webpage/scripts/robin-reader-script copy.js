let uploadUrl = '';
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

function disableButton() {
  const button = document.getElementById('start-button');
  button.disabled = true;
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

function showXmark(id) {
  const checkmark_id = id === 1 ? 'statusBox1' : 'statusBox2';
  document.getElementById(checkmark_id).innerHTML = `<div id="spinner${id}-error" class="error-mark">❌</div>`
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

  try {
    // validate file extension
    if (!allowedExtensions.exec(fileName)) {
      alert('Please upload a file with a .csv extension.');
      fileInput.value = '';
      throw new Error("wrong extension");
    }
    
    // validate file size
    if (file.size > 2097152) { // 2mb limit
      handleFileSizeTooBig();
    }  

    disableButton();
    showGrid();
    await upload(file, fileName);
    await create_xlsx(fileName);
  } catch (error) {
    return;
  }
}

async function upload(file, fileName) {
  showSpinner(1)

  try {
    // get presigned upload url
    const body = {
      csv_file_name: fileName
    }

    const response = await fetch(`${uploadUrl}`, {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify(body)
    });

    if (response.ok) {
      console.log('upload lambda function (get presigned url) successful');
    } else {
      showDownloadBarStatus(2)
      throw new Error("upload lambda function (get presigned url) failed: " + await response.text())
    }

    const result = await response.text();
    const presignedUrl = JSON.parse(result); 
    
    url = presignedUrl.url;
    fields = presignedUrl.fields;

    //upload file using presigned url
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
      console.log('File uploaded successfully using presigned url.');
    } else {
      const errorText = await uploadResponse.text();
      if (errorText.includes("<Code>EntityTooLarge</Code>")) {
        handleFileSizeTooBig();
      }
      showDownloadBarStatus(2)
      throw new Error("Failed to upload file using presigned url: " + errorText);
    }
  } catch (error) {
    showXmark(1);
    showXmark(2);
    console.error("main catch block in upload(): " + error);
    //throw error;
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
    
    if (response.ok) {
      showCheckmark(2);
      console.log('File created successfully.');
    } else {
      showDownloadBarStatus(3)
      throw new Error("Error creating xlsx")
    }

    const result = await response.text();
    download_link = JSON.parse(result).download_url
    showDownloadBarStatus(1,download_link);
  } catch (error) {
    showXmark(2);
    console.error(error);
    //throw error;
  }
}

function showDownloadBarStatus(option, download_link=null) {
  // 1 = success, show download link
  // 2 = upload lambda function (get presigned url) failed 
  // 3 = create xlsx failed
  const html_download_link = document.getElementById('download-link');
  
  switch (option){
    case 1:
      html_download_link.innerHTML = `<a href="${download_link}">Download</a>`;
      break;
    case 2:
      html_download_link.innerHTML = `<span>Upload failed. Please try again.</span>`;
      break;
    case 3:
      html_download_link.innerHTML = `<span>Create failed. Please try again.</span>`;
      break;
  }
  
  html_download_link.style.display = 'block';
}

function handleFileSizeTooBig() {
  const html_error_info = document.getElementById("other-error-info");
  html_error_info.innerHTML = 'File size too big.  If you see this, please <a href="mailto:admin@mktanon.com">email the admin.</a>'
  html_error_info.style.display = 'block';

  console.error("File size exceeds the maximum allowed size.");
  disableButton();
  showDownloadBarStatus(2);
  throw new Error("File size too big");
}
