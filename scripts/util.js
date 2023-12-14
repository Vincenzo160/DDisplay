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


export {getDDcode,throwError}