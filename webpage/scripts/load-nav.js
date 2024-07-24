$(function () {
    $("#nav-placeholder").load("includes/navbar.html");
});

function open_nav_menu() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }