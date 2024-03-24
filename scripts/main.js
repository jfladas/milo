let scrl = false;
let rev = false;
let scrlSpeed = 1;
let started = false;
let scene = 0; // 1 = forest, 2 = river, 3 = cliff
let player = {
    name: "Stranger",
    sparks: 0,
    sympathy: 0
};
let secrets = {
    uncovered: false,
    count: 5,
    found: 0,
    ucFox: false,
    ucShrum1: false,
    ucShrum2: false,
    ucShrum3: false,
    ucBerries: false,
    ucBirds: false
}

function start() {
    started = true;
    document.getElementById("uicon").style.background = "none";
    document.getElementById("uiimg").style.display = "none";
    document.getElementById("uicon").style.zIndex = "0";
    document.getElementById("inputcon").style.display = "none";
    setTimeout(() => {
        animateBirds();
    }, 3000);
    setTimeout(() => {
        let btn = document.createElement("button");
        btn.innerText = "done exploring!";
        btn.id = "btn_continue";
        btn.onclick = () => {
            btn.style.display = "none";
            nextScene();
        }
        btn.style.transform = "translateX(500%)";
        btn.style.transition = "transform 1s ease-in-out";
        document.getElementById("inputcon").style.display = "flex";
        document.getElementById("inputcon").appendChild(btn);
        setTimeout(() => {
            btn.style.transform = "translateX(0)";
        }, 100);
    }, 10000);

    function animateBirds() {
        if (scene == 1) {
            document.getElementById("birds").animate([
                { transform: 'translateX(calc(110vw + 256px))' },
                { transform: 'translateX(calc(-10vw - 256px))' }
            ], {
                duration: window.innerWidth * 3,
                iterations: 1,
                delay: 5000
            });
            setTimeout(() => {
                animateBirds();
            }, window.innerWidth * 3 + 10000);
        }
    }
}
function nextScene() {
    started = false;
    scene++;
    document.getElementById("uicon").style.background = "var(--dark)";
    document.getElementById("uiimg").style.display = "initial";
    document.getElementById("uicon").style.zIndex = "4";
    document.getElementById("inputcon").style.display = "flex";
    document.getElementById("uitxt").innerHTML = "";
    switch (scene) {
        case 1:
            document.getElementById("uiimg").src = "assets/intro.png";
            break;
        case 2:
            document.getElementById("uiimg").src = "assets/river.png";
            break;
        case 3:
            document.getElementById("uiimg").src = "assets/sleep.png";
            break;
        default:
            break;
    }
}
nextScene();

function addSpark() {
    let newSpark = document.getElementsByClassName("sparks")[player.sparks];
    console.log(newSpark);
    player.sparks++;
    //animation
    newSpark.style.backgroundImage = "url('assets/sparks_full.png')";
}

window.addEventListener('load', function () {
    this.setTimeout(() => {
        document.getElementById("title").animate([
            { opacity: "1" },
            { opacity: "0" }
        ], {
            duration: 1000,
            fill: "forwards"
        });
    }, 100);
})
let wheelTimeout = null;
window.addEventListener('wheel', (evt) => {
    if (started) {
        scrl = true;
        if (evt.deltaY < 0) {
            rev = true;
        } else if (evt.deltaY > 0) {
            rev = false;
        } else {
            rev = false;
            scrl = false;
        }
        if (evt.deltaY == 100 || evt.deltaY == -100) {
            scrlSpeed = 1;
        } else if (evt.deltaY > 80 || evt.deltaY < -80) {
            scrlSpeed = 0.7;
        } else {
            scrlSpeed = 0.3;
            if (evt.deltaY > -20 && evt.deltaY < 20) {
                scrlSpeed = 0.2;
            }
        }
        fox.animateFox();
        bg.animateBG();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            scrl = false;
            fox.animateFox();
            bg.animateBG();
        }, 300);
    }
});
window.addEventListener('click', (evt) => {

    console.log("clicked on: " + evt.target.id);
    switch (evt.target.id) {
        case "fox":
            if (!secrets.ucFox) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutMilo.nextDialogue();
                addSpark();
                secrets.ucFox = true;
                player.sympathy++;
            }
            break;
        case "iconElem":
            spark.animateSpark(evt.clientX, evt.clientY);
            toggleFullscreen();
            break;
        case "shrum1":
            if (evt.clientY > window.innerHeight - 200 && !secrets.ucShrum1) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutShrums.nextDialogue();
                secrets.ucShrum1 = true;
            }
            break;
        case "shrum2":
            if (evt.clientY > window.innerHeight - 200 && !secrets.ucShrum2) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutShrums.nextDialogue();
                secrets.ucShrum2 = true;
            }
            break;
        case "shrum3":
            if (evt.clientY > window.innerHeight - 200 && !secrets.ucShrum3) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutShrums.nextDialogue();
                secrets.ucShrum3 = true;
            }
            break;
        case "berries":
            if (evt.clientY > window.innerHeight - 300 && !secrets.ucBerries) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutBerries.nextDialogue();
                secrets.ucBerries = true;
            }
            break;
        case "birds":
            if (!secrets.ucBirds) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutBirds.nextDialogue();
                secrets.ucBirds = true;
            }
            break;
        default:
            break;
    }
    if (secrets.found == secrets.count && !secrets.uncovered) {
        addSpark();
        secrets.uncovered = true;
    }
    let dialogue;
    switch (scene) {
        case 1:
            dialogue = introDia;
            break;
        case 2:
            dialogue = riverDia;
            break;
        default:
            break;
    }
    if (!started && evt.target.id != "iconElem" && dialogue.getType() == "statement" && evt.target.tagName != "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY, true);
        dialogue.nextDialogue();
    } else if (evt.target.tagName == "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY);
    }
});

let fullscreen = false;
let iconElem = document.getElementById("iconElem");
let docElem = document.documentElement;
function toggleFullscreen() {
    if (fullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        iconElem.src = "assets/fullscreen.png";
        fullscreen = false;
    } else {
        if (docElem.requestFullscreen) {
            docElem.requestFullscreen();
        } else if (docElem.webkitRequestFullscreen) { /* Safari */
            docElem.webkitRequestFullscreen();
        } else if (docElem.msRequestFullscreen) { /* IE11 */
            docElem.msRequestFullscreen();
        }
        iconElem.src = "assets/notfullscreen.png";
        fullscreen = true;
    }
};