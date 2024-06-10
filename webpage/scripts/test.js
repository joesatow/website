reader.onload = async function(event) {
    try {
      const csvContent = event.target.result;
      const encodedContent = btoa(csvContent); // Encode content in base64
  
      const body = {
        csv_file_name: fileName,
        csv_content: encodedContent // Add encoded content to the body
      }
  
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        redirect: "follow",
        body: JSON.stringify(body)
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const download_link = window.URL.createObjectURL(blob);
        const newFilename = fileName.replace(".csv", ".xlsx");
        showCheckmark();
        showDownloadBarStatus(1, download_link, newFilename);
        console.log('create new xlsx file successful');
      } else {
        showDownloadBarStatus(2);
        const errorText = await response.text();
        throw new Error("error: create new xlsx file failed: " + errorText);
      }
    } catch (error) {
      showXmark();
      console.error("main catch block in create(): " + error);
    }
  };
  
  reader.onerror = function() {
    showXmark();
    console.error("File reading error");
  };
  
  reader.readAsText(file);