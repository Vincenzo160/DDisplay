function getDDcode(){
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    return myParam
}

function throwError(error,loud,long) {
    document.getElementById("status").innerHTML = "E:"+error;
    if (loud) {
        if (long === undefined || long === null) {
            alert("An Error occured E:"+error)
        } else {
            alert(long+" E:"+error)
        }
    }
}

function toggleBtn(btn, message, state, className) {
    const button = document.getElementById(btn);
    if (state) {
        button.disabled = true;
        button.value = message;
        if (className !== undefined) {
            button.className = className;
        } else {
            button.className = 'btn-disabled';
        }
    } else {
        button.disabled = false;
        button.value = message;
        button.className = 'home-btn3';
    }
}

function setCookie(name,value) {

    document.cookie = name+"="+ value +"; expires=Thu, 18 Dec 9999 12:00:00 UTC; path=/";
}

function copyToClipboard(data, id) {
    navigator.clipboard.writeText(data)
    .then(() => {
      document.getElementById(id).style = "color:lime; font-size: 1.425rem;"
      document.getElementById(id).classList = "fa fa-check"
      setTimeout(function() {
        document.getElementById(id).classList = "fa fa-copy"
        document.getElementById(id).style = "font-size: 1.425rem; color: var(--small-text-color);"
      }, 1900);
      
    })
    .catch((err) => {
      document.getElementById(id).classList = "fa fa-close"
      document.getElementById(id).style = "color:red; font-size: 1.425rem;"
    });
}

export {getDDcode,throwError, setCookie, toggleBtn, copyToClipboard}