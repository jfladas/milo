let scrl = false;
let rev = false;
let speed = 2;

// Fox factory function
const createFox = (foxElem, foxskElem) => {
    let x = 0;
    const foxAnim = foxskElem.animate(null, { duration: 500, easing: 'steps(4)' });

    const animateFox = () => {
        if (x < 0) {
            x = 0;
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
            if (rev) {
                x -= speed;
            } else {
                x += speed;
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

    return { animateFox };
};

// Spark factory function
const createSpark = (sparkElem, sparkskElem) => {

    sparkElem.hidden = true;

    const sparkAnim = sparkskElem.animate(null, { duration: 300, easing: 'steps(4)' });

    const animateSpark = () => {
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
        sparkElem.hidden = true;
    };

    return { animateSpark };
};

// Background factory function
const createBg = (bgElem) => {
    let x = 0;
    const bgAnim = bgElem.animate(null, { duration: 10, easing: 'steps(10)' });

    const animateBG = () => {
        if (x > 0) {
            x = 0;
        } else if (x < window.innerWidth * (-1) + 256) {
            x = window.innerWidth * (-1) + 256;
        }
        if (scrl && !(rev && x >= 0) && !(!rev && x <= window.innerWidth * (-1) + 256)) {
            if (rev) {
                x += speed;
            } else {
                x -= speed;
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

// Usage
const fox = createFox(document.getElementById("fox"), document.getElementById("foxSkin"));
const spark = createSpark(document.getElementById("spark"), document.getElementById("sparkSkin"));
const bg = createBg(document.getElementById("bg"));


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
    sparkElem.style.left = evt.clientX - 50 + "px";
    sparkElem.style.top = evt.clientY - 50 + "px";
    sparkElem.hidden = false;
    spark.animateSpark();
});