let scrl = false;
let rev = false;
let scrlSpeed = 1;
let started = false;
let fullscreen = false;
let iconfs = document.getElementById("iconfs");

function start() {
    started = true;
    document.getElementById("uicon").style.background = "none";
    document.getElementById("uiimg").style.display = "none";
}

//start();

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
        if (scrl && !(rev && bg.getX() >= 0) && !(!rev && bg.getX() <= window.innerWidth * (-1) + 256)) {
            foxSpeed = window.innerWidth / 300;
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
            bgSpeed = window.innerWidth / 500;
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
    };

    bgAnim.onfinish = animateBG;

    return {
        getX: () => x,
        animateBG
    };
};

// Usage of the factory functions
const fox = createFox(document.getElementById("fox"), document.getElementById("foxSkin"));
const spark = createSpark(document.getElementById("spark"), document.getElementById("sparkSkin"));
const bg = createBg(document.getElementById("bg"));

let dialogue = ["Hello", "How are you?", "What's your name?What's your name?What's your name?What's your name?What's your name?What's your name?What's your name?What's your name?What's your name?What's your name?"];
let progress = 0;

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
            scrlSpeed = 0.5;
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
    document.getElementById("sparkSkin").style.zIndex = "5";
    spark.animateSpark(evt.clientX, evt.clientY);
    console.log(evt.target.id);
    if(evt.target.id != "iconfs") {
        if (started) {

        } else {
            if (progress < dialogue.length) {
                document.getElementById("uitxt").innerText = dialogue[progress];
                progress++;
            } else {
                document.getElementById("uitxt").innerText = "";
                start();
            }
        }
    } else {
        toggleFullscreen();
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