let scrl = false;
let rev = false;
let foxX = 0;
let bgX = 0;
let vx = 0;
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
    walkAnim: foxElem.animate(null, { duration: 10, endDelay: -5 }),
    animateFox(scrl) {
        let keyframes = [
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' }
        ];
        if (scrl) {
            keyframes = [
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
                { clip: 'rect(0px, 512px, 256px, 256px)', transform: 'translate(-256px, 0px)' },
                { clip: 'rect(0px, 768px, 256px, 512px)', transform: 'translate(-512px, 0px)' },
                { clip: 'rect(0px, 1024px, 256px, 768px)', transform: 'translate(-768px, 0px)' },
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' }
            ];
        }

        this.foxAnim.effect.setKeyframes(keyframes);
        this.foxAnim.play();
    },
    animateWalk(scrl, rev) {
        if (scrl) {
            if (rev) {
                foxX -= 1;
            } else {
                foxX += 1;
            }
        }
        this.walkAnim.effect.setKeyframes([
            this.walkAnim.effect.getKeyframes()[1],
            { transform: 'translateX(' + foxX * 0.1 + 'vw)' }
        ]);
        this.walkAnim.play();
    }
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

const bg = {
    elem: bgElem,
    bgAnim: bgElem.animate(null, { duration: 10, easing: 'steps(1)' }),
    animateBG(progress) {
        //this.bgAnim.effect.setKeyframes(keyframes);
        //this.bgAnim.play();
    }
};

fox.walkAnim.onfinish = () => {
    fox.animateWalk(scrl, rev);
};

fox.foxAnim.onfinish = () => {
    fox.animateFox(scrl);
};

spark.sparkAnim.onfinish = () => {
    sparkElem.hidden = true;
};

bg.bgAnim.onfinish = () => {
    bgX += 1.5 * vx;
    bg.bgAnim.effect.setKeyframes([
        bg.bgAnim.effect.getKeyframes()[1],
        { transform: 'translateX(' + bgX + 'px)' }
    ]);
    bg.bgAnim.play();
}

const scrollContainer = document.querySelector("main");
let wheelEventEndTimeout = null;
window.addEventListener('wheel', (evt) => {
    scrl = true;
    if(evt.deltaY < 0) {
        rev = true;
        vx = 5;
    } else {
        vx = -5;
    }
    
    fox.animateFox(scrl);
    
    //bg.animateBG(evt.deltaY);
    //scrollContainer.scrollLeft += evt.deltaY * 0.05;
    clearTimeout(wheelEventEndTimeout);
    wheelEventEndTimeout = setTimeout(() => {
        scrl = false;
        rev = false;
        vx = 0;
        fox.animateFox(scrl);
    }, 100);
});

window.addEventListener('click', (evt) => {
    console.log(evt.clientX, evt.clientY);
    sparkElem.style.left = evt.clientX - 50 + "px";
    sparkElem.style.top = evt.clientY - 50 + "px";
    sparkElem.hidden = false;
    spark.animateSpark();
});