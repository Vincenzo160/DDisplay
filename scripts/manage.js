// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getDDcode, throwError } from "/scripts/util.js";
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

document.getElementById("id-display").innerHTML = DDcode;

const dbRef = ref(getDatabase());
get(child(dbRef, `display/`+DDcode)).then((snapshot) => {
  const data = snapshot.val()
  if (snapshot.exists()) {
      console.log(snapshot.val());
      PopulateDash(data)
    } else {
        console.log("No data available");
        throwError("C404", false)
    }
}).catch((error) => {
    console.error(error);
});

function PopulateDash(data) {
    var slide = 0
    while (slide <= data.info.count) {
        var content = data[`content${slide}`]
        let box = document.createElement("div");
        box.className = "container"

        let title = document.createElement("h2");
        title.align="left"
        title.innerHTML = slide+1+". "+content.type
        box.appendChild(title);
        if (content.type === "image") {
            let srcInput = document.createElement("input");
            srcInput.type = "text"
            srcInput.value = content.url
            box.appendChild(srcInput);
        } else {
            throwError("D10"+slide,true,"Error Parsing "+slide)
            window.location.replace("/")
        }
        document.getElementById("dash").appendChild(box);
        slide = slide+1
        console.log(slide)
    }
    var content = data[`content${slide}`]
    let box = document.createElement("div");
    box.className = "container"
    let title = document.createElement("h2");
    title.align="left"
    title.innerHTML="Settings"
    let timeInput = document.createElement("input");
    timeInput.type = "tel"
    timeInput.value = data.info.time
    box.appendChild(title);
    box.appendChild(timeInput);
    document.getElementById("dash").appendChild(box);
    document.getElementById("status-label").style.display = "none";
}