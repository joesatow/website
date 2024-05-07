async function uploadFile() {
    const file = document.getElementById('fileInput').files[0];
    const fileName = file.name;

    const raw = "";

    const requestOptions = {
      method: "POST",
      body: raw,
      redirect: "follow"
    };
    
    fetch(`https://vlqjxrlsm1.execute-api.us-east-2.amazonaws.com/upload?file_name=${fileName}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
}