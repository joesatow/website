<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>mktanon</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <?php include "./includes/navbar.html" ?>
    <div class="content">
        <input type="file" id="fileInput" accept=".csv">
        <button onclick="uploadFile()">Upload File</button>
    </div>
    <script src="robin-reader-script.js"></script>
</body>

</html>