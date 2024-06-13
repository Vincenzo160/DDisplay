// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getDDcode, throwError, toggleBtn, copyToClipboard, unsaved } from "/scripts/util.js";
import { getData } from "/scripts/db.js";
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

document.getElementById("id-display").innerHTML = DDcode+' <i id="copyid" style="font-size: 1.425rem; color: var(--small-text-color);" class="fa fa-copy"></i>';

if (DDcode === null) {
    document.getElementById("id-display").innerHTML = 'Error <i id="copyid" class="fa fa-copy"></i>'
    document.getElementById("copyid").style.display = "none";
}

document.getElementById('remslBTN').addEventListener('click', function(e) {
    removeSlide()
});
document.getElementById('addslBTN').addEventListener('click', function(e) {
    addSlide()
});
addslSEL.addEventListener("change", (event) => {
    var selection = event.target.value
    if (selection === "extension") {
        window.location.href = "/manage/add/extension?id="+ DDcode;
    } else if (selection === "text" || selection === "image") {
        addSlide(selection)
    } else {
        console.log("Invalid selection")
    }
})
expBTN.addEventListener("change", (event) => {
    var selection = event.target.value
    if (selection === "json") {
        getData().then(data => {
            
            const jsonData = JSON.stringify(data, null, '  ')
            console.log(data)
            console.log(jsonData)
            
            var blob = new Blob([jsonData], {type: "application/json"}),
            url = URL.createObjectURL(blob);

            var a = document.createElement('a');
            a.download = DDcode + ".json";
            a.href = url;
            a.textContent = "Download data.json";

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.location.reload()
          }).catch(error => {
            console.error(error);
          });
    } else {
        console.log("Invalid selection")
    }
})
document.getElementById('addslTXT').addEventListener('click', function(e) {
    toggleBtn("addslTXT", "+", true, "add-btn-disabled")
    toggleBtn("addslIMG", "+", true, "add-btn-disabled")
    toggleBtn("addextBTN", "+", true, "add-btn-disabled")
    addSlide("text")
});
document.getElementById('addslIMG').addEventListener('click', function(e) {
    toggleBtn("addslTXT", "+", true, "add-btn-disabled")
    toggleBtn("addslIMG", "+", true, "add-btn-disabled")
    toggleBtn("addextBTN", "+", true, "add-btn-disabled")
    addSlide("image")
});
document.getElementById('saveBTN').addEventListener('click', function(e) {
    save()
});
document.getElementById('viewBTN').addEventListener('click', function(e) {
    window.open("https://ddisplay.sgtbots.com/display?id="+DDcode, '_blank')
});
document.getElementById('addextBTN').addEventListener('click', function(e) {
    window.location.href = "/manage/add/extension?id="+ DDcode;
});
document.getElementById('copyid').addEventListener('click', function(e) {
    copyToClipboard(DDcode, 'copyid')
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
        document.getElementById("dashBottom").style.display = "none";
    }
}).catch((error) => {
    console.error(error);
});

let isUnsaved = false;

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
            srcInput.addEventListener('change', () => { isUnsaved = true; unsaved(srcInput); });
            box.appendChild(srcInput);
        } else if (content.type === "text") {
            //text
            let txtInput = document.createElement("textarea");
            txtInput.id = "text"+slide
            txtInput.value = content.txt
            txtInput.setAttribute('maxlength', '60');
            txtInput.addEventListener('change', () => { isUnsaved = true; unsaved(txtInput); });
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
            colTxtInput.addEventListener('change', () => { isUnsaved = true; unsaved(colTxtInput); });
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
            colBgInput.addEventListener('change', () => { isUnsaved = true; unsaved(colBgInput); });
            colDiv.appendChild(colBgInput);
        } else if (content.type === "extension") {
            //div
            let colDiv = document.createElement("div");
            colDiv.align="left"
            box.appendChild(colDiv);
            // p
            let p = document.createElement("p");
            let extSetting = content.extParams;
            delete extSetting.id
            let formattedString = Object.entries(extSetting).map(([key, value]) => `${key}: ${value}`).join(', ');
            console.log(formattedString);
            p.innerHTML = "Extension ID: "+content.extId +  "<br> Extension settings: "+formattedString
            colDiv.appendChild(p);
        } else {
            throwError("D10"+slide,true,"Error Parsing "+slide)
            window.location.replace("/")
        }
        // br
        let brk = document.createElement("br");
        box.appendChild(brk);
        // div
        let colChkDiv = document.createElement("div"); 
        colChkDiv.align="left"
        box.appendChild(colChkDiv);
        let colEnabLable = document.createElement("label");
        colEnabLable.innerHTML = "Disabled: "
        colChkDiv.appendChild(colEnabLable);
        let colEnabled = document.createElement("input");
        colEnabled.type = "checkbox"
        colEnabled.id = "disable"+slide
        colEnabled.checked = content.disabled
        colEnabled.className="psaEnabled"
        colEnabled.addEventListener('change', () => { isUnsaved = true; unsaved(colEnabled); });
        colChkDiv.appendChild(colEnabled);
        document.getElementById("dash").appendChild(box);
        slide = slide+1
        console.log(slide)
    }
    if (data.info.psaBanner) {
        // TODO add proper separator betwen content and settings        
        // br
        let brk = document.createElement("br");
        document.getElementById("dash").appendChild(brk);


        let boxPsa = document.createElement("div");
        boxPsa.className = "container"
        let psaTitle = document.createElement("h2");
        psaTitle.align="left"
        psaTitle.innerHTML="PSA Banner"
        boxPsa.appendChild(psaTitle);
        let psaInput = document.createElement("textarea");
        psaInput.value = data.psa.txt
        psaInput.id = "psaTxt"
        psaInput.setAttribute('maxlength', '90');
        psaInput.addEventListener('change', () => { isUnsaved = true; unsaved(psaInput); });
        boxPsa.appendChild(psaInput);
        // br
        let brake = document.createElement("br");
        boxPsa.appendChild(brake);
        // Div
        let chkDiv = document.createElement("div");
        chkDiv.align="left"
        boxPsa.appendChild(chkDiv);
        // Lable
        let psaEnabLable = document.createElement("label");
        psaEnabLable.innerHTML = "Enabled: "
        chkDiv.appendChild(psaEnabLable);
        let psaEnabled = document.createElement("input");
        psaEnabled.type = "checkbox"
        psaEnabled.id = "psaEnabled"
        psaEnabled.checked = data.psa.enabled
        psaEnabled.className="psaEnabled"
        psaEnabled.addEventListener('change', () => { isUnsaved = true; unsaved(psaEnabled); });
        chkDiv.appendChild(psaEnabled);
        document.getElementById("dash").appendChild(boxPsa);
    }
    var content = data[`content${slide}`]
    let box = document.createElement("div");
    box.className = "container"
    let title = document.createElement("h2");
    title.align="left"
    title.innerHTML="Interval Time (Seconds)"
    let timeInput = document.createElement("input");
    timeInput.type = "tel"
    timeInput.value = data.info.time / 1000
    timeInput.id = "Intime"
    timeInput.addEventListener('change', () => { isUnsaved = true; unsaved(timeInput); });
    box.appendChild(title);
    box.appendChild(timeInput);
    document.getElementById("dash").appendChild(box);
    document.getElementById("status-label").style.display = "none";



}

window.addEventListener('beforeunload', (event) => {
    if (isUnsaved) {
        event.preventDefault();
        event.returnValue = '';
    }
});

function save() {
    var slide = 0
    var DDcode = getDDcode()
    get(child(dbRef, `display/`+DDcode)).then((snapshot) => {
    const data = snapshot.val()
    if (snapshot.exists()) {
        console.log(snapshot.val());

        processSlides(slide, data);
        async function processSlides(slide, data) {
            while (slide <= data.info.count) {
                await saveDb(slide, data);
                slide = slide + 1;
                console.log(slide);
            }
        }
            
        function saveDb(slide,data) {
            const content = data[`content${slide}`]
            var type = document.getElementById("type"+slide).innerHTML.replace(/\d|\s|\./g, '');
            console.log(type)
            if (type === "text") {
                var resolution = "1920x1080" // TODO: Implement in a non hardcoded way
                var bgColor = document.getElementById("bgColor"+slide).value
                var txtColor = document.getElementById("txtColor"+slide).value
                var txt = document.getElementById("text"+slide).value
                var disable = document.getElementById("disable"+slide).checked
                return set(ref(db, 'display/' + DDcode + '/content'+slide), {
                    id: slide,
                    type: "text",
                    txt: txt,
                    txtColor: txtColor,
                    bgColor: bgColor,
                    url: "https://placehold.co/"+resolution+"/"+bgColor.substring(1)+"/"+txtColor.substring(1)+"?text="+encodeURIComponent(txt),
                    disabled: disable
                })
            } else if (type === "image") {
                var disable = document.getElementById("disable"+slide).checked
                return set(ref(db, 'display/' + DDcode + '/content'+slide), {
                    id: slide,
                    type: "image",
                    url: document.getElementById("url"+slide).value,
                    disabled: disable
                })
            } else if (type === "extension") {
                console.log(content)
                // console.log(slide)
                var disable = document.getElementById("disable"+slide).checked
                return set(ref(db, 'display/' + DDcode + '/content'+slide), {
                    id: slide,
                    type: "extension",
                    extId: content.extId,
                    disabled: disable
                }).then(() => {
                    set(ref(db, 'display/' + DDcode + '/content'+slide+'/extParams'), content.extParams)
                })
            }
        }
        
        // PSA
        if (document.getElementById("psaEnabled") !== null) {
            set(ref(db, 'display/' + DDcode + '/psa'), {
                enabled: document.getElementById("psaEnabled").checked,
                txt: document.getElementById("psaTxt").value
            });
        }
        set(ref(db, 'display/' + DDcode + '/info'), {
            count: data.info.count,
            time: document.getElementById("Intime").value * 1000,
            psaBanner: true
        });
        var inputElements = Array.from(document.getElementsByTagName("input"));
        var textareaElements = Array.from(document.getElementsByTagName("textarea"));
        var elements = inputElements.concat(textareaElements);
        
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains("unsaved-input")) {
                elements[i].classList.remove("unsaved-input");
            }
        }
        document.getElementById("saveWarning").style.display = "none";
        isUnsaved = false
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
            type: type,
            url: "Image url",
        });
        set(ref(db, 'display/' + DDcode + '/info'), {
            count: data+1,
            psaBanner: true,
            time: document.getElementById("Intime").value * 1000
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
                psaBanner: true,
                time: document.getElementById("Intime").value * 1000
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