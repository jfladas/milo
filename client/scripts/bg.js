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
        prlxDayItems.forEach(el => {
            el.animatePrlx(x);
        });
    };

    bgAnim.onfinish = animateBG;

    return {
        getX: () => x,
        setX: (nx) => {
            x = nx
            animateBG();
        },
        animateBG
    };
};

const bg = createBg(document.getElementById("bg"));

// Parallax factory function
const createPrlx = (id, src, factor, pos) => {
    const el = document.createElement("img");
    el.className = "prlx";
    el.draggable = false;
    el.src = src;
    if (id) {
        el.id = id;    
    } else {
        el.classList.add("through");
    }
    document.getElementById("prlxcon").appendChild(el);

    
    let p = pos * window.innerWidth / 50;
    const prlxAnim = el.animate(null, { duration: 10, easing: 'steps(10)' });

    const animatePrlx = (x) => {
        x = x * parseFloat(factor) + parseInt(p);
        prlxAnim.effect.setKeyframes([
            prlxAnim.effect.getKeyframes()[1],
            { transform: 'translateX(' + x + 'px)' }
        ]);

        prlxAnim.play();
    };

    return {
        animatePrlx,
        removePrlx: () => {
            el.remove();
        }
    };
};

let prlxDayItems = [];
function createDayPrlx() {
    const prlxDayData = [
        { src: "assets/tree.png", factor: 2, pos: [40, 100] },
        { src: "assets/bush1.png", factor: 3, pos: [10, 60, 150] },
        { src: "assets/bush2.png", factor: 3.5, pos: [30, 130, 180] },
        { id: "berries", src: "assets/berries.png", factor: 4, pos: [100] },
        { id: "shrum1", src: "assets/shrum1.png", factor: 5, pos: [30] },
        { id: "shrum2", src: "assets/shrum2.png", factor: 5, pos: [180] },
        { id: "shrum3", src: "assets/shrum3.png", factor: 5, pos: [240] }
    ];
    prlxDayData.forEach(item => {
        const { id, src, factor, pos } = item;
        if (pos.length > 1) pos.forEach(p => prlxDayItems.push(createPrlx(id, src, factor, p)));
        else prlxDayItems.push(createPrlx(id, src, factor, pos));
    });
};

let prlxNightItems = [];
function createNightPrlx() {
    const prlxNightData = [
        { src: "assets/tree.png", factor: 2, pos: [40, 100] }
    ];
    prlxNightData.forEach(item => {
        const { src, factor, pos } = item;
        prlxNightItems.push(createPrlx(null, src, factor, pos));
    });
}