function getDDcode(){
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    return myParam
}

function throwError(error,loud) {
    document.getElementById("status").innerHTML = "E:"+error;
    if (loud) {
        alert("An Error occured E:"+error)
    }
}


export {getDDcode,throwError}