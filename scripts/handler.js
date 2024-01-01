import { createDisplay } from "/scripts/db.js";

document.getElementById('connectDisplay').addEventListener('click', function(e) {
    var code = document.getElementById('code-d').value;
    if (code.length === 10) {
        window.location.href = "/display?id="+ code
    } else {
        alert("Invalid Code")
    }
  });
document.getElementById('connectManage').addEventListener('click', function(e) {
var code = document.getElementById('code-m').value;
if (code.length === 10) {
    window.location.href = "/manage?id="+ code
} else if (code === "") {
    var result = confirm("Do you want to create a new Display?")
    if (result) {
        createDisplay()
    }

} else {
    alert("Invalid Code")
}
});