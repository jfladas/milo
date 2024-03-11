let scrl = false;
let rev = false;
let foxX = 0;
let bgX = 0;
let speed = 2;
const foxElem = document.getElementById("fox");
const foxskElem = document.getElementById("foxSkin");
const sparkElem = document.getElementById("spark");
const sparkskElem = document.getElementById("sparkSkin");
const bgElem = document.getElementById("bg");

sparkElem.hidden = true;

const fox = {
    elem: foxElem,
    skinElem: foxskElem,
    foxAnim: foxskElem.animate(null, { duration: 500, easing: 'steps(4)' }),
    animateFox() {
        let keyframes = [
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + foxX +'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + foxX +'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + foxX +'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + foxX +'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + foxX +'px, 0px)' }
        ];
        if (scrl) {
            if (rev) {
                foxX -= speed;
            } else {
                foxX += speed;
            }
            keyframes = [
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + (0 + foxX) + 'px, 0px)' },
                { clip: 'rect(0px, 512px, 256px, 256px)', transform: 'translate(' + (-256 + foxX) + 'px, 0px)' },
                { clip: 'rect(0px, 768px, 256px, 512px)', transform: 'translate(' + (-512 + foxX) + 'px, 0px)' },
                { clip: 'rect(0px, 1024px, 256px, 768px)', transform: 'translate(' + (-758 + foxX) + 'px, 0px)' },
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + (0 + foxX) + 'px, 0px)' }
            ];
        }

        this.foxAnim.effect.setKeyframes(keyframes);
        this.foxAnim.play();
    }
};

fox.foxAnim.onfinish = () => {
    fox.animateFox();
};

const spark = {
    elem: sparkElem,
    skinElem: sparkskElem,
    sparkAnim: sparkskElem.animate(null, { duration: 300, easing: 'steps(4)' }),
    animateSpark() {
        let keyframes = [
            { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 192px, 96px, 96px)', transform: 'translate(-96px, 0px)' },
            { clip: 'rect(0px, 288px, 96px, 192px)', transform: 'translate(-192px, 0px)' },
            { clip: 'rect(0px, 384px, 96px, 288px)', transform: 'translate(-288px, 0px)' },
            { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'translate(0px, 0px)' }
        ];

        this.sparkAnim.effect.setKeyframes(keyframes);
        this.sparkAnim.play();
    }
};

spark.sparkAnim.onfinish = () => {
    sparkElem.hidden = true;
};

const bg = {
    elem: bgElem,
    bgAnim: bgElem.animate(null, { duration: 10, easing: 'steps(10)' }),
    animateBG() {
        if (scrl) {
            if (rev) {
                bgX += speed;
            } else {
                bgX -= speed;
            }
        }
        this.bgAnim.effect.setKeyframes([
            this.bgAnim.effect.getKeyframes()[1],
            { transform: 'translateX(' + bgX + 'px)' }
        ]);
        this.bgAnim.play();
    }
};

bg.bgAnim.onfinish = () => {
    bg.animateBG();
}

const scrollContainer = document.querySelector("main");
let wheelEventEndTimeout = null;
window.addEventListener('wheel', (evt) => {
    //console.log(evt.deltaY);
    scrl = true;
    if(evt.deltaY < 0) {
        rev = true;
    } else if (evt.deltaY > 0) {
        rev = false;
    } else {
        rev = false;
        scrl = false;
    }
    if(evt.deltaY > 80 || evt.deltaY < -80) {
        speed = 4;
    } else {
        speed = 2;
        if(evt.deltaY > -20 && evt.deltaY < 20) {
            speed = 1;
        }
    }
    console.log(speed);
    fox.animateFox();
    bg.animateBG();
    clearTimeout(wheelEventEndTimeout);
    wheelEventEndTimeout = setTimeout(() => {
        scrl = false;
        fox.animateFox();
        bg.animateBG();
    }, 300);
});

window.addEventListener('click', (evt) => {
    console.log(evt.clientX, evt.clientY);
    sparkElem.style.left = evt.clientX - 50 + "px";
    sparkElem.style.top = evt.clientY - 50 + "px";
    sparkElem.hidden = false;
    spark.animateSpark();
});