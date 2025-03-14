document.getElementById("home-start-btn").addEventListener("click", function() {
    window.location.href = "visualisation.html?source=home";
  });

  document.getElementById("home-tutorial-btn").addEventListener("click", function() {
    window.location.href = "visualisation.html?tutorial=true";
  });


function openInfo(){
  document.getElementById('home-info-background').style.display = 'flex';
}

function closeInfo(){
  document.getElementById('home-info-background').style.display = 'none';
}