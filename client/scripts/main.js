let scrl = false;
let rev = false;
let scrlSpeed = 1;
let started = false;
let scene = 0; // 1 = forest, 2 = river & night, 3 = cliff & end
let player = {
    name: "Stranger",
    sparks: 0, // 0 - 6
    sympathy: 0, // 0 - 3
    ending: -1 // 0 = bad, 1 = neutral, 2 = good, -1 = none
};
let secrets = {
    day: {
        uncovered: {
            fox: false,
            all: false,
            shrum1: false,
            shrum2: false,
            shrum3: false,
            berries: false,
            birds: false
        },
        count: 5,
        found: 0,
    },
    night: {
        uncovered: {
            all: false,
            flies: false
        },
        count: 1,
        found: 0,
    }
}

//sound
let soundPlaying = false;
let introSound = document.getElementById("introsound");
let statementSound = document.getElementById("statementsound");
statementSound.volume = 0.7;
let questionSound = document.getElementById("questionsound");
questionSound.volume = 0.7;
let sparkSound = document.getElementById("sparksound");
sparkSound.volume = 0.1;

//working get request
/*
function updatePlayer() {
    let url = "http://127.0.0.1:3000/?string=yay&number=123";
    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}
updatePlayer();
*/

function start() {
    started = true;
    
    switch (scene) {
        case 1:
            setTimeout(() => {
                animateBirds();
            }, 3000);
            break;
        case 2:
            document.getElementById("light").style.background = "radial-gradient(circle at center, transparent, #010912e6 30%)";
            createFlies();
            createNightPrlx();
            prlxDayItems.forEach(el => {
                el.removePrlx();
            });
            break;
    }

    fox.setX(0);
    bg.setX(0);
    document.getElementById("uicon").style.background = "none";
    document.getElementById("uiimg").style.display = "none";
    document.getElementById("uicon").style.zIndex = "4";
    document.getElementById("inputcon").style.display = "none";


    setTimeout(() => {
        let btn = document.createElement("button");
        btn.innerText = "done exploring?";
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
    
    let dialogue = getCurrentDialogue();
    let img;
    switch (dialogue) {
        case introDia:
            img = "assets/intro2.png";
            break;
        case riverDia:
            img = "assets/river2.png";
            break;
        case endDia:
            img = "assets/sleep2.png";
            break;
    }
    document.getElementById("uiimg").src = img;
    dialogue.nextDialogue();
}

// create spark counter ui
for (let i = 0; i < 6; i++) {
    let div = document.createElement('div');
    div.className = 'sparks';
    if (i == 0) {
        div.style.marginRight = '20px';
    }
    document.getElementById('spcon').appendChild(div);
}


function addSpark() {
    let newSpark = document.getElementsByClassName("sparks")[player.sparks];
    player.sparks++;
    document.getElementById("sp").animate([
        { opacity: "0.5", transform: "scale(0)"},
        { opacity: "0", transform: "scale(50)"}
    ], {
        duration: 700,
        easing: "ease-in",
    });
    newSpark.style.backgroundImage = "url('assets/sparks_full.png')";
    sparkSound.play();
}

window.addEventListener('load', function () {
    document.getElementById("title").style.position = "absolute";
    this.setTimeout(() => {
        document.getElementById("title").animate([
            { opacity: "1" },
            { opacity: "0" }
        ], {
            duration: 1000,
            fill: "forwards"
        });
        document.getElementById("fox").style.top = "55vh";
        document.getElementById("spark").style.top = "25vh";

        createDayPrlx();
    }, 200);
    nextScene();
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
        case "iconfs":
            spark.animateSpark(evt.clientX, evt.clientY);
            toggleFullscreen();
            break;
        case "fox":
            if (!secrets.day.uncovered.fox) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutMilo.nextDialogue();
                addSpark();
                secrets.day.uncovered.fox = true;
            }
            break;
        case "shrum1":
            if (evt.clientY > window.innerHeight - 200 && !secrets.day.uncovered.shrum1) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutShrums.nextDialogue();
                secrets.day.uncovered.shrum1 = true;
            }
            break;
        case "shrum2":
            if (evt.clientY > window.innerHeight - 200 && !secrets.day.uncovered.shrum2) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutShrums.nextDialogue();
                secrets.day.uncovered.shrum2 = true;
            }
            break;
        case "shrum3":
            if (evt.clientY > window.innerHeight - 200 && !secrets.day.uncovered.shrum3) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutShrums.nextDialogue();
                secrets.day.uncovered.shrum3 = true;
            }
            break;
        case "berries":
            if (evt.clientY > window.innerHeight - 300 && !secrets.day.uncovered.berries) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutBerries.nextDialogue();
                secrets.day.uncovered.berries = true;
            }
            break;
        case "birds":
            if (!secrets.day.uncovered.birds) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutBirds.nextDialogue();
                secrets.day.uncovered.birds = true;
            }
            break;
        default:
            break;
    }

    if (evt.target.classList.contains("fly")) {
        console.log("clicked on: fly");
        if(!secrets.night.uncovered.flies) {
            spark.animateSpark(evt.clientX, evt.clientY);
            aboutFlies.nextDialogue();
            secrets.night.uncovered.flies = true;
        }
    }

    let dialogue = getCurrentDialogue();
    if (!started && evt.target.id != "iconfs" && dialogue.getType() == "statement" && evt.target.tagName != "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY);
        dialogue.nextDialogue();
        if (dialogue == introDia && !soundPlaying) {
            soundPlaying = true;
            introSound.play();
        }
    }
    if (evt.target.tagName == "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY);
    }
});
window.addEventListener('keydown', (evt) => {
    let dialogue = getCurrentDialogue();
    if (evt.key == "Enter" || evt.key == " ") {
        if (!started && dialogue.getType() == "statement") {
            spark.animateSpark(window.innerWidth - 100, window.innerHeight * 0.75, true);
            dialogue.nextDialogue();
        }
    }
});
window.addEventListener('mousemove', (evt) => {
    let light = document.getElementById("light");
    let lightWidth = 200 * window.innerWidth / 100;
    let lightHeight = 200 * window.innerHeight / 100;
    light.style.left = (evt.clientX - lightWidth / 2) + 'px';
    light.style.top = (evt.clientY - lightHeight / 2) + 'px';
});

let fullscreen = false;
let iconElem = document.getElementById("iconfs");
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