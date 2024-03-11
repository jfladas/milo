let scrl = false;
let rev = false;
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
    x: 0,
    foxAnim: foxskElem.animate(null, { duration: 500, easing: 'steps(4)' }),
    animateFox() {
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > window.innerWidth - 512) {
            this.x = window.innerWidth - 512;
        }
        let keyframes = [
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + this.x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + this.x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + this.x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + this.x + 'px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + this.x + 'px, 0px)' }
        ];
        if (scrl && !(rev && bg.x >= 0) && !(!rev && bg.x <= window.innerWidth * (-1) + 256)) {
            if (rev) {
                this.x -= speed;
            } else {
                this.x += speed;
            }

            keyframes = [
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + (0 + this.x) + 'px, 0px)' },
                { clip: 'rect(0px, 512px, 256px, 256px)', transform: 'translate(' + (-256 + this.x) + 'px, 0px)' },
                { clip: 'rect(0px, 768px, 256px, 512px)', transform: 'translate(' + (-512 + this.x) + 'px, 0px)' },
                { clip: 'rect(0px, 1024px, 256px, 768px)', transform: 'translate(' + (-758 + this.x) + 'px, 0px)' },
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(' + (0 + this.x) + 'px, 0px)' }
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
    x: 0,
    bgAnim: bgElem.animate(null, { duration: 10, easing: 'steps(10)' }),
    animateBG() {
        if (this.x > 0) {
            this.x = 0;
        } else if (this.x < window.innerWidth*(-1) + 256) {
            this.x = window.innerWidth * (-1) + 256;
        }
        if (scrl && !(rev && this.x >= 0) && !(!rev && this.x <= window.innerWidth * (-1) + 256)) {
            if (rev) {
                this.x += speed;
            } else {
                this.x -= speed;
            }
        }
        this.bgAnim.effect.setKeyframes([
            this.bgAnim.effect.getKeyframes()[1],
            { transform: 'translateX(' + this.x + 'px)' }
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
    if (evt.deltaY < 0) {
        rev = true;
    } else if (evt.deltaY > 0) {
        rev = false;
    } else {
        rev = false;
        scrl = false;
    }
    if (evt.deltaY > 80 || evt.deltaY < -80) {
        speed = 4;
    } else {
        speed = 2;
        if (evt.deltaY > -20 && evt.deltaY < 20) {
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