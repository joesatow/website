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

function showSpinner() {
  document.getElementById("spinner1").style.display = 'block';
}

function showCheckmark() {
  document.getElementById('statusBox1').innerHTML = `<div class="checkmark">✔️</div>`
}

function showXmark() {
  document.getElementById("statusBox1").innerHTML = `<div class="error-mark">❌</div>`
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
    await create(file, fileName);
  } catch (error) {
    return;
  }
}

async function create(file, fileName) {
  showSpinner()

  try {
    const reader = new FileReader();
  
    reader.onload = async function(event) {
      const csvContent = event.target.result;
      const encodedContent = btoa(csvContent); // Encode content in base64

      const body = {
          csv_file_name: fileName,
          csv_content: encodedContent // Add encoded content to the body
      }
      
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        redirect: "follow",
        body: JSON.stringify(body)
      }

      const response = await fetch(uploadUrl, requestOptions);
    };
    
    await reader.readAsText(file);
    
  } catch (error) {
    showXmark();
    console.error("main catch block in create(): " + error);
  }
}


// async function create(file, fileName) {
//   showSpinner()

//   try {
//     const reader = new FileReader();

//     reader.onload = async function(event) {
//       try {
//         const csvContent = event.target.result;
//         const encodedContent = btoa(csvContent); // Encode content in base64
  
//         const body = {
//           csv_file_name: fileName,
//           csv_content: encodedContent // Add encoded content to the body
//         }
  
//         const response = await fetch(uploadUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           redirect: "follow",
//           body: JSON.stringify(body)
//         });
  
//         if (response.ok) {
//           const blob = await response.blob();
//           const download_link = window.URL.createObjectURL(blob);
//           const newFilename = fileName.replace(".csv", ".xlsx");
//           showCheckmark()
//           showDownloadBarStatus(1, download_link, newFilename);
//           console.log('create new xlsx file successful');
//         } else {
//           showDownloadBarStatus(2)
//           throw new Error("error: create new xlsx file failed: " + await response.text());
//         }
//       } catch (error) {
//         throw new Error("nested reader error")
//       }
//     };
//     reader.readAsText(file);
//   } catch (error) {
//     showXmark();
//     console.error("main catch block in create(): " + error);
//   }
// }

function showDownloadBarStatus(option, download_link, newFilename) {
  // 1 = success, show download link
  // 2 = create xlsx function failed
  const html_download_link = document.getElementById('download-link');
  
  switch (option){
    case 1:
      html_download_link.innerHTML = `<a href="${download_link}" download="${newFilename}">Download</a>`;
      break;
    case 2:
      html_download_link.innerHTML = `<span>Create xlsx failed. Please try again.</span>`;
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
