let scrl = false;
let rev = false;
let end = false;
let nxttxt = null;
let scrlSpeed = 1;
let started = false;
let scene = 0; // 1 = forest, 2 = river, 3 = cliff
let fullscreen = false;
let iconfs = document.getElementById("iconfs");
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
const scrollContainer = document.querySelector("main");
let wheelEventEndTimeout = null;
let docelem = document.documentElement;

nextScene();

// Fox factory function
const createFox = (skin) => {
    let x = 0;
    let foxSpeed = 2;
    const foxAnim = skin.animate(null, { duration: 500, easing: 'steps(4)' });

    const animateFox = () => {
        if (x < (0)) {
            x = (0);
        } else if (x > window.innerWidth - 512) {
            x = window.innerWidth - 512;
        }
        let keyframes = [
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + x + 'px, 0px)' }
        ];
        if (scrl && (!(rev && bg.getX() >= 0) || !(rev && x <= 0)) && (!(!rev && bg.getX() <= window.innerWidth * (-1)) || !(!rev && x >= window.innerWidth - 512))) {
            foxSpeed = window.innerWidth / 400;
            if ((rev && x <= 0) || (!rev && x >= window.innerWidth - 512)) {
                foxSpeed = 0;
            }
            if (rev) {
                x -= foxSpeed * scrlSpeed;
                skin.style.backgroundImage = "url('assets/foxrev.png')";
            } else {
                x += foxSpeed * scrlSpeed;
                skin.style.backgroundImage = "url('assets/fox.png')";
            }
            
            keyframes = [
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + (0 + x) + 'px, 0px)' },
                { clip: 'rect(0px, 512px, 256px, 256px)', transform: 'translate(' + (-256 + x) + 'px, 0px)' },
                { clip: 'rect(0px, 768px, 256px, 512px)', transform: 'translate(' + (-512 + x) + 'px, 0px)' },
                { clip: 'rect(0px, 1024px, 256px, 768px)', transform: 'translate(' + (-758 + x) + 'px, 0px)' },
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + (0 + x) + 'px, 0px)' }
            ];
        }

        foxAnim.effect.setKeyframes(keyframes);
        foxAnim.play();
        checkEnd();
    };

    foxAnim.onfinish = animateFox;

    return {
        getX: () => x,
        animateFox
    };
};

// Spark factory function
const createSpark = (elem, skin) => {

    elem.hidden = true;

    const sparkAnim = skin.animate(null, { duration: 300, easing: 'steps(4)' });

    const animateSpark = (x, y) => {
        elem.style.left = x - 50 + "px";
        elem.style.top = y - 50 + "px";
        elem.hidden = false;
        let keyframes = [
            { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 192px, 96px, 96px)', transform: 'translate(-96px, 0px)' },
            { clip: 'rect(0px, 288px, 96px, 192px)', transform: 'translate(-192px, 0px)' },
            { clip: 'rect(0px, 384px, 96px, 288px)', transform: 'translate(-288px, 0px)' },
            { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'translate(0px, 0px)' }
        ];
        document.getElementById("sparkSkin").style.zIndex = "5";
        sparkAnim.effect.setKeyframes(keyframes);
        sparkAnim.play();
    };

    sparkAnim.onfinish = () => {
        elem.hidden = true;
    };

    return { animateSpark };
};

// Background factory function
const createBg = (elem) => {
    let x = 0;
    let bgSpeed = 2;
    const bgAnim = elem.animate(null, { duration: 10, easing: 'steps(10)' });

    const animateBG = () => {
        if (x > 0) {
            x = 0;
        } else if (x < window.innerWidth * (-2) + 256) {
            x = window.innerWidth * (-2) + 256;
        }
        if (scrl && !(rev && x >= 0) && !(!rev && x <= window.innerWidth * (-1))) {
            bgSpeed = window.innerWidth / 600;
            if (rev) {
                x += bgSpeed*scrlSpeed;
            } else {
                x -= bgSpeed*scrlSpeed;
            }
        }
        bgAnim.effect.setKeyframes([
            bgAnim.effect.getKeyframes()[1],
            { transform: 'translateX(' + x + 'px)' }
        ]);
        bgAnim.play();
        prlxItems.forEach(el => {
            el.animatePrlx(x);
        });
        checkEnd();
    };

    bgAnim.onfinish = animateBG;

    return {
        getX: () => x,
        animateBG
    };
};

// Parallax factory function
const createPrlx = (elem, factor, pos) => {
    let p = pos * window.innerWidth / 50;
    const prlxAnim = elem.animate(null, { duration: 10, easing: 'steps(10)' });

    const animatePrlx = (x) => {
        x = x * parseFloat(factor) + parseInt(p);
        prlxAnim.effect.setKeyframes([
            prlxAnim.effect.getKeyframes()[1],
            { transform: 'translateX(' + x + 'px)' }
        ]);
        
        prlxAnim.play();
    };

    return {
        animatePrlx
    };
};

// Dialogue factory function
const createDialogue = (script, name) => {
    let progress = 0;
    let type = "statement";
    function nextDialogue() {
        dialogue = this;
        nxttxt = dialogue.next();
        if (nxttxt != null) {
            document.getElementById("uitxt").innerText = nxttxt.text;
            if (dialogue == aboutMilo || dialogue == aboutShrums || dialogue == aboutBerries || dialogue == aboutBirds) {
                let nowtxt = nxttxt.text;
                setTimeout(() => {
                    console.log(document.getElementById("uitxt").innerText, nowtxt, document.getElementById("uitxt").innerText == nowtxt);
                    if (document.getElementById("uitxt").innerText == nowtxt) {
                        document.getElementById("uitxt").innerText = "";
                    }
                }, 10000);
                if (dialogue == aboutShrums || dialogue == aboutBerries || dialogue == aboutBirds) {
                    secrets.found++;
                }
            }
            if (nxttxt.type == "question") {
                if (dialogue == introDia && introDia.getProgress() == 3) {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.id = "input";
                    input.placeholder = "Stranger";
                    input.setAttribute("spellcheck", "false");
                    input.style.transform = "translateX(500%)";
                    input.style.transition = "transform 1s ease-in-out";
                    input.addEventListener('input', resizeInput);
                    input.addEventListener('keydown', (event) => {
                        if (event.key === "Enter") {
                            handleInput();
                            introDia.nextDialogue();
                        }
                    });
                    resizeInput.call(input); // immediately call the function
                    function resizeInput() {
                        this.style.width = this.value.length + "ch";
                    }
                    document.getElementById("inputcon").appendChild(input);
                    setTimeout(() => {
                        input.style.transform = "translateX(0)";
                    }, 100);
                    setTimeout(() => {
                        input.focus();
                    }, 1100);
                }
                for (let i = 0; i < nxttxt.answers.length; i++) {
                    let btn = document.createElement("button");
                    btn.innerText = nxttxt.answers[i];
                    btn.id = dialogue.getName() + "_btn_" + dialogue.getProgress() + "_" + i;
                    btn.onclick = () => {
                        handleClick(btn.id);
                    }
                    btn.style.transform = "translateX(500%)";
                    btn.style.transition = "transform 1s ease-in-out";
                    document.getElementById("inputcon").appendChild(btn);
                    setTimeout(() => {
                        btn.style.transform = "translateX(0)";
                    }, 100);
                }
            }
        } else {
            document.getElementById("uitxt").innerText = "";
            if (dialogue == introDia || dialogue == riverDia) {
                start();
            }
        }
    }
    function next() {
        if (progress >= script.length) {
            return null; // End of dialogue
        }

        const current = script[progress];
        progress++;

        if (current.statement) {
            type = "statement";
            return { type: "statement", text: current.statement };
        } else if (current.question) {
            type = "question";
            return {
                type: "question",
                text: current.question,
                answers: current.answers
            };
        }
    }
    function changeNext(statement) {
        script[progress].statement = statement;
    }

    return {
        next: next,
        nextDialogue,
        getLength: () => script.length,
        getProgress: () => progress,
        getType: () => type,
        getName: () => name,
        changeNext
    };
};

// Usage of the factory functions
const fox = createFox(document.getElementById("foxSkin"));
const spark = createSpark(document.getElementById("spark"), document.getElementById("sparkSkin"));
const bg = createBg(document.getElementById("bg"));

let prlxItems = [];
let els = document.getElementsByClassName("prlx");
Array.prototype.forEach.call(els, function (el) {
    prlxItems.push(createPrlx(el, el.getAttribute("data-prlx-factor"), el.getAttribute("data-prlx-pos")));
});

const introDia = createDialogue([
    { statement: "Hey there! I'm Milo, your cheerful explorer buddy!" },
    { statement: "I love spending time with kind folks like you, and I'm thrilled to embark on this adventure together!" },
    { question: "Oh, and what's your name, friend? I'd love to know!", answers: ["...is my Name"] },
    { statement: "You don't wanna tell me? Thats okay..." },
    { question: "Do you want to help me uncover the wonders of this forest?", answers: ["Yes", "No"] },
    { statement: "Yay! Thank you! This is going to be so fun!" },
    { statement: "Click on interesting things to hear me share little tales about them. Exploring the woods together with you would make me very happy!" },
    { statement: "And don't forget, scrolling moves us forward or backward. Let's make today unforgettable!" },
], "intro");
const aboutMilo = createDialogue([
    { statement: "Oh, me? Well, I'm Milo, the friendly fox. I've roamed these woods for as long as I can remember, always on the lookout for new adventures and hidden secrets." },
], "milo");
const aboutShrums = createDialogue([
    { statement: "Ah, mushrooms! Each one holds a mystery, from the delicious to the poisonous, even those that glow. They're like hidden treasures in the forest." },
    { statement: "These fungi, small yet significant, emerge from the shadows, reminding us of beauty in darkness." },
    { statement: "Like time's guardians, the shrooms silently witness nature's rhythm. Every little instance may shape our journey." }
], "shrum");
const aboutBerries = createDialogue([
    { statement: "Berries, nature's sweet jewels, each one a tiny burst of flavor and joy. They are like the little joys life offers, waiting to be savored." }
], "berries");
const aboutBirds = createDialogue([
    { statement: "Look at those birds, dancing across the sky! Each one is like a fleeting moment of freedom and grace. This reminds me to be grateful for these experiences." }
], "birds");
const riverDia = createDialogue([
    { statement: "Oh, look at this! We've stumbled upon my favorite spot, the enchanting river Rami." },
    { statement: "It's such a beautiful afternoon, look how the sunlight dances on the water, casting a warm glow over everything." },
    { statement: "Rami has this way of making you stop and think, you know? It's like a gentle nudge to ponder life's mysteries." },
    { question: "So, what do you think? Can I ask you some questions before we continue our journey?", answers: ["Yes", "No"] },
    { question: "How can we spread kindness every day?", answers: ["Just enjoy the present!", "Even a small gesture can brighten someone's day"] },
    { question: "What can we do to make the world a better place?", answers: ["Try to discover joy in the simple things", "Don't worry too much about that yet"] },
    { question: "How can we help friends see the bright side of life, even if we might not always see it ourselves?", answers: ["It's important to focus on your own well-being before trying to help others", "Unexpected acts of kindness or just a positive attitude can be a great start"] },
    { statement: "Thanks for sharing your thoughts! Let's keep exploring, shall we?" },
], "river");

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
}
function nextScene() {
    started = false;
    scene++;
    document.getElementById("uicon").style.background = "initial";
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

function checkEnd() {
    if (bg.getX() == window.innerWidth * (-1) + 256 && fox.getX() == window.innerWidth - 512) {
        end = true
    } else {
        end = false;
    }
}

function animateBirds() {
    document.getElementById("birds").animate([
        { transform: 'translateX(calc(110vw + 256px))' },
        { transform: 'translateX(calc(-10vw - 256px))' }
    ], {
        duration: window.innerWidth * 3,
        iterations: 1,
        delay: 5000
    });
    if (scene == 1) {
        setTimeout(() => {
            animateBirds();
        }, window.innerWidth * 3 + 10000);
    }
}

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
        clearTimeout(wheelEventEndTimeout);
        wheelEventEndTimeout = setTimeout(() => {
            scrl = false;
            fox.animateFox();
            bg.animateBG();
        }, 300);
    }
});
window.addEventListener('click', (evt) => {
    
    console.log("clicked on: " + evt.target.id);
    switch (evt.target.id) {
        case "foxSkin":
            if (!secrets.ucFox) {
                spark.animateSpark(evt.clientX, evt.clientY);
                aboutMilo.nextDialogue();
                addSpark();
                secrets.ucFox = true;
                player.sympathy++;
            }
            break;
        case "iconfs":
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
    if (!started && evt.target.id != "iconfs" && dialogue.getType() == "statement" && evt.target.tagName != "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY);
        dialogue.nextDialogue();
    } else if (evt.target.tagName == "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY);
    }
});
function handleClick(id) {
    let dialogue;
    switch (id.split("_")[0]) {
        case "intro":
            dialogue = introDia;
            break;
        case "aboutMilo":
            dialogue = aboutMilo;
            break;
        case "river":
            dialogue = riverDia;
            break;
        default:
            break;
    }
    switch (id) {
        case "intro_btn_3_0": // Name input
            handleInput();
            break;
        case "intro_btn_5_0": // Yes
            introDia.changeNext("Yay! Thank you! This is going to be so fun!");
            addSpark();
            break;
        case "intro_btn_5_1": // No
            introDia.changeNext("...");
            window.location.href = "gameover.html";
            break;
        case "river_btn_4_0": // Yes
            addSpark();
            break;
        case "river_btn_4_1": // No
            riverDia.changeNext("...");
            window.location.href = "gameover.html";
            break;
        case "river_btn_5_0": // Enjoy the present (bad)
        case "river_btn_6_1": // Don't worry (bad)
            break;
        case "river_btn_5_1": // Small gesture (good)
        case "river_btn_6_0": // Discover joy (good)
            player.sympathy++;
            break;
        case "river_btn_7_1": // Positive attitude (good)
            player.sympathy++;
        case "river_btn_7_0": // Focus on yourself (bad)
            riverDia.changeNext("Thanks for sharing your thoughts, " + player.name + "! Let's keep exploring, shall we?");
            break;
        default:
            break;
    }
    if (document.getElementById(dialogue.getName() + "_btn_" + dialogue.getProgress() + "_0")) {
        document.getElementById(dialogue.getName() + "_btn_" + dialogue.getProgress() + "_0").hidden = true;
    }
    if (document.getElementById(dialogue.getName() + "_btn_" + dialogue.getProgress() + "_1")) {
        document.getElementById(dialogue.getName() + "_btn_" + dialogue.getProgress() + "_1").hidden = true;
    }
    dialogue.nextDialogue();
}
function handleInput() {
    document.getElementById("input").hidden = true;
    if (document.getElementById("intro_btn_" + introDia.getProgress() + "_0")) {
        document.getElementById("intro_btn_" + introDia.getProgress() + "_0").hidden = true;
    }
    player.name = document.getElementById("input").value;
    let text = "Nice to meet you, " + player.name + "! That's a lovely name!";
    switch (player.name.toLowerCase().replace(/\s/g, '')) {
        case "":
        case "stranger":
            player.name = "Stranger";
            text = "You don't wanna tell me? Thats okay...";
            break;
        case "milo":
            text = "Hey, that's my name! Don't steal it! Just kidding, I'm happy to share it with you!";
            break;
        case "jfladas":
            text = "That's a weird name... Sounds like an abbreviation... I wonder what it stands for...";
            break;
        case "lukas":
            text = "That name sounds familiar... It's like I've heard it before... Oh well! Nice to meet you!";
            break;
        case "marin":
            text = "Marin, du bisch toll <3";
            break;
        case "cathy":
        case "caterina":
        case "maude":
            text = "Hi " + player.name + "! I like your tattoos!";
            break;
        case "angelika":
        case "angel":
        case "elias":
        case "lisa":
            text = "Konnichiwa " + player.name + "-san! Ogenki desu ka?";
            break;
        case "marc":
            text = "Hey " + player.name + "! I heard you are a great teacher!";
            break;
        case "remo":
            text = "Remoooo! (^_^)/";
            break;
        case "tim":
            text = "Tim! Let's *smash* this adventure together!";
            break;
        case "api":
        case "apisana":
            text = "What an honor to meet the Tekken Master " + player.name + " herself! I'm a big fan!";
            break;
        case "tamara":
        case "moon":
        case "cherry":
        case "dorjee":
        case "blossom":
            text = "What a beautiful name, " + player.name + "! The *universe* is telling me that we are going to have a great time together!";
            break;
        case "nick":
        case "annina":
        case "ardit":
        case "arwen":
        case "baramee":
        case "chiara":
        case "dario":
        case "jan":
        case "jennifer":
        case "jules":
        case "julian":
        case "laura":
        case "marco":
        case "michelle":
        case "mike":
        case "nika":
        case "rico":
        case "riggo":
        case "sawmi":
        case "sawmiya":
        case "sebi":
        case "sebastian":
        case "silvan":
        case "stefan":
        case "yanis":
        case "yannick":
            text = "Oh, hello " + player.name + "! Have we met before? Anyway, ready to ideate our way to greatness together?";
            break;
        case "pia":
        case "peter":
        case "andrea":
        case "monika":
            text = "Hey there " + player.name + "! You seem very *familiar*...";
            break;
    }
    introDia.changeNext(text);
    if (player.name != "Stranger") {
        addSpark();
    }
}

function addSpark() {
    let newSpark = document.getElementsByClassName("sparks")[player.sparks];
    console.log(newSpark);
    player.sparks++;
    //animation
    newSpark.style.backgroundImage = "url('assets/sparks_full.png')";
}

/* View in fullscreen */
function toggleFullscreen() {
    if (fullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        iconfs.src = "assets/fullscreen.png";
        fullscreen = false;
    } else {
        if (docelem.requestFullscreen) {
            docelem.requestFullscreen();
        } else if (docelem.webkitRequestFullscreen) { /* Safari */
            docelem.webkitRequestFullscreen();
        } else if (docelem.msRequestFullscreen) { /* IE11 */
            docelem.msRequestFullscreen();
        }
        iconfs.src = "assets/notfullscreen.png";
        fullscreen = true;
    }
};