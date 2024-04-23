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
        animatePrlx
    };
};

const prlxData = [
    { src: "assets/tree.png", factor: 2, pos: [40, 100] },
    { src: "assets/bush1.png", factor: 3, pos: [10, 60, 150] },
    { src: "assets/bush2.png", factor: 3.5, pos: [30, 130, 180] },
    { id: "berries", src: "assets/berries.png", factor: 4, pos: [100] },
    { id: "shrum1", src: "assets/shrum1.png", factor: 5, pos: [30] },
    { id: "shrum2", src: "assets/shrum2.png", factor: 5, pos: [180] },
    { id: "shrum3", src: "assets/shrum3.png", factor: 5, pos: [240] }
];
let prlxItems = [];
prlxData.forEach(item => {
    const { id, src, factor, pos } = item;
    if (pos.length > 1) pos.forEach(p => prlxItems.push(createPrlx(id, src, factor, p)));
    else prlxItems.push(createPrlx(id, src, factor, pos));
});
/*
function createAndAppendImages(data) {
    data.forEach(item => {
        const { id, src, factor, pos } = item;
        const img = document.createElement("img");
        img.className = "prlx through";
        img.draggable = false;
        img.src = src;
        img.setAttribute("factor", factor);
        pos.forEach(p => img.setAttribute("pos", p));
        if (id) img.id = id;
        container.appendChild(img);
    });
}

// Call the function to create and append images
createAndAppendImages(imagesData);

let prlxItems = [];
let els = document.getElementsByClassName("prlx");
Array.prototype.forEach.call(els, function (el) {
    prlxItems.push(createPrlx(el, el.getAttribute("factor"), el.getAttribute("pos")));
});

<img class="prlx through" draggable="false" src="assets/tree.png" factor="2" pos="40">
        <img class="prlx through" draggable="false" src="assets/tree.png" factor="2" pos="100">

        <img class="prlx through" draggable="false" src="assets/bush1.png" factor="3" pos="10">
        <img class="prlx through" draggable="false" src="assets/bush1.png" factor="3" pos="60">
        <img class="prlx through" draggable="false" src="assets/bush1.png" factor="3" pos="150">

        <img class="prlx through" draggable="false" src="assets/bush2.png" factor="3.5" pos="30">
        <img class="prlx through" draggable="false" src="assets/bush2.png" factor="3.5" pos="130">
        <img class="prlx through" draggable="false" src="assets/bush2.png" factor="3.5" pos="180">

        <img id="berries" class="prlx" draggable="false" src="assets/berries.png" factor="4" pos="100">

        <img id="shrum1" class="prlx" draggable="false" src="assets/shrum1.png" factor="5" pos="30">
        <img id="shrum2" class="prlx" draggable="false" src="assets/shrum2.png" factor="5" pos="180">
        <img id="shrum3" class="prlx" draggable="false" src="assets/shrum3.png" factor="5" pos="240">

*/