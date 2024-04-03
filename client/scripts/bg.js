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
                x += bgSpeed * scrlSpeed;
            } else {
                x -= bgSpeed * scrlSpeed;
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
    };

    bgAnim.onfinish = animateBG;

    return {
        getX: () => x,
        animateBG
    };
};

const bg = createBg(document.getElementById("bg"));

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

let prlxItems = [];
let els = document.getElementsByClassName("prlx");
Array.prototype.forEach.call(els, function (el) {
    prlxItems.push(createPrlx(el, el.getAttribute("factor"), el.getAttribute("pos")));
});