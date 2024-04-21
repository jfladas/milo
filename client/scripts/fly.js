//TODO: fly away on hover

// Firefly factory function
const createFly = (elem) => {
    let x = window.innerWidth * 0.75 + Math.random() * 100 - 50;
    let y = window.innerHeight * -0.25 + Math.random() * 100 - 50;
    const flyAnim = elem.animate(null, { duration: 500 });

    const animateFly = () => {
        nx = x + Math.random() * 30 - 15;
        ny = y + Math.random() * 30 - 15;
        /*
        if (nx < 0) {
            nx = 0;
        } else if (nx > window.innerWidth) {
            nx = window.innerWidth;
        }
        if (ny < window.innerHeight * -0.5) {
            ny = 0;
        } else if (ny > window.innerHeight * 0.5) {
            ny = window.innerHeight;
        }*/
        
        let keyframes = [
            { transform: 'translate(' + x + 'px, ' + y + 'px)' },
            { transform: 'translate(' + nx + 'px, ' + ny + 'px)' },
        ];
        x = nx;
        y = ny;
        flyAnim.effect.setKeyframes(keyframes);
        flyAnim.play();
    };

    flyAnim.onfinish = animateFly;

    return {
        animateFly,
        getElem : () => elem
    };
};

const count = 10;
let flies = [];
function createFlies() {
    for (let i = 0; i < count; i++) {
        const fly = document.createElement("div");
        fly.classList.add("fly");

        document.getElementById("prlxcon").appendChild(fly);
        flies.push(createFly(fly));
        flies[i].animateFly();
    }
    //let els = document.getElementsByClassName("fly");
    Array.prototype.forEach.call(flies, function (f) {
        el = f.getElem();
        el.style.background = "radial-gradient(circle at center, #C6AE33AA, transparent 50%)";
    });
}