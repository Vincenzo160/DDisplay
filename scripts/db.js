// Import the functions you need from the SDKs you need
import { setCookie } from "/scripts/util.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
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

function createDisplay() {
  const epochTime = Date.now();
  const randomNumber = Math.floor(Math.random() * 10001);
  const result = String(epochTime/randomNumber);
  console.log(result)
  const hashedResult = CryptoJS.SHA256(result).toString();
  const truncatedHashedResult = hashedResult.substring(0, 15);
  console.log(hashedResult);
  console.log(truncatedHashedResult);
  const db = getDatabase();
  const displayRef = ref(db, 'display/' + truncatedHashedResult);

  get(displayRef).then((snapshot) => {
    if (snapshot.exists()) {
      createDisplay()
    } else {
      set(ref(db, 'display/' + truncatedHashedResult+"/info"), {
        count: 0,
        time: 10000
      }).then(() => {
        return set(ref(db, 'display/' + truncatedHashedResult+"/content0"), {
          id: 1,
          type: "image",
          url: "Image url",
        });
      }).then(() => {
        setCookie("DDcode", truncatedHashedResult)
        window.location.href = "/manage?id="+ truncatedHashedResult
      }).catch((error) => {
        console.error(error);
      });
    }
  }).catch((error) => {
    console.error(error);
  });
}


export { createDisplay }