let scrl = false;
let rev = false;
let end = false;
let nxttxt = null;
let scrlSpeed = 1;
let started = false;
let fullscreen = false;
let iconfs = document.getElementById("iconfs");

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

    function next() {
        if (progress >= script.length) {
            return null; // End of dialogue
        }

        const current = script[progress];
        progress++;

        if (current.statement) {
            return { type: "statement", text: current.statement };
        } else if (current.question) {
            return {
                type: "question",
                text: current.question,
                answers: current.answers
            };
        }
    }

    return {
        next,
        getLength: () => script.length,
        getProgress: () => progress
    };
};

const introDia = createDialogue([
    { statement: "Hello" },
    { statement: "How are you?" }
    //,{ question: "What's your name?", answers: ["John", "Alice"] }
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
            if (!started) {
                spark.animateSpark(evt.clientX, evt.clientY);
            }
    }
    if (!started && evt.target.id != "iconfs") {
        nxttxt = introDia.next();
        if (nxttxt != null) {
            document.getElementById("uitxt").innerText = nxttxt.text;
            if(nxttxt.type == "question") {
                for (let i = 0; i < nxttxt.answers.length; i++) {
                    let btn = document.createElement("button");
                    btn.innerText = nxttxt.answers[i];
                    btn.id = "btn" + i;
                    btn.onclick = function() {
                        document.getElementById("uitxt").innerText = "";
                        nxttxt = introDia.next();
                        if (nxttxt != null) {
                            document.getElementById("uitxt").innerText = nxttxt.text;
                        }
                    }
                    document.getElementById("uicon").appendChild(btn);
                }
            }
        } else {
            document.getElementById("uitxt").innerText = "";
            start();
        }
    }
    
});

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