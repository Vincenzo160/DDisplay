import { createDisplay } from "/scripts/db.js";
import { toggleBtn, getCookie } from "/scripts/util.js";

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


document.getElementById('connectDisplayRecent').addEventListener('click', function(e) {
    var recentDisplay = getCookie("DDcode")
    if (recentDisplay !== null) {
        toggleBtn("connectDisplayRecent", "Connecting...", true)
        window.location.href = "/display?id="+ recentDisplay
    } else {
        alert("No Recent Display")
    }

})
document.getElementById('connectManageRecent').addEventListener('click', function(e) {
    var recentDisplay = getCookie("DDcode")
    if (recentDisplay !== null) {
        toggleBtn("connectManageRecent", "Connecting...", true)
        window.location.href = "/manage?id="+ recentDisplay
    } else {
        alert("No Recent Display")
    }

})

var recentDisplay = getCookie("DDcode")
console.log(recentDisplay)

if (recentDisplay !== null) {
    document.getElementById('code').innerText = recentDisplay
    document.getElementById('recent').removeAttribute('hidden');
}