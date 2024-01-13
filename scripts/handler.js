import { createDisplay } from "/scripts/db.js";
import { toggleBtn } from "/scripts/util.js";

document.getElementById('connectDisplay').addEventListener('click', function(e) {
    toggleBtn("connectDisplay", "Connecting...", true)
    var code = document.getElementById('code-d').value;
    if (code.length === 7) {
        window.location.href = "/display?id="+ code
    } else {
        alert("Invalid Code")
        toggleBtn("connectDisplay", "Connect", false)
    }
  });
document.getElementById('connectManage').addEventListener('click', function(e) {
var code = document.getElementById('code-m').value;
if (code.length === 7) {
    toggleBtn("connectManage", "Connecting...", true)
    window.location.href = "/manage?id="+ code
} else if (code === "") {
    var result = confirm("Do you want to create a new Display?")
    if (result) {
        toggleBtn("connectManage", "Creating...", true)
        createDisplay()
    }

} else {
    alert("Invalid Code")
}
});