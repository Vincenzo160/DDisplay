document.getElementById('connectDisplay').addEventListener('click', function(e) {
    var code = document.getElementById('code-d').value;
    if (code.length === 7 && code === code.toUpperCase()) {
        window.location.href = "/display?id="+ code
    } else {
        alert("Invalid Code")
    }
  });