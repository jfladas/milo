// Firefly factory function
const createFly = (elem) => {
    let x = window.innerWidth * 0.75 + Math.random() * 100 - 50;
    let y = window.innerHeight * -0.25 + Math.random() * 100 - 50;
    
    let away = false;

    const flyAnim = elem.animate(null, { duration: 300 });

    const animateFly = () => {
        nx = x + Math.random() * 20 - 10;
        ny = y + Math.random() * 20 - 10;
        if (away) {
            away = false;
            nx = x + Math.random() * 200 - 100;
            ny = y + Math.random() * 200 - 100;
        }
        
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
        getElem: () => elem,
        setAway: (a) => away = a
    };
};

const count = 7;
let flies = [];
function createFlies() {
    for (let i = 0; i < count; i++) {
        const fly = document.createElement("div");
        fly.classList.add("fly");
        document.getElementById("prlxcon").appendChild(fly);
        flies.push(createFly(fly));
        setTimeout(() => {
            flies[i].animateFly();
        }, Math.random() * 10);
        fly.addEventListener("mouseenter", () => {
            flies[i].setAway(true);
        });
    }
    Array.prototype.forEach.call(flies, function (f) {
        el = f.getElem();
        el.style.background = "radial-gradient(circle at center, #C6AE33AA, transparent 50%)";
    });
}