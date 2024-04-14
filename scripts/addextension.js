// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getDDcode, throwError, toggleBtn, copyToClipboard, unsaved } from "/scripts/util.js";
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

console.log(DDcode)

document.getElementById("id-display").innerHTML = DDcode+' <i id="copyid" style="font-size: 1.425rem; color: var(--small-text-color);" class="copy-icon fa fa-copy"></i>';

if (DDcode === null) {
  document.getElementById("id-display").innerHTML = 'Error <i id="copyid" class="fa fa-copy"></i>'
  document.getElementById("copyid").style.display = "none";
}

document.getElementById('copyid').addEventListener('click', function(e) {
  copyToClipboard(DDcode, 'copyid')
});

document.getElementById("status-label").style.display = "none";
const dbRef = ref(getDatabase());


function addExtension(extId, extParams) {
  var DDcode = getDDcode()
  get(child(dbRef, `display/`+DDcode+'/info')).then((snapshot) => {
  const data = snapshot.val()
  if (snapshot.exists()) {
      set(ref(db, 'display/' + DDcode + '/content'+(data.count+1)), {
          id: data.count+1,
          type: "extension",
          extId: extId,
      }).then(() => {
        extParams.id = extId
        set(ref(db, 'display/' + DDcode + '/content'+(data.count+1)+'/extParams'), extParams)}).then(() => {
          set(ref(db, 'display/' + DDcode + '/info'), {
              count: data.count+1,
              psaBanner: true,
              time: data.time
          });
          toggleBtn("add-1", "Setting up", false)
          console.log("Success, Redirecting...")
          // window.location.href = "/manage?id="+ DDcode;
        })
  } else {
      console.log("No data available");
      throwError("C404", false)
  }
  }).catch((error) => {
      console.error(error);
  });
}

// Weather Extension
document.getElementById('cust-1').addEventListener('click', function(e) {
  console.log("Settings 1")
  document.getElementById("ext-settings1").style.display = "block";
  document.getElementById("ext-info1").style.display = "none";
});

document.getElementById('add-1').addEventListener('click', function(e) {
  console.log("Add 1")
  toggleBtn("add-1", "Adding...", true)
  var city = document.getElementById('ext1-city').value;
  if (city === "" || city === null || city === undefined) {
    alert("Please enter a city")
    toggleBtn("add-1", "Add", false)
    return
  }
  var extParams = {
    city: city
  }
  addExtension("weather", extParams)
});

