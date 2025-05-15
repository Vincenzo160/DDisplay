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
const dbRef = ref(getDatabase());

var DDcode = getDDcode()
const urlParams = new URLSearchParams(window.location.search);
const contentID = urlParams.get('ctn');
console.log(DDcode)

const icons = {
  "0": "qi-100",
  "1": "qi-102",
  "2": "qi-103",
  "3": "qi-104",
  //fog
  "45": "qi-501",
  "48": "qi-501",
  //drizzle
  "51": "qi-309",
  "53": "qi-309",
  "55": "qi-309",
  //freezing drizzle
  "56": "qi-2214",
  "57": "qi-2214",
  //rain
  "61": "qi-305",
  "63": "qi-306",
  "65": "qi-307",
  //freezing rain
  "66": "qi-313",
  "67": "qi-313",
  //snow fall
  "71": "qi-400",
  "73": "qi-401",
  "75": "qi-402",
  "77": "qi-400",
  //rain showers
  "80": "qi-300",
  "81": "qi-301",
  "82": "qi-301",
  //snow showers
  "85": "qi-406",
  "86": "qi-406",
  //thunderstorm
  "95": "qi-303",
  "96": "qi-304",
  "99": "qi-304"
}


function populateMeteo(data, lang) {
  if (lang === "it") {
    document.getElementById("temps").innerHTML = "Max: "+data.daily.temperature_2m_max + "°C" + " Min: "+data.daily.temperature_2m_min + "°C";
    document.getElementById("uv").innerHTML = "Indice UV: "+data.daily.uv_index_max;
    document.getElementById("wind").innerHTML = "Velocità Vento: "+data.current.wind_speed_10m + "Km/h";
    document.getElementById("temp").innerHTML = "Attuale: "+data.current.temperature_2m + "°C";
    document.getElementById("source").innerHTML = "Fonte: open-meteo.com";
  } else {
    document.getElementById("temps").innerHTML = "Max: "+data.daily.temperature_2m_max + "°C" + " Min: "+data.daily.temperature_2m_min + "°C";
    document.getElementById("uv").innerHTML = "UV Index: "+data.daily.uv_index_max;
    document.getElementById("wind").innerHTML = "Wind Speed: "+data.current.wind_speed_10m + "Km/h";
    document.getElementById("temp").innerHTML = "Current: "+data.current.temperature_2m + "°C";
  }

  document.getElementById("forecast-icon").classList.remove("qi-100");
  document.getElementById("forecast-icon").classList.add(icons[data.current.weather_code]);
  
}


function getMeteo(data) {
  fetch("https://api.open-meteo.com/v1/forecast?latitude="+data.lat+"&longitude="+data.lon+"&current=temperature_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=1")
    .then(response => response.json())
    .then(Wdata => {
      localStorage.setItem("Meteo", JSON.stringify(Wdata));
      localStorage.setItem("lang", data.displayLang);
      localStorage.setItem("contentID", contentID);
      localStorage.setItem("timestamp", Date.now());
      console.log("Cache updated");
      populateMeteo(Wdata, data.displayLang)

    })
    .catch(error => console.error('Error fetching meteo:', error));
}


function setBackground() {
  var now = new Date();
  var hour = now.getHours();
  // var hour = 6;
  var body = document.body;

  if (hour < 6 || hour >= 18) {
    // Night time
    body.style.background = "linear-gradient(to bottom, #1a4b6d, #052641)";
  } else if (hour < 11) {
    // Morning
    body.style.background = "linear-gradient(to bottom, #1a70b2, #ebda7f)";
  } else {
    // Afternoon
    // body.style.background = "linear-gradient(to bottom, #1b70b1, #003e79)";
    body.style.background = "linear-gradient(to bottom, #1b8eb1, #005b79)";
  }
}

setInterval(setBackground, 1000 * 60 * 60);

window.onload = setBackground;
const timestamp = localStorage.getItem("timestamp");
const cachedMeteo = JSON.parse(localStorage.getItem("Meteo"));
if (!(cachedMeteo === null) && contentID === localStorage.getItem("contentID") && (Date.now() - timestamp < 43200000)) { // 12h
  console.log("Using cache, cache is " + (Date.now() - timestamp) + " old");
  
  populateMeteo(cachedMeteo, localStorage.getItem("lang"));
}

get(child(dbRef, `display/`+DDcode+'/content'+contentID+'/extParams')).then((snapshot) => {
  const data = snapshot.val()
  if (snapshot.exists()) {
      getMeteo(data)
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});