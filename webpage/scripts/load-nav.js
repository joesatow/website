function open_nav_menu() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
      x.style.display = "none";
  } else {
      x.style.display = "block";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('includes/navbar.html')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
          document.getElementById('nav-placeholder').innerHTML = data;
          document.getElementById('open-nav-menu').addEventListener('click', function(event) {
            event.preventDefault();
            open_nav_menu();
        });
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
});