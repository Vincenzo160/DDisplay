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

document.getElementById('remslBTN').addEventListener('click', function(e) {
    removeSlide()
});
document.getElementById('addslBTN').addEventListener('click', function(e) {
    addSlide()
});
addslSEL.addEventListener("change", (event) => {
    var selection = event.target.value
    addSlide(selection)
})
document.getElementById('saveBTN').addEventListener('click', function(e) {
    save()
});
document.getElementById('viewBTN').addEventListener('click', function(e) {
    window.open("https://ddisplay.sgtbots.com/display?id="+DDcode, '_blank')
});

const dbRef = ref(getDatabase());
get(child(dbRef, `display/`+DDcode)).then((snapshot) => {
  const data = snapshot.val()
  if (snapshot.exists()) {
      console.log(snapshot.val());
      PopulateDash(data)
    } else {
        console.log("No data available");
        throwError("C404", false)
        document.getElementById("commands").style.display = "none";
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
        title.id="type"+slide
        title.innerHTML = slide+1+". "+content.type
        box.appendChild(title);
        if (content.type === "image") {
            let srcInput = document.createElement("input");
            srcInput.type = "text"
            srcInput.id = "url"+slide
            srcInput.value = content.url
            box.appendChild(srcInput);
        } else if (content.type === "text") {
            //text
            let txtInput = document.createElement("textarea");
            txtInput.id = "text"+slide
            txtInput.value = content.txt
            txtInput.setAttribute('maxlength', '60');
            box.appendChild(txtInput);
            // Div
            let colDiv = document.createElement("div");
            colDiv.align="left"
            box.appendChild(colDiv);
            // Color selector lable
            let colTxtLabel = document.createElement("label");
            colTxtLabel.innerHTML = "Text Color: "
            colDiv.appendChild(colTxtLabel);

            // Color selector text
            let colTxtInput = document.createElement("input");
            colTxtInput.type = "color"
            colTxtInput.id = "txtColor"+slide
            colTxtInput.value = content.txtColor
            colDiv.appendChild(colTxtInput);
            // br
            let brake = document.createElement("br");
            colDiv.appendChild(brake);
            // Color selector lable
            let colBgLabel = document.createElement("label");
            colBgLabel.innerHTML = "Background Color: "
            colDiv.appendChild(colBgLabel);
            // Color selector bg
            let colBgInput = document.createElement("input");
            colBgInput.type = "color"
            colBgInput.id = "bgColor"+slide
            colBgInput.value = content.bgColor
            colDiv.appendChild(colBgInput);
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
    timeInput.id = "Intime"
    box.appendChild(title);
    box.appendChild(timeInput);
    document.getElementById("dash").appendChild(box);
    document.getElementById("status-label").style.display = "none";
}

function save() {
    var slide = 0
    var DDcode = getDDcode()
    get(child(dbRef, `display/`+DDcode+'/info/count')).then((snapshot) => {
    const data = snapshot.val()
    if (snapshot.exists()) {
        console.log(snapshot.val());
        while (slide <= data) {
            var type = document.getElementById("type"+slide).innerHTML.replace(/\d|\s|\./g, '');
            console.log(type)
            if (type === "text") {
                var resolution = "1920x1080" // TODO: Implement in a non hardcoded way
                var bgColor = document.getElementById("bgColor"+slide).value
                var txtColor = document.getElementById("txtColor"+slide).value
                var txt = document.getElementById("text"+slide).value
                set(ref(db, 'display/' + DDcode + '/content'+slide), {
                    id: slide,
                    type: "text",
                    txt: txt,
                    txtColor: txtColor,
                    bgColor: bgColor,
                    url: "https://placehold.co/"+resolution+"/"+bgColor.substring(1)+"/"+txtColor.substring(1)+"?text="+encodeURIComponent(txt)
                });
            } else {
                set(ref(db, 'display/' + DDcode + '/content'+slide), {
                    id: slide,
                    type: "image",
                    url: document.getElementById("url"+slide).value,
                });
            }
            slide = slide+1
            console.log(slide)
        }
        set(ref(db, 'display/' + DDcode + '/info'), {
            count: data,
            time: document.getElementById("Intime").value
        });

        } else {
            console.log("No data available");
            throwError("C404", false)
        }
    }).catch((error) => {
        console.error(error);
    });
}

function addSlide(type) {
    var DDcode = getDDcode()
    get(child(dbRef, `display/`+DDcode+'/info/count')).then((snapshot) => {
    const data = snapshot.val()
    if (snapshot.exists()) {

        set(ref(db, 'display/' + DDcode + '/content'+(data+1)), {
            id: data+1,
            type: type, // TODO: Implement in a non hardcoded way
            url: "url",
        });
        set(ref(db, 'display/' + DDcode + '/info'), {
            count: data+1,
            time: document.getElementById("Intime").value
        });
        window.location.reload()
    } else {
        console.log("No data available");
        throwError("C404", false)
    }
    }).catch((error) => {
        console.error(error);
    });
}

function removeSlide() {
    var DDcode = getDDcode()
    get(child(dbRef, `display/`+DDcode+'/info/count')).then((snapshot) => {
        const data = snapshot.val()
        if (data <= 0) {
            throwError("D100", true, "Cannot remove slide 0")
            return
        }
        if (snapshot.exists()) {
            remove(ref(db, 'display/' + DDcode + '/content'+data))
            set(ref(db, 'display/' + DDcode + '/info'), {
                count: data-1,
                time: document.getElementById("Intime").value
            });
            window.location.reload()
        } else {
            console.log("No data available");
            throwError("C404", false)
        }
        }).catch((error) => {
            console.error(error);
    });
}