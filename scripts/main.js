let scrl = false;
let rev = false;
let scrlSpeed = 1;
let started = false;
let scene = 0; // 1 = forest, 2 = river & night, 3 = cliff & end
let player = {
    id: 0,
    name: "Stranger",
    sparks: 0, // 0 - 7
    sympathy: 0, // 0 - 3
    ending: -1, // 0 = bad, 1 = neutral, 2 = good, 3 = perfect, -1 = none
    score: 0
};
let secrets = {
    day: {
        uncovered: {
            fox: false,
            all: false,
            shrum3: false,
            flwr3: false,
            berries: false,
            birds: false
        },
        count: 4,
        found: 0,
    },
    night: {
        uncovered: {
            all: false,
            shrum1: false,
            shrum2: false,
            flwr1: false,
            flwr2: false,
            flies: false
        },
        count: 5,
        found: 0,
    }
}
let topPlayers = [];

//sound
let soundPlaying = false;
let introSound = document.getElementById("introsound");
let statementSound = document.getElementById("statementsound");
statementSound.volume = 0.7;
let questionSound = document.getElementById("questionsound");
questionSound.volume = 0.7;
let sparkSound = document.getElementById("sparksound");
sparkSound.volume = 0.1;
let birbSound = document.getElementById("birbsound");
birbSound.volume = 0.5;

let url = "https://milos-fa-050d98f6ceab.herokuapp.com/:3000/check";
fetch(url, {
    method: 'POST',
    credentials: 'include', // Ensure cookies are included in the request
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json())
    .then(data => {
        if (data.status == "new") {
            //console.log("new user");
            initialize();
        } else {
            //console.log("returning user");
            player = data.player;
            secrets = data.secrets;
            endScreen();
        }
    })
    .catch(error => {
        console.log(error);
        initialize();
    });

function saveData() {
    player.score = player.ending * 1000 + player.sparks * 100 + player.sympathy * 20 + secrets.day.found * 10 + secrets.night.found * 10;
    if (secrets.day.uncovered.fox) { player.score += 20; }
    let url = "https://milos-fa-050d98f6ceab.herokuapp.com/:3000/save";
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ player, secrets })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
    setTimeout(() => {
        location.reload();
    }, 300);
}

function deleteData() {
    let url = "https://milos-fa-050d98f6ceab.herokuapp.com/:3000/delete";
    let playerId = { id: player.id };  // Wrap the id in an object

    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerId)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));

    setTimeout(() => {
        location.reload();
    }, 300);
}

function createScoreEntries() {
    let inTop = false;
    topPlayers.forEach((entry) => {
        let isCurrentPlayer = entry.player.id == player.id;
        createScoreEntry(entry.player, isCurrentPlayer);
        if (isCurrentPlayer) {
            inTop = true;
        }
    });
    if (!inTop) {
        const divSpace = document.createElement('div');
        divSpace.className = 'topscore space';
        divSpace.innerHTML = `...`;

        document.getElementById('endscores').appendChild(divSpace);
        createScoreEntry(player, true);
    }

    function createScoreEntry(player, isCurrentPlayer) {
        const div = document.createElement('div');
        div.className = 'topscore';

        let initialSparkImg;
        let initialSparkSrc;
        if (player.score >= 3840) {
            initialSparkSrc = isCurrentPlayer ? 'assets/spark_dark_small.png' : 'assets/spark_single_small.png';
        } else {
            initialSparkSrc = 'assets/small.png';
        }
        initialSparkImg = createSparkImg(initialSparkSrc);
        div.appendChild(initialSparkImg);

        div.innerHTML += ` ${player.name} | ${player.score} `;

        if (isCurrentPlayer) {
            div.style.backgroundColor = "var(--yellow)";
            div.style.color = "var(--black)";
            div.style.fontWeight = "bold";
        }

        for (let i = 0; i < player.sparks; i++) {
            const sparkImg = createSparkImg(isCurrentPlayer ? 'assets/spark_dark_small.png' : 'assets/spark_single_small.png');
            div.appendChild(sparkImg);
        }

        document.getElementById('endscores').appendChild(div);

        function createSparkImg(src) {
            const sparkImg = document.createElement('img');
            sparkImg.src = src;
            if (src == 'assets/spark_dark_small.png') {
                sparkImg.style.transform = 'scale(1.25) translateY(10px)';
            }
            sparkImg.className = 'topspark';
            return sparkImg;
        }
    }
}
function getTopData() {
    let url = "https://milos-fa-050d98f6ceab.herokuapp.com/:3000/top";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            topPlayers = data;
            createScoreEntries();
        })
        .catch(error => {
            console.log(error);
        });
}


function endScreen() {
    const endEl = document.createElement('div');
    endEl.id = 'end';
    document.body.appendChild(endEl);

    const endTxtEl = document.createElement('div');
    endTxtEl.id = 'endtxt';
    const pEl = document.createElement('p');
    pEl.innerHTML = "Good night, <span id='endspan'>" + player.name + "</span>!";
    endTxtEl.appendChild(pEl);
    document.getElementById('end').appendChild(endTxtEl);


    const endSparksEl = document.createElement('div');
    endSparksEl.id = 'endsparks';
    document.getElementById('end').appendChild(endSparksEl);
    for (let i = 0; i < 7; i++) {
        let div = document.createElement('div');
        div.className = 'sparks';
        endSparksEl.appendChild(div);
    }

    const endScoresEl = document.createElement('div');
    endScoresEl.id = 'endscores';
    document.getElementById('end').appendChild(endScoresEl);

    getTopData();

    const endButtonEl = document.createElement('button');
    endButtonEl.id = 'endbutton';
    endButtonEl.innerText = "restart";
    endButtonEl.onmouseover = () => {
        endButtonEl.innerText = "restart (deletes your data)";
    }
    endButtonEl.onmouseout = () => {
        endButtonEl.innerText = "restart";
    }
    endButtonEl.onclick = () => {
        deleteData();
    }
    document.getElementById('end').appendChild(endButtonEl);
    for (let i = 0; i < player.sparks; i++) {
        setTimeout(() => {
            document.getElementsByClassName("sparks")[i].style.backgroundImage = "url('assets/sparks_full.png')";
            const sp = document.getElementById("sp");
            sp.animate([
                { opacity: "0.5", transform: "scale(0)" },
                { opacity: "0", transform: "scale(50)" }
            ], {
                duration: 700,
                easing: "ease-in",
            });
        }, i * 750 + 1000);
    }
}

function initialize() {
    document.getElementById("title").style.position = "absolute";
    setTimeout(() => {
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

    // create spark counter ui
    for (let i = 0; i < 7; i++) {
        let div = document.createElement('div');
        div.className = 'sparks';
        if (i == 0) {
            div.style.marginRight = '20px';
        }
        document.getElementById('spcon').appendChild(div);
    }

    addEventListeners();

    nextScene();
}
function start() {
    started = true;
    
    switch (scene) {
        case 1:
            setTimeout(animateBirds, 8000);
            break;
        case 2:
            document.getElementById("light").style.backgroundImage = "url('assets/flash.png')";
            //document.getElementById("light").style.background = "radial-gradient(circle at center, transparent, #010912e6 30%)";
            createFlies();
            break;
    }

    fox.setX(0);
    bg.setX(0);
    
    setTimeout(() => {
        document.getElementById("uicon").style.background = "none";
        document.getElementById("uiimg").style.display = "none";
        document.getElementById("inputcon").style.display = "none";
    }, 100);


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
                iterations: 1
            });
            birbSound.play();
            setTimeout(animateBirds, window.innerWidth * 3 + 10000);
        }
    }
}
function nextScene() {
    started = false;
    scene++;
    document.getElementById("uicon").style.background = "var(--dark)";
    document.getElementById("uiimg").style.display = "initial";
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
            prlxDayItems.forEach(el => {
                el.removePrlx();
            });
            createNightPrlx();
            break;
        case endDia:
            img = "assets/sleep2.png";
            removeFlies();
            prlxNightItems.forEach(el => {
                el.removePrlx();
            });
            document.getElementById("light").remove();
            document.getElementById("fox").remove();
            calcEnding();
            break;
    }
    document.getElementById("uiimg").src = img;
    dialogue.nextDialogue();

    function calcEnding() {
        let dia;
        if (player.sparks < 3) {
            player.ending = 0;
            dia = [
                { text: "As darkness falls over the forest, a quiet fog seems to cloud my thoughts." },
                { text: "Maybe this is a turning point, a chance for a new beginning. The idea of getting some rest feels more peaceful than anything right now." }
            ];
        } else if (player.sparks < 6) {
            player.ending = 1;
            dia = [
                { text: "Under the serene night sky, I find myself drifting off to sleep. It's a peaceful slumber. Just the quiet embrace of the night, wrapping me in its embrace." },
                { text: "Maybe this is what they mean by the circle of life, huh? Endings leading to new beginnings..." }
            ];
        } else {
            player.ending = 2;
            dia = [
                { text: "With a contented sigh, I nestle into my cozy spot under the stars. Today was magical, filled with laughter, adventure, and cherished memories." },
                { text: "As I drift off to sleep, I'm filled with gratitude for this wonderful day and the amazing friend who shared it with me, no matter what the future may hold." }
            ];
            if (player.sparks == 7) {
                dia.push({ text: "Thanks to you, today was perfect. Sweet dreams, " + player.name + "!" });
                player.ending = 3;
            }
        }
        endDia.appendDialogue(dia);
    }
}

function addSpark() {
    let newSpark = document.getElementsByClassName("sparks")[player.sparks];
    player.sparks++;
    document.getElementById("sp").animate([
        { opacity: "0.5", transform: "scale(0)" },
        { opacity: "0", transform: "scale(50)" }
    ], {
        duration: 700,
        easing: "ease-in",
    });
    newSpark.style.backgroundImage = "url('assets/sparks_full.png')";
    sparkSound.play();
}

let wheelTimeout = null;
function addEventListeners() {
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
        //console.log("clicked on: " + evt.target.id);
        switch (evt.target.id) {
            case "iconfs":
                spark.animateSpark(evt.clientX, evt.clientY);
                toggleFullscreen();
                break;
            case "fox":
                if (!secrets.day.uncovered.fox && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutMilo.nextDialogue();
                    addSpark();
                    secrets.day.uncovered.fox = true;
                }
                break;
            case "shrum3":
                if (evt.clientY > window.innerHeight - 250 && !secrets.day.uncovered.shrum3 && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutShrums.nextDialogue();
                    secrets.day.uncovered.shrum3 = true;
                }
                break;
            case "flwr3":
                if (evt.clientY > window.innerHeight - 250 && !secrets.day.uncovered.flwr3 && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutFlowers.nextDialogue();
                    secrets.day.uncovered.flwr3 = true;
                }
                break;
            case "berries":
                if (evt.clientY > window.innerHeight - 300 && !secrets.day.uncovered.berries && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutBerries.nextDialogue();
                    secrets.day.uncovered.berries = true;
                }
                break;
            case "birds":
                if (!secrets.day.uncovered.birds && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutBirds.nextDialogue();
                    secrets.day.uncovered.birds = true;
                }
                break;


            case "shrum1":
                if (evt.clientY > window.innerHeight - 250 && !secrets.night.uncovered.shrum1 && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutShrums.nextDialogue();
                    secrets.night.uncovered.shrum1 = true;
                }
                break;
            case "shrum2":
                if (evt.clientY > window.innerHeight - 250 && !secrets.night.uncovered.shrum2 && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutShrums.nextDialogue();
                    secrets.night.uncovered.shrum2 = true;
                }
                break;
            case "flwr1":
                if (evt.clientY > window.innerHeight - 250 && !secrets.night.uncovered.flwr1 && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutFlowers.nextDialogue();
                    secrets.night.uncovered.flwr1 = true;
                }
                break;
            case "flwr2":
                if (evt.clientY > window.innerHeight - 250 && !secrets.night.uncovered.flwr2 && started) {
                    spark.animateSpark(evt.clientX, evt.clientY);
                    aboutFlowers.nextDialogue();
                    secrets.night.uncovered.flwr2 = true;
                }
                break;
            
            default:
                break;
        }

        if (evt.target.classList.contains("fly")) {
            //console.log("clicked on: fly");
            if (!secrets.night.uncovered.flies && started) {
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
        if (evt.key == "Enter" || evt.key == " ") {
            let dialogue = getCurrentDialogue();
            if (!started && dialogue.getType() == "statement") {
                spark.animateSpark(window.innerWidth - 100, window.innerHeight * 0.75, true);
                dialogue.nextDialogue();
            }
        }
    });
    window.addEventListener('mousemove', (evt) => {
        if (started) {
            let light = document.getElementById("light");
            let lightWidth = 200 * window.innerWidth / 100;
            let lightHeight = 200 * window.innerHeight / 100;
            light.style.left = (evt.clientX - lightWidth / 2) + 'px';
            light.style.top = (evt.clientY - lightHeight / 2) + 'px';
        }
    });
}

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