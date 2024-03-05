// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getDDcode, throwError, psaBanner } from "/scripts/util.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAo_IoaYDL5swKZDmbr9b4O__U0pFDnVw0",
  authDomain: "ddisplay-e3562.firebaseapp.com",
  databaseURL: "https://ddisplay-e3562-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ddisplay-e3562",
  storageBucket: "ddisplay-e3562.appspot.com",
  messagingSenderId: "718815442672",
  appId: "1:718815442672:web:a08af129212f1cc92eb435"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

var DDcode = getDDcode()
if (DDcode === null) {DDcode = "error"}
console.log(DDcode)
var data = undefined
const urlsRef = ref(db, 'display/' + DDcode);
onValue(urlsRef, (snapshot) => {
    const debugElement = document.getElementById("debug");
    const urls = snapshot.val();
    console.log(urls);
    if (debugElement.innerHTML === "null" || debugElement.innerHTML === urls) {
        debugElement.innerHTML = JSON.stringify(urls);
        console.log(debugElement.innerHTML);

    } else {
        location.reload();
    }
    data = urls

});
const dbRef = ref(getDatabase());
get(child(dbRef, 'display/'+DDcode+'/info/time')).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
    startClock(snapshot.val())
} else {
    console.log("No data available");
    throwError("C404", false)
    document.getElementById("status").innerHTML = "E:C404";
}
}).catch((error) => {
    console.error(error);
});

function startClock(delay) {
    console.log("Starting clock")
    if (data.info.psaBanner && data.psa.enabled) {
        console.log("PSA: " + data.psa.txt)
        psaBanner(data.psa.txt)
    }
    document.getElementById("img-content").setAttribute("src", data.content0.url);
    document.getElementById("status-label").style.display = "none";
    var intCount = -1
    
    function execute() {
        if (intCount >= data.info.count) {intCount = -1}
        intCount = intCount +1
        if (data === undefined || data === null) {
            console.log("Error: Data not found")
            return
        }
        console.log("int:"+intCount)
    
        console.log(data[`content${intCount}`].url)
        document.getElementById("img-content").setAttribute("src", data[`content${intCount}`].url);
        if (data[`content${intCount}`].type === "text") {
            document.body.style.backgroundColor = data[`content${intCount}`].bgColor
        } else {
            document.body.style.backgroundColor = "#121212"
        }
        
        setTimeout(execute, delay);
    }
    execute();
}