let scrl = false;
let rev = false;
let end = false;
let nxttxt = null;
let scrlSpeed = 1;
let started = false;
let fullscreen = false;
let iconfs = document.getElementById("iconfs");
let player = {
    name: "Stranger",
    sparks: 0,
    sympathy: 0
};

// Fox factory function
const createFox = (elem, skin) => {
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
        if (scrl && (!(rev && bg.getX() >= 0) || !(rev && x <= 0)) && (!(!rev && bg.getX() <= window.innerWidth * (-1) + 256) || !(!rev && x >= window.innerWidth - 512))) {
            foxSpeed = (window.innerWidth - 512) / 300;
            if ((rev && x <= 0) || (!rev && x >= window.innerWidth - 512)) {
                foxSpeed = 0;
            }
            if (rev) {
                x -= foxSpeed*scrlSpeed;
            } else {
                x += foxSpeed*scrlSpeed;
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
        } else if (x < window.innerWidth * (-1) + 256) {
            x = window.innerWidth * (-1) + 256;
        }
        if (scrl && !(rev && x >= 0) && !(!rev && x <= window.innerWidth * (-1) + 256)) {
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

// Background factory function
const createPrlx = (elem, factor, pos) => {
    let p = pos;
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

// Usage of the factory functions
const fox = createFox(document.getElementById("fox"), document.getElementById("foxSkin"));
const spark = createSpark(document.getElementById("spark"), document.getElementById("sparkSkin"));
const bg = createBg(document.getElementById("bg"));

let prlxItems = [];
let els = document.getElementsByClassName("prlx");
Array.prototype.forEach.call(els, function (el) {
    prlxItems.push(createPrlx(el, el.getAttribute("data-prlx-factor"), el.getAttribute("data-prlx-pos")));
});

function start() {
    started = true;
    document.getElementById("uicon").style.background = "none";
    document.getElementById("uiimg").style.display = "none";
    document.getElementById("uicon").style.zIndex = "0";
}

function checkEnd() {
    if (bg.getX() == window.innerWidth * (-1) + 256 && fox.getX() == window.innerWidth - 512) {
        end = true
    } else {
        end = false;
    }
}

// Dialogue factory function
const createDialogue = (script) => {
    let progress = 0;
    let type = "statement";
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
        next,
        getLength: () => script.length,
        getProgress: () => progress,
        getType: () => type,
        changeNext
    };
};

const introDia = createDialogue([
    { statement: "Hey there! I'm Milo, your cheerful explorer buddy!" },
    { statement: "I love spending time with kind folks like you, and I'm thrilled to embark on this adventure together!" },
    { question: "Oh, and what's your name, friend? I'd love to know!", answers: ["...is my Name"] },
    { statement: "You don't wanna tell me? Thats okay..." },
    { question: "Do you want to help me uncover the wonders of this forest?", answers: ["Yes", "No"] },
    { statement: "Yay! Thank you! This is going to be so fun!" },
    { statement: "Click on interesting things to hear me share little tales about them. Exploring the woods together with you would make me very happy!" },
    { statement: "And don't forget, scrolling moves us forward or backward. Let's make today unforgettable!" },
]);

const scrollContainer = document.querySelector("main");
let wheelEventEndTimeout = null;
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
            spark.animateSpark(evt.clientX, evt.clientY);
            console.log("clicked on fox");
            break;
        case "iconfs":
            spark.animateSpark(evt.clientX, evt.clientY);
            toggleFullscreen();
            break;
        case "shrum1":
            console.log(evt.clientY);
            if (evt.clientY > window.innerHeight - 300) {
                spark.animateSpark(evt.clientX, evt.clientY);
            }
            break;
        case "shrum2":
            if (evt.clientY > window.innerHeight - 300) {
                spark.animateSpark(evt.clientX, evt.clientY);
            }
            break;
        case "shrum3":
            if (evt.clientY > window.innerHeight - 300) {
                spark.animateSpark(evt.clientX, evt.clientY);
            }
            break;
        default:
            break;
    }
    if (!started && evt.target.id != "iconfs" && introDia.getType() == "statement" && evt.target.tagName != "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY);
        nextDialogue();
    } else if (evt.target.tagName == "BUTTON") {
        spark.animateSpark(evt.clientX, evt.clientY);
    }
});

function nextDialogue() {
    nxttxt = introDia.next();
    if (nxttxt != null) {
        document.getElementById("uitxt").innerText = nxttxt.text;
        if (nxttxt.type == "question") {
            if (introDia.getProgress() == 3) {
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
                        nextDialogue();
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
                btn.id = "btn_" + introDia.getProgress() + "_" + i;
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
        start();
    }
}
function handleClick(id) {
    switch (id) {
        case "btn_3_0": // Name input
            handleInput();
            break;
        case "btn_5_0": // Yes
            introDia.changeNext("Yay! Thank you! This is going to be so fun!");
            //addSpark();
            break;
        case "btn_5_1": // No
            introDia.changeNext("...");
            //gameOver();
            break;
        default:
            break;
    }
    if (document.getElementById("btn_" + introDia.getProgress() + "_0")) {
        document.getElementById("btn_" + introDia.getProgress() + "_0").hidden = true;
    }
    if (document.getElementById("btn_" + introDia.getProgress() + "_1")) {
        document.getElementById("btn_" + introDia.getProgress() + "_1").hidden = true;
    }
    nextDialogue();
}
function handleInput() {
    document.getElementById("input").hidden = true;
    if (document.getElementById("btn_" + introDia.getProgress() + "_0")) {
        document.getElementById("btn_" + introDia.getProgress() + "_0").hidden = true;
    }
    player.name = document.getElementById("input").value;
    let text = "Nice to meet you, " + player.name + "! That's a lovely name!";
    switch (player.name.toLowerCase()) {
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
        case "sawmi":
        case "sawmiya":
        case "sebi":
        case "sebastian":
        case "silvan":
        case "stefan":
        case "yanis":
        case "yannick":
            text = "Oh, hello " + player.name + "! You sound familiar... Have we met before?";
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
        //addSpark();
    }
}

let elem = document.documentElement;

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
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        iconfs.src = "assets/notfullscreen.png";
        fullscreen = true;
    }
}